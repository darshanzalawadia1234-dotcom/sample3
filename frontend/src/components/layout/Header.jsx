import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, HelpCircle, Sliders, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatUtcDateTime } from '../../utils/formatting';

export default function Header({ onMenuClick }) {
  const { systemStatus, notifications } = useApp();
  const location = useLocation();
  const [utcTime, setUtcTime] = useState(formatUtcDateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setUtcTime(formatUtcDateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = (pathname) => {
    if (pathname === '/dashboard') return 'OPERATIONS OVERVIEW';
    if (pathname.startsWith('/sea-ice')) return 'SEA-ICE ANALYSIS';
    if (pathname.startsWith('/icebergs/')) return 'ICEBERG DYNAMICS';
    if (pathname.startsWith('/icebergs')) return 'ICEBERGS';
    if (pathname.startsWith('/navigation')) return 'ROUTE PLANNING';
    if (pathname.startsWith('/environment')) return 'ENVIRONMENTAL CONDITIONS';
    if (pathname.startsWith('/vessels/')) return 'VESSEL DETAIL';
    if (pathname.startsWith('/vessels')) return 'RESEARCH VESSELS';
    if (pathname.startsWith('/scenario')) return 'SCENARIO ANALYSIS';
    if (pathname.startsWith('/history')) return 'HISTORICAL ARCHIVE';
    if (pathname.startsWith('/models')) return 'MODEL MONITORING';
    if (pathname.startsWith('/settings')) return 'SYSTEM SETTINGS';
    if (pathname.startsWith('/help')) return 'FIELD GUIDE';
    if (pathname.startsWith('/auth')) return 'VESSEL ACCESS';
    return 'OPERATIONS';
  };

  const isLiveData = systemStatus.dataMode === 'LIVE';

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: '#0D100E',
        borderBottom: '1px solid #292D28',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 100
      }}
    >
      {/* Left: Mobile Button + ANTARCTIC OPERATIONS + Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={onMenuClick}
          aria-label="Open mobile menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#E8E6D9',
            cursor: 'pointer',
            padding: '4px'
          }}
          className="mobile-menu-btn"
        >
          <Menu size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-mono)' }}>
          <span style={{ fontSize: '10px', color: '#6F746C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            ANTARCTIC OPERATIONS
          </span>
          <span style={{ color: '#292D28' }}>/</span>
          <span style={{ fontSize: '11px', color: '#E8E6D9', fontWeight: 600, letterSpacing: '0.08em' }}>
            {getPageTitle(location.pathname)}
          </span>
        </div>
      </div>

      {/* Right: Data Mode, Timestamp, Action Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '10.5px' }}>
          <span style={{ color: isLiveData ? '#C8D35A' : '#9A9D93', letterSpacing: '0.08em' }}>
            {isLiveData ? 'LIVE DATA' : 'DEMO DATA'}
          </span>
          <span style={{ color: '#6F746C' }}>·</span>
          <span style={{ color: '#6F746C', letterSpacing: '0.04em' }}>
            UPDATED {utcTime.split(' ')[1] || '18:05:14'} UTC
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            to="/dashboard"
            title="Notifications"
            style={{
              color: notifications?.length > 0 ? '#C8D35A' : '#6F746C',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
          >
            <Bell size={15} />
          </Link>

          <Link
            to="/help"
            title="Help"
            style={{
              color: '#6F746C',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
          >
            <HelpCircle size={15} />
          </Link>

          <Link
            to="/settings"
            title="Settings"
            style={{
              color: '#6F746C',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
          >
            <Sliders size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}
