import React from 'react';

/**
 * Ice Concentration Bar (DESIGN.md)
 * Segmented 10-tier micro-gauge conforming to WMO egg-code maritime standards.
 * Displays ice coverage from 1/10 to 10/10 tenths with dynamic color grading
 * from open water navy to consolidate pack-ice glacial white.
 */
export default function IceConcentrationBar({
  concentration = 0.65, // 0.0 to 1.0 (or 0-100%)
  stageOfDevelopment = 'Medium First-Year Ice (70-120cm)',
  form = 'Big Floe (500-2000m)',
  showDetails = true
}) {
  const tenths = Math.min(10, Math.max(0, Math.round((concentration > 1 ? concentration / 100 : concentration) * 10)));
  const percentage = Math.round((concentration > 1 ? concentration : concentration * 100));

  // WMO 10-tier color scale from open water to consolidated pack ice
  const tierColors = [
    '#0c274d', // 1/10 Open Water
    '#133b70', // 2/10 Very Open Drift
    '#1d5396', // 3/10 Very Open Drift
    '#256cb8', // 4/10 Open Drift
    '#3287db', // 5/10 Open Drift
    '#4ba0f5', // 6/10 Close Pack
    '#70bbf9', // 7/10 Close Pack
    '#9bd2fb', // 8/10 Very Close Pack
    '#cce8fd', // 9/10 Consolidated
    '#f0f8ff'  // 10/10 Compact Pack
  ];

  return (
    <div
      style={{
        background: 'rgba(8, 19, 37, 0.75)',
        border: '1px solid var(--border-structural)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}
    >
      <div className="flex-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="label-sm" style={{ color: 'var(--text-muted)' }}>WMO SEA-ICE COVERAGE</span>
          <span className="label-sm" style={{ color: 'var(--accent-cyan)' }}>[{tenths}/10]</span>
        </div>
        <span className="telemetry-value" style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
          {percentage}%
        </span>
      </div>

      {/* 10-Tier Segmented Gauge */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: '3px',
          height: '14px',
          padding: '2px',
          background: 'var(--surface-deep)',
          borderRadius: 'var(--radius-xs)',
          border: '1px solid rgba(71, 85, 105, 0.3)'
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => {
          const isActive = index < tenths;
          const color = tierColors[index];

          return (
            <div
              key={index}
              style={{
                height: '100%',
                background: isActive ? color : 'rgba(30, 41, 59, 0.35)',
                borderRadius: '1px',
                boxShadow: isActive ? `0 0 6px ${color}66` : 'none',
                transition: 'background 0.3s ease'
              }}
              title={`${index + 1}/10 tenths`}
            />
          );
        })}
      </div>

      {showDetails && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '9.5px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            marginTop: '2px'
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>FORM: {form}</span>
          <span style={{ color: tenths >= 8 ? 'var(--risk-critical)' : tenths >= 5 ? 'var(--tertiary-container)' : 'var(--risk-low)' }}>
            {tenths >= 8 ? 'CONSOLIDATED PACK' : tenths >= 5 ? 'CLOSE PACK ICE' : 'NAVIGABLE OPEN LEADS'}
          </span>
        </div>
      )}
    </div>
  );
}
