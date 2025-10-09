import api from './axios';

export const auctionService = {
  // Get all auctions
  getAll: async (params = {}) => {
    const response = await api.get('/aucations', { params });
    return response.data;
  },

  // Get auction detail
  getDetail: async (id) => {
    const response = await api.get(`/aucations/${id}`);
    return response.data;
  },

  // Create new auction
  create: async (data) => {
    const formData = new FormData();
    formData.append('cover', data.cover);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('start_bid', data.start_bid);
    formData.append('closed_at', data.closed_at);

    const response = await api.post('/aucations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update auction
  update: async (id, data) => {
    const formData = new URLSearchParams();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('start_bid', data.start_bid);
    formData.append('closed_at', data.closed_at);

    const response = await api.put(`/aucations/${id}`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // Change cover
  changeCover: async (id, cover) => {
    const formData = new FormData();
    formData.append('cover', cover);

    const response = await api.post(`/aucations/${id}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete auction
  delete: async (id) => {
    const response = await api.delete(`/aucations/${id}`);
    return response.data;
  },

  // Add bid
  addBid: async (id, bidAmount) => {
    const formData = new URLSearchParams();
    formData.append('bid', bidAmount);

    const response = await api.post(`/aucations/${id}/bids`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // Delete bid
  deleteBid: async (id) => {
    const response = await api.delete(`/aucations/${id}/bids`);
    return response.data;
  },
};