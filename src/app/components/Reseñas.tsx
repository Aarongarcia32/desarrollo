// src/app/components/Reseñas.tsx
import { useState, useEffect } from "react";
import { Star, X, User, Calendar, MessageCircle, ThumbsUp, AlertCircle } from "lucide-react";
import { Reseña, obtenerReseñasPorNegocio, agregarReseña, obtenerReseñaUsuario, actualizarCalificacionNegocio } from "../data/ReseñasData";
import { BusinessData } from "../data/NegociosEjemplo";

interface ReseñasProps {
  negocio: BusinessData;
  onClose: () => void;
  onReseñaAgregada?: () => void;
}

export default function Reseñas({ negocio, onClose, onReseñaAgregada }: ReseñasProps) {
  const [reseñas, setReseñas] = useState<Reseña[]>([]);
  const [loading, setLoading] = useState(true);
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [calificacionHover, setCalificacionHover] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [usuarioActual, setUsuarioActual] = useState<any>(null);
  const [reseñaExistente, setReseñaExistente] = useState<Reseña | null>(null);
  const [promedioCalificacion, setPromedioCalificacion] = useState(0);

  useEffect(() => {
    cargarDatos();
  }, [negocio.id]);

  const cargarDatos = () => {
    try {
      // Cargar usuario actual
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        setUsuarioActual(JSON.parse(currentUser));
      }

      // Cargar reseñas del negocio
      const reseñasNegocio = obtenerReseñasPorNegocio(negocio.id);
      setReseñas(reseñasNegocio);

      // Calcular promedio
      if (reseñasNegocio.length > 0) {
        const total = reseñasNegocio.reduce((sum, r) => sum + r.calificacion, 0);
        setPromedioCalificacion(total / reseñasNegocio.length);
      }

      // Verificar si el usuario ya reseñó este negocio
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const existente = obtenerReseñaUsuario(negocio.id, user.id);
        if (existente) {
          setReseñaExistente(existente);
          setCalificacion(existente.calificacion);
          setComentario(existente.comentario);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error cargando reseñas:", error);
      setLoading(false);
    }
  };

  const handleSubmitReseña = () => {
    setError("");
    setSuccess("");

    // Validar usuario autenticado
    if (!usuarioActual) {
      setError("⚠️ Debes iniciar sesión para publicar una reseña");
      return;
    }

    // Validar calificación
    if (calificacion === 0) {
      setError("⚠️ Selecciona una calificación de 1 a 5 estrellas");
      return;
    }

    // Validar comentario
    if (comentario.trim().length < 10) {
      setError("⚠️ El comentario debe tener al menos 10 caracteres");
      return;
    }

    // Verificar si ya reseñó este negocio
    if (reseñaExistente) {
      setError("⚠️ Ya has publicado una reseña para este negocio. Solo puedes publicar una reseña por negocio.");
      return;
    }

    try {
      // Agregar reseña
      const nuevaReseña = agregarReseña({
        negocioId: negocio.id,
        usuarioId: usuarioActual.id,
        usuarioNombre: usuarioActual.nombre,
        calificacion: calificacion,
        comentario: comentario.trim(),
      });

      // Actualizar calificación del negocio
      actualizarCalificacionNegocio(negocio.id);

      // Actualizar estado
      setReseñas([nuevaReseña, ...reseñas]);
      setReseñaExistente(nuevaReseña);
      setSuccess("✅ ¡Reseña publicada exitosamente!");
      setCalificacion(0);
      setComentario("");

      // Notificar al componente padre
      if (onReseñaAgregada) {
        onReseñaAgregada();
      }

      // Actualizar promedio
      const nuevasReseñas = [nuevaReseña, ...reseñas];
      const total = nuevasReseñas.reduce((sum, r) => sum + r.calificacion, 0);
      setPromedioCalificacion(total / nuevasReseñas.length);

      setTimeout(() => setSuccess(""), 5000);
    } catch (error) {
      console.error("Error publicando reseña:", error);
      setError("❌ Error al publicar la reseña. Intenta de nuevo.");
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, hover: number = 0) => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      const filled = interactive 
        ? (hover >= starValue || calificacion >= starValue)
        : rating >= starValue;

      return (
        <button
          key={i}
          type="button"
          onMouseEnter={() => interactive && setCalificacionHover(starValue)}
          onMouseLeave={() => interactive && setCalificacionHover(0)}
          onClick={() => interactive && setCalificacion(starValue)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'} focus:outline-none`}
          disabled={!!reseñaExistente}
        >
          <Star
            size={interactive ? 32 : 16}
            className={`${
              filled 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'fill-gray-200 text-gray-200'
            } transition-colors`}
          />
        </button>
      );
    });
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

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando reseñas...</p>
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
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              ⭐ Reseñas de {negocio.nombre}
            </h2>
            {reseñas.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {reseñas.length} reseñas • Promedio: {promedioCalificacion.toFixed(1)} ⭐
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Formulario de reseña */}
          {usuarioActual && !reseñaExistente && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MessageCircle size={18} className="text-blue-600" />
                Publica tu reseña
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Calificación
                  </label>
                  <div className="flex gap-1">
                    {renderStars(0, true, calificacionHover)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Comentario
                  </label>
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Cuéntanos tu experiencia con este negocio..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                    <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                )}
                <button
                  onClick={handleSubmitReseña}
                  className="w-full px-4 py-2.5 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition font-medium"
                >
                  Publicar reseña
                </button>
              </div>
            </div>
          )}

          {/* Mensaje si ya reseñó */}
          {reseñaExistente && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-700 flex items-center gap-2">
                ✅ Ya publicaste una reseña para este negocio
              </p>
              <div className="mt-2 flex items-center gap-1">
                {renderStars(reseñaExistente.calificacion)}
              </div>
              <p className="text-sm text-gray-600 mt-1">"{reseñaExistente.comentario}"</p>
            </div>
          )}

          {/* Mensaje si no está autenticado */}
          {!usuarioActual && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-700 flex items-center gap-2">
                🔒 Inicia sesión para publicar una reseña
              </p>
            </div>
          )}

          {/* Lista de reseñas */}
          {reseñas.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <User size={18} />
                Reseñas de otros usuarios
              </h3>
              {reseñas.map((reseña) => (
                <div key={reseña.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                          {reseña.usuarioNombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            {reseña.usuarioNombre}
                          </p>
                          <div className="flex items-center gap-1">
                            {renderStars(reseña.calificacion)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-2">{reseña.comentario}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(reseña.fecha)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No hay reseñas aún</p>
              <p className="text-sm text-gray-400">Sé el primero en dejar una reseña</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}