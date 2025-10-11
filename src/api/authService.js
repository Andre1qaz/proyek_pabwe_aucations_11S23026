import api from './axios';

export const authService = {
  // Login - POST ke /auth/login
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email: email,
      password: password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Register - POST ke /auth/register
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', {
      name: name,
      email: email,
      password: password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Get current user - Gunakan data dari login
  getMe: async () => {
    // Karena tidak ada endpoint /auth/me di dokumentasi,
    // kita ambil dari localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    return { data: user };
  },
};