import React, { useState } from 'react';
import MapContainer from '../components/map/MapContainer';
import { Wind, Waves, Thermometer, Compass, Gauge, Droplets } from 'lucide-react';
import { MOCK_WEATHER, MOCK_OCEAN } from '../api/mockData';

export default function Environment() {
  const [coords, setCoords] = useState({ lat: -64.82, lon: -58.25 });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0B0D0C', color: '#E8E6D9', padding: '24px 28px', gap: '18px', overflowY: 'auto' }}>
      {/* Header matching Section 16 */}
      <div style={{ borderBottom: '1px solid #292D28', paddingBottom: '14px' }}>
        <div className="page-eyebrow">ATMOSPHERE · OCEAN · ICE</div>
        <h1 className="page-title-serif" style={{ fontSize: '32px' }}>Environmental field</h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#9A9D93', marginTop: '6px' }}>
          Select a map position to inspect the latest atmospheric, oceanographic, and cryosphere observations.
        </p>
      </div>

      {/* Main Grid: Left Map + Right Current Conditions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '18px',
          minHeight: '520px'
        }}
        className="env-split-grid"
      >
        {/* Large Interactive Map */}
        <div
          style={{
            backgroundColor: '#0B0F0D',
            border: '1px solid #292D28',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            minHeight: '480px'
          }}
        >
          <MapContainer />
        </div>

        {/* Right: CURRENT CONDITIONS */}
        <div
          style={{
            backgroundColor: '#121512',
            border: '1px solid #292D28',
            borderRadius: 'var(--radius-sm)',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div className="technical-label">CURRENT CONDITIONS</div>

          {/* Large Primary Measurement */}
          <div
            style={{
              backgroundColor: '#0B0D0C',
              border: '1px solid #292D28',
              borderRadius: '2px',
              padding: '16px',
              textAlign: 'center'
            }}
          >
            <div style={{ color: '#6F746C', fontSize: '10px', fontFamily: 'var(--font-mono)', letterSpacing: '0.14em' }}>
              PRIMARY WIND VECTOR
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '36px',
                fontWeight: 600,
                color: '#C8D35A',
                marginTop: '4px'
              }}
            >
              18.2 kn
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#9A9D93', marginTop: '2px' }}>
              DIRECTION: SW 224°
            </div>
          </div>

          {/* Clean Technical Data Blocks */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ backgroundColor: '#0B0D0C', border: '1px solid #222621', padding: '10px', borderRadius: '2px' }}>
              <div style={{ color: '#6F746C', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>AIR TEMP</div>
              <div style={{ color: '#E8E6D9', fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '2px' }}>
                -18.4 °C
              </div>
            </div>

            <div style={{ backgroundColor: '#0B0D0C', border: '1px solid #222621', padding: '10px', borderRadius: '2px' }}>
              <div style={{ color: '#6F746C', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>WIND</div>
              <div style={{ color: '#E8E6D9', fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '2px' }}>
                SW 18.2 kn
              </div>
            </div>

            <div style={{ backgroundColor: '#0B0D0C', border: '1px solid #222621', padding: '10px', borderRadius: '2px' }}>
              <div style={{ color: '#6F746C', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>PRESSURE</div>
              <div style={{ color: '#E8E6D9', fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '2px' }}>
                978 hPa
              </div>
            </div>

            <div style={{ backgroundColor: '#0B0D0C', border: '1px solid #222621', padding: '10px', borderRadius: '2px' }}>
              <div style={{ color: '#6F746C', fontFamily: 'var(--font-mono)', fontSize: '9px' }}>WAVES</div>
              <div style={{ color: '#E8E6D9', fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '2px' }}>
                2.1 m
              </div>
            </div>

            <div style={{ backgroundColor: '#0B0D0C', border: '1px solid #222621', padding: '10px', borderRadius: '2px' }}>
              <div style={{ color: '#6F746C', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>WATER</div>
              <div style={{ color: '#E8E6D9', fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '2px' }}>
                -1.4 °C
              </div>
            </div>

            <div style={{ backgroundColor: '#0B0D0C', border: '1px solid #222621', padding: '10px', borderRadius: '2px' }}>
              <div style={{ color: '#6F746C', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>CURRENT</div>
              <div style={{ color: '#E8E6D9', fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '2px' }}>
                0.8 kn SE
              </div>
            </div>
          </div>

          {/* Coordinate Readout */}
          <div style={{ borderTop: '1px solid #222621', paddingTop: '12px', marginTop: 'auto' }}>
            <div className="technical-label" style={{ marginBottom: '4px' }}>SELECTED GRID COORD</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C8D35A' }}>
              64°49.2'S · 058°15.0'W
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#6F746C', marginTop: '2px' }}>
              DATUM: WGS 84 · ELEVATION: 0 M MSL
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .env-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
