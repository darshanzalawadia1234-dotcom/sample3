import apiClient from './client';
import { MOCK_ICEBERGS } from './mockData';

export const icebergApi = {
  /**
   * Get list of all tracked icebergs
   * GET /api/icebergs
   */
  async getAll(bounds = null) {
    try {
      let endpoint = '/api/icebergs';
      if (bounds) {
        const query = new URLSearchParams(bounds).toString();
        endpoint += `?${query}`;
      }
      const data = await apiClient.get(endpoint);
      return { ...data, isFallback: false };
    } catch (err) {
      console.warn('Backend iceberg service unavailable, using mock fallback', err);
      return {
        icebergs: [...MOCK_ICEBERGS],
        isFallback: true
      };
    }
  },

  /**
   * Get single iceberg details
   * GET /api/icebergs/{id}
   */
  async getById(id) {
    try {
      const data = await apiClient.get(`/api/icebergs/${id}`);
      return { ...data, isFallback: false };
    } catch (err) {
      console.warn(`Backend iceberg ${id} unavailable, using mock fallback`, err);
      const berg = MOCK_ICEBERGS.find(b => b.id === id || b.external_id === id) || MOCK_ICEBERGS[0];
      return { ...berg, isFallback: true };
    }
  },

  /**
   * Get predicted drift trajectory for an iceberg
   * GET /api/icebergs/{id}/trajectory
   */
  async getTrajectory(id, forecastHours = '6,12,18,24,48') {
    try {
      const data = await apiClient.get(`/api/icebergs/${id}/trajectory?forecast_hours=${forecastHours}`);
      return { ...data, isFallback: false };
    } catch (err) {
      console.warn(`Backend iceberg trajectory for ${id} unavailable, using mock fallback`, err);
      const berg = MOCK_ICEBERGS.find(b => b.id === id || b.external_id === id) || MOCK_ICEBERGS[0];
      return {
        id: berg.id,
        name: berg.name,
        currentPosition: { latitude: berg.latitude, longitude: berg.longitude },
        speedKnots: berg.speed,
        headingDegrees: berg.heading || berg.direction,
        driftModel: 'Lagrangian Drift v1.2 (Coupled Ekman/Atmospheric)',
        trajectory: berg.trajectory || [],
        isFallback: true
      };
    }
  },

  /**
   * Get active proximity alerts
   * GET /api/icebergs/alerts
   */
  async getAlerts() {
    try {
      const data = await apiClient.get('/api/icebergs/alerts');
      return { ...data, isFallback: false };
    } catch (err) {
      console.warn('Backend iceberg alerts unavailable, using mock fallback', err);
      return {
        alerts: [
          {
            id: 'alert-01',
            icebergId: 'A-68A',
            severity: 'CRITICAL',
            closestPointOfApproachKm: 4.8,
            timeToCpaHours: 2.5,
            message: 'Iceberg A-68A projected to cross Rothera transit corridor in 2.5h'
          }
        ],
        isFallback: true
      };
    }
  }
};

export default icebergApi;
