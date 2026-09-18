import React from 'react';

/**
 * Vector Drift Indicator (DESIGN.md)
 * Graphical tactical widget displaying vessel heading vs. true current drift vector,
 * combining an SVG compass rose dial with cyan (heading) and amber (ocean drift) vectors.
 */
export default function VectorDriftIndicator({
  heading = 214,
  driftAngle = 226,
  driftSpeedKnots = 2.4,
  sog = 11.2,
  size = 140
}) {
  const center = size / 2;
  const radius = center - 14;

  const toRad = (deg) => (deg - 90) * (Math.PI / 180);

  // Heading vector tip
  const headingRad = toRad(heading);
  const hx = center + radius * 0.88 * Math.cos(headingRad);
  const hy = center + radius * 0.88 * Math.sin(headingRad);

  // Drift vector tip
  const driftRad = toRad(driftAngle);
  const dx = center + radius * 0.72 * Math.cos(driftRad);
  const dy = center + radius * 0.72 * Math.sin(driftRad);

  const angleDiff = (driftAngle - heading + 360) % 360;
  const signedDiff = angleDiff > 180 ? (angleDiff - 360).toFixed(1) : `+${angleDiff.toFixed(1)}`;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'rgba(8, 19, 37, 0.75)',
        border: '1px solid var(--border-structural)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px',
        position: 'relative'
      }}
    >
      <div className="flex-between" style={{ width: '100%', marginBottom: '6px' }}>
        <span className="label-sm" style={{ color: 'var(--text-muted)' }}>VECTOR DRIFT ROSAL</span>
        <span className="telemetry-value" style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>
          {heading}° HDG
        </span>
      </div>

      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Outer Compass Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="rgba(4, 9, 20, 0.6)"
            stroke="var(--border-structural)"
            strokeWidth="1.2"
          />

          {/* 10° Minor Tick Marks */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = i * 10;
            const rad = toRad(angle);
            const isMajor = i % 9 === 0;
            const tickLen = isMajor ? 6 : 3;
            const x1 = center + radius * Math.cos(rad);
            const y1 = center + radius * Math.sin(rad);
            const x2 = center + (radius - tickLen) * Math.cos(rad);
            const y2 = center + (radius - tickLen) * Math.sin(rad);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMajor ? 'var(--text-secondary)' : 'rgba(71, 85, 105, 0.45)'}
                strokeWidth={isMajor ? '1.5' : '1'}
              />
            );
          })}

          {/* Cardinal Labels */}
          <text x={center} y={center - radius + 13} fill="var(--text-primary)" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="var(--font-mono)">N</text>
          <text x={center + radius - 10} y={center + 3} fill="var(--text-muted)" fontSize="8.5" textAnchor="middle" fontFamily="var(--font-mono)">E</text>
          <text x={center} y={center + radius - 6} fill="var(--text-muted)" fontSize="8.5" textAnchor="middle" fontFamily="var(--font-mono)">S</text>
          <text x={center - radius + 10} y={center + 3} fill="var(--text-muted)" fontSize="8.5" textAnchor="middle" fontFamily="var(--font-mono)">W</text>

          {/* Drift Vector Arc */}
          <path
            d={`M ${center + radius * 0.4 * Math.cos(headingRad)} ${center + radius * 0.4 * Math.sin(headingRad)} A ${radius * 0.4} ${radius * 0.4} 0 0 1 ${center + radius * 0.4 * Math.cos(driftRad)} ${center + radius * 0.4 * Math.sin(driftRad)}`}
            fill="none"
            stroke="rgba(245, 158, 11, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />

          {/* True Drift Vector (Amber) */}
          <line
            x1={center}
            y1={center}
            x2={dx}
            y2={dy}
            stroke="var(--tertiary-container)"
            strokeWidth="1.8"
            strokeDasharray="3 2"
          />
          <circle cx={dx} cy={dy} r="2.5" fill="var(--tertiary-container)" />

          {/* Vessel Heading Vector (Glacial Cyan) */}
          <line
            x1={center}
            y1={center}
            x2={hx}
            y2={hy}
            stroke="var(--accent-cyan)"
            strokeWidth="2.2"
          />
          <polygon
            points={`${hx},${hy} ${hx - 4 * Math.cos(headingRad - 0.5)},${hy - 4 * Math.sin(headingRad - 0.5)} ${hx - 4 * Math.cos(headingRad + 0.5)},${hy - 4 * Math.sin(headingRad + 0.5)}`}
            fill="var(--accent-cyan)"
          />

          {/* Center Hull Reticle */}
          <circle cx={center} cy={center} r="3" fill="#ffffff" />
          <circle cx={center} cy={center} r="6" fill="none" stroke="var(--accent-cyan)" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>

      {/* Vector Key-Value Grid */}
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          marginTop: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px'
        }}
      >
        <div style={{ background: 'var(--surface-deep)', padding: '4px 6px', borderRadius: 'var(--radius-xs)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '8.5px', display: 'block' }}>LEEWAY OFFSET</span>
          <span style={{ color: 'var(--tertiary-container)', fontWeight: 600 }}>{signedDiff}°</span>
        </div>
        <div style={{ background: 'var(--surface-deep)', padding: '4px 6px', borderRadius: 'var(--radius-xs)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '8.5px', display: 'block' }}>SET & DRIFT</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{driftSpeedKnots} kn</span>
        </div>
      </div>
    </div>
  );
}
