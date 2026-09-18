import React from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * CPA / TCPA Threat Banner (DESIGN.md)
 * Persistent pinned tactical HUD banner flashing amber or vermilion when a target
 * iceberg Closest Point of Approach (CPA) intersects the vessel's safety perimeter.
 */
export default function ThreatBanner({
  targetId = 'A-76A',
  cpaNm = 1.4,
  tcpaMinutes = 42,
  bearing = 198,
  driftSpeed = 1.8,
  severity = 'critical', // 'warning' | 'critical'
  onAcknowledge,
  onInspect
}) {
  const isCritical = severity === 'critical';
  const borderColor = isCritical ? 'var(--risk-critical)' : 'var(--tertiary-container)';
  const bgColor = isCritical ? 'rgba(147, 0, 10, 0.35)' : 'rgba(245, 158, 11, 0.18)';
  const glowColor = isCritical ? 'rgba(239, 68, 68, 0.35)' : 'rgba(245, 158, 11, 0.25)';

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 40,
        width: '100%',
        backgroundColor: bgColor,
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: `1px solid ${borderColor}`,
        boxShadow: `0 0 20px ${glowColor}, inset 0 0 12px ${glowColor}`,
        borderRadius: 'var(--radius-sm)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
        animation: isCritical ? 'banner-strobe 2s infinite ease-in-out' : 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-xs)',
            background: isCritical ? 'var(--risk-critical)' : 'var(--tertiary-container)',
            display: 'grid',
            placeItems: 'center',
            color: '#040914',
            flexShrink: 0
          }}
        >
          {isCritical ? <ShieldAlert size={18} /> : <AlertTriangle size={18} />}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#ffffff'
              }}
            >
              {isCritical ? 'CRITICAL CPA BREACH' : 'PROXIMITY WARNING'} : TARGET {targetId}
            </span>
            <span
              style={{
                background: 'rgba(4, 9, 20, 0.8)',
                padding: '1px 6px',
                borderRadius: '2px',
                fontSize: '9.5px',
                fontFamily: 'var(--font-mono)',
                color: borderColor,
                border: `1px solid ${borderColor}`
              }}
            >
              EXCLUSION CONTOUR VIOLATION
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginTop: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-secondary)'
            }}
          >
            <span>
              CPA: <strong style={{ color: '#ffffff' }}>{cpaNm} NM</strong>
            </span>
            <span>
              TCPA: <strong style={{ color: isCritical ? 'var(--risk-critical)' : 'var(--tertiary-container)' }}>{tcpaMinutes} MIN</strong>
            </span>
            <span>
              BEARING: <strong style={{ color: '#ffffff' }}>{bearing}°</strong>
            </span>
            <span>
              DRIFT: <strong style={{ color: '#ffffff' }}>{driftSpeed} kn</strong>
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {onInspect && (
          <button
            onClick={onInspect}
            className="btn-tactical"
            style={{ fontSize: '10.5px', padding: '5px 10px' }}
          >
            <span>Telemetry</span>
            <ArrowRight size={12} />
          </button>
        )}
        <Link
          to="/navigation"
          className="btn-engage"
          style={{ fontSize: '10.5px', padding: '5px 12px' }}
        >
          Compute Evasive Waypoint
        </Link>
        {onAcknowledge && (
          <button
            onClick={onAcknowledge}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Acknowledge
          </button>
        )}
      </div>

      <style>{`
        @keyframes banner-strobe {
          0%, 100% {
            border-color: var(--risk-critical);
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.4), inset 0 0 12px rgba(239, 68, 68, 0.2);
          }
          50% {
            border-color: rgba(239, 68, 68, 0.45);
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.15), inset 0 0 4px rgba(239, 68, 68, 0.05);
          }
        }
      `}</style>
    </div>
  );
}
