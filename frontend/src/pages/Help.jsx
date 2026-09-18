import React, { useState } from 'react';

export default function Help() {
  const [activeSection, setActiveSection] = useState('purpose');

  const sections = [
    {
      id: 'purpose',
      title: 'Purpose',
      desc: 'The Antarctic Decision Support System provides marine operators, research expedition commanders, and ice navigators with actionable situational awareness. By pairing high-resolution polar remote sensing with predictive numerical forecasting, the system assists bridge officers in identifying open leads, circumventing dynamic iceberg drift corridors, and managing vessel structural hull fatigue in compliance with WMO Polar Code regulations.'
    },
    {
      id: 'sea-ice',
      title: 'Sea ice',
      desc: 'Sea-ice concentration observations are derived from multi-sensor composites, combining synthetic aperture radar (Sentinel-1 SAR) with passive microwave radiometry. Coverage is reported in tenths (WMO egg-code standard) and percentage coverage. Predictions for +6h to +72h model thermodynamic melting, freezing degree days, and wind-driven pack compaction to identify potential pinching points.'
    },
    {
      id: 'icebergs',
      title: 'Iceberg predictions',
      desc: 'Iceberg trajectory estimation combines satellite altimetry and radar scatterometer wind stress with depth-stratified ocean current models (HYCOM / CMEMS). Form drag, skin drag, wave radiation stress, and high-latitude Coriolis acceleration are continuously calculated to predict Closest Point of Approach (CPA) and Time to CPA (TCPA) relative to active vessel tracks.'
    },
    {
      id: 'route-optimization',
      title: 'Route optimization',
      desc: 'The routing engine leverages a modified multi-objective A* algorithm across a cost-field grid. The algorithm simultaneously optimizes three competing parameters: navigational safety (avoiding heavy floes and iceberg exclusion contours), fuel conservation (minimizing ice resistance and maximizing ocean current assist), and total passage time.'
    },
    {
      id: 'risk-score',
      title: 'Risk score',
      desc: 'The composite navigational risk index (0–100) weights sea-ice concentration, floe stage of development, iceberg proximity, and metocean severity. Scores 0–35 indicate Low Risk (navigable leads within vessel ice-class capability); 36–65 represent Moderate Risk (caution advised, reduced transit speed); 66–100 indicate High / Critical Risk (structural breach hazard, evasive rerouting required).'
    },
    {
      id: 'model-confidence',
      title: 'Model confidence',
      desc: 'Confidence ratings represent the statistical standard deviation across ensemble forecast trajectories. High confidence (>85%) corresponds to stable atmospheric pressure cells and recent radar satellite passes. Lower confidence values highlight rapid cyclone formation or high-latitude cloud cover anomalies.'
    },
    {
      id: 'demo-mode',
      title: 'Demo mode',
      desc: 'In demonstration mode, the console operates on scientifically calibrated synthetic observations representative of typical Austral summer conditions across the Weddell, Bellingshausen, and Ross Seas. The system mirrors true live telemetry schemas and algorithm behaviors without requiring live satellite subscription uplinks.'
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer',
      desc: 'This decision-support console is an advisory prototype intended for research, expedition planning, and operational simulation. It does not replace mandatory SOLAS navigation watches, certified hydrographic charts, ice pilot expertise, or master command discretion under extreme maritime conditions.'
    }
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0B0D0C', color: '#E8E6D9', padding: '24px 28px', gap: '20px', overflowY: 'auto' }}>
      {/* Header matching Section 20 */}
      <div style={{ borderBottom: '1px solid #292D28', paddingBottom: '14px' }}>
        <div className="page-eyebrow">OPERATOR REFERENCE</div>
        <h1 className="page-title-serif" style={{ fontSize: '32px' }}>Using the system</h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#9A9D93', marginTop: '4px' }}>
          A concise guide to forecasts, route decisions, risk, and data provenance.
        </p>
      </div>

      {/* Documentation Layout: Left Index + Right Manual */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: '28px',
          alignItems: 'flex-start'
        }}
        className="help-layout-grid"
      >
        {/* LEFT: Small Internal Navigation */}
        <div
          style={{
            position: 'sticky',
            top: '20px',
            backgroundColor: '#121512',
            border: '1px solid #292D28',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 0',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div className="technical-label" style={{ padding: '0 16px 8px 16px', borderBottom: '1px solid #222621', marginBottom: '6px' }}>
            SECTIONS
          </div>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setActiveSection(s.id)}
              style={{
                padding: '8px 16px',
                fontSize: '11.5px',
                fontFamily: 'var(--font-mono)',
                color: activeSection === s.id ? '#C8D35A' : '#9A9D93',
                backgroundColor: activeSection === s.id ? 'rgba(200, 211, 90, 0.08)' : 'transparent',
                borderLeft: activeSection === s.id ? '2px solid #C8D35A' : '2px solid transparent',
                textDecoration: 'none'
              }}
            >
              {s.title}
            </a>
          ))}
        </div>

        {/* RIGHT: Large Content Sections */}
        <div
          style={{
            backgroundColor: '#121512',
            border: '1px solid #292D28',
            borderRadius: 'var(--radius-sm)',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}
        >
          {sections.map((s, idx) => (
            <div key={s.id} id={s.id} style={{ borderBottom: idx < sections.length - 1 ? '1px solid #222621' : 'none', paddingBottom: idx < sections.length - 1 ? '28px' : '0' }}>
              <div className="technical-label" style={{ color: '#6F746C', marginBottom: '6px' }}>
                REF · {String(idx + 1).padStart(2, '0')}
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 400, color: '#E8E6D9', marginBottom: '10px' }}>
                {s.title}
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13.5px', color: '#9A9D93', lineHeight: 1.7, maxWidth: '780px' }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .help-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
