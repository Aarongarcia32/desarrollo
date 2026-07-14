// src/app/services/api.config.ts

export const API_URL = 'https://vqwksyomqavpvmjwcexg.supabase.co/rest/v1';
export const API_KEY = 'sb_publishable_CE5SV_Iy3YtzOTUTxgA5Mw_TYJYopaS'; // ← PEGA TU CLAVE

export const ENDPOINTS = {
  USUARIOS: '/usuarios',
  NEGOCIOS: '/negocios',
  COMENTARIOS: '/comentarios',
  PUBLICACIONES: '/publicaciones',
  BLOQUEOS: '/bloqueos',
  REPORTES: '/reportes'
};

export const getHeaders = () => ({
  'apikey': API_KEY,
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
});