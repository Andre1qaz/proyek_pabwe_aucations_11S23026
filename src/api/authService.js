import api from './axios';

export const authService = {
  // Login - GANTI ke /users/login
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    const response = await api.post('/users/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // Register - GANTI ke /users/register
  register: async (name, email, password) => {
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);

    const response = await api.post('/users/register', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // Get current user - GANTI ke /users/me
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};