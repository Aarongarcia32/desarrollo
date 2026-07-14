// src/app/pages/Comentarios.tsx
import React, { useEffect, useState } from 'react';
import { comentarioService } from '../services/comentario.service';
import type { Comentario } from '../services/comentario.service';
import { Star, Trash2, User, RefreshCw } from 'lucide-react';

export default function Comentarios() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarComentarios();
  }, []);

  const cargarComentarios = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Cargando comentarios desde JSON Server...');

      const data = await comentarioService.getAll();
      console.log('✅ Comentarios recibidos:', data);

      setComentarios(data);
    } catch (err: any) {
      console.error('❌ Error al cargar comentarios:', err);
      setError(err.message || 'Error al cargar comentarios');
    } finally {
      setLoading(false);
    }
  };

  const eliminarComentario = async (id: string | number) => {
    if (confirm('¿Seguro que quieres eliminar este comentario?')) {
      try {
        await comentarioService.delete(id);
        cargarComentarios();
      } catch (err) {
        alert('Error al eliminar comentario');
      }
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'star-filled' : 'star-empty'}
        fill={i < rating ? '#eab308' : 'none'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando comentarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>💬 Comentarios</h2>
          <p className="subtitle">Gestiona los comentarios de los usuarios</p>
        </div>
        <button
          onClick={cargarComentarios}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="error-banner">
          ❌ {error}
        </div>
      )}

      <div className="user-table">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Comentario</th>
              <th>Calificación</th>
              <th>Negocio</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {comentarios.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  <div>📭</div>
                  <p>No hay comentarios registrados</p>
                  <p style={{ fontSize: '12px', marginTop: '8px', color: '#6b7280' }}>
                    Escribe una reseña en el proyecto principal para verla aquí
                  </p>
                </td>
              </tr>
            ) : (
              comentarios.map((comentario) => (
                <tr key={comentario.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: '#8b5cf6' }}>
                        <User size={16} color="white" />
                      </div>
                      <div>
                        <div className="user-name">
                          {comentario.usuarioNombre || `Usuario ${comentario.usuarioId}`}
                        </div>
                        <div className="user-id">ID: {comentario.usuarioId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="comment-text-preview">
                      {comentario.texto || comentario.comentario || 'Sin texto'}
                    </div>
                  </td>
                  <td>
                    <div className="comment-stars">
                      {renderStars(comentario.calificacion || 0)}
                    </div>
                  </td>
                  <td>
                    <span className="role-badge user">
                      🏪 {comentario.negocioId || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      {comentario.fecha
                        ? new Date(comentario.fecha).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => eliminarComentario(comentario.id!)}
                      className="btn-delete"
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="table-footer">
          Total: <strong>{comentarios.length}</strong> comentarios
        </div>
      </div>
    </div>
  );
}