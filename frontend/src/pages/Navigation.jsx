import React, { useState } from 'react';
import MapContainer from '../components/map/MapContainer';
import { useRoute } from '../hooks/useRoute';
import { useShips } from '../hooks/useShips';
import { Play, RotateCcw, ShieldCheck, Check, Compass, Info, ArrowRight } from 'lucide-react';
import { MOCK_ROUTES } from '../api/mockData';

export default function Navigation() {
  const { ships } = useShips();
  const { routeResult, selectedRoute, activeOptionId, setActiveOptionId, optimizing, optimizeRoute } = useRoute();

  const [selectedVessel, setSelectedVessel] = useState(ships[0]?.name || 'RV Meridian');
  const [safetyWeight, setSafetyWeight] = useState(70);
  const [fuelWeight, setFuelWeight] = useState(50);
  const [timeWeight, setTimeWeight] = useState(40);

  const handleReset = () => {
    setSafetyWeight(70);
    setFuelWeight(50);
    setTimeWeight(40);
  };

  const handleOptimize = async () => {
    await optimizeRoute({
      vesselName: selectedVessel,
      safetyWeight,
      fuelWeight,
      timeWeight
    });
  };

  // Profiles from Section 15
  const profiles = [
    { id: 'shortest', name: 'SHORTEST', dist: '1,240 km', fuel: '142k L', time: '52.4 h', risk: 'HIGH · 72/100', riskColor: '#D85C3E' },
    { id: 'safest', name: 'SAFEST', dist: '1,490 km', fuel: '168k L', time: '64.1 h', risk: 'LOW · 25/100', riskColor: '#8A963E' },
    { id: 'fuel_opt', name: 'FUEL EFFICIENT', dist: '1,380 km', fuel: '138k L', time: '58.8 h', risk: 'MODERATE · 38/100', riskColor: '#C8D35A' },
    { id: 'balanced', name: 'BALANCED', dist: '1,320 km', fuel: '148k L', time: '55.2 h', risk: 'LOW · 31/100', riskColor: '#8A963E' }
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'transparent', color: '#E8E6D9', padding: '24px 28px', gap: '20px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #292D28', paddingBottom: '14px' }}>
        <div className="page-eyebrow">POLAR NAVIGATION ENGINE</div>
        <h1 className="page-title-serif">ROUTE PLANNING</h1>
      </div>

      {/* Top Split: Left Parameters + Right Map */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '340px 1fr',
          gap: '16px',
          alignItems: 'stretch'
        }}
        className="nav-split-grid"
      >
        {/* LEFT: Route Controls */}
        <div
          style={{
            backgroundColor: 'rgba(18, 21, 18, 0.65)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            border: '1px solid #292D28',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div className="technical-label">OPTIMIZATION PARAMETERS</div>

          {/* Vessel Dropdown */}
          <div>
            <label className="technical-label" style={{ display: 'block', marginBottom: '6px' }}>VESSEL</label>
            <select
              value={selectedVessel}
              onChange={(e) => setSelectedVessel(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <option value="RV Meridian">RV Meridian (PC 5)</option>
              <option value="R/V Polarstern">R/V Polarstern (PC 3)</option>
              <option value="RRS Sir David Attenborough">RRS Sir David Attenborough (PC 4)</option>
              <option value="Agulhas II">Agulhas II (PC 5)</option>
            </select>
          </div>

          {/* SAFETY Slider */}
          <div>
            <div className="flex-between" style={{ marginBottom: '6px' }}>
              <label className="technical-label">SAFETY WEIGHT</label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C8D35A' }}>{safetyWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={safetyWeight}
              onChange={(e) => setSafetyWeight(Number(e.target.value))}
              style={{ accentColor: '#C8D35A', height: '4px', cursor: 'pointer' }}
            />
          </div>

          {/* FUEL Slider */}
          <div>
            <div className="flex-between" style={{ marginBottom: '6px' }}>
              <label className="technical-label">FUEL WEIGHT</label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C8D35A' }}>{fuelWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={fuelWeight}
              onChange={(e) => setFuelWeight(Number(e.target.value))}
              style={{ accentColor: '#C8D35A', height: '4px', cursor: 'pointer' }}
            />
          </div>

          {/* TIME Slider */}
          <div>
            <div className="flex-between" style={{ marginBottom: '6px' }}>
              <label className="technical-label">TIME WEIGHT</label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C8D35A' }}>{timeWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={timeWeight}
              onChange={(e) => setTimeWeight(Number(e.target.value))}
              style={{ accentColor: '#C8D35A', height: '4px', cursor: 'pointer' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '6px' }}>
            <button
              onClick={handleOptimize}
              disabled={optimizing}
              className="btn-primary-action"
              style={{ flex: 1, padding: '8px 12px' }}
            >
              <Play size={13} fill="#0B0D0C" />
              <span>{optimizing ? 'Calculating...' : 'Optimize route'}</span>
            </button>

            <button
              onClick={handleReset}
              className="btn-secondary"
              style={{ padding: '8px 12px' }}
              title="Reset sliders"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* RIGHT: Map Container */}
        <div
          style={{
            backgroundColor: '#0B0F0D',
            border: '1px solid #292D28',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            minHeight: '380px',
            height: '100%'
          }}
        >
          <MapContainer
            customRoutes={routeResult.options}
            highlightedRouteId={activeOptionId || 'balanced'}
          />
        </div>
      </div>

      {/* Section 15: ROUTE COMPARISON TABLE */}
      <div
        style={{
          backgroundColor: 'rgba(18, 21, 18, 0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          border: '1px solid #292D28',
          borderRadius: 'var(--radius-sm)',
          padding: '18px'
        }}
      >
        <div className="technical-label" style={{ marginBottom: '12px' }}>
          ROUTE COMPARISON MATRIX
        </div>

        <table className="tactical-table">
          <thead>
            <tr>
              <th>PROFILE</th>
              <th>DISTANCE</th>
              <th>FUEL</th>
              <th>TIME</th>
              <th>RISK</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => {
              const isSelected = (activeOptionId || 'balanced') === p.id;
              return (
                <tr
                  key={p.id}
                  onClick={() => setActiveOptionId(p.id)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(200, 211, 90, 0.08)' : undefined,
                    cursor: 'pointer'
                  }}
                  className={isSelected ? 'selected' : ''}
                >
                  <td style={{ fontWeight: 600, color: isSelected ? '#C8D35A' : '#E8E6D9' }}>
                    {p.name}
                  </td>
                  <td>{p.dist}</td>
                  <td>{p.fuel}</td>
                  <td>{p.time}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 6px',
                        borderRadius: '2px',
                        fontSize: '9.5px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        color: p.riskColor,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        border: `1px solid ${p.riskColor}40`
                      }}
                    >
                      {p.risk}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Section 16: AI DECISION EXPLANATION & TRADEOFF ANALYSIS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '16px'
        }}
        className="nav-decision-grid"
      >
        <div
          style={{
            backgroundColor: 'rgba(18, 21, 18, 0.65)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            border: '1px solid #292D28',
            borderRadius: 'var(--radius-sm)',
            padding: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Compass size={16} color="#C8D35A" />
            <span className="technical-label">AI ROUTE SELECTION RATIONALE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MOCK_ROUTES.decisionExplanation.highlights.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#E8E6D9' }}>
                <Check size={14} color="#C8D35A" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(18, 21, 18, 0.65)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            border: '1px solid #292D28',
            borderRadius: 'var(--radius-sm)',
            padding: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Info size={16} color="#C8D35A" />
            <span className="technical-label">MULTI-OBJECTIVE TRADEOFF</span>
          </div>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12.5px', color: '#9A9D93', lineHeight: 1.6 }}>
            {MOCK_ROUTES.decisionExplanation.tradeoff}
          </p>
        </div>
      </div>

      {/* Section 17: SEGMENT-BY-SEGMENT WAYPOINT INSPECTION */}
      <div
        style={{
          backgroundColor: 'rgba(18, 21, 18, 0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          border: '1px solid #292D28',
          borderRadius: 'var(--radius-sm)',
          padding: '18px'
        }}
      >
        <div className="technical-label" style={{ marginBottom: '14px' }}>
          WAYPOINT CORRIDOR SEGMENTS ({MOCK_ROUTES.segments.length})
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {MOCK_ROUTES.segments.map((seg) => (
            <div
              key={seg.id}
              style={{
                backgroundColor: '#0B0D0C',
                border: '1px solid #222621',
                borderRadius: '2px',
                padding: '14px'
              }}
            >
              <div className="flex-between" style={{ marginBottom: '6px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: '#C8D35A' }}>
                  {seg.id}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    fontWeight: 600,
                    color: seg.icebergRisk === 'LOW' ? '#4EBA6F' : '#E09F3E'
                  }}
                >
                  RISK: {seg.icebergRisk}
                </span>
              </div>

              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#E8E6D9', fontWeight: 600, marginBottom: '8px' }}>
                {seg.title}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#9A9D93' }}>
                <div>DIST: {seg.distanceKm} km</div>
                <div>ICE CONC: {seg.seaIceConcentration}%</div>
                <div>WIND: {seg.windSpeedKnots} kn</div>
                <div>FUEL: {seg.fuelEstimateLiters} L</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .nav-split-grid, .nav-decision-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
