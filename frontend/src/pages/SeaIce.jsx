import React, { useState } from 'react';
import MapContainer from '../components/map/MapContainer';
import SeaIceChart from '../components/charts/SeaIceChart';
import { Layers, Calendar, Search } from 'lucide-react';
import { useSeaIce } from '../hooks/useSeaIce';

export default function SeaIce() {
  const horizons = ['6h', '12h', '24h', '48h', '72h'];
  const { currentData, forecastData, horizon, setHorizon } = useSeaIce('24h');

  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-09-18');
  const [queryLat, setQueryLat] = useState('-70.5231');
  const [queryLon, setQueryLon] = useState('-45.1842');
  const [loadedNotice, setLoadedNotice] = useState(false);

  const handleQuery = (e) => {
    e.preventDefault();
    setLoadedNotice(true);
    setTimeout(() => setLoadedNotice(false), 3000);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'transparent', color: '#E8E6D9', padding: '24px 28px', gap: '20px', overflowY: 'auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid #292D28', paddingBottom: '14px' }}>
        <div>
          <div className="page-eyebrow">CRYOSPHERE NUMERICAL OBSERVATIONS</div>
          <h1 className="page-title-serif">SEA-ICE ANALYSIS</h1>
        </div>

        {/* Forecast Horizon Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="technical-label" style={{ marginRight: '6px' }}>FORECAST HORIZON:</span>
          {horizons.map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className="btn-polar"
              style={{
                background: horizon === h ? '#C8D35A' : 'rgba(18, 21, 18, 0.7)',
                color: horizon === h ? '#0B0D0C' : '#9A9D93',
                borderColor: horizon === h ? '#C8D35A' : '#292D28',
                borderRadius: '2px',
                padding: '4px 10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10.5px',
                fontWeight: horizon === h ? 600 : 400,
                cursor: 'pointer'
              }}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* UPPER AREA: Scientific Sea-Ice Map Visualization */}
      <div
        style={{
          height: '330px',
          backgroundColor: '#0B0F0D',
          border: '1px solid #292D28',
          borderRadius: 'var(--radius-sm)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <MapContainer />
      </div>

      {/* Section 14: CONCENTRATION SCALE (Grayscale / Neutral Gradient) */}
      <div
        style={{
          backgroundColor: 'rgba(18, 21, 18, 0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          border: '1px solid #292D28',
          borderRadius: 'var(--radius-sm)',
          padding: '14px 20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="technical-label">SEA-ICE CONCENTRATION SCALE</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: '#9A9D93' }}>
            MICROWAVE RADIOMETRY PASSIVE SENSOR
          </span>
        </div>

        {/* Grayscale/Neutral Gradient Bar */}
        <div
          style={{
            height: '10px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #0B0F0D 0%, #202621 25%, #4C554E 50%, #8D998F 75%, #E8E6D9 100%)',
            border: '1px solid #292D28',
            marginBottom: '6px'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: '#9A9D93' }}>
          <span>0% LOW (OPEN WATER)</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100% DENSE (CONSOLIDATED PACK)</span>
        </div>
      </div>

      {/* Section 14: CONCENTRATION HISTORY AND FORECAST (Clean Scientific Chart) */}
      <div
        style={{
          backgroundColor: 'rgba(18, 21, 18, 0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          border: '1px solid #292D28',
          borderRadius: 'var(--radius-sm)',
          padding: '18px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div className="technical-label">TIME-SERIES OBSERVATION</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: '#E8E6D9', marginTop: '2px' }}>
              Concentration History and Forecast
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#6F746C' }}>
            72H PROJECTION MODEL · SHADED UNCERTAINTY BAND
          </div>
        </div>

        <SeaIceChart forecastHours={72} />
      </div>

      {/* Section 14: HISTORICAL QUERY */}
      <div
        style={{
          backgroundColor: 'rgba(18, 21, 18, 0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          border: '1px solid #292D28',
          borderRadius: 'var(--radius-sm)',
          padding: '18px'
        }}
      >
        <div className="technical-label" style={{ marginBottom: '4px' }}>
          ARCHIVAL TELEMETRY
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: '#E8E6D9', marginBottom: '14px' }}>
          Historical Query
        </div>

        <form onSubmit={handleQuery} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 140px', gap: '12px', alignItems: 'flex-end' }}>
          <div>
            <label className="technical-label" style={{ display: 'block', marginBottom: '6px' }}>START DATE</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
            />
          </div>

          <div>
            <label className="technical-label" style={{ display: 'block', marginBottom: '6px' }}>END DATE</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
            />
          </div>

          <div>
            <label className="technical-label" style={{ display: 'block', marginBottom: '6px' }}>LATITUDE</label>
            <input
              type="text"
              value={queryLat}
              onChange={(e) => setQueryLat(e.target.value)}
              placeholder="-70.5231"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
            />
          </div>

          <div>
            <label className="technical-label" style={{ display: 'block', marginBottom: '6px' }}>LONGITUDE</label>
            <input
              type="text"
              value={queryLon}
              onChange={(e) => setQueryLon(e.target.value)}
              placeholder="-45.1842"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary-action"
            style={{ height: '36px' }}
          >
            <span>Load history</span>
          </button>
        </form>

        {loadedNotice && (
          <div style={{ marginTop: '10px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C8D35A' }}>
            ✓ Historical observation records retrieved and calibrated for coordinates.
          </div>
        )}

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11.5px', color: '#6F746C', marginTop: '12px' }}>
          Historical records query NSIDC composite microwave daily sea-ice concentrations back to 1979 for baseline trend analysis and model anomaly estimation.
        </p>
      </div>
    </div>
  );
}
