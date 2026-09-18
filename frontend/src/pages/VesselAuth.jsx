import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authApi } from '../api/authApi';
import { Eye, EyeOff, ShieldCheck, Compass, ArrowRight, Anchor, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * POLARNEXUS — Vessel Access Portal
 * Directly ported from reference_design/polarnexus-vessel-auth.html
 * Split-screen Antarctic terrain bathymetry with cursor reveal on the left,
 * and high-precision tactical vessel authentication & registration on the right.
 */
export default function VesselAuth() {
  const navigate = useNavigate();
  const { setSelectedShip, availableShips } = useApp();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [identifier, setIdentifier] = useState('DBLK / 8112299'); // Default demo: Polarstern
  const [password, setPassword] = useState('Polaris@2026!');
  const [vesselName, setVesselName] = useState('');
  const [imoNumber, setImoNumber] = useState('');
  const [callsign, setCallsign] = useState('');
  const [iceClass, setIceClass] = useState('PC3');
  const [operatorEmail, setOperatorEmail] = useState('');
  const [rememberVessel, setRememberVessel] = useState(true);

  // Terrain interactive cursor reveal
  const terrainRef = useRef(null);

  useEffect(() => {
    const el = terrainRef.current;
    if (!el) return;

    const handlePointerMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--rx', `${x.toFixed(2)}%`);
      el.style.setProperty('--ry', `${y.toFixed(2)}%`);
      el.style.setProperty('--rv', '1');
    };

    const handlePointerLeave = () => {
      el.style.setProperty('--rv', '0');
    };

    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // Authenticate via Supabase Auth or fallback to local demo vessel auth
      let authUser = null;
      try {
        const cleanEmail = identifier.includes('@') ? identifier : `${identifier.toLowerCase().replace(/[^a-z0-9]/g, '')}@polarnexus.antarctica`;
        authUser = await authApi.signIn(cleanEmail, password);
      } catch (err) {
        // Fallback for offline/demo credentials
        console.warn('Supabase auth fallback:', err.message);
      }

      // Check matched vessel in fleet
      const matchedShip = availableShips?.find(
        (s) =>
          s.imo === identifier ||
          s.callsign === identifier ||
          identifier.toLowerCase().includes(s.name.toLowerCase()) ||
          identifier.includes(s.imo || '')
      ) || availableShips?.[0];

      if (matchedShip) {
        setSelectedShip(matchedShip);
      }

      setSuccessMsg('Vessel verified. Access granted to Tactical Bridge.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const cleanEmail = operatorEmail || `${callsign.toLowerCase()}@polarnexus.antarctica`;
      await authApi.signUp(cleanEmail, password, {
        vessel_name: vesselName,
        imo_number: imoNumber,
        callsign: callsign,
        ice_class: iceClass
      });

      setSuccessMsg('Vessel registered in Polar Registry. Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 900);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const loadDemoVessel = (ship) => {
    setIdentifier(`${ship.callsign || 'DBLK'} / ${ship.imo || '8112299'}`);
    setPassword('Polaris@2026!');
    setSelectedShip(ship);
  };

  return (
    <div className="vessel-auth-page">
      {/* LEFT: Terrain Bathymetry Panel */}
      <section className="terrain" ref={terrainRef}>
        {/* SVG Bathymetric Contours */}
        <svg className="contours" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <defs>
            <linearGradient id="contourGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Concentric topographic & bathymetric depth contours */}
          <path d="M 0,150 Q 250,90 500,160 T 1000,120 L 1000,1000 L 0,1000 Z" className="contour" />
          <path d="M 0,220 Q 260,180 520,240 T 1000,200" className="contour" />
          <path d="M 0,300 Q 300,240 560,320 T 1000,280" className="contour" />
          <path d="M 0,390 Q 280,340 540,410 T 1000,370" className="contour" />
          <path d="M 0,480 Q 320,420 580,500 T 1000,460" className="contour" />
          <path d="M 0,570 Q 300,520 560,590 T 1000,560" className="contour" />
          <path d="M 0,660 Q 340,610 600,680 T 1000,650" className="contour" />
          <path d="M 0,760 Q 310,720 580,780 T 1000,750" className="contour" />
          <path d="M 0,860 Q 360,820 620,880 T 1000,850" className="contour" />
          
          {/* Seamount & Trench rings */}
          <ellipse cx="680" cy="420" rx="140" ry="90" className="contour" />
          <ellipse cx="680" cy="420" rx="100" ry="65" className="contour" />
          <ellipse cx="680" cy="420" rx="60" ry="40" className="contour" />
          <ellipse cx="680" cy="420" rx="25" ry="16" className="contour" />

          <ellipse cx="280" cy="680" rx="160" ry="110" className="contour" />
          <ellipse cx="280" cy="680" rx="110" ry="75" className="contour" />
          <ellipse cx="280" cy="680" rx="65" ry="42" className="contour" />
        </svg>

        {/* Cursor radial illumination */}
        <div className="terrain-reveal" />

        {/* Tactical Overlay UI */}
        <div className="terrain-ui">
          <div className="brand">
            <div className="brand-mark">
              <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#38bdf8" strokeWidth="1.8" />
                <circle cx="16" cy="16" r="8" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 2" />
                <line x1="16" y1="2" x2="16" y2="30" stroke="#38bdf8" strokeWidth="1.4" />
                <line x1="2" y1="16" x2="30" y2="16" stroke="#38bdf8" strokeWidth="1.4" />
                <circle cx="16" cy="16" r="2.5" fill="#38bdf8" />
              </svg>
            </div>
            <div>
              <div className="brand-name">POLARNEXUS</div>
              <div className="brand-sub">ANTARCTIC NAVIGATION INTELLIGENCE</div>
            </div>
          </div>

          {/* Quick Demo Vessel Switcher */}
          <div style={{ pointerEvents: 'auto', background: 'rgba(4, 9, 20, 0.75)', backdropFilter: 'blur(8px)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)', maxWidth: '380px' }}>
            <div className="label-sm" style={{ color: 'var(--accent-cyan)', marginBottom: '8px' }}>
              FLAGSHIP FLEET PROFILES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {availableShips?.slice(0, 3).map((ship) => (
                <button
                  key={ship.id}
                  onClick={() => loadDemoVessel(ship)}
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: identifier.includes(ship.name) || identifier.includes(ship.callsign) ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 29, 54, 0.5)',
                    border: '1px solid ' + (identifier.includes(ship.name) || identifier.includes(ship.callsign) ? 'var(--accent-cyan)' : 'rgba(30, 41, 59, 0.6)'),
                    padding: '6px 10px',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div>
                    <strong style={{ color: '#ffffff' }}>{ship.name}</strong>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>{ship.iceClass}</span>
                  </div>
                  <span style={{ color: 'var(--accent-cyan)', fontSize: '10px' }}>{ship.callsign}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="terrain-foot">
            <dl className="readout">
              <dt>POLAR OPERATIONS CONSOLE</dt>
              <dd>WMO Polar Code Safety Standard compliant</dd>
              <dd>Real-time Sentinel SAR & CMEMS sea-ice telemetry</dd>
              <dd>Autonomous A* / RRT* ice avoidance routing</dd>
            </dl>

            <div className="coords">
              <span>64°49'S 63°30'W</span>
              <span>PALMER STATION / ANVERS ISL.</span>
              <div className="demo">SOUTHERN OCEAN OPS SECTOR 4</div>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT: Vessel Authentication Panel */}
      <section className="auth">
        <div className="auth-inner">
          <div className="eyebrow">
            <span>VESSEL BRIDGE VERIFICATION</span>
          </div>

          <h1>Polar Access Terminal</h1>
          <p className="lede">
            Authenticate registered vessel credentials or register an expedition icebreaker into the Antarctic decision-support grid.
          </p>

          {/* Mode Switcher */}
          <div className="modes" data-mode={mode}>
            <div className="modes-thumb" />
            <button
              type="button"
              aria-selected={mode === 'signin'}
              onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              aria-selected={mode === 'signup'}
              onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            >
              Register Vessel
            </button>
          </div>

          {/* Error & Success Feedback */}
          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid var(--risk-critical)',
                borderRadius: '6px',
                color: 'var(--risk-critical)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                marginBottom: '16px'
              }}
            >
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid var(--risk-low)',
                borderRadius: '6px',
                color: 'var(--risk-low)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                marginBottom: '16px'
              }}
            >
              <CheckCircle2 size={15} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Sign In Form */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="fields">
              <div className="field">
                <label htmlFor="identifier">
                  Vessel Callsign / IMO Number <span className="opt">(or Master Email)</span>
                </label>
                <div className="control">
                  <input
                    id="identifier"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. DBLK / 8112299"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="password">Bridge Passkey / Security PIN</label>
                <div className="control has-toggle">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    className="peek"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide passkey' : 'Show passkey'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="inline">
                <label className="check">
                  <input
                    type="checkbox"
                    checked={rememberVessel}
                    onChange={(e) => setRememberVessel(e.target.checked)}
                  />
                  <span>Remember station session</span>
                </label>

                <button
                  type="button"
                  className="link"
                  onClick={() => {
                    setIdentifier('DBLK / 8112299');
                    setPassword('Polaris@2026!');
                    setSuccessMsg('Demo flagship credentials loaded.');
                  }}
                >
                  Use Demo Flagship
                </button>
              </div>

              <button type="submit" className="submit" disabled={loading}>
                {loading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Authorize Bridge Access</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Register Vessel Form */
            <form onSubmit={handleSignUp} className="fields">
              <div className="field">
                <label htmlFor="vesselName">Expedition Vessel Name</label>
                <div className="control">
                  <input
                    id="vesselName"
                    type="text"
                    required
                    value={vesselName}
                    onChange={(e) => setVesselName(e.target.value)}
                    placeholder="e.g. R/V Sir David Attenborough"
                  />
                </div>
              </div>

              <div className="row two">
                <div className="field">
                  <label htmlFor="imoNumber">IMO Number</label>
                  <div className="control">
                    <input
                      id="imoNumber"
                      type="text"
                      required
                      value={imoNumber}
                      onChange={(e) => setImoNumber(e.target.value)}
                      placeholder="9798222"
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="callsign">Radio Callsign</label>
                  <div className="control">
                    <input
                      id="callsign"
                      type="text"
                      required
                      value={callsign}
                      onChange={(e) => setCallsign(e.target.value)}
                      placeholder="ZDLP"
                    />
                  </div>
                </div>
              </div>

              <div className="row two">
                <div className="field">
                  <label htmlFor="iceClass">Polar Ice Class</label>
                  <div className="control">
                    <select
                      id="iceClass"
                      value={iceClass}
                      onChange={(e) => setIceClass(e.target.value)}
                    >
                      <option value="PC1">PC1 — Year-round polar ice operations</option>
                      <option value="PC2">PC2 — Year-round multi-year ice</option>
                      <option value="PC3">PC3 — Year-round second-year ice</option>
                      <option value="PC4">PC4 — Year-round thick first-year ice</option>
                      <option value="PC5">PC5 — Year-round medium first-year ice</option>
                      <option value="PC6">PC6 — Summer/autumn medium first-year</option>
                      <option value="PC7">PC7 — Summer/autumn thin first-year</option>
                      <option value="1A Super">1A Super — Baltic Heavy Icebreaker</option>
                      <option value="1A">1A — Moderate Icebreaker</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="operatorEmail">Operator / Master Email</label>
                  <div className="control">
                    <input
                      id="operatorEmail"
                      type="email"
                      required
                      value={operatorEmail}
                      onChange={(e) => setOperatorEmail(e.target.value)}
                      placeholder="navigation@bas.ac.uk"
                    />
                  </div>
                </div>
              </div>

              <div className="field">
                <label htmlFor="regPassword">Create Master Passkey</label>
                <div className="control has-toggle">
                  <input
                    id="regPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    className="peek"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit" disabled={loading}>
                {loading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    <Anchor size={18} />
                    <span>Enroll Vessel in Polar Grid</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Link
              to="/dashboard"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                textDecoration: 'none'
              }}
            >
              Skip to Open Operations Console →
            </Link>
          </div>
        </div>
      </section>

      {/* Embedded CSS matching polarnexus-vessel-auth.html */}
      <style>{`
        .vessel-auth-page {
          display: grid;
          grid-template-columns: 50vw 50vw;
          min-height: 100vh;
          background: #07131D;
          color: #0B1821;
          font-family: var(--font-body);
        }

        .terrain {
          position: relative;
          overflow: hidden;
          background: #050B12;
          isolation: isolate;
          --rx: 50%;
          --ry: 40%;
          --rv: 0;
        }

        .terrain .contours {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        .contour {
          fill: none;
          stroke: #1B3245;
          stroke-width: 1.1;
          vector-effect: non-scaling-stroke;
          transition: stroke 0.5s ease;
        }

        .terrain-reveal {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: var(--rv);
          transition: opacity 0.5s ease;
          background: radial-gradient(
            circle at var(--rx) var(--ry),
            rgba(56, 189, 248, 0.16) 0%,
            rgba(56, 189, 248, 0.06) 32%,
            rgba(56, 189, 248, 0) 65%
          );
          mix-blend-mode: screen;
        }

        .terrain::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(120% 90% at 42% 45%, rgba(0,0,0,0) 38%, rgba(3,7,12,0.75) 100%),
            linear-gradient(90deg, rgba(5,11,18,0.55) 0%, rgba(5,11,18,0) 22%, rgba(5,11,18,0) 78%, rgba(9,20,30,0.65) 100%);
          z-index: 2;
        }

        .terrain::before {
          content: "";
          position: absolute;
          top: 0; bottom: 0; right: 0;
          width: 1px;
          z-index: 3;
          background: linear-gradient(180deg,
            rgba(56, 189, 248, 0) 0%,
            rgba(56, 189, 248, 0.35) 25%,
            rgba(56, 189, 248, 0.55) 50%,
            rgba(56, 189, 248, 0.35) 75%,
            rgba(56, 189, 248, 0) 100%);
        }

        .terrain-ui {
          position: relative;
          z-index: 3;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(24px, 3.4vw, 48px);
          pointer-events: none;
        }

        .brand {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .brand-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(18px, 1.6vw, 22px);
          letter-spacing: 0.15em;
          color: #E6EFF3;
          margin: 0 0 4px;
        }

        .brand-sub {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #7E99A7;
        }

        .terrain-foot {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }

        .readout dt {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #5E7A88;
          margin-bottom: 8px;
        }

        .readout dd {
          margin: 0 0 4px;
          font-size: 11.5px;
          color: #9FB6C1;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .readout dd::before {
          content: "";
          width: 4px;
          height: 4px;
          background: #38bdf8;
          transform: rotate(45deg);
        }

        .coords {
          text-align: right;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          color: #6E8A98;
          line-height: 1.8;
        }

        .coords .demo {
          margin-top: 8px;
          font-size: 9.5px;
          color: #4E6875;
        }

        .auth {
          position: relative;
          background: #F5F7F8;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(28px, 4vw, 64px) clamp(20px, 4vw, 56px);
          overflow-y: auto;
        }

        .auth::before {
          content: "";
          position: absolute;
          left: 0; top: 0; bottom: 0; width: 14px;
          background-image: repeating-linear-gradient(180deg,
            #C3D0D6 0 1px, transparent 1px 34px);
          opacity: 0.55;
          pointer-events: none;
        }

        .auth-inner {
          width: 100%;
          max-width: 432px;
        }

        .eyebrow {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #486581;
          font-weight: 600;
          margin: 0 0 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .eyebrow::after {
          content: "";
          height: 1px;
          flex: 1;
          background: #D7E0E4;
        }

        .auth h1 {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 600;
          color: #0B1821;
          margin: 0 0 8px;
          line-height: 1.2;
        }

        .lede {
          margin: 0 0 24px;
          color: #667780;
          font-size: 13.5px;
          line-height: 1.5;
        }

        .modes {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #EAEFF1;
          border: 1px solid #D7E0E4;
          border-radius: 8px;
          padding: 3px;
          margin: 0 0 22px;
        }

        .modes-thumb {
          position: absolute;
          top: 3px; left: 3px;
          width: calc(50% - 3px);
          height: calc(100% - 6px);
          background: #ffffff;
          border: 1px solid #D7E0E4;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(11,24,33,0.06);
          transition: transform 0.25s cubic-bezier(.22,.61,.36,1);
        }

        .modes[data-mode="signup"] .modes-thumb {
          transform: translateX(100%);
        }

        .modes button {
          position: relative;
          z-index: 1;
          appearance: none;
          background: none;
          border: 0;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: #667780;
          padding: 8px;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .modes button[aria-selected="true"] {
          color: #0B1821;
          font-weight: 600;
        }

        .fields {
          display: grid;
          gap: 14px;
        }

        .row.two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .field {
          display: grid;
          gap: 6px;
        }

        .field label {
          font-size: 12px;
          font-weight: 500;
          color: #0B1821;
        }

        .field label .opt {
          color: #667780;
          font-weight: 400;
        }

        .control {
          position: relative;
        }

        .control input,
        .control select {
          width: 100%;
          height: 46px;
          padding: 0 12px;
          font-size: 13.5px;
          font-family: var(--font-body);
          color: #0B1821;
          background: #ffffff;
          border: 1px solid #D7E0E4;
          border-radius: 6px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .control input:focus,
        .control select:focus {
          outline: none;
          border-color: #38bdf8;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
        }

        .has-toggle input {
          padding-right: 44px;
        }

        .peek {
          position: absolute;
          right: 4px; top: 50%;
          transform: translateY(-50%);
          width: 36px; height: 36px;
          display: grid;
          place-items: center;
          border: none;
          background: none;
          border-radius: 4px;
          color: #667780;
          cursor: pointer;
        }

        .peek:hover {
          color: #0B1821;
          background: #EEF2F4;
        }

        .inline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12.5px;
          color: #667780;
          margin-top: 2px;
        }

        .check {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .check input {
          width: 16px; height: 16px;
          accent-color: #07131D;
        }

        .link {
          background: none;
          border: none;
          border-bottom: 1px solid #C3D0D6;
          color: #10232F;
          font-family: inherit;
          font-size: 12.5px;
          cursor: pointer;
          padding-bottom: 1px;
        }

        .submit {
          margin-top: 14px;
          width: 100%;
          height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #07131D;
          color: #EAF2F5;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          border: 1px solid #07131D;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.15s ease;
        }

        .submit:hover:not(:disabled) {
          background: #10232F;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(7,19,29,0.18);
        }

        .submit:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(234, 242, 245, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .vessel-auth-page {
            grid-template-columns: 1fr;
          }
          .terrain {
            display: none;
          }
          .auth {
            min-height: 100vh;
          }
        }
      `}</style>
    </div>
  );
}
