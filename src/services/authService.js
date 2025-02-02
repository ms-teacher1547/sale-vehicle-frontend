import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth';

const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
};

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

const logout = async () => {
  const response = await axios.post(`${API_URL}/logout`);
  return response.data;
};

// Assigner l'objet à une variable avant de l'exporter
const authService = { login, register, logout };
export default authService;