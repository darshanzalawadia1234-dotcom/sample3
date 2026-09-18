import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapContainer from '../components/map/MapContainer';
import IcebergDetailDrawer from '../components/icebergs/IcebergDetailDrawer';
import { useApp } from '../context/AppContext';
import { useIcebergs } from '../hooks/useIcebergs';
import { useRoute } from '../hooks/useRoute';
import {
  AlertTriangle,
  Check,
  ArrowRight,
  Compass,
  Layers,
  Ship,
  Wind
} from 'lucide-react';
import { MOCK_WEATHER, MOCK_OCEAN } from '../api/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedShip } = useApp();
  const { icebergs } = useIcebergs();
  const { routeResult, selectedRoute } = useRoute();

  const [inspectedIceberg, setInspectedIceberg] = useState(null);

  // Timeline points matching Section 13
  const timelinePoints = [
    { label: 'NOW', time: '18:00 UTC', ice: '15%', wind: '14 kn SW', status: 'active' },
    { label: '+6 HOURS', time: '00:00 UTC', ice: '24%', wind: '18 kn W', status: 'upcoming' },
    { label: '+12 HOURS', time: '06:00 UTC', ice: '42%', wind: '22 kn WNW', status: 'upcoming' },
    { label: '+24 HOURS', time: '18:00 UTC', ice: '31%', wind: '16 kn NW', status: 'upcoming' },
    { label: '+48 HOURS', time: '18:00 UTC', ice: '18%', wind: '12 kn N', status: 'upcoming' },
    { label: 'DESTINATION', time: 'ETA 72h', ice: '<10%', wind: '9 kn NE', status: 'terminal' }
  ];

  const handleInspectHazard = () => {
    const berg = icebergs.find((b) => b.id.includes('017') || b.id.includes('A-')) || icebergs[0];
    if (berg) setInspectedIceberg(berg);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        backgroundColor: 'transparent',
        position: 'relative'
      }}
    >
      {/* Main Grid: Balanced Map + Operations Side Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          minHeight: 0,
          position: 'relative'
        }}
        className="dashboard-main-grid"
      >
        {/* LEFT: Antarctic Sea-Ice Scientific Map Visualization */}
        <div
          style={{
            position: 'relative',
            height: '420px',
            backgroundColor: 'var(--map-bg)',
            overflow: 'hidden',
            borderRight: '1px solid #292D28',
            borderBottom: '1px solid #292D28'
          }}
        >
          <MapContainer
            onSelectIceberg={(berg) => setInspectedIceberg(berg)}
            highlightedIcebergId={inspectedIceberg?.id}
            customRoutes={routeResult.options}
            highlightedRouteId={selectedRoute?.id || 'balanced'}
          />

          {inspectedIceberg && (
            <IcebergDetailDrawer
              iceberg={inspectedIceberg}
              onClose={() => setInspectedIceberg(null)}
            />
          )}
        </div>

        {/* RIGHT: Operations Intelligence Panels */}
        <div
          style={{
            backgroundColor: '#0D100E',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            borderBottom: '1px solid #292D28'
          }}
          className="dashboard-side-panel"
        >
          {/* Section 10: HAZARD PANEL */}
          <div
            style={{
              backgroundColor: '#121512',
              border: '1px solid #292D28',
              borderRadius: 'var(--radius-sm)',
              padding: '12px'
            }}
          >
            <div className="flex-between" style={{ marginBottom: '6px' }}>
              <span className="technical-label">HAZARD STATE</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9.5px',
                  fontWeight: 600,
                  color: '#D85C3E'
                }}
              >
                <AlertTriangle size={12} color="#D85C3E" />
                ICEBERG PROXIMITY
              </span>
            </div>

            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#E8E6D9', lineHeight: 1.4, margin: '4px 0 10px 0' }}>
              <strong style={{ color: '#E8E6D9' }}>A-017</strong> projected within 18.4 km of route in 14h 20m.
            </p>

            <button
              onClick={handleInspectHazard}
              className="btn-secondary"
              style={{ width: '100%', fontSize: '11px', padding: '5px 10px' }}
            >
              View on map
            </button>
          </div>

          {/* Section 11: RECOMMENDED ACTION */}
          <div
            style={{
              backgroundColor: '#121512',
              border: '1px solid #292D28',
              borderRadius: 'var(--radius-sm)',
              padding: '12px'
            }}
          >
            <div className="flex-between" style={{ marginBottom: '6px' }}>
              <span className="technical-label">RECOMMENDED ACTION</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 600,
                  color: '#8A963E',
                  backgroundColor: 'rgba(138, 150, 62, 0.15)',
                  padding: '2px 6px',
                  borderRadius: '2px'
                }}
              >
                LOW RISK · 31/100
              </span>
            </div>

            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12.5px', fontWeight: 600, color: '#E8E6D9', marginBottom: '4px' }}>
              Maintain eastern corridor
            </div>

            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11.5px', color: '#9A9D93', lineHeight: 1.4 }}>
              Avoid compacting ice edge west of waypoint 04. Reassess at +12h.
            </p>
          </div>

          {/* Section 12: ROUTE DECISION PANEL */}
          <div
            style={{
              backgroundColor: '#121512',
              border: '1px solid #292D28',
              borderRadius: 'var(--radius-sm)',
              padding: '12px'
            }}
          >
            <div className="technical-label" style={{ marginBottom: '6px' }}>
              ROUTE DECISION
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#E8E6D9' }}>
                <Check size={13} color="#C8D35A" style={{ flexShrink: 0 }} />
                <span>Lower iceberg exposure</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#E8E6D9' }}>
                <Check size={13} color="#C8D35A" style={{ flexShrink: 0 }} />
                <span>Avoids dense pack ice</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#E8E6D9' }}>
                <Check size={13} color="#C8D35A" style={{ flexShrink: 0 }} />
                <span>Optimal fuel & time compromise</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/navigation')}
              className="btn-primary-action"
              style={{ width: '100%', fontSize: '11px', padding: '6px 10px' }}
            >
              <span>Inspect Profile & Waypoints</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Section 14: IN-SITU OBSERVATIONS FULL DECK */}
      <div
        style={{
          backgroundColor: '#0D100E',
          borderBottom: '1px solid #292D28',
          padding: '12px 24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="technical-label">IN-SITU METOCEAN OBSERVATIONS · WMO BUOY NETWORK</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#6F746C' }}>LIVE SENSOR FEEDS</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div style={{ backgroundColor: '#121512', border: '1px solid #222621', padding: '10px 14px', borderRadius: '2px' }}>
            <div style={{ color: '#6F746C', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>AIR TEMPERATURE</div>
            <div style={{ color: '#E8E6D9', fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '2px' }}>
              -18.4 °C
            </div>
            <div style={{ color: '#9A9D93', fontSize: '9px', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>Trend: Steady (-0.2°C/h)</div>
          </div>

          <div style={{ backgroundColor: '#121512', border: '1px solid #222621', padding: '10px 14px', borderRadius: '2px' }}>
            <div style={{ color: '#6F746C', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>SURFACE WIND</div>
            <div style={{ color: '#E8E6D9', fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '2px' }}>
              SW 18.2 kn
            </div>
            <div style={{ color: '#9A9D93', fontSize: '9px', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>Gusts: 28.5 kn</div>
          </div>

          <div style={{ backgroundColor: '#121512', border: '1px solid #222621', padding: '10px 14px', borderRadius: '2px' }}>
            <div style={{ color: '#6F746C', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>BAROMETRIC PRESSURE</div>
            <div style={{ color: '#E8E6D9', fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '2px' }}>
              978.5 hPa
            </div>
            <div style={{ color: '#C8D35A', fontSize: '9px', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>Falling (-1.2 hPa/3h)</div>
          </div>

          <div style={{ backgroundColor: '#121512', border: '1px solid #222621', padding: '10px 14px', borderRadius: '2px' }}>
            <div style={{ color: '#6F746C', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>SIGNIFICANT WAVE HEIGHT</div>
            <div style={{ color: '#E8E6D9', fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '2px' }}>
              2.1 m
            </div>
            <div style={{ color: '#9A9D93', fontSize: '9px', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>Period: 8.5s · Sea State 4</div>
          </div>
        </div>
      </div>

      {/* Section 13: EXPEDITION TIMELINE */}
      <div
        style={{
          borderTop: '1px solid #292D28',
          backgroundColor: '#0B0D0C',
          padding: '12px 24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div className="technical-label">EXPEDITION TIMELINE</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: '#6F746C' }}>
            WAYPOINTS 01 – 06 · ROUTE DELTA: +1.8h
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '12px'
          }}
        >
          {/* Horizontal Connecting Line */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '5%',
              right: '5%',
              height: '1px',
              backgroundColor: '#292D28',
              zIndex: 1
            }}
          />

          {timelinePoints.map((pt, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: pt.status === 'active' ? '#C8D35A' : '#151915',
                  border: `1.5px solid ${pt.status === 'active' ? '#C8D35A' : '#6F746C'}`,
                  marginBottom: '8px',
                  boxShadow: pt.status === 'active' ? '0 0 6px #C8D35A' : 'none'
                }}
              />

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 600, color: pt.status === 'active' ? '#C8D35A' : '#E8E6D9' }}>
                {pt.label}
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', color: '#6F746C', marginTop: '2px' }}>
                {pt.time}
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', color: '#9A9D93', marginTop: '4px' }}>
                ICE: {pt.ice} · {pt.wind}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .dashboard-main-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-side-panel {
            border-left: none !important;
            border-top: 1px solid #292D28;
          }
        }
      `}</style>
    </div>
  );
}
