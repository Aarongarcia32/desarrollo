// src/app/pages/Usuarios.tsx
import React, { useEffect, useState } from 'react';
import { usuarioService } from '../services/usuario.service';
import { comentarioService } from '../services/comentario.service';
import { bloqueoService } from '../services/bloqueo.service';
import type { Usuario } from '../services/usuario.service';
import type { Comentario } from '../services/comentario.service';
import { Eye, X, Star, MessageCircle, Ban, Lock, MessageSquare } from 'lucide-react';
export const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [userComments, setUserComments] = useState<Comentario[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [userIdToBan, setUserIdToBan] = useState<string>('');
  const [motivoBloqueo, setMotivoBloqueo] = useState('');
  const [usuariosBloqueados, setUsuariosBloqueados] = useState<string[]>([]);

  useEffect(() => {
    cargarUsuarios();
    cargarBloqueados();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getAll();
      setUsuarios(data);
      setError('');
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const cargarBloqueados = async () => {
    try {
      const bloqueados = await bloqueoService.obtenerBloqueados();
      setUsuariosBloqueados(bloqueados.map(b => b.usuario_id));
    } catch (error) {
      console.error('Error al cargar bloqueados:', error);
    }
  };

  const verReseñas = async (user: Usuario) => {
    setSelectedUser(user);
    setShowModal(true);
    setModalLoading(true);
    try {
      const allComments = await comentarioService.getAll();
      const userComs = allComments.filter(c => c.usuario_id === user.id);
      setUserComments(userComs);
    } catch (err) {
      console.error('Error al cargar reseñas:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const eliminarUsuario = async (id: string | number) => {
  if (confirm('¿Seguro que quieres eliminar este usuario?')) {
    try {
      await usuarioService.delete(id);
      cargarUsuarios();
    } catch (err) {
      alert('Error al eliminar usuario');
    }
  }
};

const handleBloquearUsuario = async (usuarioId: string) => {
  if (!motivoBloqueo.trim()) {
    alert('⚠️ Debes escribir un motivo');
    return;
  }
  
  const result = await bloqueoService.bloquear(usuarioId, motivoBloqueo);
  if (result) {
    alert(`✅ Usuario bloqueado. Motivo: ${motivoBloqueo}`);
    setShowBanModal(false);
    setMotivoBloqueo('');
    cargarUsuarios();
    cargarBloqueados();
  } else {
    alert('❌ Error al bloquear usuario');
  }
};

const handleDesbloquear = async (usuarioId: string) => {
  if (confirm('¿Desbloquear este usuario?')) {
    const result = await bloqueoService.desbloquear(usuarioId);
    if (result) {
      alert('✅ Usuario desbloqueado');
      cargarUsuarios();
      cargarBloqueados();
    } else {
      alert('❌ Error al desbloquear usuario');
    }
  }
};

const toggleEstado = async (id: string | number, activo: boolean = true) => {
  try {
    await usuarioService.toggleStatus(id, !activo);
    cargarUsuarios();
  } catch (err) {
    alert('Error al cambiar estado');
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
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>👥 Usuarios</h2>
          <p className="subtitle">Gestiona los usuarios registrados en la plataforma</p>
        </div>
        <button onClick={cargarUsuarios} className="btn-primary">
          🔄 Actualizar
        </button>
      </div>

      {error && <div className="error-banner">❌ {error}</div>}

      <div className="user-table">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  <div>📭</div>
                  <p>No hay usuarios registrados</p>
                </td>
              </tr>
            ) : (
              usuarios.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {user.nombre?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="user-name">{user.nombre}</div>
                        <div className="user-id">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.telefono || '—'}</td>
                  <td>
                    <span className={`role-badge ${user.rol === 'admin' ? 'admin' : 'user'}`}>
                      {user.rol || 'usuario'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.activo !== false ? 'active' : 'inactive'}`}>
                      {user.activo !== false ? '🟢 Activo' : '🔴 Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      {user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : '—'}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => verReseñas(user)}
                        className="btn-view"
                        title="Ver reseñas"
                      >
                        <MessageCircle size={16} />
                      </button>
                      {usuariosBloqueados.includes(user.id!) ? (
                        <button
                          onClick={() => handleDesbloquear(user.id!)}
                          className="btn-activate"
                          title="Desbloquear"
                        >
                          <Lock size={14} /> Desbloquear
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setUserIdToBan(user.id!);
                            setShowBanModal(true);
                          }}
                          className="btn-deactivate"
                          title="Bloquear"
                        >
                          <Ban size={14} /> Bloquear
                        </button>
                      )}
                      <button
                        onClick={() => toggleEstado(user.id!, user.activo !== false)}
                        className={user.activo !== false ? 'btn-deactivate' : 'btn-activate'}
                      >
                        {user.activo !== false ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => eliminarUsuario(user.id!)}
                        className="btn-delete"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="table-footer">
          Total: <strong>{usuarios.length}</strong> usuarios
        </div>
      </div>

      {/* Modal de Reseñas */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>📝 Reseñas de {selectedUser.nombre}</h3>
                <p className="subtitle">{selectedUser.email}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="modal-close">
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              {modalLoading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Cargando reseñas...</p>
                </div>
              ) : userComments.length === 0 ? (
                <div className="empty-state-comments">
                  <MessageCircle size={48} />
                  <p>Este usuario aún no ha escrito reseñas</p>
                </div>
              ) : (
                <div className="comments-list">
                  {userComments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <div className="comment-stars">
                          {renderStars(comment.calificacion)}
                        </div>
                        <span className="comment-date">
                          {new Date(comment.fecha).toLocaleDateString('es-MX')}
                        </span>
                      </div>
                      <p className="comment-text">{comment.texto}</p>
                      <div className="comment-meta">
                        <span className="comment-negocio">🏪 Negocio ID: {comment.negocio_id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Bloqueo */}
      {showBanModal && (
        <div className="modal-overlay" onClick={() => setShowBanModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>🚫 Bloquear Usuario</h3>
                <p className="subtitle">Motivo del bloqueo</p>
              </div>
              <button onClick={() => setShowBanModal(false)} className="modal-close">
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Usuario: <strong>{usuarios.find(u => u.id === userIdToBan)?.nombre || 'Desconocido'}</strong>
                </label>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Motivo del bloqueo</label>
                <textarea
                  value={motivoBloqueo}
                  onChange={(e) => setMotivoBloqueo(e.target.value)}
                  placeholder="Ej: Publicaciones ofensivas, Spam, etc."
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', minHeight: '80px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  onClick={() => handleBloquearUsuario(userIdToBan)}
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  Bloquear
                </button>
                <button
                  onClick={() => setShowBanModal(false)}
                  style={{ padding: '10px 24px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};