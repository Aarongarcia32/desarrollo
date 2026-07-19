// src/app/components/DetalleNegocio.tsx
import { useState, useEffect } from 'react';
import { X, Star, Heart, MapPin, Phone, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import { Negocio } from '../../services/negocio.service';
import Reseñas from './Reseñas';
import { obtenerReseñasPorNegocio, Reseña } from '../data/ReseñasData';

interface DetalleNegocioProps {
  negocio: Negocio;
  onClose: () => void;
  onFavoritoToggle?: (id: string) => void;
}

export default function DetalleNegocio({ negocio, onClose, onFavoritoToggle }: DetalleNegocioProps) {
  const [isFavorito, setIsFavorito] = useState(false);
  const [reseñas, setReseñas] = useState<Reseña[]>([]);
  const [promedioCalificacion, setPromedioCalificacion] = useState(0);
  const [showReseñas, setShowReseñas] = useState(false);

  useEffect(() => {
    // Verificar si es favorito
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const favs = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]");
      setIsFavorito(favs.includes(negocio.id));
    }

    // Cargar reseñas
    const reseñasNegocio = obtenerReseñasPorNegocio(negocio.id);
    setReseñas(reseñasNegocio);
    if (reseñasNegocio.length > 0) {
      const total = reseñasNegocio.reduce((sum, r) => sum + r.calificacion, 0);
      setPromedioCalificacion(total / reseñasNegocio.length);
    }
  }, [negocio.id]);

  const handleFavoritoToggle = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      alert("⚠️ Inicia sesión para agregar favoritos");
      return;
    }
    const user = JSON.parse(currentUser);
    let favs = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]");
    
    if (isFavorito) {
      favs = favs.filter((id: string) => id !== negocio.id);
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favs));
      setIsFavorito(false);
    } else {
      favs.push(negocio.id);
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favs));
      setIsFavorito(true);
    }
    
    if (onFavoritoToggle) {
      onFavoritoToggle(negocio.id);
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

  // Verificar que negocio existe
  if (!negocio) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-gray-500">No se encontró el negocio</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">{negocio.nombre}</h2>
            {negocio.verificado && (
              <CheckCircle size={18} className="text-green-500" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFavoritoToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Heart 
                size={22} 
                className={isFavorito ? 'fill-red-500 text-red-500' : 'text-gray-400'}
              />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Categoría y calificación */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {negocio.categoria || 'Sin categoría'}
            </span>
            {negocio.calificacion > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {renderStars(Math.round(negocio.calificacion))}
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {negocio.calificacion.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({reseñas.length} reseñas)
                </span>
              </div>
            )}
          </div>

          {/* Descripción */}
          {negocio.descripcion && (
            <p className="text-gray-600 text-sm">{negocio.descripcion}</p>
          )}

          {/* Información del negocio */}
          <div className="space-y-2">
            {negocio.direccion && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin size={16} className="shrink-0 mt-0.5" />
                <span>{negocio.direccion}</span>
              </div>
            )}
            {negocio.telefono && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} />
                <span>{negocio.telefono}</span>
              </div>
            )}
            {negocio.created_at && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={16} />
                <span>Registrado: {new Date(negocio.created_at).toLocaleDateString('es-MX')}</span>
              </div>
            )}
          </div>

          {/* Botón de reseñas */}
          <button
            onClick={() => setShowReseñas(!showReseñas)}
            className="w-full mt-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            {showReseñas ? 'Ocultar reseñas' : `Ver reseñas (${reseñas.length})`}
          </button>

          {/* Reseñas */}
          {showReseñas && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl max-h-60 overflow-y-auto">
              {reseñas.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">No hay reseñas aún</p>
              ) : (
                <div className="space-y-3">
                  {reseñas.map((reseña) => (
                    <div key={reseña.id} className="border-b border-gray-200 pb-3 last:border-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            {reseña.usuarioNombre.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-sm">{reseña.usuarioNombre}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {renderStars(reseña.calificacion)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{reseña.comentario}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(reseña.fecha).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botón cerrar */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-2.5 rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}