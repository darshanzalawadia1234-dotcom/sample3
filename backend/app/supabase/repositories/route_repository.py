from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy import select, desc
from app.core.logging_config import logger
from app.supabase.client import get_supabase_client
from app.database.connection import SessionLocal
from app.database import models
from .audit_repository import audit_repository

class RouteRepository:
    def save_route_transaction(
        self,
        request_data: Dict[str, Any],
        results_data: List[Dict[str, Any]],
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Persist a route optimization request and its generated result alternatives
        into Supabase with audit logging.
        """
        client = get_supabase_client()

        req_payload = {
            "user_id": user_id,
            "ship_id": request_data.get("ship_id") or request_data.get("shipId"),
            "start_latitude": float(request_data.get("start_latitude", request_data.get("startLat", -64.82))),
            "start_longitude": float(request_data.get("start_longitude", request_data.get("startLon", -58.25))),
            "destination_latitude": float(request_data.get("destination_latitude", request_data.get("destLat", -67.57))),
            "destination_longitude": float(request_data.get("destination_longitude", request_data.get("destLon", -68.13))),
            "safety_weight": float(request_data.get("weights", {}).get("safety", request_data.get("safety_weight", 0.7))),
            "fuel_weight": float(request_data.get("weights", {}).get("fuel", request_data.get("fuel_weight", 0.2))),
            "time_weight": float(request_data.get("weights", {}).get("time", request_data.get("time_weight", 0.1))),
            "requested_at": datetime.now(timezone.utc).isoformat()
        }

        # Normalize weights if given on 0-100 scale
        total_w = req_payload["safety_weight"] + req_payload["fuel_weight"] + req_payload["time_weight"]
        if total_w > 1.5:
            req_payload["safety_weight"] /= 100.0
            req_payload["fuel_weight"] /= 100.0
            req_payload["time_weight"] /= 100.0

        saved_request_id = None

        if client is not None:
            try:
                res = client.table("route_requests").insert(req_payload).execute()
                if res.data and len(res.data) > 0:
                    saved_request_id = res.data[0]["id"]
            except Exception as e:
                logger.warning(f"Supabase route_requests insert failed ({e}), saving locally.")

        if saved_request_id is None:
            with SessionLocal() as db:
                rr = models.RouteRequest(
                    user_id=req_payload["user_id"],
                    ship_id=req_payload["ship_id"],
                    start_latitude=req_payload["start_latitude"],
                    start_longitude=req_payload["start_longitude"],
                    destination_latitude=req_payload["destination_latitude"],
                    destination_longitude=req_payload["destination_longitude"],
                    safety_weight=req_payload["safety_weight"],
                    fuel_weight=req_payload["fuel_weight"],
                    time_weight=req_payload["time_weight"]
                )
                db.add(rr)
                db.commit()
                db.refresh(rr)
                saved_request_id = rr.id

        # Audit log: Route Requested
        audit_repository.log_action(
            entity_type="ROUTE_REQUEST",
            entity_id=str(saved_request_id),
            action="ROUTE_REQUESTED",
            user_id=user_id,
            new_data=req_payload
        )

        # Persist each route result (recommended + options)
        persisted_results = []
        for r in results_data:
            geom = r.get("route_geometry") or r.get("geometry") or r.get("waypoints") or []
            res_payload = {
                "route_request_id": saved_request_id,
                "route_type": r.get("type", r.get("id", "balanced")),
                "distance_km": float(r.get("distanceKm", r.get("distance_km", 0.0))),
                "estimated_time_hours": float(r.get("travelTimeHours", r.get("estimated_time_hours", 0.0))),
                "estimated_fuel": float(r.get("estimatedFuelLiters", r.get("estimated_fuel", 0.0))),
                "safety_score": float(r.get("safetyScore", r.get("safety_score", 85.0))),
                "overall_risk": r.get("riskScoreCategory", r.get("overall_risk", "LOW")),
                "route_geometry": geom,
                "major_hazards": r.get("hazards", []),
                "created_at": datetime.now(timezone.utc).isoformat()
            }

            if client is not None:
                try:
                    res_r = client.table("route_results").insert(res_payload).execute()
                    if res_r.data:
                        persisted_results.append(res_r.data[0])
                        continue
                except Exception as e:
                    logger.warning(f"Supabase route_results insert failed ({e}), saving locally.")

            with SessionLocal() as db:
                result_row = models.RouteResult(
                    route_request_id=saved_request_id,
                    route_type=res_payload["route_type"],
                    distance_km=res_payload["distance_km"],
                    estimated_time_hours=res_payload["estimated_time_hours"],
                    estimated_fuel=res_payload["estimated_fuel"],
                    safety_score=res_payload["safety_score"],
                    overall_risk=res_payload["overall_risk"],
                    route_geometry=res_payload["route_geometry"],
                    major_hazards=res_payload["major_hazards"]
                )
                db.add(result_row)
                db.commit()
                db.refresh(result_row)
                persisted_results.append({
                    "id": result_row.id,
                    **res_payload
                })

        # Audit log: Route Generated
        audit_repository.log_action(
            entity_type="ROUTE_RESULT",
            entity_id=str(saved_request_id),
            action="ROUTE_GENERATED",
            user_id=user_id,
            new_data={"route_request_id": saved_request_id, "alternatives_count": len(persisted_results)}
        )

        return {
            "route_request_id": saved_request_id,
            "results": persisted_results
        }

    def get_route_history(self, user_id: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        """Retrieve previously generated routes from Supabase."""
        client = get_supabase_client()
        if client is not None:
            try:
                query = client.table("route_requests").select("*, route_results(*)").order("requested_at", desc=True).limit(limit)
                if user_id:
                    query = query.eq("user_id", user_id)
                res = query.execute()
                if res.data is not None:
                    return res.data
            except Exception as e:
                logger.warning(f"Supabase get_route_history failed ({e}), falling back to local database.")

        with SessionLocal() as db:
            stmt = select(models.RouteRequest).order_by(desc(models.RouteRequest.requested_at)).limit(limit)
            if user_id:
                stmt = stmt.where(models.RouteRequest.user_id == user_id)
            records = db.scalars(stmt).all()
            out = []
            for req in records:
                out.append({
                    "id": req.id,
                    "user_id": req.user_id,
                    "ship_id": req.ship_id,
                    "start_latitude": req.start_latitude,
                    "start_longitude": req.start_longitude,
                    "destination_latitude": req.destination_latitude,
                    "destination_longitude": req.destination_longitude,
                    "safety_weight": req.safety_weight,
                    "fuel_weight": req.fuel_weight,
                    "time_weight": req.time_weight,
                    "requested_at": req.requested_at.isoformat() if req.requested_at else None,
                    "route_results": [
                        {
                            "id": r.id,
                            "route_type": r.route_type,
                            "distance_km": r.distance_km,
                            "estimated_time_hours": r.estimated_time_hours,
                            "estimated_fuel": r.estimated_fuel,
                            "safety_score": r.safety_score,
                            "overall_risk": r.overall_risk,
                            "route_geometry": r.route_geometry,
                            "major_hazards": r.major_hazards
                        }
                        for r in req.results
                    ]
                })
            return out

    def get_route_by_id(self, route_id: int) -> Optional[Dict[str, Any]]:
        """Retrieve single route request and associated results by ID."""
        client = get_supabase_client()
        if client is not None:
            try:
                res = client.table("route_requests").select("*, route_results(*)").eq("id", route_id).single().execute()
                if res.data:
                    return res.data
            except Exception as e:
                logger.warning(f"Supabase get_route_by_id failed ({e}), falling back to local database.")

        with SessionLocal() as db:
            req = db.scalar(select(models.RouteRequest).where(models.RouteRequest.id == route_id))
            if req:
                return {
                    "id": req.id,
                    "user_id": req.user_id,
                    "ship_id": req.ship_id,
                    "start_latitude": req.start_latitude,
                    "start_longitude": req.start_longitude,
                    "destination_latitude": req.destination_latitude,
                    "destination_longitude": req.destination_longitude,
                    "safety_weight": req.safety_weight,
                    "fuel_weight": req.fuel_weight,
                    "time_weight": req.time_weight,
                    "requested_at": req.requested_at.isoformat() if req.requested_at else None,
                    "route_results": [
                        {
                            "id": r.id,
                            "route_type": r.route_type,
                            "distance_km": r.distance_km,
                            "estimated_time_hours": r.estimated_time_hours,
                            "estimated_fuel": r.estimated_fuel,
                            "safety_score": r.safety_score,
                            "overall_risk": r.overall_risk,
                            "route_geometry": r.route_geometry,
                            "major_hazards": r.major_hazards
                        }
                        for r in req.results
                    ]
                }
        return None

route_repository = RouteRepository()
