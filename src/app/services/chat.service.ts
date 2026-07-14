// src/app/services/chat.service.ts
import { API_URL, ENDPOINTS, getHeaders } from './api.config';

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
  },

  // Obtener todas las conversaciones (admin)
  obtenerConversaciones: async (): Promise<MensajeChat[]> => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.CHAT}?order=created_at.desc&limit=100`,
        { headers: getHeaders() }
      );
      if (response.ok) return response.json();
      return [];
    } catch (error) {
      console.error('❌ Error al obtener conversaciones:', error);
      return [];
    }
  },

  // Obtener conversaciones agrupadas por negocio
  obtenerConversacionesAgrupadas: async (): Promise<{ negocio_id: string; negocio_nombre: string; ultimo_mensaje: MensajeChat; no_leidos: number }[]> => {
    try {
      const mensajes = await chatService.obtenerConversaciones();
      const agrupados: Record<string, any> = {};
      
      mensajes.forEach(msg => {
        if (!agrupados[msg.negocio_id]) {
          agrupados[msg.negocio_id] = {
            negocio_id: msg.negocio_id,
            negocio_nombre: msg.negocio_nombre,
            ultimo_mensaje: msg,
            no_leidos: 0
          };
        }
        if (!msg.leido) {
          agrupados[msg.negocio_id].no_leidos++;
        }
        // Actualizar último mensaje si es más reciente
        if (new Date(msg.created_at!) > new Date(agrupados[msg.negocio_id].ultimo_mensaje.created_at!)) {
          agrupados[msg.negocio_id].ultimo_mensaje = msg;
        }
      });
      
      return Object.values(agrupados).sort((a, b) => 
        new Date(b.ultimo_mensaje.created_at).getTime() - new Date(a.ultimo_mensaje.created_at).getTime()
      );
    } catch (error) {
      console.error('❌ Error al agrupar conversaciones:', error);
      return [];
    }
  }
};