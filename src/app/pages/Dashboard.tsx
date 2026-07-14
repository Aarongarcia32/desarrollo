// src/app/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { usuarioService } from '../services/usuario.service';
import { negocioService } from '../services/negocio.service';
import { comentarioService } from '../services/comentario.service';
import { 
  Users, 
  Store, 
  MessageCircle, 
  Star, 
  TrendingUp, 
  TrendingDown,
  RefreshCw
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    usuarios: 0,
    usuariosActivos: 0,
    usuariosInactivos: 0,
    negocios: 0,
    comentarios: 0,
    calificacionPromedio: 0,
    negociosVerificados: 0,
    crecimiento: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const [usuarios, negocios, comentarios] = await Promise.all([
        usuarioService.getAll(),
        negocioService.getAll(),
        comentarioService.getAll()
      ]);

      const usuariosActivos = usuarios.filter(u => u.activo !== false).length;
      const usuariosInactivos = usuarios.length - usuariosActivos;
      const negociosVerificados = negocios.filter(n => n.verificado === true).length;
      const califPromedio = negocios.length > 0 
        ? negocios.reduce((sum, n) => sum + (n.calificacion || 0), 0) / negocios.length 
        : 0;

      const sortedUsers = [...usuarios]
        .filter(u => u.fechaRegistro)
        .sort((a, b) => 
          new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
        )
        .slice(0, 5);

      setRecentUsers(sortedUsers);
      setStats({
        usuarios: usuarios.length,
        usuariosActivos,
        usuariosInactivos,
        negocios: negocios.length,
        comentarios: comentarios.length,
        calificacionPromedio: califPromedio,
        negociosVerificados,
        crecimiento: 12
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando panel...</p>
      </div>
    );
  }

  const cards = [
    {
      icon: '👥',
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
      value: stats.usuarios,
      label: 'Total Usuarios',
      change: `${stats.crecimiento}% este mes`,
      changeType: 'up'
    },
    {
      icon: '🏪',
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      value: stats.negocios,
      label: 'Negocios',
      change: `${stats.negociosVerificados} verificados`,
      changeType: 'up'
    },
    {
      icon: '💬',
      iconBg: '#fef3c7',
      iconColor: '#d97706',
      value: stats.comentarios,
      label: 'Comentarios',
      change: '+5% esta semana',
      changeType: 'up'
    },
    {
      icon: '⭐',
      iconBg: '#f3e8ff',
      iconColor: '#7c3aed',
      value: stats.calificacionPromedio.toFixed(1),
      label: 'Calificación Promedio',
      change: `${stats.calificacionPromedio.toFixed(1)} estrellas`,
      changeType: 'up'
    }
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>📊 Panel de Control</h1>
          <p className="subtitle">Resumen de tu plataforma Ojo al Negocio</p>
        </div>
        <button 
          onClick={cargarEstadisticas}
          className="btn-actualizar"
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="yt-stats-grid">
        {cards.map((card, index) => (
          <div key={index} className="yt-stat-card">
            <div className="yt-stat-icon" style={{ background: card.iconBg, color: card.iconColor }}>
              <span style={{ fontSize: '28px' }}>{card.icon}</span>
            </div>
            <div className="yt-stat-content">
              <div className="yt-stat-value">{card.value}</div>
              <div className="yt-stat-label">{card.label}</div>
              <div className={`yt-stat-change ${card.changeType}`}>
                {card.changeType === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {card.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actividad Reciente */}
      <div className="yt-activity-section">
        <div className="yt-section-header">
          <h3>📈 Actividad Reciente</h3>
          <button className="yt-see-all">Ver todo →</button>
        </div>
        <div className="yt-activity-grid">
          <div className="yt-activity-chart">
            {[65, 45, 75, 55, 85, 65, 90, 70, 80, 60, 75, 55].map((height, i) => (
              <div key={i} className="yt-chart-bar" style={{ height: `${height}%` }}>
                <span className="tooltip">{height}%</span>
              </div>
            ))}
          </div>
          <div className="yt-activity-labels">
            <span>Ene</span><span>Feb</span><span>Mar</span>
            <span>Abr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Ago</span><span>Sep</span>
            <span>Oct</span><span>Nov</span><span>Dic</span>
          </div>
          <div className="yt-activity-stats">
            <div className="yt-activity-stat">
              <span className="yt-activity-stat-icon">👥</span>
              <div className="yt-activity-stat-value">{stats.usuarios}</div>
              <div className="yt-activity-stat-label">Usuarios</div>
            </div>
            <div className="yt-activity-stat">
              <span className="yt-activity-stat-icon">🏪</span>
              <div className="yt-activity-stat-value">{stats.negocios}</div>
              <div className="yt-activity-stat-label">Negocios</div>
            </div>
            <div className="yt-activity-stat">
              <span className="yt-activity-stat-icon">💬</span>
              <div className="yt-activity-stat-value">{stats.comentarios}</div>
              <div className="yt-activity-stat-label">Comentarios</div>
            </div>
          </div>
        </div>
      </div>

      {/* Usuarios Recientes */}
      <div className="yt-content-section">
        <div className="yt-section-header">
          <h3>📋 Usuarios Recientes</h3>
          <button className="yt-see-all">Ver todos →</button>
        </div>
        <div className="yt-table-container">
          <table className="yt-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Registro</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                recentUsers.map((user, index) => (
                  <tr key={index}>
                    <td>
                      <div className="yt-user-cell">
                        <div className="yt-user-avatar" style={{ 
                          background: `hsl(${index * 60 + 200}, 70%, 50%)` 
                        }}>
                          {user.nombre?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="yt-user-name">{user.nombre || 'Sin nombre'}</span>
                      </div>
                    </td>
                    <td>{user.email || 'Sin email'}</td>
                    <td>
                      <span className={`yt-badge ${user.rol === 'admin' ? 'admin' : 'user'}`}>
                        {user.rol || 'usuario'}
                      </span>
                    </td>
                    <td>
                      <span className={`yt-status ${user.activo !== false ? 'active' : 'inactive'}`}>
                        {user.activo !== false ? '🟢 Activo' : '🔴 Inactivo'}
                      </span>
                    </td>
                    <td style={{ color: '#6b7280', fontSize: '14px' }}>
                      {user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString('es-MX') : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}