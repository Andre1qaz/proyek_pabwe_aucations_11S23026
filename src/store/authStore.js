import { create } from 'zustand';
import { authService } from '../api/authService';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      
      // Get user data
      const userData = await authService.getMe();
      localStorage.setItem('user', JSON.stringify(userData.data));
      
      set({ user: userData.data, token, isLoading: false });
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login gagal';
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(name, email, password);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registrasi gagal';
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null });
      return false;
    }

    try {
      const userData = await authService.getMe();
      set({ user: userData.data, token });
      return true;
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null });
      return false;
    }
  },
}));