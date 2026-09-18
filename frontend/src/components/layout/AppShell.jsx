import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import OperationsStrip from './OperationsStrip';
import PolarShaderBackground from '../common/PolarShaderBackground';

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shaderEnabled, setShaderEnabled] = useState(true);
  const location = useLocation();

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: 'transparent', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient WebGL Simplex Noise Polar Abyss Shader */}
      {shaderEnabled && <PolarShaderBackground opacity={0.75} />}
      {/* Persistent Left Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          minWidth: 0,
          marginLeft: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          transition: 'margin-left 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="main-viewport"
      >
        {/* Global Operations Header */}
        <Header onMenuClick={() => setMobileOpen(true)} />

        {/* Live Operations Telemetry Strip */}
        <OperationsStrip />

        {/* Main Routed Page Content with Liquid Smooth Transitions */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflowY: 'auto',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div
            key={location.pathname}
            className="page-transition-wrapper"
            style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100%' }}
          >
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .main-viewport {
            margin-left: 0 !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.mobile-open {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </div>
  );
}
