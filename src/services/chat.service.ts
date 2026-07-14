// src/services/chat.service.ts
import { API_URL, ENDPOINTS, getHeaders } from './api';

export interface MensajeChat {
  id?: string;
  usuario_id: string;
  usuario_nombre: string;
  mensaje: string;
  created_at?: string;
  negocio_id: string;
  negocio_nombre: string;
  leido?: boolean;
  respuesta?: string;
  respondido_por?: string;
  respondido_at?: string;
}

export const chatService = {
  // Enviar mensaje (solo negocios)
  enviar: async (mensaje: Omit<MensajeChat, 'id' | 'created_at' | 'leido' | 'respuesta'>): Promise<MensajeChat | null> => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.CHAT}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          ...mensaje,
          created_at: new Date().toISOString(),
          leido: false
        })
      });
      if (response.ok) return response.json();
      return null;
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);
      return null;
    }
  },

  // Obtener mensajes de un negocio
  obtenerPorNegocio: async (negocioId: string): Promise<MensajeChat[]> => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.CHAT}?negocio_id=eq.${negocioId}&order=created_at.asc`,
        { headers: getHeaders() }
      );
      if (response.ok) return response.json();
      return [];
    } catch (error) {
      console.error('❌ Error al obtener mensajes:', error);
      return [];
    }
  },

  // Marcar como leído (admin)
  marcarLeido: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.CHAT}?id=eq.${id}`,
        {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ leido: true })
        }
      );
      return response.ok;
    } catch (error) {
      console.error('❌ Error al marcar como leído:', error);
      return false;
    }
  },

  // Obtener mensajes no leídos (admin)
  obtenerNoLeidos: async (): Promise<MensajeChat[]> => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.CHAT}?leido=eq.false&order=created_at.asc`,
        { headers: getHeaders() }
      );
      if (response.ok) return response.json();
      return [];
    } catch (error) {
      console.error('❌ Error al obtener no leídos:', error);
      return [];
    }
  },

  // Responder a un mensaje (admin)
  responder: async (id: string, respuesta: string, adminId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.CHAT}?id=eq.${id}`,
        {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({
            respuesta: respuesta,
            respondido_por: adminId,
            respondido_at: new Date().toISOString(),
            leido: true
          })
        }
      );
      return response.ok;
    } catch (error) {
      console.error('❌ Error al responder:', error);
      return false;
    }
  }
};