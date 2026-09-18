import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Compass,
  Layers,
  TriangleAlert,
  Navigation as NavigationIcon,
  CloudSun,
  Ship,
  Clock,
  Cpu,
  Sliders,
  HelpCircle,
  Shuffle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { systemStatus } = useApp();
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: 'OVERVIEW', icon: Compass, exact: true },
    { to: '/sea-ice', label: 'SEA ICE', icon: Layers },
    { to: '/icebergs', label: 'ICEBERGS', icon: TriangleAlert },
    { to: '/navigation', label: 'NAVIGATION', icon: NavigationIcon },
    { to: '/environment', label: 'ENVIRONMENT', icon: CloudSun },
    { to: '/vessels', label: 'VESSELS', icon: Ship },
    { to: '/history', label: 'HISTORY', icon: Clock },
    { to: '/models', label: 'MODELS', icon: Cpu },
    { to: '/scenario', label: 'SCENARIO', icon: Shuffle },
    { to: '/settings', label: 'SETTINGS', icon: Sliders },
    { to: '/help', label: 'HELP', icon: HelpCircle }
  ];

  const isBackendOnline = systemStatus.backend === 'HEALTHY' || systemStatus.backend === 'ONLINE';
  const isLiveData = systemStatus.dataMode === 'LIVE';

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 13, 12, 0.85)',
            zIndex: 1100
          }}
        />
      )}

      <aside
        style={{
          width: 'var(--sidebar-width)',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          backgroundColor: '#0D100E',
          borderRight: '1px solid #292D28',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1200,
          transition: 'transform 0.2s ease',
          transform: mobileOpen ? 'translateX(0)' : undefined
        }}
        className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}
      >
        {/* Top: A·D Logo Box + ANTARCTIC DECISION SUPPORT */}
        <div
          style={{
            padding: '18px 18px',
            borderBottom: '1px solid #292D28',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              background: '#121512',
              border: '1px solid #C8D35A',
              color: '#C8D35A',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: '2px',
              flexShrink: 0
            }}
          >
            A·D
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10.5px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: '#E8E6D9',
                lineHeight: 1.2
              }}
            >
              ANTARCTIC
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '8.5px',
                letterSpacing: '0.15em',
                color: '#6F746C'
              }}
            >
              DECISION SUPPORT
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.to ||
              (item.to !== '/dashboard' && location.pathname.startsWith(item.to));

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className="sidebar-nav-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 18px',
                  color: isActive ? '#C8D35A' : '#9A9D93',
                  backgroundColor: isActive ? 'rgba(200, 211, 90, 0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid #C8D35A' : '2px solid transparent',
                  textDecoration: 'none',
                  fontSize: '11.5px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.08em',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform'
                }}
              >
                <Icon size={15} color={isActive ? '#C8D35A' : '#6F746C'} style={{ flexShrink: 0 }} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <style>{`
          .sidebar-nav-item:hover {
            transform: translateX(2px);
            color: #E8E6D9 !important;
            background-color: rgba(200, 211, 90, 0.05) !important;
          }
        `}</style>

        {/* Section 7: Sidebar System Status Display */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid #292D28',
            backgroundColor: '#0B0D0C',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isBackendOnline ? '#C8D35A' : '#D85C3E',
                boxShadow: isBackendOnline ? '0 0 6px #C8D35A' : '0 0 6px #D85C3E'
              }}
            />
            <span style={{ color: isBackendOnline ? '#E8E6D9' : '#D85C3E', fontWeight: 600, letterSpacing: '0.06em' }}>
              {isBackendOnline ? 'BACKEND ONLINE' : 'BACKEND OFFLINE'}
            </span>
          </div>

          <div style={{ color: '#6F746C', letterSpacing: '0.08em', paddingLeft: '14px' }}>
            DATA MODE: <span style={{ color: '#9A9D93' }}>{isLiveData ? 'LIVE' : 'DEMO'}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
