import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MapContainer from '../components/map/MapContainer';
import ExpeditionTimeline from '../components/navigation/ExpeditionTimeline';
import ThreatBanner from '../components/icebergs/ThreatBanner';
import VectorDriftIndicator from '../components/navigation/VectorDriftIndicator';
import IceConcentrationBar from '../components/icebergs/IceConcentrationBar';
import IcebergDetailDrawer from '../components/icebergs/IcebergDetailDrawer';
import Metric from '../components/common/Metric';
import RiskBadge from '../components/common/RiskBadge';
import { useApp } from '../context/AppContext';
import { useIcebergs } from '../hooks/useIcebergs';
import { useRoute } from '../hooks/useRoute';
import {
  Ship,
  Compass,
  ArrowRight,
  ShieldAlert,
  Anchor,
  Radio,
  Wind,
  Waves,
  Crosshair,
  Layers
} from 'lucide-react';
import { MOCK_WEATHER, MOCK_OCEAN } from '../api/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedShip, selectShipForNavigation } = useApp();
  const { icebergs, alerts } = useIcebergs();
  const { routeResult, selectedRoute } = useRoute();

  const [inspectedIceberg, setInspectedIceberg] = useState(null);
  const [threatDismissed, setThreatDismissed] = useState(false);

  // Determine active threat notice
  const primaryAlert = alerts[0] || routeResult.proximityAlert;

  const handleLaunchNavigation = () => {
    if (selectedShip) {
      selectShipForNavigation(selectedShip);
    }
    navigate('/navigation');
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        position: 'relative',
        zIndex: 1
      }}
    >
      {/* Top Pinned Threat Strobe Banner if proximity alert is active */}
      {primaryAlert && !threatDismissed && (
        <div style={{ padding: '8px 14px 0 14px' }}>
          <ThreatBanner
            targetId={primaryAlert.icebergId || 'A-76A'}
            cpaNm={primaryAlert.distanceNm ? (primaryAlert.distanceNm).toFixed(1) : '1.4'}
            tcpaMinutes={primaryAlert.timeToImpactHours ? Math.round(primaryAlert.timeToImpactHours * 60) : 42}
            bearing={primaryAlert.bearing || 198}
            driftSpeed={1.8}
            severity={primaryAlert.severity || 'critical'}
            onAcknowledge={() => setThreatDismissed(true)}
            onInspect={() => {
              const matched = icebergs.find((b) => b.id === primaryAlert.icebergId);
              if (matched) setInspectedIceberg(matched);
            }}
          />
        </div>
      )}

      {/* Main 24-Column Tactical Deck Grid */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 370px',
          minHeight: 0,
          position: 'relative',
          padding: '8px 12px 0 12px',
          gap: '10px'
        }}
        className="dashboard-grid"
      >
        {/* CENTER / LEFT: Dominant Geospatial Polar Cartography View */}
        <div
          style={{
            position: 'relative',
            height: '100%',
            minHeight: '440px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border-structural)',
            boxShadow: 'var(--shadow-panel)'
          }}
        >
          {/* HUD Top Bar Overlay */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(4, 9, 20, 0.82)',
              backdropFilter: 'var(--glass-blur)',
              border: '1px solid var(--border-structural)',
              borderRadius: 'var(--radius-xs)',
              padding: '4px 10px'
            }}
          >
            <span className="led-pip led-cyan" />
            <span className="label-sm" style={{ color: '#ffffff' }}>ANTARCTIC SECTOR 4</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span className="telemetry-value" style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>
              WGS 84 POLAR STEREOGRAPHIC
            </span>
          </div>

          <MapContainer
            onSelectIceberg={(berg) => setInspectedIceberg(berg)}
            highlightedIcebergId={inspectedIceberg?.id}
            customRoutes={routeResult.options}
            highlightedRouteId={selectedRoute?.id || 'balanced'}
          />

          {/* Iceberg Telemetry Detail Drawer */}
          {inspectedIceberg && (
            <IcebergDetailDrawer
              iceberg={inspectedIceberg}
              onClose={() => setInspectedIceberg(null)}
            />
          )}
        </div>

        {/* RIGHT: Instrumental Tactical Telemetry & Decision Console */}
        <div
          style={{
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
            border: '1px solid var(--border-structural)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-panel), var(--glass-specular)',
            padding: '14px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
          className="dashboard-intel-panel"
        >
          {/* Active Flagship Vessel Card */}
          <div
            style={{
              background: 'var(--surface-mid)',
              border: '1px solid var(--border-structural)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px'
            }}
          >
            <div className="flex-between" style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ship size={14} color="var(--accent-cyan)" />
                <span className="label-sm" style={{ color: 'var(--accent-cyan)' }}>FLAGSHIP STATUS</span>
              </div>
              <span className="telemetry-chip" style={{ height: '20px', padding: '0 6px', fontSize: '9.5px', color: 'var(--risk-low)' }}>
                <span className="led-pip led-green" />
                {selectedShip?.status || 'IN TRANSIT'}
              </span>
            </div>

            <div
              className="mono-readout"
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.04em',
                marginBottom: '4px'
              }}
            >
              {selectedShip?.name || 'R/V Polarstern'}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                marginBottom: '10px'
              }}
            >
              <span>ICE CLASS: <strong style={{ color: 'var(--accent-ice)' }}>{selectedShip?.iceClass || 'PC3'}</strong></span>
              <span>·</span>
              <span>DEST: <strong style={{ color: '#ffffff' }}>{selectedShip?.destination || 'Rothera Station'}</strong></span>
            </div>

            {/* Quick SOG & Bunker Gauges */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <div style={{ background: 'var(--surface-deep)', padding: '6px 8px', borderRadius: 'var(--radius-xs)', border: '1px solid rgba(71,85,105,0.3)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '8.5px', display: 'block' }}>SPEED OVER GROUND (SOG)</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{selectedShip?.normalSpeed || 11.2} kn</span>
              </div>
              <div style={{ background: 'var(--surface-deep)', padding: '6px 8px', borderRadius: 'var(--radius-xs)', border: '1px solid rgba(71,85,105,0.3)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '8.5px', display: 'block' }}>REMAINING BUNKER FUEL</span>
                <span style={{ color: 'var(--accent-ice)', fontWeight: 600 }}>88% (840k L)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button
                onClick={handleLaunchNavigation}
                className="btn-engage"
                style={{ flex: 1, padding: '7px 10px', fontSize: '11px' }}
              >
                <span>Plan Waypoint</span>
                <ArrowRight size={13} />
              </button>
              <Link
                to="/auth"
                className="btn-tactical"
                style={{ padding: '7px 10px', fontSize: '11px', textDecoration: 'none' }}
                title="Manage Vessel Credentials"
              >
                <Anchor size={13} />
              </Link>
            </div>
          </div>

          {/* Vector Drift Indicator (Specialized Polar Component) */}
          <VectorDriftIndicator
            heading={214}
            driftAngle={226}
            driftSpeedKnots={2.4}
            sog={selectedShip?.normalSpeed || 11.2}
            size={136}
          />

          {/* WMO Sea Ice Concentration Micro-Gauge (Specialized Polar Component) */}
          <IceConcentrationBar
            concentration={0.65}
            stageOfDevelopment="Medium First-Year (70-120cm)"
            form="Big Floe (500-2000m)"
          />

          {/* Synoptic In-Situ Metocean Readouts */}
          <div
            style={{
              background: 'var(--surface-mid)',
              border: '1px solid var(--border-structural)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px'
            }}
          >
            <div className="flex-between" style={{ marginBottom: '8px' }}>
              <span className="label-sm" style={{ color: 'var(--text-muted)' }}>SYNOPTIC METOCEAN CONDITIONS</span>
              <span className="telemetry-chip" style={{ height: '18px', padding: '0 4px', fontSize: '8.5px', color: 'var(--accent-cyan)' }}>
                IN-SITU
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <Metric
                label="AIR TEMP"
                value={`${MOCK_WEATHER.airTemperature}`}
                unit="°C"
                secondary="SST: -1.6°C"
              />
              <Metric
                label="WIND VECTOR"
                value={`${MOCK_WEATHER.windSpeed}`}
                unit="kn"
                secondary={`${MOCK_WEATHER.windDirectionText} ${MOCK_WEATHER.windDirectionDegrees}°`}
              />
              <Metric
                label="BAROMETER"
                value={`${Math.round(MOCK_WEATHER.barometricPressure)}`}
                unit="hPa"
                secondary="Falling 1.2 hPa/3h"
              />
              <Metric
                label="SIGNIFICANT WAVE"
                value={`${MOCK_OCEAN.significantWaveHeight}`}
                unit="m"
                secondary="Period: 8.5s"
              />
            </div>
          </div>

          {/* Active Recommended Tactical Route */}
          {selectedRoute && (
            <div
              style={{
                background: 'var(--surface-mid)',
                border: '1px solid var(--border-structural)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px'
              }}
            >
              <div className="flex-between" style={{ marginBottom: '6px' }}>
                <span className="label-sm" style={{ color: 'var(--text-muted)' }}>ACTIVE ROUTE MATRIX</span>
                <RiskBadge score={selectedRoute.riskScore} category={selectedRoute.riskCategory} size="sm" />
              </div>

              <div
                className="mono-readout"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: selectedRoute.color || 'var(--accent-ice)',
                  marginBottom: '6px'
                }}
              >
                {selectedRoute.name}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  marginBottom: '6px'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '8px', display: 'block' }}>DIST</span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>{selectedRoute.distanceKm} km</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '8px', display: 'block' }}>FUEL</span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>{selectedRoute.estimatedFuelLiters} L</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '8px', display: 'block' }}>TRANSIT</span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>{selectedRoute.travelTimeHours} h</span>
                </div>
              </div>

              <p style={{ fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {selectedRoute.summary}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM: Fluid Acoustic & Expedition Timeline Scrubber */}
      <div
        style={{
          borderTop: '1px solid var(--border-structural)',
          backgroundColor: 'rgba(4, 9, 20, 0.9)',
          padding: '2px 8px'
        }}
      >
        <ExpeditionTimeline timeline={routeResult.timeline} />
      </div>

      <style>{`
        @media (max-width: 1080px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-intel-panel {
            border-left: none !important;
            border-top: 1px solid var(--border-structural);
          }
        }
      `}</style>
    </div>
  );
}
