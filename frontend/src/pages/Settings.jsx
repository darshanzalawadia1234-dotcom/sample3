import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings } = useApp();
  const [activeTab, setActiveTab] = useState('SYSTEM');
  const [savedNotice, setSavedNotice] = useState(false);

  const sections = ['ACCOUNT', 'SYSTEM', 'DATA SOURCES', 'NOTIFICATIONS', 'DISPLAY', 'SECURITY'];

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0B0D0C', color: '#E8E6D9', padding: '24px 28px', gap: '20px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #292D28', paddingBottom: '14px' }}>
        <div className="page-eyebrow">CONSOLE PARAMETERS</div>
        <h1 className="page-title-serif" style={{ fontSize: '32px' }}>System settings</h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#9A9D93', marginTop: '4px' }}>
          Configure operational telemetry feeds, coordinate formats, risk thresholds, and operator security keys.
        </p>
      </div>

      {/* Tabs matching Section 23 */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #292D28', paddingBottom: '10px' }}>
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => setActiveTab(s)}
            style={{
              background: activeTab === s ? '#151915' : 'transparent',
              color: activeTab === s ? '#C8D35A' : '#9A9D93',
              border: `1px solid ${activeTab === s ? '#C8D35A' : 'transparent'}`,
              borderRadius: '2px',
              padding: '6px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: activeTab === s ? 600 : 400,
              cursor: 'pointer'
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div
        style={{
          backgroundColor: '#121512',
          border: '1px solid #292D28',
          borderRadius: 'var(--radius-sm)',
          padding: '24px',
          maxWidth: '680px'
        }}
      >
        {activeTab === 'SYSTEM' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="technical-label">NAVIGATION & GEODESY SETTINGS</div>

            <div>
              <label className="technical-label" style={{ display: 'block', marginBottom: '6px' }}>DISTANCE MEASUREMENT</label>
              <select
                value={settings.unitDistance || 'km'}
                onChange={(e) => updateSettings({ unitDistance: e.target.value })}
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <option value="km">Kilometers (km) - Polar Geodesic Metric</option>
                <option value="nm">Nautical Miles (NM) - IMO SOLAS Standard</option>
              </select>
            </div>

            <div>
              <label className="technical-label" style={{ display: 'block', marginBottom: '6px' }}>COORDINATE FORMAT</label>
              <select
                value={settings.coordinateFormat || 'dms'}
                onChange={(e) => updateSettings({ coordinateFormat: e.target.value })}
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <option value="dms">Degrees, Minutes & Cardinal (64°31.4'S 41°18.7'E)</option>
                <option value="decimal">Signed Decimal Degrees (-64.5231, 41.3117)</option>
              </select>
            </div>

            <div>
              <label className="technical-label" style={{ display: 'block', marginBottom: '6px' }}>DEFAULT CHART DATUM</label>
              <input
                type="text"
                disabled
                value="WGS 84 (World Geodetic System 1984 - Polar Stereographic EPSG:3031)"
                style={{ fontFamily: 'var(--font-mono)', opacity: 0.8 }}
              />
            </div>
          </div>
        )}

        {activeTab === 'ACCOUNT' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="technical-label">OPERATOR PROFILE</div>
            <div>
              <label className="technical-label" style={{ display: 'block', marginBottom: '6px' }}>OPERATOR NAME</label>
              <input type="text" defaultValue="Dr. Sarah Evans" />
            </div>
            <div>
              <label className="technical-label" style={{ display: 'block', marginBottom: '6px' }}>AFFILIATION</label>
              <input type="text" defaultValue="British Antarctic Survey / R/V Polarstern" />
            </div>
          </div>
        )}

        {activeTab === 'DATA SOURCES' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="technical-label">REMOTE SENSING INGESTION PIPELINES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div className="flex-between" style={{ borderBottom: '1px solid #222621', paddingBottom: '8px' }}>
                <span>Sentinel-1 SAR Satellite Imagery (ESA Copernicus)</span>
                <span style={{ color: '#C8D35A', fontFamily: 'var(--font-mono)' }}>ACTIVE · 10m/px</span>
              </div>
              <div className="flex-between" style={{ borderBottom: '1px solid #222621', paddingBottom: '8px' }}>
                <span>AMSR2 Microwave Sea-Ice Concentration (JAXA)</span>
                <span style={{ color: '#C8D35A', fontFamily: 'var(--font-mono)' }}>ACTIVE · 12.5km</span>
              </div>
              <div className="flex-between" style={{ borderBottom: '1px solid #222621', paddingBottom: '8px' }}>
                <span>HYCOM Global 0.08° Ocean Current Kinematics</span>
                <span style={{ color: '#C8D35A', fontFamily: 'var(--font-mono)' }}>ACTIVE · 3-hourly</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'NOTIFICATIONS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="technical-label">TACTICAL THREAT NOTIFICATIONS</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: '#C8D35A' }} />
              <span>Audio proximity alert on iceberg CPA &lt; 2.0 NM</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: '#C8D35A' }} />
              <span>Pack compaction alert when sea ice convergence exceeds 15% / 6h</span>
            </label>
          </div>
        )}

        {activeTab === 'DISPLAY' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="technical-label">CONSOLE GRAPHICS</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: '#C8D35A' }} />
              <span>Display subtle navigation coordinate grid</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: '#C8D35A' }} />
              <span>Enable continuous background ambient drift animation</span>
            </label>
          </div>
        )}

        {activeTab === 'SECURITY' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="technical-label">ENCRYPTION & SATELLITE COMMS</div>
            <div>
              <label className="technical-label" style={{ display: 'block', marginBottom: '6px' }}>BRIDGE ACCESS PASSKEY</label>
              <input type="password" defaultValue="••••••••••••" />
            </div>
            <div>
              <label className="technical-label" style={{ display: 'block', marginBottom: '6px' }}>IRIDIUM SATELLITE BURST SIGNING</label>
              <input type="text" disabled value="ECDSA SHA-256 (Bridge Key ID: 0x48FA1B)" style={{ fontFamily: 'var(--font-mono)' }} />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px', borderTop: '1px solid #222621', paddingTop: '16px' }}>
          <button onClick={handleSave} className="btn-primary-action">
            <span>Save settings</span>
          </button>
          {savedNotice && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C8D35A', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={14} /> Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
