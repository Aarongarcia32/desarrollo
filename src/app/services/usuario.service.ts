// src/app/services/usuario.service.ts
import { API_URL, ENDPOINTS, getHeaders } from './api.config';

export interface Usuario {
  id?: string;
  nombre: string;
  email: string;
  telefono?: string;
  password?: string;
  rol?: 'admin' | 'usuario';
  fecha_registro?: string;
  activo?: boolean;
}

export const usuarioService = {
  // Obtener todos los usuarios
  getAll: async (): Promise<Usuario[]> => {
    const response = await fetch(`${API_URL}${ENDPOINTS.USUARIOS}?select=*`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return response.json();
  },

  // Crear usuario
  create: async (usuario: Omit<Usuario, 'id'>): Promise<Usuario> => {
    const response = await fetch(`${API_URL}${ENDPOINTS.USUARIOS}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        ...usuario,
        fecha_registro: new Date().toISOString(),
        activo: true
      })
    });
    if (!response.ok) throw new Error('Error al crear usuario');
    return response.json();
  },

  // Actualizar usuario
  update: async (id: string, data: Partial<Usuario>): Promise<Usuario> => {
    const response = await fetch(`${API_URL}${ENDPOINTS.USUARIOS}?id=eq.${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al actualizar usuario');
    return response.json();
  },

  // Eliminar usuario
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}${ENDPOINTS.USUARIOS}?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al eliminar usuario');
  },

  // Cambiar estado
  toggleStatus: async (id: string, activo: boolean): Promise<Usuario> => {
    return await usuarioService.update(id, { activo });
  }
};