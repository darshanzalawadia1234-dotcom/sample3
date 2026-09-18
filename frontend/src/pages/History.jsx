import React, { useState } from 'react';
import SeaIceChart from '../components/charts/SeaIceChart';

export default function History() {
  const [activeTab, setActiveTab] = useState('ice');
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-09-18');
  const [location, setLocation] = useState('Weddell Sea Sector (70°S 45°W)');
  const [queried, setQueried] = useState(true);

  const tabs = [
    { id: 'ice', label: 'ice' },
    { id: 'icebergs', label: 'icebergs' },
    { id: 'weather', label: 'weather' },
    { id: 'ocean', label: 'ocean' },
    { id: 'routes', label: 'routes' }
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0B0D0C', color: '#E8E6D9', padding: '24px 28px', gap: '20px', overflowY: 'auto' }}>
      {/* Header matching Section 19 */}
      <div style={{ borderBottom: '1px solid #292D28', paddingBottom: '14px' }}>
        <div className="page-eyebrow">OBSERVATION ARCHIVE</div>
        <h1 className="page-title-serif" style={{ fontSize: '32px' }}>Historical data</h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#9A9D93', marginTop: '4px' }}>
          Query recorded environmental observations and completed routing analyses.
        </p>
      </div>

      {/* Archive Query Panel */}
      <div
        style={{
          backgroundColor: '#121512',
          border: '1px solid #292D28',
          borderRadius: 'var(--radius-sm)',
          padding: '18px'
        }}
      >
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #292D28', paddingBottom: '10px', marginBottom: '16px' }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: activeTab === t.id ? '#0B0D0C' : 'transparent',
                color: activeTab === t.id ? '#C8D35A' : '#9A9D93',
                border: activeTab === t.id ? '1px solid #292D28' : '1px solid transparent',
                borderRadius: '2px',
                padding: '6px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 140px', gap: '12px', alignItems: 'flex-end' }}>
          <div>
            <label className="technical-label" style={{ display: 'block', marginBottom: '6px' }}>START DATE</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div>
            <label className="technical-label" style={{ display: 'block', marginBottom: '6px' }}>END DATE</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div>
            <label className="technical-label" style={{ display: 'block', marginBottom: '6px' }}>LOCATION</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <button
            onClick={() => setQueried(true)}
            className="btn-primary-action"
            style={{ height: '36px' }}
          >
            <span>Query archive</span>
          </button>
        </div>
      </div>

      {/* Large Scientific Chart */}
      <div
        style={{
          backgroundColor: '#121512',
          border: '1px solid #292D28',
          borderRadius: 'var(--radius-sm)',
          padding: '20px'
        }}
      >
        <div className="flex-between" style={{ marginBottom: '14px' }}>
          <div className="technical-label">OBSERVATION TIME-SERIES · REANALYSIS</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#6F746C' }}>
            DAILY RESOLUTION · ERA5 / NSIDC COMPOSITE
          </div>
        </div>

        <SeaIceChart forecastHours={90} />

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#6F746C', marginTop: '16px', borderTop: '1px solid #222621', paddingTop: '10px' }}>
          Summary values and trends are calculated only after historical observations are returned.
        </p>
      </div>
    </div>
  );
}
