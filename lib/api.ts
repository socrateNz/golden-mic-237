import axios from 'axios';

import { useAdminStore } from '@/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAdminStore.getState().logout();
      setAdminToken(null);
    }
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
