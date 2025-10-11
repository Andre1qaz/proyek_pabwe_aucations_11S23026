import api from './axios';

export const authService = {
  // Login - GANTI ke GET method dengan query params
  login: async (email, password) => {
    const response = await api.get('/users/login', {
      params: {
        email: email,
        password: password,
      },
    });
    return response.data;
  },

  // Register - Kemungkinan juga GET
  register: async (name, email, password) => {
    const response = await api.get('/users/register', {
      params: {
        name: name,
        email: email,
        password: password,
      },
    });
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};