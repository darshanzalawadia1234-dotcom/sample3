import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShips } from '../hooks/useShips';
import { useApp } from '../context/AppContext';
import { formatLatitude, formatLongitude } from '../utils/coordinates';
import { Ship, Plus, Trash2, ArrowRight, X, Check } from 'lucide-react';

export default function Vessels() {
  const navigate = useNavigate();
  const { ships, addShip, editShip, removeShip } = useShips();
  const { selectShipForNavigation } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const initialForm = {
    name: '',
    vesselType: 'Polar Research Icebreaker',
    imo: '',
    callsign: '',
    latitude: -64.52,
    longitude: 41.31,
    normalSpeed: 14.2,
    heading: 214,
    iceClass: 'PC 5',
    fuelCapacity: 950000,
    currentFuel: 820000,
    destination: 'Mawson Research Station',
    status: 'ACTIVE'
  };

  const [form, setForm] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await editShip(editingId, {
          ...form,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          normalSpeed: Number(form.normalSpeed),
          heading: Number(form.heading),
          fuelCapacity: Number(form.fuelCapacity),
          currentFuel: Number(form.currentFuel)
        });
      } else {
        await addShip({
          ...form,
          id: `ship_${Date.now()}`,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          normalSpeed: Number(form.normalSpeed),
          heading: Number(form.heading),
          fuelCapacity: Number(form.fuelCapacity),
          currentFuel: Number(form.currentFuel)
        });
      }

      setModalOpen(false);
      setToastMessage(`VESSEL UPDATED · ${form.name.toUpperCase()} · DATA SAVED`);
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      console.error('Error saving vessel', err);
    }
  };

  const handleDelete = async (e, id, name) => {
    e.stopPropagation();
    if (window.confirm(`Remove ${name} from active fleet registry?`)) {
      await removeShip(id);
      setToastMessage(`VESSEL REMOVED · ${name.toUpperCase()}`);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0B0D0C', color: '#E8E6D9', padding: '24px 28px', gap: '20px', overflowY: 'auto' }}>
      {/* Toast Confirmation */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            right: '28px',
            zIndex: 2000,
            backgroundColor: '#121512',
            border: '1px solid #C8D35A',
            color: '#C8D35A',
            padding: '10px 16px',
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.6)'
          }}
        >
          <Check size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header matching Section 17 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #292D28', paddingBottom: '14px' }}>
        <div>
          <div className="page-eyebrow">FLEET REGISTRY · {ships.length} ACTIVE</div>
          <h1 className="page-title-serif" style={{ fontSize: '32px' }}>Expedition fleet</h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#9A9D93', marginTop: '4px' }}>
            Registered vessel particulars, current fixes, fuel profiles, and destinations.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn-primary-action">
          <Plus size={14} />
          <span>Add vessel</span>
        </button>
      </div>

      {/* Section 17: Vertical List of Vessels with Subtle Borders and Generous Spacing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {ships.map((ship) => {
          const latStr = formatLatitude(ship.latitude);
          const lonStr = formatLongitude(ship.longitude);

          return (
            <div
              key={ship.id}
              style={{
                backgroundColor: '#121512',
                border: '1px solid #292D28',
                borderRadius: 'var(--radius-sm)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap',
                transition: 'border-color 0.15s ease'
              }}
            >
              {/* Left Column: Vessel Identity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '240px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    backgroundColor: '#0B0D0C',
                    border: '1px solid #292D28',
                    borderRadius: '2px',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#C8D35A'
                  }}
                >
                  <Ship size={16} />
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#6F746C', letterSpacing: '0.12em' }}>
                    RESEARCH VESSEL
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 600, color: '#E8E6D9', marginTop: '2px' }}>
                    {ship.name.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#9A9D93', marginTop: '2px' }}>
                    {latStr} · {lonStr}
                  </div>
                </div>
              </div>

              {/* Middle Column: Speed & Ice Class */}
              <div style={{ display: 'flex', gap: '32px', fontFamily: 'var(--font-mono)' }}>
                <div>
                  <div style={{ color: '#6F746C', fontSize: '9px', letterSpacing: '0.1em' }}>SPEED</div>
                  <div style={{ color: '#E8E6D9', fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>
                    {ship.normalSpeed || 14.2} kn
                  </div>
                </div>

                <div>
                  <div style={{ color: '#6F746C', fontSize: '9px', letterSpacing: '0.1em' }}>ICE CLASS</div>
                  <div style={{ color: '#C8D35A', fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>
                    {ship.iceClass || 'PC 5'}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#6F746C', fontSize: '9px', letterSpacing: '0.1em' }}>DESTINATION</div>
                  <div style={{ color: '#9A9D93', fontSize: '13px', marginTop: '2px' }}>
                    {ship.destination || 'Rothera Station'}
                  </div>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link
                  to={`/vessels/${ship.id}`}
                  className="btn-secondary"
                  style={{ textDecoration: 'none', fontSize: '11px', padding: '6px 12px' }}
                >
                  <span>Open record</span>
                  <ArrowRight size={12} />
                </Link>

                <button
                  onClick={(e) => handleDelete(e, ship.id, ship.name)}
                  style={{
                    background: 'none',
                    border: '1px solid #292D28',
                    color: '#6F746C',
                    padding: '6px 8px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Remove vessel"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 18: ADD / EDIT VESSEL MODAL */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 13, 12, 0.85)',
            zIndex: 1500,
            display: 'grid',
            placeItems: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: '#121512',
              border: '1px solid #292D28',
              borderRadius: 'var(--radius-sm)',
              width: '100%',
              maxWidth: '560px',
              padding: '24px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #292D28', paddingBottom: '12px', marginBottom: '18px' }}>
              <div>
                <div className="technical-label">FLEET REGISTRATION</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: '#E8E6D9', marginTop: '2px' }}>
                  {editingId ? 'Edit Vessel' : 'Add Vessel'}
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#6F746C', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="technical-label" style={{ display: 'block', marginBottom: '4px' }}>VESSEL NAME</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. RV Meridian"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="technical-label" style={{ display: 'block', marginBottom: '4px' }}>IMO / IDENTIFIER</label>
                  <input
                    type="text"
                    value={form.imo}
                    onChange={(e) => setForm({ ...form, imo: e.target.value })}
                    placeholder="9798222"
                  />
                </div>
                <div>
                  <label className="technical-label" style={{ display: 'block', marginBottom: '4px' }}>CALL SIGN</label>
                  <input
                    type="text"
                    value={form.callsign}
                    onChange={(e) => setForm({ ...form, callsign: e.target.value })}
                    placeholder="ZDLP"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="technical-label" style={{ display: 'block', marginBottom: '4px' }}>LATITUDE</label>
                  <input
                    type="text"
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                  />
                </div>
                <div>
                  <label className="technical-label" style={{ display: 'block', marginBottom: '4px' }}>LONGITUDE</label>
                  <input
                    type="text"
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="technical-label" style={{ display: 'block', marginBottom: '4px' }}>SPEED (kn)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.normalSpeed}
                    onChange={(e) => setForm({ ...form, normalSpeed: e.target.value })}
                  />
                </div>
                <div>
                  <label className="technical-label" style={{ display: 'block', marginBottom: '4px' }}>HEADING (°)</label>
                  <input
                    type="number"
                    value={form.heading}
                    onChange={(e) => setForm({ ...form, heading: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="technical-label" style={{ display: 'block', marginBottom: '4px' }}>ICE CLASS</label>
                  <select
                    value={form.iceClass}
                    onChange={(e) => setForm({ ...form, iceClass: e.target.value })}
                  >
                    <option value="PC 1">PC 1 (Year-round polar ice)</option>
                    <option value="PC 2">PC 2 (Multi-year ice)</option>
                    <option value="PC 3">PC 3 (Second-year ice)</option>
                    <option value="PC 4">PC 4 (Thick first-year ice)</option>
                    <option value="PC 5">PC 5 (Medium first-year)</option>
                    <option value="PC 6">PC 6 (Thin first-year)</option>
                    <option value="PC 7">PC 7 (Summer thin first-year)</option>
                  </select>
                </div>
                <div>
                  <label className="technical-label" style={{ display: 'block', marginBottom: '4px' }}>DESTINATION</label>
                  <input
                    type="text"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-action"
                >
                  Save vessel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
