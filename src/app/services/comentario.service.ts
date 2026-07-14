// src/app/services/comentario.service.ts
import { API_URL, ENDPOINTS, getHeaders } from './api.config';

export interface Comentario {
  id?: string;
  texto: string;
  calificacion: number;
  negocio_id: string;
  usuario_id: string;
  fecha?: string;
}

export const comentarioService = {
  getAll: async (): Promise<Comentario[]> => {
    const response = await fetch(`${API_URL}${ENDPOINTS.COMENTARIOS}?select=*`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener comentarios');
    return response.json();
  },

  create: async (comentario: Omit<Comentario, 'id'>): Promise<Comentario> => {
    const response = await fetch(`${API_URL}${ENDPOINTS.COMENTARIOS}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        ...comentario,
        fecha: new Date().toISOString()
      })
    });
    if (!response.ok) throw new Error('Error al crear comentario');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}${ENDPOINTS.COMENTARIOS}?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al eliminar comentario');
  }
};