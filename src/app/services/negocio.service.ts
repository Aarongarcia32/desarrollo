// src/app/services/negocio.service.ts
import { API_URL, ENDPOINTS, getHeaders } from './api.config';

export interface Negocio {
  id?: string;
  nombre: string;
  direccion: string;
  categoria: string;
  calificacion: number;
  usuario_id: string;
  verificado?: boolean;
  activo?: boolean;
  telefono?: string;
  descripcion?: string;
  created_at?: string;
}

export const negocioService = {
  getAll: async (): Promise<Negocio[]> => {
    const response = await fetch(`${API_URL}${ENDPOINTS.NEGOCIOS}?select=*`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener negocios');
    return response.json();
  },

  create: async (negocio: Omit<Negocio, 'id'>): Promise<Negocio> => {
    const response = await fetch(`${API_URL}${ENDPOINTS.NEGOCIOS}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        ...negocio,
        created_at: new Date().toISOString(),
        verificado: false,
        activo: true
      })
    });
    if (!response.ok) throw new Error('Error al crear negocio');
    return response.json();
  },

  update: async (id: string, data: Partial<Negocio>): Promise<Negocio> => {
    const response = await fetch(`${API_URL}${ENDPOINTS.NEGOCIOS}?id=eq.${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al actualizar negocio');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}${ENDPOINTS.NEGOCIOS}?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al eliminar negocio');
  }
};