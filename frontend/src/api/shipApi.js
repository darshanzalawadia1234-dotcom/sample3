import apiClient from './client';
import { MOCK_SHIPS } from './mockData';

export const shipApi = {
  /**
   * Get all registered research vessels
   * GET /api/vessels
   */
  async getShips() {
    try {
      const data = await apiClient.get('/api/vessels');
      const list = Array.isArray(data) ? data : (data.vessels || data.ships || []);
      const ships = list.map(mapShip);
      return { ships, isFallback: false };
    } catch (err) {
      console.warn('Backend vessels service unavailable, using mock fallback', err);
      return {
        ships: [...MOCK_SHIPS],
        isFallback: true
      };
    }
  },

  /**
   * Get single vessel by ID
   * GET /api/vessels/{id}
   */
  async getShipById(id) {
    try {
      const data = await apiClient.get(`/api/vessels/${id}`);
      return { ...mapShip(data), isFallback: false };
    } catch (err) {
      console.warn(`Backend vessel ${id} unavailable, using mock fallback`, err);
      const ship = MOCK_SHIPS.find(s => s.id === id || s.id === Number(id)) || MOCK_SHIPS[0];
      return { ...ship, isFallback: true };
    }
  },

  /**
   * Register a new research vessel
   * POST /api/vessels
   */
  async createShip(shipData) {
    const payload = toDatabaseShip(shipData);
    const data = await apiClient.post('/api/vessels', payload);
    return { ...mapShip(data), isFallback: false };
  },

  /**
   * Update existing vessel details
   * PUT /api/vessels/{id}
   */
  async updateShip(id, shipData) {
    const payload = toDatabaseShip(shipData);
    const data = await apiClient.put(`/api/vessels/${id}`, payload);
    return { ...mapShip(data), isFallback: false };
  },

  /**
   * Delete vessel from registry
   * DELETE /api/vessels/{id}
   */
  async deleteShip(id) {
    await apiClient.delete(`/api/vessels/${id}`);
    return { success: true, isFallback: false };
  }
};

function mapShip(s) {
  return {
    ...s,
    id: s.id,
    name: s.vessel_name || s.name,
    vessel_name: s.vessel_name || s.name,
    maxSpeed: s.max_speed ?? s.maxSpeed ?? 15.0,
    normalSpeed: s.normal_speed ?? s.normalSpeed ?? 11.0,
    fuelCapacity: s.fuel_capacity ?? s.fuelCapacity ?? 950000.0,
    fuelConsumptionRate: s.fuel_consumption_rate ?? s.fuelConsumptionRate ?? 85.0,
    iceClass: s.ice_class ?? s.iceClass ?? 'PC3',
    destLatitude: s.destination_latitude ?? s.destLatitude ?? -67.57,
    destLongitude: s.destination_longitude ?? s.destLongitude ?? -68.13,
    destination: s.destination || 'Rothera Station',
    operator: s.owner_name || s.operator || 'Antarctic Expedition',
    status: s.status || 'OPERATIONAL'
  };
}

function toDatabaseShip(s) {
  return {
    name: s.name || s.vessel_name,
    vessel_name: s.vessel_name || s.name,
    registration_number: s.registration_number || s.registrationNumber,
    imo_number: s.imo_number || s.imoNumber,
    call_sign: s.call_sign || s.callSign,
    vessel_type: s.vessel_type || s.vesselType || 'Research Vessel',
    owner_name: s.owner_name || s.operator,
    latitude: Number(s.latitude),
    longitude: Number(s.longitude),
    destination_latitude: s.destLatitude !== undefined ? Number(s.destLatitude) : (s.destination_latitude !== undefined ? Number(s.destination_latitude) : null),
    destination_longitude: s.destLongitude !== undefined ? Number(s.destLongitude) : (s.destination_longitude !== undefined ? Number(s.destination_longitude) : null),
    destination: s.destination,
    max_speed: s.maxSpeed !== undefined ? Number(s.maxSpeed) : (s.max_speed !== undefined ? Number(s.max_speed) : 15.0),
    normal_speed: s.normalSpeed !== undefined ? Number(s.normalSpeed) : (s.normal_speed !== undefined ? Number(s.normal_speed) : 11.0),
    fuel_consumption_rate: s.fuelConsumptionRate !== undefined ? Number(s.fuelConsumptionRate) : (s.fuel_consumption_rate !== undefined ? Number(s.fuel_consumption_rate) : 85.0),
    fuel_capacity: s.fuelCapacity !== undefined ? Number(s.fuelCapacity) : (s.fuel_capacity !== undefined ? Number(s.fuel_capacity) : 950000.0),
    ice_class: s.iceClass || s.ice_class || 'PC3',
    status: s.status || 'OPERATIONAL'
  };
}

export default shipApi;
