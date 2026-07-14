// src/app/pages/Configuracion.tsx
import React, { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Globe, Database, Save, Moon, Sun, RefreshCw } from 'lucide-react';

export default function Configuracion() {
  const [config, setConfig] = useState({
    notificaciones: true,
    modoOscuro: false,
    idioma: 'es',
    apiUrl: 'http://localhost:3000'
  });

  // Cargar configuración guardada al iniciar
  useEffect(() => {
    const savedConfig = localStorage.getItem('adminConfig');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
        // Aplicar modo oscuro si estaba activado
        if (parsed.modoOscuro) {
          document.body.classList.add('dark-mode');
        }
      } catch (error) {
        console.error('Error al cargar configuración:', error);
      }
    }
  }, []);

  const handleChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Guardar en localStorage
    localStorage.setItem('adminConfig', JSON.stringify(config));
    
    // Aplicar modo oscuro
    if (config.modoOscuro) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    alert('✅ Configuración guardada exitosamente');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>⚙️ Configuración</h2>
          <p className="subtitle">Administra la configuración del sistema</p>
        </div>
        <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} />
          Guardar
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Notificaciones */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={20} color="#2563eb" />
              <div>
                <h4 style={{ margin: 0, color: '#111827' }}>Notificaciones</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Recibir alertas del sistema</p>
              </div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
              <input
                type="checkbox"
                checked={config.notificaciones}
                onChange={(e) => handleChange('notificaciones', e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: config.notificaciones ? '#2563eb' : '#ccc',
                transition: '.3s',
                borderRadius: '24px'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '18px',
                  width: '18px',
                  left: config.notificaciones ? '26px' : '4px',
                  bottom: '3px',
                  background: 'white',
                  transition: '.3s',
                  borderRadius: '50%'
                }} />
              </span>
            </label>
          </div>

          {/* Modo Oscuro */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {config.modoOscuro ? <Moon size={20} color="#6b7280" /> : <Sun size={20} color="#eab308" />}
              <div>
                <h4 style={{ margin: 0, color: '#111827' }}>Modo Oscuro</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Cambiar tema del panel</p>
              </div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
              <input
                type="checkbox"
                checked={config.modoOscuro}
                onChange={(e) => handleChange('modoOscuro', e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: config.modoOscuro ? '#1f2937' : '#ccc',
                transition: '.3s',
                borderRadius: '24px'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '18px',
                  width: '18px',
                  left: config.modoOscuro ? '26px' : '4px',
                  bottom: '3px',
                  background: 'white',
                  transition: '.3s',
                  borderRadius: '50%'
                }} />
              </span>
            </label>
          </div>

          {/* Idioma */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Globe size={20} color="#10b981" />
              <div>
                <h4 style={{ margin: 0, color: '#111827' }}>Idioma</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Idioma del panel</p>
              </div>
            </div>
            <select
              value={config.idioma}
              onChange={(e) => handleChange('idioma', e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white' }}
            >
              <option value="es">🇪🇸 Español</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>

          {/* API URL */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Database size={20} color="#8b5cf6" />
              <div>
                <h4 style={{ margin: 0, color: '#111827' }}>API URL</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>URL del servidor JSON Server</p>
              </div>
            </div>
            <input
              type="text"
              value={config.apiUrl}
              onChange={(e) => handleChange('apiUrl', e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', width: '250px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}