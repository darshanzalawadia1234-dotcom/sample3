import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, HelpCircle, Sliders, Menu, X, ShieldAlert, User, LogIn, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatUtcDateTime } from '../../utils/formatting';
import authApi from '../../api/authApi';

export default function Header({ onMenuClick }) {
  const { systemStatus, notifications, dismissNotification } = useApp();
  const location = useLocation();
  const [utcTime, setUtcTime] = useState(formatUtcDateTime());
  const [showNotifications, setShowNotifications] = useState(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authEmail, setAuthEmail] = useState('operator@antarctic.org');
  const [authPassword, setAuthPassword] = useState('demopassword123');
  const [authName, setAuthName] = useState('Dr. Sarah Evans');
  const [authOrg, setAuthOrg] = useState('British Antarctic Survey');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Real-time UTC clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setUtcTime(formatUtcDateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch current user on mount
  useEffect(() => {
    authApi.getMe()
      .then(user => setCurrentUser(user))
      .catch(() => setCurrentUser(null));
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (isSignUp) {
        const res = await authApi.signup({
          email: authEmail,
          password: authPassword,
          full_name: authName,
          organization: authOrg,
          role: 'operator'
        });
        setCurrentUser(res.user);
      } else {
        const res = await authApi.login({
          email: authEmail,
          password: authPassword
        });
        setCurrentUser(res.user);
      }
      setShowAuthModal(false);
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await authApi.logout();
    setCurrentUser(null);
  };

  const getPageTitle = (pathname) => {
    if (pathname === '/dashboard') return 'ANTARCTIC OPERATIONS COMMAND';
    if (pathname.startsWith('/sea-ice')) return 'SEA-ICE CONCENTRATION & FORECAST';
    if (pathname.startsWith('/icebergs/')) return 'ICEBERG TRAJECTORY DYNAMICS';
    if (pathname.startsWith('/icebergs')) return 'ICEBERG TRACKING & PROXIMITY';
    if (pathname.startsWith('/navigation')) return 'EXPEDITION ROUTE OPTIMIZATION';
    if (pathname.startsWith('/environment')) return 'SYNOPTIC POLAR METEOROLOGY & OCEAN';
    if (pathname.startsWith('/vessels/')) return 'RESEARCH VESSEL TELEMETRY';
    if (pathname.startsWith('/vessels')) return 'POLAR RESEARCH FLEET MANAGEMENT';
    if (pathname.startsWith('/scenario')) return 'ENVIRONMENTAL "WHAT IF?" SIMULATOR';
    if (pathname.startsWith('/history')) return 'HISTORICAL POLAR OBSERVATIONS';
    if (pathname.startsWith('/models')) return 'PREDICTION MODEL METRICS & TRANSPARENCY';
    if (pathname.startsWith('/settings')) return 'SYSTEM SETTINGS & CARTOGRAPHY PRESETS';
    if (pathname.startsWith('/help')) return 'POLAR NAVIGATION REFERENCE & MANUAL';
    return 'POLAR DECISION SUPPORT';
  };

  const isDemo = systemStatus.dataMode !== 'LIVE';

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'rgba(13, 27, 52, 0.65)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-panel), var(--glass-specular)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px'
          }}
          className="mobile-menu-btn"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1
            className="mono-readout"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'var(--text-primary)',
              textTransform: 'uppercase'
            }}
          >
            {getPageTitle(location.pathname)}
          </h1>
        </div>
      </div>

      {/* Center/Right: Data Status, Auth & Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Telemetry Status Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-primary)',
            padding: '4px 10px',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>DATA:</span>
          <span style={{ color: isDemo ? 'var(--risk-moderate)' : 'var(--risk-low)', fontWeight: 600 }}>
            {isDemo ? 'DEMO' : 'LIVE'}
          </span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span style={{ color: 'var(--text-secondary)' }}>{utcTime}</span>
        </div>

        {/* User Auth Profile Badge / Button */}
        {currentUser ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(91, 192, 190, 0.1)',
              border: '1px solid rgba(91, 192, 190, 0.3)',
              borderRadius: 'var(--radius-xs)',
              padding: '4px 10px',
              fontSize: '11px',
              color: 'var(--accent-cyan)'
            }}
          >
            <User size={13} />
            <span style={{ fontWeight: 600, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser.full_name || currentUser.email}
            </span>
            <button
              onClick={handleLogout}
              title="Sign Out"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0 2px'
              }}
            >
              <LogOut size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(91, 192, 190, 0.15)',
              border: '1px solid var(--accent-cyan)',
              borderRadius: 'var(--radius-xs)',
              padding: '4px 10px',
              fontSize: '11px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <LogIn size={13} color="var(--accent-cyan)" />
            <span>OPERATOR LOGIN</span>
          </button>
        )}

        {/* Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
          {/* Notifications Button */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
            style={{
              background: 'rgba(28, 42, 67, 0.45)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-sm)',
              color: notifications.length > 0 ? 'var(--accent-ice)' : 'var(--text-muted)',
              cursor: 'pointer',
              padding: '7px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
          >
            <Bell size={15} />
            {notifications.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--risk-critical)',
                  boxShadow: '0 0 6px rgba(239, 68, 68, 0.8)'
                }}
              />
            )}
          </button>

          {/* Settings Link */}
          <Link
            to="/settings"
            aria-label="Settings"
            style={{
              background: 'rgba(28, 42, 67, 0.45)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              padding: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Sliders size={15} />
          </Link>

          {/* Help Link */}
          <Link
            to="/help"
            aria-label="Help and Documentation"
            style={{
              background: 'rgba(28, 42, 67, 0.45)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              padding: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <HelpCircle size={15} />
          </Link>

          {/* Notifications Flyout Drawer */}
          {showNotifications && (
            <div
              className="glass-panel-deep"
              style={{
                position: 'absolute',
                top: '44px',
                right: 0,
                width: '340px',
                zIndex: 2000,
                padding: '14px',
                border: '1px solid var(--glass-border-hover)'
              }}
            >
              <div className="flex-between" style={{ marginBottom: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                <span className="technical-label">Operational Hazard Notices ({notifications.length})</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={13} />
                </button>
              </div>

              {notifications.length === 0 ? (
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', padding: '12px 0', textAlign: 'center' }}>
                  No active operational notices.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      style={{
                        padding: '8px',
                        background: 'var(--bg-primary)',
                        borderLeft: `3px solid ${n.severity === 'WARNING' ? 'var(--risk-moderate)' : 'var(--accent-ice)'}`,
                        borderRadius: 'var(--radius-xs)'
                      }}
                    >
                      <div className="flex-between" style={{ marginBottom: '2px' }}>
                        <span className="mono-readout" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {n.title}
                        </span>
                        <button
                          onClick={() => dismissNotification(n.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '10px' }}
                        >
                          ✕
                        </button>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        {n.message}
                      </div>
                      <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                        {n.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Supabase Auth Modal */}
      {showAuthModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 11, 26, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000
          }}
        >
          <div
            className="tech-card"
            style={{
              width: '400px',
              maxWidth: '90vw',
              padding: '24px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--accent-cyan)',
              boxShadow: '0 0 25px rgba(91, 192, 190, 0.2)'
            }}
          >
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div>
                <div className="technical-label">SUPABASE AUTHENTICATION</div>
                <h3 className="mono-readout" style={{ fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>
                  {isSignUp ? 'REGISTER POLAR OPERATOR' : 'OPERATOR LOGIN'}
                </h3>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {authError && (
              <div
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid var(--risk-critical)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--risk-critical)',
                  fontSize: '11.5px',
                  marginBottom: '14px'
                }}
              >
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {isSignUp && (
                <>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      className="polar-input"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px', background: 'var(--bg-primary)', color: '#fff', border: '1px solid var(--border-medium)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      INSTITUTE / ORGANIZATION
                    </label>
                    <input
                      type="text"
                      className="polar-input"
                      value={authOrg}
                      onChange={(e) => setAuthOrg(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px', background: 'var(--bg-primary)', color: '#fff', border: '1px solid var(--border-medium)' }}
                    />
                  </div>
                </>
              )}

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  OPERATOR EMAIL
                </label>
                <input
                  type="email"
                  className="polar-input"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-primary)', color: '#fff', border: '1px solid var(--border-medium)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  SECURITY PASSPHRASE
                </label>
                <input
                  type="password"
                  className="polar-input"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-primary)', color: '#fff', border: '1px solid var(--border-medium)' }}
                />
              </div>

              <div style={{ marginTop: '6px', display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="btn-polar btn-primary-action"
                  style={{ flex: 1, padding: '10px' }}
                >
                  {authLoading ? 'AUTHENTICATING...' : (isSignUp ? 'CREATE ACCOUNT' : 'AUTHENTICATE')}
                </button>
              </div>

              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-ice)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {isSignUp ? 'Already registered? Sign In' : 'New operator? Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
