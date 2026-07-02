// src/app/components/DetalleNegocio.tsx
import { useState, useEffect } from "react";
import { X, Star, MapPin, Phone, Clock, User, Heart, Facebook, Instagram, MessageCircle, CheckCircle2 } from "lucide-react";
import { BusinessData } from "../data/NegociosEjemplo";
import Reseñas from "./Reseñas";

interface DetalleNegocioProps {
  negocio: BusinessData | null;
  onClose: () => void;
  onFavoritoToggle?: (id: string) => void;
}

export default function DetalleNegocio({ negocio, onClose, onFavoritoToggle }: DetalleNegocioProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReseñas, setShowReseñas] = useState(false);

  useEffect(() => {
    if (negocio) {
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const favs = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]");
        setIsFavorite(favs.includes(negocio.id));
      }
    }
  }, [negocio]);

  if (!negocio) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-gray-500">No hay información disponible</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const handleFavorito = () => {
    if (onFavoritoToggle) {
      onFavoritoToggle(negocio.id);
      setIsFavorite(!isFavorite);
    }
  };

  // Función para obtener el icono de categoría
  const getCategoryEmoji = (categoria: string) => {
    const emojis: Record<string, string> = {
      "Restaurante / Comida": "🍽️",
      "Hotel / Hospedaje": "🏨",
      "Tours y actividades": "🗺️",
      "Tienda / Retail": "🛍️",
      "Spa / Belleza": "💆",
      "Transporte": "🚗",
      "Otro": "📍",
    };
    return emojis[categoria] || "📍";
  };

  const getCategoryColor = (categoria: string) => {
    const colors: Record<string, string> = {
      "Restaurante / Comida": "bg-red-100 text-red-700",
      "Hotel / Hospedaje": "bg-blue-100 text-blue-700",
      "Tours y actividades": "bg-yellow-100 text-yellow-700",
      "Tienda / Retail": "bg-purple-100 text-purple-700",
      "Spa / Belleza": "bg-pink-100 text-pink-700",
      "Transporte": "bg-cyan-100 text-cyan-700",
      "Otro": "bg-gray-100 text-gray-700",
    };
    return colors[categoria] || "bg-gray-100 text-gray-700";
  };

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
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con botón cerrar */}
          <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                {getCategoryEmoji(negocio.categoria)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{negocio.nombre}</h2>
                <p className="text-sm text-gray-500">{negocio.giro}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            >
              <X size={24} />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-6 space-y-4">
            {/* Categorías y verificación */}
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(negocio.categoria)}`}>
                {negocio.categoria}
              </span>
              {negocio.verificado && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
                  <CheckCircle2 size={14} />
                  Verificado
                </span>
              )}
              {negocio.calificacion && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1">
                  <Star size={14} className="fill-yellow-500" />
                  {negocio.calificacion} / 5.0
                </span>
              )}
            </div>

            {/* Descripción */}
            {negocio.descripcion && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-700 text-sm leading-relaxed">{negocio.descripcion}</p>
              </div>
            )}

            {/* Información de contacto */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                📋 Información de contacto
              </h3>
              
              {negocio.direccion && (
                <div className="flex items-start gap-3 text-sm">
                  <MapPin size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs">Dirección</p>
                    <p className="text-gray-800">{negocio.direccion}</p>
                  </div>
                </div>
              )}

              {negocio.telefono && (
                <div className="flex items-start gap-3 text-sm">
                  <Phone size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs">Teléfono</p>
                    <p className="text-gray-800">{negocio.telefono}</p>
                  </div>
                </div>
              )}

              {negocio.horario && (
                <div className="flex items-start gap-3 text-sm">
                  <Clock size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs">Horario</p>
                    <p className="text-gray-800">{negocio.horario}</p>
                  </div>
                </div>
              )}

              {negocio.createdAt && (
                <div className="flex items-start gap-3 text-sm">
                  <User size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs">Registrado desde</p>
                    <p className="text-gray-800">{formatDate(negocio.createdAt)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Redes sociales */}
            {negocio.redes && (negocio.redes.facebook || negocio.redes.instagram || negocio.redes.whatsapp) && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                  🌐 Redes sociales
                </h3>
                <div className="flex flex-wrap gap-3">
                  {negocio.redes.facebook && (
                    <a 
                      href={`https://facebook.com/${negocio.redes.facebook}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:opacity-80 transition text-sm"
                    >
                      <Facebook size={16} />
                      {negocio.redes.facebook}
                    </a>
                  )}
                  {negocio.redes.instagram && (
                    <a 
                      href={`https://instagram.com/${negocio.redes.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E4405F] to-[#F56040] text-white rounded-lg hover:opacity-80 transition text-sm"
                    >
                      <Instagram size={16} />
                      {negocio.redes.instagram}
                    </a>
                  )}
                  {negocio.redes.whatsapp && (
                    <a 
                      href={`https://wa.me/${negocio.redes.whatsapp}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:opacity-80 transition text-sm"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4 border-t flex-wrap">
              <button
                onClick={handleFavorito}
                className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition ${
                  isFavorite 
                    ? 'bg-red-50 text-red-600 border-2 border-red-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart size={18} className={isFavorite ? 'fill-red-500' : ''} />
                {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              </button>

              {/* 👇 NUEVO BOTÓN DE RESEÑAS */}
              <button
                onClick={() => setShowReseñas(true)}
                className="flex-1 py-2.5 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition flex items-center justify-center gap-2"
              >
                <Star size={18} />
                Ver reseñas
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 👇 MODAL DE RESEÑAS */}
      {showReseñas && (
        <Reseñas
          negocio={negocio}
          onClose={() => setShowReseñas(false)}
          onReseñaAgregada={() => {
            // Actualizar la información del negocio si es necesario
            console.log("Reseña agregada, actualizando...");
          }}
        />
      )}
    </>
  );
}