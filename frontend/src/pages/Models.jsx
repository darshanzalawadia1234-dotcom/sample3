import React from 'react';

export default function Models() {
  const models = [
    {
      category: 'FORECAST MODEL',
      name: 'Numerical Polar Metocean Predictor',
      version: 'v2.4.1',
      lastTrained: '2026-08-15 UTC',
      confidence: '89.4%',
      inputSources: 'ECMWF IFS, ERA5 Reanalysis, GFS Polar High-Res',
      status: 'OPERATIONAL'
    },
    {
      category: 'ICE CONCENTRATION MODEL',
      name: 'Deep Cryosphere CNN Regressor',
      version: 'v3.1.0',
      lastTrained: '2026-09-02 UTC',
      confidence: '92.1%',
      inputSources: 'Sentinel-1 SAR, AMSR2 Radiometry, MODIS Cryo Albedo',
      status: 'OPERATIONAL'
    },
    {
      category: 'ICEBERG TRAJECTORY MODEL',
      name: 'Coupled Lagrangian Drift Dynamics',
      version: 'v1.8.4',
      lastTrained: '2026-08-28 UTC',
      confidence: '86.7%',
      inputSources: 'CMEMS HYCOM 0.08° Velocity Fields, Scatterometer Wind Vectors',
      status: 'CALIBRATED'
    },
    {
      category: 'ROUTE OPTIMIZATION MODEL',
      name: 'Pareto-Frontier Multi-Objective A*',
      version: 'v2.0.2',
      lastTrained: '2026-09-10 UTC',
      confidence: '94.8%',
      inputSources: 'Polar Code PC1-PC7 Hull Curves, In-Situ Depth Soundings, Bathymetry',
      status: 'ACTIVE'
    }
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'transparent', color: '#E8E6D9', padding: '24px 32px', gap: '22px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ paddingBottom: '16px' }}>
        <div className="page-eyebrow" style={{ color: '#6F746C', letterSpacing: '0.14em', marginBottom: '6px' }}>
          ALGORITHMIC PROVENANCE & MONITORING
        </div>
        <h1 className="page-title-serif" style={{ fontSize: '36px', fontWeight: 400, color: '#E8E6D9', margin: 0 }}>
          Predictive models
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#6F746C', marginTop: '6px' }}>
          Verification metrics, training timestamps, sensor pipelines, and operational status for all deployed algorithms.
        </p>
      </div>

      {/* Model Sections Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '16px' }}>
        {models.map((m, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'rgba(18, 21, 18, 0.65)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid #222621',
              borderRadius: '4px',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div className="flex-between">
              <span className="technical-label" style={{ color: '#C8D35A' }}>{m.category}</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9.5px',
                  fontWeight: 600,
                  color: '#8A963E',
                  backgroundColor: 'rgba(138, 150, 62, 0.15)',
                  padding: '2px 6px',
                  borderRadius: '2px'
                }}
              >
                ● {m.status}
              </span>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 600, color: '#E8E6D9' }}>
                {m.name}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#9A9D93', marginTop: '2px' }}>
                VERSION: {m.version} · LAST TRAINED: {m.lastTrained}
              </div>
            </div>

            {/* Technical Key-Values */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid #222621', paddingTop: '12px', fontFamily: 'var(--font-mono)' }}>
              <div>
                <div style={{ color: '#6F746C', fontSize: '9px', letterSpacing: '0.1em' }}>CONFIDENCE RATING</div>
                <div style={{ color: '#C8D35A', fontSize: '15px', fontWeight: 600, marginTop: '2px' }}>
                  {m.confidence}
                </div>
              </div>

              <div>
                <div style={{ color: '#6F746C', fontSize: '9px', letterSpacing: '0.1em' }}>VALIDATION METRIC</div>
                <div style={{ color: '#E8E6D9', fontSize: '12px', marginTop: '2px' }}>
                  RMSE: 0.042 / R² 0.94
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #222621', paddingTop: '10px' }}>
              <div style={{ color: '#6F746C', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                INPUT DATA SOURCES
              </div>
              <div style={{ color: '#9A9D93', fontSize: '11.5px', fontFamily: 'var(--font-sans)', marginTop: '2px' }}>
                {m.inputSources}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
