import apiClient from './client';

export const authApi = {
  /**
   * Sign up new user
   * POST /api/auth/signup
   */
  async signup(data) {
    const res = await apiClient.post('/api/auth/signup', data);
    if (res.access_token) {
      apiClient.setAuthToken(res.access_token);
    }
    return res;
  },

  /**
   * Log in user
   * POST /api/auth/login
   */
  async login(credentials) {
    const res = await apiClient.post('/api/auth/login', credentials);
    if (res.access_token) {
      apiClient.setAuthToken(res.access_token);
    }
    return res;
  },

  /**
   * Log out
   * POST /api/auth/logout
   */
  async logout() {
    try {
      await apiClient.post('/api/auth/logout', {});
    } finally {
      apiClient.clearAuthToken();
    }
    return { success: true };
  },

  /**
   * Get current authenticated user profile
   * GET /api/auth/me
   */
  async getMe() {
    return await apiClient.get('/api/auth/me');
  }
};

export default authApi;
