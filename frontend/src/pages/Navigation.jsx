import React, { useState } from 'react';
import MapContainer from '../components/map/MapContainer';
import { useRoute } from '../hooks/useRoute';
import { useShips } from '../hooks/useShips';
import { Play, RotateCcw, ShieldCheck, Check } from 'lucide-react';

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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0B0D0C', color: '#E8E6D9', padding: '24px 28px', gap: '20px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #292D28', paddingBottom: '14px' }}>
        <div className="page-eyebrow">POLAR NAVIGATION ENGINE</div>
        <h1 className="page-title-serif">ROUTE PLANNING</h1>
      </div>

      {/* Main Layout: Left Controls + Right Map */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '16px',
          height: '370px'
        }}
        className="nav-split-grid"
      >
        {/* LEFT: Route Controls */}
        <div
          style={{
            backgroundColor: '#121512',
            border: '1px solid #292D28',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            height: '370px',
            overflowY: 'auto'
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
            height: '370px'
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
          backgroundColor: '#121512',
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

      <style>{`
        @media (max-width: 960px) {
          .nav-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
