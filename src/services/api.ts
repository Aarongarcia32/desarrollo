export const API_URL = 'https://vqwksyomqavpvmjwcexg.supabase.co/rest/v1';
export const API_KEY = 'sb_publishable_CE5SV_Iy3YtzOTUTxgA5Mw_TYJYopaS';

export const ENDPOINTS = {
  USERS: '/usuarios',
  BUSINESSES: '/negocios',
  COMMENTS: '/comentarios',
  CHAT: '/mensajes_chat',
  BLOQUEOS: '/bloqueos',
};

export const getHeaders = () => ({
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
});