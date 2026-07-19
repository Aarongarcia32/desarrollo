// src/services/resena.service.ts
import { API_URL, ENDPOINTS, getHeaders } from './api';

export const resenaService = {
  guardar: async (reseña: any) => {
    try {
      console.log('📤 Enviando reseña a Supabase:', reseña);
      
      // Verificar que los datos sean válidos
      console.log('🔍 Datos a enviar:');
      console.log('  - texto:', reseña.comentario || reseña.texto);
      console.log('  - calificacion:', reseña.calificacion);
      console.log('  - negocio_id:', reseña.negocioId);
      console.log('  - usuario_id:', reseña.usuarioId);
      console.log('  - fecha:', reseña.fecha || new Date().toISOString());
      
      // Verificar que no haya campos undefined
      if (!reseña.negocioId) {
        console.error('❌ ERROR: negocioId es undefined!');
        return null;
      }
      
      if (!reseña.usuarioId) {
        console.error('❌ ERROR: usuarioId es undefined!');
        return null;
      }
      
      // Construir el body
      const bodyData = {
        texto: reseña.comentario || reseña.texto,
        calificacion: reseña.calificacion,
        negocio_id: reseña.negocioId,
        usuario_id: reseña.usuarioId,
        fecha: reseña.fecha || new Date().toISOString()
      };
      
      console.log('📦 Body a enviar:', JSON.stringify(bodyData, null, 2));
      
      const response = await fetch(`${API_URL}${ENDPOINTS.COMMENTS}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(bodyData)
      });
      
      console.log('📥 Respuesta de Supabase:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Reseña guardada en Supabase:', data);
        return data;
      } else {
        const errorText = await response.text();
        console.error('❌ Error al guardar reseña:', response.status, errorText);
        console.error('❌ Body que causó el error:', bodyData);
        return null;
      }
    } catch (error) {
      console.error('❌ No se pudo conectar con Supabase:', error);
      return null;
    }
  }
};