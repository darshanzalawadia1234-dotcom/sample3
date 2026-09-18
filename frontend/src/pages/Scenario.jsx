import React, { useState } from 'react';
import MapContainer from '../components/map/MapContainer';
import { Play, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Scenario() {
  const [vessel, setVessel] = useState('RV Meridian');
  const [startPos, setStartPos] = useState('64°31.4S 41°18.7E');
  const [destination, setDestination] = useState('Rothera Research Station');
  const [safetyWeight, setSafetyWeight] = useState(80);
  const [fuelWeight, setFuelWeight] = useState(40);
  const [timeWeight, setTimeWeight] = useState(30);
  const [iceSeverity, setIceSeverity] = useState(+15);
  const [windSeverity, setWindSeverity] = useState(+20);

  const [simulated, setSimulated] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const handleRun = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setSimulated(true);
    }, 600);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'transparent', color: '#E8E6D9', padding: '24px 28px', gap: '20px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #292D28', paddingBottom: '14px' }}>
        <div className="page-eyebrow">WHAT-IF EXPEDITION MODELLING</div>
        <h1 className="page-title-serif" style={{ fontSize: '32px' }}>Scenario simulation</h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#9A9D93', marginTop: '4px' }}>
          Evaluate contingency rerouting, fuel penalty tolerances, and ice-pack pinching hazards under simulated adverse weather.
        </p>
      </div>

      {/* Main Grid: Left Controls + Right Map */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          gap: '18px',
          alignItems: 'stretch'
        }}
        className="scenario-split-grid"
      >
        {/* LEFT: Configuration */}
        <div
          style={{
            backgroundColor: 'rgba(18, 21, 18, 0.65)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            border: '1px solid #292D28',
            borderRadius: 'var(--radius-sm)',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div className="technical-label">SCENARIO INPUT PARAMETERS</div>

          <div>
            <label className="technical-label" style={{ display: 'block', marginBottom: '4px' }}>VESSEL</label>
            <select
              value={vessel}
              onChange={(e) => setVessel(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <option value="RV Meridian">RV Meridian (PC 5)</option>
              <option value="R/V Polarstern">R/V Polarstern (PC 3)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label className="technical-label" style={{ display: 'block', marginBottom: '4px' }}>START POSITION</label>
              <input
                type="text"
                value={startPos}
                onChange={(e) => setStartPos(e.target.value)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}
              />
            </div>
            <div>
              <label className="technical-label" style={{ display: 'block', marginBottom: '4px' }}>DESTINATION</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}
              />
            </div>
          </div>

          {/* Sliders */}
          <div>
            <div className="flex-between" style={{ marginBottom: '4px' }}>
              <label className="technical-label">SAFETY WEIGHT</label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C8D35A' }}>{safetyWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={safetyWeight}
              onChange={(e) => setSafetyWeight(Number(e.target.value))}
              style={{ accentColor: '#C8D35A', height: '4px' }}
            />
          </div>

          <div>
            <div className="flex-between" style={{ marginBottom: '4px' }}>
              <label className="technical-label">SIMULATED ICE SEVERITY DELTA</label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#D85C3E' }}>+{iceSeverity}%</span>
            </div>
            <input
              type="range"
              min="-20"
              max="40"
              value={iceSeverity}
              onChange={(e) => setIceSeverity(Number(e.target.value))}
              style={{ accentColor: '#D85C3E', height: '4px' }}
            />
          </div>

          <div>
            <div className="flex-between" style={{ marginBottom: '4px' }}>
              <label className="technical-label">SIMULATED GALE WIND DELTA</label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#E8E6D9' }}>+{windSeverity} kn</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={windSeverity}
              onChange={(e) => setWindSeverity(Number(e.target.value))}
              style={{ accentColor: '#C8D35A', height: '4px' }}
            />
          </div>

          <button
            onClick={handleRun}
            disabled={simulating}
            className="btn-primary-action"
            style={{ width: '100%', marginTop: 'auto', padding: '10px' }}
          >
            <Play size={13} fill="#0B0D0C" />
            <span>{simulating ? 'Running simulation...' : 'RUN SCENARIO'}</span>
          </button>
        </div>

        {/* RIGHT: Map */}
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
          <MapContainer />
        </div>
      </div>

      {/* Results Section */}
      {simulated && (
        <div
          style={{
            backgroundColor: 'rgba(18, 21, 18, 0.65)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            border: '1px solid #292D28',
            borderRadius: 'var(--radius-sm)',
            padding: '20px'
          }}
        >
          <div className="technical-label" style={{ marginBottom: '12px' }}>
            SIMULATION IMPACT & DIVERGENCE METRICS
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{ backgroundColor: '#0B0D0C', border: '1px solid #222621', padding: '12px', borderRadius: '2px' }}>
              <div style={{ color: '#6F746C', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>RISK DELTA</div>
              <div style={{ color: '#D85C3E', fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '2px' }}>
                +23 / 100
              </div>
              <div style={{ color: '#9A9D93', fontSize: '10px', marginTop: '2px' }}>Elevated pack compaction</div>
            </div>

            <div style={{ backgroundColor: '#0B0D0C', border: '1px solid #222621', padding: '12px', borderRadius: '2px' }}>
              <div style={{ color: '#6F746C', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>FUEL PENALTY</div>
              <div style={{ color: '#C8D35A', fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '2px' }}>
                +115,000 L
              </div>
              <div style={{ color: '#9A9D93', fontSize: '10px', marginTop: '2px' }}>Icebreaking hull drag</div>
            </div>

            <div style={{ backgroundColor: '#0B0D0C', border: '1px solid #222621', padding: '12px', borderRadius: '2px' }}>
              <div style={{ color: '#6F746C', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>ETA DURATION</div>
              <div style={{ color: '#E8E6D9', fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '2px' }}>
                +4.4 HOURS
              </div>
              <div style={{ color: '#9A9D93', fontSize: '10px', marginTop: '2px' }}>Speed reduced to 9.2 kn</div>
            </div>

            <div style={{ backgroundColor: '#0B0D0C', border: '1px solid #222621', padding: '12px', borderRadius: '2px' }}>
              <div style={{ color: '#6F746C', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>ENVIRONMENTAL IMPACT</div>
              <div style={{ color: '#8A963E', fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '2px' }}>
                MARGINAL
              </div>
              <div style={{ color: '#9A9D93', fontSize: '10px', marginTop: '2px' }}>Protected seal zone cleared</div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .scenario-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
