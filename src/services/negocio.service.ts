// src/services/negocio.service.ts
import { API_URL, ENDPOINTS, getHeaders } from './api';

export interface Negocio {
  id: string;
  nombre: string;
  direccion: string;
  categoria: string;
  calificacion: number;
  usuario_id: string;
  verificado: boolean;
  activo: boolean;
  telefono?: string;
  descripcion?: string;
  created_at?: string;
  lat?: number;
  lng?: number;
  giro?: string;
  rfc?: string;
  userId?: string;
  createdAt?: string;
}

export const negocioService = {
  getAll: async (): Promise<Negocio[]> => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.BUSINESSES}?select=*`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Error al obtener negocios');
      return response.json();
    } catch (error) {
      console.error('❌ Error al obtener negocios desde Supabase:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Negocio | null> => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.BUSINESSES}?id=eq.${id}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Error al obtener negocio');
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('❌ Error al obtener negocio:', error);
      return null;
    }
  }
};