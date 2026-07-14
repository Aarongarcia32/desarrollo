// src/app/services/reporte.service.ts
import { API_URL, ENDPOINTS, getHeaders } from './api.config';

export interface Reporte {
  id?: string;
  titulo: string;
  descripcion?: string;
  tipo: string;
  datos: any;
  creado_por: string;
  created_at?: string;
  formato: string;
}

export const reporteService = {
  // Guardar reporte
  guardar: async (reporte: Omit<Reporte, 'id' | 'created_at'>): Promise<Reporte | null> => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.REPORTES}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          ...reporte,
          created_at: new Date().toISOString()
        })
      });
      if (response.ok) return response.json();
      return null;
    } catch (error) {
      console.error('❌ Error al guardar reporte:', error);
      return null;
    }
  },

  // Obtener todos los reportes
  obtenerTodos: async (): Promise<Reporte[]> => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.REPORTES}?order=created_at.desc`,
        { headers: getHeaders() }
      );
      if (response.ok) return response.json();
      return [];
    } catch (error) {
      console.error('❌ Error al obtener reportes:', error);
      return [];
    }
  },

  // Generar datos para reporte de usuarios
  generarReporteUsuarios: async (usuarios: any[]): Promise<any> => {
    const total = usuarios.length;
    const activos = usuarios.filter(u => u.activo !== false).length;
    const inactivos = total - activos;
    const negocios = usuarios.filter(u => u.rol === 'negocio').length;
    const usuariosNormales = total - negocios;

    return {
      total,
      activos,
      inactivos,
      negocios,
      usuariosNormales,
      fechaGeneracion: new Date().toISOString()
    };
  },

  // Generar datos para reporte de actividad
  generarReporteActividad: async (publicaciones: any[], comentarios: any[]): Promise<any> => {
    return {
      totalPublicaciones: publicaciones.length,
      totalComentarios: comentarios.length,
      fechaGeneracion: new Date().toISOString()
    };
  }
};