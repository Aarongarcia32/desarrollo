import { API_URL, ENDPOINTS, getHeaders } from './api';
import { supabase } from './supabase';
 
const TABLA = 'mensajes_chat';
 
export type Remitente = 'negocio' | 'admin';
 
export interface MensajeChat {
  id: string;
  negocio_id: string;
  negocio_nombre: string;
  usuario_id: string;
  usuario_nombre: string;
  mensaje: string;
  remitente: Remitente;
  leido: boolean;
  created_at: string;
}
 
export const chatService = {
  obtenerPorNegocio: async (negocioId: string): Promise<MensajeChat[]> => {
    try {
      const r = await fetch(
        `${API_URL}${ENDPOINTS.CHAT}?negocio_id=eq.${negocioId}&order=created_at.asc`,
        { headers: getHeaders() },
      );
      if (!r.ok) {
        console.error('❌ obtenerPorNegocio:', r.status, await r.text());
        return [];
      }
      return r.json();
    } catch (e) {
      console.error('❌ obtenerPorNegocio:', e);
      return [];
    }
  },
 
  // El negocio envía (crea fila con remitente='negocio')
  enviar: async (payload: {
    negocio_id: string;
    negocio_nombre: string;
    usuario_id: string;
    usuario_nombre: string;
    mensaje: string;
  }): Promise<MensajeChat | null> => {
    try {
      const r = await fetch(`${API_URL}${ENDPOINTS.CHAT}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ ...payload, remitente: 'negocio', leido: false }),
      });
      if (!r.ok) {
        console.error('❌ enviar:', r.status, await r.text());
        return null;
      }
      const data = await r.json();
      return Array.isArray(data) ? data[0] ?? null : data;
    } catch (e) {
      console.error('❌ enviar:', e);
      return null;
    }
  },
 
  // Realtime: solo los mensajes de ESTE negocio. Devuelve función para cortar.
  suscribir: (negocioId: string, onMensaje: (m: MensajeChat) => void): (() => void) => {
    const canal = supabase
      .channel(`chat-negocio-${negocioId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: TABLA,
          filter: `negocio_id=eq.${negocioId}`,
        },
        (payload) => onMensaje(payload.new as MensajeChat),
      )
      .subscribe();
 
    return () => {
      supabase.removeChannel(canal);
    };
  },
};