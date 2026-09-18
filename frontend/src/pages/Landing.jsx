import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldAlert, Layers, Activity, ChevronDown } from 'lucide-react';
import { formatUtcDateTime } from '../utils/formatting';

export default function Landing() {
  const [utcTime, setUtcTime] = useState(formatUtcDateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setUtcTime(formatUtcDateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B0D0C', color: '#E8E6D9', display: 'flex', flexDirection: 'column' }}>
      {/* Cinematic Hero Viewport */}
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 36px',
          overflow: 'hidden'
        }}
      >
        {/* Background Antarctic Aerial Landscape Image with Dark Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2400&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            filter: 'brightness(0.32) contrast(1.15) desaturate(0.4)',
            zIndex: 0
          }}
        />

        {/* Subtle Dark Gradient & Grid Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(11,13,12,0.85) 0%, rgba(11,13,12,0.4) 40%, rgba(11,13,12,0.92) 100%), radial-gradient(circle at 20% 40%, rgba(200,211,90,0.06) 0%, transparent 60%)',
            zIndex: 1
          }}
        />

        {/* Top Header Bar */}
        <header
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(41, 45, 40, 0.6)',
            paddingBottom: '16px'
          }}
        >
          {/* Top-Left: Small Square Logo Box "A·D" + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                background: '#121512',
                border: '1px solid #C8D35A',
                color: '#C8D35A',
                display: 'grid',
                placeItems: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}
            >
              A·D
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', color: '#E8E6D9', lineHeight: 1.2 }}>
                ANTARCTIC
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', color: '#9A9D93' }}>
                DECISION SUPPORT
              </div>
            </div>
          </div>

          {/* Top-Right: Status Text with Yellow-Green Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#9A9D93' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C8D35A', boxShadow: '0 0 6px #C8D35A' }} />
            <span>EXPEDITION CONSOLE · 74.3°S 145.9°E</span>
          </div>
        </header>

        {/* Hero Content Positioned Toward Left */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '820px',
            margin: 'auto 0',
            padding: '40px 0'
          }}
        >
          <div className="page-eyebrow" style={{ marginBottom: '12px', fontSize: '11px' }}>
            POLAR RESEARCH OPERATIONS
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(44px, 5.5vw, 76px)',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#E8E6D9',
              marginBottom: '20px'
            }}
          >
            Antarctic Decision<br />Support System
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '17px',
              lineHeight: 1.6,
              color: '#9A9D93',
              maxWidth: '620px',
              marginBottom: '32px'
            }}
          >
            AI-assisted sea-ice forecasting, iceberg trajectory prediction, and safer expedition routing across the Southern Ocean.
          </p>

          {/* Two Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              to="/dashboard"
              className="btn-primary-action"
              style={{
                textDecoration: 'none',
                padding: '11px 24px',
                fontSize: '13px'
              }}
            >
              <span>Open Operations Dashboard</span>
              <ArrowRight size={14} />
            </Link>

            <a
              href="#system-details"
              className="btn-secondary"
              style={{
                textDecoration: 'none',
                padding: '11px 22px',
                fontSize: '13px'
              }}
            >
              <span>Explore the System</span>
              <ChevronDown size={14} />
            </a>
          </div>
        </div>

        {/* Bottom Hero Horizontal System Information Strip */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            borderTop: '1px solid rgba(41, 45, 40, 0.7)',
            paddingTop: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px'
          }}
        >
          <div style={{ borderLeft: '1px solid rgba(41, 45, 40, 0.7)', paddingLeft: '12px' }}>
            <div style={{ color: '#6F746C', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>ACTIVE SECTOR</div>
            <div style={{ color: '#E8E6D9', fontWeight: 600, marginTop: '2px' }}>WEDDELL / ROSS</div>
          </div>

          <div style={{ borderLeft: '1px solid rgba(41, 45, 40, 0.7)', paddingLeft: '12px' }}>
            <div style={{ color: '#6F746C', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>CHART DATUM</div>
            <div style={{ color: '#E8E6D9', fontWeight: 600, marginTop: '2px' }}>WGS 84 POLAR</div>
          </div>

          <div style={{ borderLeft: '1px solid rgba(41, 45, 40, 0.7)', paddingLeft: '12px' }}>
            <div style={{ color: '#6F746C', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>MODE</div>
            <div style={{ color: '#C8D35A', fontWeight: 600, marginTop: '2px' }}>DEMO FEED</div>
          </div>

          <div style={{ borderLeft: '1px solid rgba(41, 45, 40, 0.7)', paddingLeft: '12px' }}>
            <div style={{ color: '#6F746C', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>UTC TIMESTAMP</div>
            <div style={{ color: '#E8E6D9', fontWeight: 600, marginTop: '2px' }}>{utcTime}</div>
          </div>
        </div>
      </div>

      {/* System Overview Section Below Hero */}
      <section
        id="system-details"
        style={{
          padding: '64px 36px',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          borderTop: '1px solid #292D28'
        }}
      >
        <div style={{ maxWidth: '640px', marginBottom: '40px' }}>
          <div className="page-eyebrow">MISSION-CRITICAL CAPABILITIES</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 400, color: '#E8E6D9', marginTop: '4px' }}>
            Engineered for Extreme-Latitude Navigation
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div className="tech-card" style={{ padding: '24px' }}>
            <div style={{ color: '#C8D35A', fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: '12px' }}>01 / CRYOSPHERE</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: '#E8E6D9', marginBottom: '8px' }}>
              Sea-Ice Concentration Models
            </h3>
            <p style={{ color: '#9A9D93', fontSize: '13px', lineHeight: 1.6 }}>
              Ingests high-resolution Sentinel-1 SAR and AMSR2 microwave radiometry to forecast lead openings and floe compaction up to 72 hours in advance.
            </p>
          </div>

          <div className="tech-card" style={{ padding: '24px' }}>
            <div style={{ color: '#C8D35A', fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: '12px' }}>02 / HYDRODYNAMICS</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: '#E8E6D9', marginBottom: '8px' }}>
              Iceberg Drift & CPA Predictor
            </h3>
            <p style={{ color: '#9A9D93', fontSize: '13px', lineHeight: 1.6 }}>
              Physics-informed machine learning combines CMEMS surface currents and scatterometer wind vectors to calculate closest point of approach threat vectors.
            </p>
          </div>

          <div className="tech-card" style={{ padding: '24px' }}>
            <div style={{ color: '#C8D35A', fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: '12px' }}>03 / MARITIME POLAR CODE</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: '#E8E6D9', marginBottom: '8px' }}>
              Multi-Objective Route Optimization
            </h3>
            <p style={{ color: '#9A9D93', fontSize: '13px', lineHeight: 1.6 }}>
              A* and RRT* routing engines balance bunker fuel burn against structural ice risk according to vessel Polar Class hull ratings (PC1–PC7).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
