// src/app/services/publicacion.service.ts
import { API_URL, ENDPOINTS, getHeaders } from './api.config';

export interface Publicacion {
  id?: string;
  usuario_id: string;
  usuario_nombre: string;
  contenido: string;
  tipo: string;
  created_at: string;
  negocio_id?: string;
  negocio_nombre?: string;
  visible: boolean;
  reportado: boolean;
}

export const publicacionService = {
  // Obtener todas las publicaciones
  obtenerTodas: async (): Promise<Publicacion[]> => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.PUBLICACIONES}?order=created_at.desc`,
        { headers: getHeaders() }
      );
      if (response.ok) return response.json();
      return [];
    } catch (error) {
      console.error('❌ Error al obtener publicaciones:', error);
      return [];
    }
  },

  // Obtener publicaciones de un usuario
  obtenerPorUsuario: async (usuarioId: string): Promise<Publicacion[]> => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.PUBLICACIONES}?usuario_id=eq.${usuarioId}&order=created_at.desc`,
        { headers: getHeaders() }
      );
      if (response.ok) return response.json();
      return [];
    } catch (error) {
      console.error('❌ Error al obtener publicaciones del usuario:', error);
      return [];
    }
  },

  // Ocultar publicación (moderación)
  ocultar: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.PUBLICACIONES}?id=eq.${id}`,
        {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ visible: false })
        }
      );
      return response.ok;
    } catch (error) {
      console.error('❌ Error al ocultar publicación:', error);
      return false;
    }
  },

  // Reportar publicación
  reportar: async (id: string, usuarioId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.PUBLICACIONES}?id=eq.${id}`,
        {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ 
            reportado: true,
            reportado_por: usuarioId
          })
        }
      );
      return response.ok;
    } catch (error) {
      console.error('❌ Error al reportar publicación:', error);
      return false;
    }
  },

  // Eliminar publicación (admin)
  eliminar: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.PUBLICACIONES}?id=eq.${id}`,
        { method: 'DELETE', headers: getHeaders() }
      );
      return response.ok;
    } catch (error) {
      console.error('❌ Error al eliminar publicación:', error);
      return false;
    }
  }
};