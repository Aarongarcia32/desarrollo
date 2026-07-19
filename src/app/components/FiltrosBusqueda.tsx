// src/app/components/FiltrosBusqueda.tsx
import { useState } from "react";
import { Filter, X, Star, Calendar } from "lucide-react";
import { FiltrosBusqueda, obtenerCategorias, BusinessData } from "../data/NegociosEjemplo";

interface FiltrosBusquedaProps {
  negocios: BusinessData[];
  onFiltrar: (filtros: FiltrosBusqueda) => void;
  onClose: () => void;
  filtrosActuales: FiltrosBusqueda;
}

export default function FiltrosBusquedaComponent({
  negocios,
  onFiltrar,
  onClose,
  filtrosActuales,
}: FiltrosBusquedaProps) {
  const [calificacionMinima, setCalificacionMinima] = useState<number>(
    filtrosActuales.calificacionMinima || 0
  );
  const [fechaUltimaReseña, setFechaUltimaReseña] = useState<string>(
    filtrosActuales.fechaUltimaReseña || ""
  );
  const [categoria, setCategoria] = useState<string>(
    filtrosActuales.categoria || "Todas"
  );
  const [calificacionHover, setCalificacionHover] = useState(0);

  const categorias = obtenerCategorias(negocios);

  const handleAplicarFiltros = () => {
    onFiltrar({
      calificacionMinima: calificacionMinima > 0 ? calificacionMinima : undefined,
      fechaUltimaReseña: fechaUltimaReseña || undefined,
      categoria: categoria !== "Todas" ? categoria : undefined,
    });
    onClose();
  };

  const handleLimpiarFiltros = () => {
    setCalificacionMinima(0);
    setFechaUltimaReseña("");
    setCategoria("Todas");
    onFiltrar({});
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Filter size={20} className="text-blue-600" />
            Filtros avanzados
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Calificación mínima */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            ⭐ Calificación mínima
          </label>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onMouseEnter={() => setCalificacionHover(num)}
                  onMouseLeave={() => setCalificacionHover(0)}
                  onClick={() => setCalificacionMinima(num === calificacionMinima ? 0 : num)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      num <= (calificacionHover || calificacionMinima)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            {calificacionMinima > 0 && (
              <span className="text-sm font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">
                {calificacionMinima}+ ⭐
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {calificacionMinima === 0 
              ? 'Mostrar todos los negocios' 
              : `Solo negocios con ${calificacionMinima}+ estrellas`}
          </p>
        </div>

        {/* Fecha de última reseña */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            📅 Fecha de última reseña
          </label>
          <input
            type="date"
            value={fechaUltimaReseña}
            onChange={(e) => setFechaUltimaReseña(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">
            Mostrar negocios con reseñas después de esta fecha
          </p>
        </div>

        {/* Categoría */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            📂 Categoría
          </label>
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoria(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categoria === cat
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resumen de filtros activos */}
        {(calificacionMinima > 0 || fechaUltimaReseña || categoria !== "Todas") && (
          <div className="mb-6 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm font-medium text-blue-700 mb-2">Filtros activos:</p>
            <div className="flex flex-wrap gap-2">
              {calificacionMinima > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  ⭐ {calificacionMinima}+ estrellas
                </span>
              )}
              {fechaUltimaReseña && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  📅 Reseñas después de {new Date(fechaUltimaReseña).toLocaleDateString()}
                </span>
              )}
              {categoria !== "Todas" && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  📂 {categoria}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={handleLimpiarFiltros}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
          >
            Limpiar
          </button>
          <button
            onClick={handleAplicarFiltros}
            className="flex-1 px-4 py-2.5 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition font-medium"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
}