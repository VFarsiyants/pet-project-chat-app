import axios from 'axios';

export const API_URL = 'http://localhost:8000/api'

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL
})

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config;
})

$api.interceptors.response.use((config) => {
  return config;
}, (async error => {
  const originalRequest = error.config;
  originalRequest._isRetry = true;
  try {
    if (error.message.status == 401 && error.config && !error.config._isRetry) {
        const response = await axios.get(`${API_URL}/token/refresh/`);
        localStorage.setItem('token', response.data.access);
        return $api.request(originalRequest);
    }
  } catch {
    console.log('user is not authorized');
  }
  throw error;
}))

export default $api;