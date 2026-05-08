import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.error ?? error.message ?? 'Erreur réseau';
    return Promise.reject(new Error(message));
  }
);

// Ajoute le token admin si présent (dashboard)
export function setAdminToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['x-admin-token'] = token;
  } else {
    delete api.defaults.headers.common['x-admin-token'];
  }
}
