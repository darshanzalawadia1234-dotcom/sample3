import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapContainer from '../components/map/MapContainer';
import IcebergDetailDrawer from '../components/icebergs/IcebergDetailDrawer';
import RiskBadge from '../components/common/RiskBadge';
import { useIcebergs } from '../hooks/useIcebergs';
import { useMapState } from '../context/MapContext';
import { formatLatitude, formatLongitude } from '../utils/coordinates';
import { TriangleAlert, Search, Filter, Compass, Navigation2 } from 'lucide-react';

export default function Icebergs() {
  const navigate = useNavigate();
  const { icebergs, loading } = useIcebergs();
  const { flyTo } = useMapState();

  const [selectedBerg, setSelectedBerg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');

  const filteredIcebergs = icebergs.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'ALL' || b.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const handleSelectBerg = (berg) => {
    setSelectedBerg(berg);
    flyTo(berg.latitude, berg.longitude, 6);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'transparent', color: '#E8E6D9', padding: '24px 32px', gap: '22px', overflowY: 'auto' }}>
      {/* Header matching user reference */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="page-eyebrow" style={{ color: '#6F746C', letterSpacing: '0.14em', marginBottom: '6px' }}>
            ICEBERG REGISTRY · {filteredIcebergs.length} ACTIVE TARGETS
          </div>
          <h1 className="page-title-serif" style={{ fontSize: '36px', fontWeight: 400, color: '#E8E6D9', margin: 0 }}>
            Tracked icebergs
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#6F746C', marginTop: '6px' }}>
            Satellite radar-tracked targets, drift kinematics, and maritime hazard envelopes.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilterRisk(lvl)}
              style={{
                background: filterRisk === lvl ? 'rgba(200, 211, 90, 0.15)' : 'transparent',
                color: filterRisk === lvl ? '#C8D35A' : '#6F746C',
                border: filterRisk === lvl ? '1px solid #C8D35A' : '1px solid #292D28',
                borderRadius: '2px',
                padding: '5px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Map */}
      <div
        style={{
          height: '320px',
          backgroundColor: '#0B0F0D',
          border: '1px solid #222621',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <MapContainer
          onSelectIceberg={handleSelectBerg}
          highlightedIcebergId={selectedBerg?.id}
        />

        {selectedBerg && (
          <IcebergDetailDrawer
            iceberg={selectedBerg}
            onClose={() => setSelectedBerg(null)}
          />
        )}
      </div>

      {/* Vertical List of Icebergs matching the user reference screenshot */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredIcebergs.map(berg => {
          const latStr = formatLatitude(berg.latitude);
          const lonStr = formatLongitude(berg.longitude);
          const lengthDisplay = berg.length > 1000 ? `${(berg.length / 1000).toFixed(1)} km` : `${berg.length} m`;
          const widthDisplay = berg.width > 1000 ? `${(berg.width / 1000).toFixed(1)} km` : `${berg.width} m`;
          const isSelected = selectedBerg?.id === berg.id;

          const riskColor =
            berg.riskLevel === 'CRITICAL' ? '#D85C3E' :
            berg.riskLevel === 'HIGH' ? '#D97706' :
            berg.riskLevel === 'MODERATE' ? '#C8D35A' : '#4EBA6F';

          return (
            <div
              key={berg.id}
              onClick={() => handleSelectBerg(berg)}
              style={{
                backgroundColor: isSelected ? 'rgba(25, 30, 25, 0.85)' : 'rgba(18, 21, 18, 0.65)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: isSelected ? '1px solid #C8D35A' : '1px solid #222621',
                borderRadius: '4px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px',
                flexWrap: 'wrap',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease, background-color 0.15s ease'
              }}
            >
              {/* Left Column: Target Identity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', minWidth: '280px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    backgroundColor: 'rgba(11, 13, 12, 0.8)',
                    border: '1px solid #292D28',
                    borderRadius: '3px',
                    display: 'grid',
                    placeItems: 'center',
                    color: riskColor
                  }}
                >
                  <TriangleAlert size={18} />
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#6F746C', letterSpacing: '0.14em' }}>
                    RADAR TARGET · {berg.origin || 'CALVED BERG'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: '#E8E6D9', marginTop: '3px', letterSpacing: '0.04em' }}>
                    {berg.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6F746C', marginTop: '3px' }}>
                    {latStr} · {lonStr}
                  </div>
                </div>
              </div>

              {/* Middle Columns: Dimensions & Drift */}
              <div style={{ display: 'flex', gap: '48px', fontFamily: 'var(--font-mono)', flex: 1, justifyContent: 'center' }}>
                <div>
                  <div style={{ color: '#6F746C', fontSize: '9px', letterSpacing: '0.12em' }}>DIMENSIONS</div>
                  <div style={{ color: '#9A9D93', fontSize: '13px', fontWeight: 500, marginTop: '3px' }}>
                    {lengthDisplay} × {widthDisplay}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#6F746C', fontSize: '9px', letterSpacing: '0.12em' }}>DRIFT VELOCITY</div>
                  <div style={{ color: '#9A9D93', fontSize: '13px', fontWeight: 500, marginTop: '3px' }}>
                    {berg.speed} kn ({berg.direction})
                  </div>
                </div>

                <div>
                  <div style={{ color: '#6F746C', fontSize: '9px', letterSpacing: '0.12em' }}>RISK RATING</div>
                  <div style={{ color: riskColor, fontSize: '13px', fontWeight: 600, marginTop: '3px' }}>
                    {berg.riskLevel} ({berg.riskScore}/100)
                  </div>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/icebergs/${berg.id}`);
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '11.5px', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent' }}
                >
                  <span>Open record</span>
                  <Navigation2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 1080px) {
          .iceberg-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
