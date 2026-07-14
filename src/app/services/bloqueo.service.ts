// src/app/services/bloqueo.service.ts
import { API_URL, ENDPOINTS, getHeaders } from './api.config';

export interface Bloqueo {
  id?: string;
  usuario_id: string;
  motivo: string;
  fecha_inicio: string;
  fecha_fin?: string;
  activo: boolean;
  creado_por: string;
  comentario?: string;
}

export const bloqueoService = {
  // Bloquear usuario
  bloquear: async (usuarioId: string, motivo: string, comentario?: string): Promise<Bloqueo | null> => {
    try {
      console.log('📤 Bloqueando usuario:', usuarioId);
      console.log('📝 Motivo:', motivo);
      
      const body = {
        usuario_id: usuarioId,
        motivo: motivo,
        fecha_inicio: new Date().toISOString(),
        activo: true,
        creado_por: 'admin',
        comentario: comentario || ''
      };
      
      const response = await fetch(`${API_URL}${ENDPOINTS.BLOQUEOS}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body)
      });
      
      console.log('📥 Status:', response.status);
      
      if (response.ok) {
        // ✅ Verificar si hay contenido antes de parsear JSON
        const text = await response.text();
        if (text && text.length > 0) {
          try {
            const data = JSON.parse(text);
            console.log('✅ Usuario bloqueado:', data);
            return data;
          } catch (e) {
            console.log('✅ Usuario bloqueado (sin datos de retorno)');
            return { usuario_id: usuarioId, motivo, activo: true } as Bloqueo;
          }
        } else {
          console.log('✅ Usuario bloqueado (sin datos de retorno)');
          return { usuario_id: usuarioId, motivo, activo: true } as Bloqueo;
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Error:', response.status, errorText);
        return null;
      }
    } catch (error) {
      console.error('❌ Error al bloquear usuario:', error);
      return null;
    }
  },

  // Desbloquear usuario
  desbloquear: async (usuarioId: string): Promise<boolean> => {
    try {
      console.log('📤 Desbloqueando usuario:', usuarioId);
      
      const response = await fetch(
        `${API_URL}${ENDPOINTS.BLOQUEOS}?usuario_id=eq.${usuarioId}&activo=eq.true`,
        {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ 
            activo: false,
            fecha_fin: new Date().toISOString()
          })
        }
      );
      
      console.log('📥 Status:', response.status);
      
      if (response.ok) {
        console.log('✅ Usuario desbloqueado');
        return true;
      } else {
        const errorText = await response.text();
        console.error('❌ Error:', response.status, errorText);
        return false;
      }
    } catch (error) {
      console.error('❌ Error al desbloquear usuario:', error);
      return false;
    }
  },

  // Obtener usuarios bloqueados
  obtenerBloqueados: async (): Promise<Bloqueo[]> => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.BLOQUEOS}?activo=eq.true&select=*`,
        { headers: getHeaders() }
      );
      if (response.ok) {
        const text = await response.text();
        if (text && text.length > 0) {
          return JSON.parse(text);
        }
        return [];
      }
      return [];
    } catch (error) {
      console.error('❌ Error al obtener bloqueados:', error);
      return [];
    }
  },

  // Verificar si un usuario está bloqueado
  estaBloqueado: async (usuarioId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.BLOQUEOS}?usuario_id=eq.${usuarioId}&activo=eq.true`,
        { headers: getHeaders() }
      );
      if (response.ok) {
        const text = await response.text();
        if (text && text.length > 0) {
          const data = JSON.parse(text);
          return data.length > 0;
        }
        return false;
      }
      return false;
    } catch (error) {
      console.error('❌ Error al verificar bloqueo:', error);
      return false;
    }
  }
};