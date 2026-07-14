// src/app/pages/Negocios.tsx
import React, { useEffect, useState } from 'react';
import { negocioService } from '../services/negocio.service';
import type { Negocio } from '../services/negocio.service';
import { Store, Search, Star, RefreshCw } from 'lucide-react';

export default function Negocios() {
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargarNegocios();
  }, []);

  const cargarNegocios = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await negocioService.getAll();
      setNegocios(data);
    } catch (err: any) {
      setError('Error al cargar negocios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const eliminarNegocio = async (id: string | number) => {
    if (confirm('¿Seguro que quieres eliminar este negocio?')) {
      try {
        await negocioService.delete(id);
        cargarNegocios();
      } catch (err) {
        alert('Error al eliminar negocio');
      }
    }
  };

  const toggleVerificado = async (id: string | number, verificado: boolean) => {
    try {
      await negocioService.update(id, { verificado: !verificado });
      cargarNegocios();
    } catch (err) {
      alert('Error al cambiar estado de verificación');
    }
  };

  const negociosFiltrados = negocios.filter(n =>
    n.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando negocios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>🏪 Negocios</h2>
          <p className="subtitle">Gestiona los negocios registrados</p>
        </div>
        <button onClick={cargarNegocios} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      {error && <div className="error-banner">❌ {error}</div>}

      {/* Buscador */}
      <div className="filtros-container">
        <div className="search-box" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}>
          <Search size={18} color="#6b7280" />
          <input
            type="text"
            placeholder="Buscar negocio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px' }}
          />
        </div>
      </div>

      <div className="user-table">
        <table>
          <thead>
            <tr>
              <th>Negocio</th>
              <th>Categoría</th>
              <th>Calificación</th>
              <th>Estado</th>
              <th>Verificado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {negociosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  <div>📭</div>
                  <p>No hay negocios registrados</p>
                </td>
              </tr>
            ) : (
              negociosFiltrados.map((negocio) => (
                <tr key={negocio.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: '#10b981' }}>
                        <Store size={16} color="white" />
                      </div>
                      <div>
                        <div className="user-name">{negocio.nombre || 'Sin nombre'}</div>
                        <div className="user-id">ID: {negocio.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="role-badge user">{negocio.categoria || 'Sin categoría'}</span>
                  </td>
                  <td>
                    <div className="comment-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < (negocio.calificacion || 0) ? 'star-filled' : 'star-empty'}
                          fill={i < (negocio.calificacion || 0) ? '#eab308' : 'none'}
                        />
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${negocio.activo !== false ? 'active' : 'inactive'}`}>
                      {negocio.activo !== false ? '🟢 Activo' : '🔴 Inactivo'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${negocio.verificado ? 'active' : 'inactive'}`}>
                      {negocio.verificado ? '✅ Verificado' : '⏳ Pendiente'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => toggleVerificado(negocio.id!, negocio.verificado || false)}
                        className={negocio.verificado ? 'btn-deactivate' : 'btn-activate'}
                      >
                        {negocio.verificado ? 'Desmarcar' : 'Verificar'}
                      </button>
                      <button
                        onClick={() => eliminarNegocio(negocio.id!)}
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
          Total: <strong>{negociosFiltrados.length}</strong> negocios
        </div>
      </div>
    </div>
  );
}