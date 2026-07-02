// src/app/Perfil.tsx
import { useState, useEffect } from "react";
import { User, Mail, Phone, X, Calendar } from "lucide-react";

interface PerfilProps {
  onClose: () => void;
}

export default function Perfil({ onClose }: PerfilProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        const data = JSON.parse(currentUser);
        setUser(data);
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
    }
  }, []);

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 p-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando perfil...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha no disponible';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <User size={24} />
            Mi Perfil
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {user.nombre?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>

        {/* Información */}
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <User size={18} className="text-blue-600" />
              <div>
                <label className="text-xs text-gray-500 font-medium block">Nombre completo</label>
                <p className="font-medium text-gray-800">{user.nombre}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-blue-600" />
              <div>
                <label className="text-xs text-gray-500 font-medium block">Correo electrónico</label>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-blue-600" />
              <div>
                <label className="text-xs text-gray-500 font-medium block">Teléfono</label>
                <p className="font-medium text-gray-800">{user.telefono || "No especificado"}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <User size={18} className="text-blue-600" />
              <div>
                <label className="text-xs text-gray-500 font-medium block">Tipo de cuenta</label>
                <p className="font-medium text-gray-800 capitalize">{user.accountType || "Usuario"}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-blue-600" />
              <div>
                <label className="text-xs text-gray-500 font-medium block">Miembro desde</label>
                <p className="font-medium text-gray-800">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botón cerrar */}
        <div className="flex gap-3 justify-end pt-4 border-t mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}