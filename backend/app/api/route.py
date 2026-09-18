from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List, Dict, Any
from app.services.routing_service import routing_service
from app.supabase.repositories.vessel_repository import vessel_repository
from app.supabase.repositories.route_repository import route_repository
from app.api.auth import get_current_user_optional
from app.schemas.route import (
    RouteOptimizeRequest, RouteOptimizeResponse,
    ScenarioSimulateRequest, ScenarioSimulateResponse
)

router = APIRouter(prefix="", tags=["ROUTING"])

@router.post("/api/route/optimize", response_model=RouteOptimizeResponse, summary="Optimize multi-objective polar navigation route")
def optimize_route(request: RouteOptimizeRequest, user: Optional[dict] = Depends(get_current_user_optional)):
    """
    Execute Pareto A* optimization evaluating sea-ice concentration, iceberg drift cones,
    wind vectors, and wave heights according to user safety, fuel, and time priorities.
    Saves route request and generated route result in Supabase with audit logging.
    """
    ship_data = None
    target_ship_id = request.ship_id or request.shipId
    if target_ship_id:
        try:
            sid = int(target_ship_id)
            vessel = vessel_repository.get_vessel_by_id(sid)
            if vessel:
                ship_data = {
                    "name": vessel.get("vessel_name") or vessel.get("name"),
                    "ice_class": vessel.get("ice_class", "PC3"),
                    "normal_speed": vessel.get("normal_speed", 12.0),
                    "fuel_consumption_rate": vessel.get("fuel_consumption_rate", 85.0)
                }
        except (ValueError, TypeError):
            pass

    try:
        result = routing_service.optimize_route(request.model_dump(), ship_data)

        # Persist transaction to Supabase
        user_id = user.get("id") if user else None
        results_to_save = [result["recommendedRoute"]] + result.get("options", [])
        # Deduplicate by route id / type
        seen = set()
        dedup_results = []
        for r in results_to_save:
            rtype = r.get("type", r.get("id"))
            if rtype not in seen:
                seen.add(rtype)
                dedup_results.append(r)

        persisted = route_repository.save_route_transaction(
            request_data=request.model_dump(),
            results_data=dedup_results,
            user_id=user_id
        )
        result["dbRequestId"] = persisted["route_request_id"]
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Routing engine calculation error: {str(e)}")


@router.post("/api/route/compare", summary="Compare alternative navigation strategies")
def compare_routes(request: RouteOptimizeRequest, user: Optional[dict] = Depends(get_current_user_optional)):
    """
    Compare Pareto alternatives: Shortest, Safest, Fuel-Efficient, and Balanced routes.
    Stores route request and options to Supabase.
    """
    try:
        result = routing_service.optimize_route(request.model_dump())
        user_id = user.get("id") if user else None
        route_repository.save_route_transaction(
            request_data=request.model_dump(),
            results_data=result.get("options", []),
            user_id=user_id
        )
        return {"options": result["options"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Route comparison failed: {str(e)}")


@router.get("/api/routes/history", summary="Get historical route optimizations from Supabase")
def get_routes_history(
    limit: int = Query(50, ge=1, le=100),
    user: Optional[dict] = Depends(get_current_user_optional)
):
    """Retrieve history of saved routes and calculation parameters directly from Supabase."""
    user_id = user.get("id") if user else None
    routes = route_repository.get_route_history(user_id=user_id, limit=limit)
    return {"history": routes, "count": len(routes)}


@router.get("/api/routes/{route_id}", summary="Get specific route details by ID")
def get_route_by_id(route_id: int):
    """Retrieve single stored route request and associated results from Supabase."""
    route = route_repository.get_route_by_id(route_id)
    if not route:
        raise HTTPException(status_code=404, detail=f"Route request {route_id} not found in database.")
    return route


@router.post("/api/scenario/simulate", response_model=ScenarioSimulateResponse, summary="Simulate environmental What-If scenario")
def simulate_scenario(request: ScenarioSimulateRequest):
    """
    Simulate adverse polar perturbations (gale winds, sudden pack freeze, wave height jumps)
    and calculate mathematical divergence from baseline route.
    """
    base_result = routing_service.optimize_route({
        "startLat": -64.82,
        "startLon": -58.25,
        "destLat": -67.57,
        "destLon": -68.13,
        "weights": {"safety": 0.7, "fuel": 0.2, "time": 0.1}
    })
    base_route = base_result["recommendedRoute"]

    # Calculate realistic environmental divergence
    fuel_multiplier = 1.0 + (request.windDelta * 0.008) + (request.iceDelta * 0.015) + (request.waveDelta * 0.02)
    time_multiplier = 1.0 + (request.iceDelta * 0.018) + (request.waveDelta * 0.015)
    risk_delta = int(round((request.iceDelta * 0.4) + (request.windDelta * 0.3) + (request.waveDelta * 0.3)))

    distance_mult = 1.06 if request.iceDelta > 10.0 else 1.02
    scenario_dist = round(base_route["distanceKm"] * distance_mult, 1)
    scenario_fuel = int(round(base_route["estimatedFuelLiters"] * fuel_multiplier))
    scenario_time = round(base_route["travelTimeHours"] * time_multiplier, 1)
    scenario_risk = min(100, max(10, base_route["riskScore"] + risk_delta))

    scenario_route = {
        **base_route,
        "id": "scenario-sim",
        "name": "HYPOTHETICAL SCENARIO ROUTE",
        "type": "Simulation",
        "distanceKm": scenario_dist,
        "travelTimeHours": scenario_time,
        "estimatedFuelLiters": scenario_fuel,
        "riskScore": scenario_risk,
        "color": "#E09F3E"
    }

    divergence = {
        "distanceDiffKm": round(scenario_dist - base_route["distanceKm"], 1),
        "fuelDiffLiters": scenario_fuel - base_route["estimatedFuelLiters"],
        "timeDiffHours": round(scenario_time - base_route["travelTimeHours"], 1),
        "riskDiffScore": scenario_risk - base_route["riskScore"]
    }

    wind_sign = "+" if request.windDelta >= 0 else ""
    ice_sign = "+" if request.iceDelta >= 0 else ""
    fuel_pct = round((fuel_multiplier - 1.0) * 100.0, 1)

    impact = (
        f"Under simulated conditions (Wind {wind_sign}{request.windDelta} kn, "
        f"Sea Ice {ice_sign}{request.iceDelta}%), the vessel must deviate to avoid heavy pack ice, "
        f"increasing fuel consumption by {fuel_pct}% and voyage risk score by {divergence['riskDiffScore']} points."
    )

    return {
        "baselineRoute": base_route,
        "scenarioRoute": scenario_route,
        "divergence": divergence,
        "impactSummary": impact
    }
