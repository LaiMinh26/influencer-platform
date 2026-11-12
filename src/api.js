import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const getBrands = async () => {
  const response = await axios.get(`${API_URL}/api/brands`);
  return response.data;
};