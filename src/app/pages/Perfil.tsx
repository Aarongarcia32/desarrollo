// src/app/pages/Perfil.tsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Calendar, Edit2, Save, X } from 'lucide-react';

export default function Perfil() {
  const [perfil, setPerfil] = useState({
    nombre: 'Administrador',
    email: 'admin@admin.com',
    telefono: '55-1234-5678',
    rol: 'admin'
  });
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState(perfil);

  useEffect(() => {
    // Cargar perfil guardado
    const saved = localStorage.getItem('adminPerfil');
    if (saved) {
      const parsed = JSON.parse(saved);
      setPerfil(parsed);
      setForm(parsed);
    }
  }, []);

  const handleEdit = () => {
    setEditando(true);
    setForm(perfil);
  };

  const handleSave = () => {
    setPerfil(form);
    localStorage.setItem('adminPerfil', JSON.stringify(form));
    setEditando(false);
    alert('✅ Perfil actualizado exitosamente');
  };

  const handleCancel = () => {
    setEditando(false);
    setForm(perfil);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>👤 Perfil</h2>
          <p className="subtitle">Administra tu perfil de usuario</p>
        </div>
        {!editando ? (
          <button onClick={handleEdit} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Edit2 size={16} />
            Editar Perfil
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={16} />
              Guardar
            </button>
            <button onClick={handleCancel} style={{ padding: '10px 20px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <X size={16} />
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '600px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {perfil.nombre.charAt(0).toUpperCase()}
          </div>
          <h3 style={{ margin: '12px 0 4px 0', color: '#111827' }}>{perfil.nombre}</h3>
          <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
            {perfil.rol === 'admin' ? 'Administrador' : 'Usuario'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <User size={20} color="#6b7280" />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Nombre</p>
              {editando ? (
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '6px 0', border: 'none', borderBottom: '2px solid #2563eb', outline: 'none', fontSize: '16px' }}
                />
              ) : (
                <p style={{ margin: 0, fontSize: '16px', color: '#111827' }}>{perfil.nombre}</p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <Mail size={20} color="#6b7280" />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Email</p>
              {editando ? (
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '6px 0', border: 'none', borderBottom: '2px solid #2563eb', outline: 'none', fontSize: '16px' }}
                />
              ) : (
                <p style={{ margin: 0, fontSize: '16px', color: '#111827' }}>{perfil.email}</p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <Phone size={20} color="#6b7280" />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Teléfono</p>
              {editando ? (
                <input
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '6px 0', border: 'none', borderBottom: '2px solid #2563eb', outline: 'none', fontSize: '16px' }}
                />
              ) : (
                <p style={{ margin: 0, fontSize: '16px', color: '#111827' }}>{perfil.telefono}</p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={20} color="#6b7280" />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Rol</p>
              <p style={{ margin: 0, fontSize: '16px', color: '#111827' }}>
                {perfil.rol === 'admin' ? 'Administrador' : 'Usuario'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <Calendar size={20} color="#6b7280" />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Último acceso</p>
              <p style={{ margin: 0, fontSize: '16px', color: '#111827' }}>
                {new Date().toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}