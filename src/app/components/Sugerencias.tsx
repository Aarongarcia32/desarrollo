// src/app/Sugerencias.tsx
import { useState, useEffect } from "react";
import { Search, X, Star, MapPin, CheckCircle2, Heart, SlidersHorizontal, Grid, List } from "lucide-react";
import { useMapa } from "./MapaContext";
import DetalleNegocio from "./DetalleNegocio";

interface SugerenciasProps {
  onClose?: () => void;
}

export default function Sugerencias({ onClose }: SugerenciasProps) {
  const { 
    negociosFiltrados, 
    negocios, 
    setFiltros, 
    filtros,
    loading,
    categorias,
    favoritos,
    toggleFavorito,
    negocioSeleccionado,
    setNegocioSeleccionado
  } = useMapa();

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("Todas");
  const [calificacionMinima, setCalificacionMinima] = useState<number>(0);
  const [calificacionHover, setCalificacionHover] = useState<number>(0);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [vista, setVista] = useState<"grid" | "lista">("grid");
  const [ordenarPor, setOrdenarPor] = useState<"calificacion" | "nombre" | "reciente">("calificacion");

  // Aplicar filtros al contexto
  useEffect(() => {
    const nuevosFiltros: any = {};
    
    if (calificacionMinima > 0) {
      nuevosFiltros.calificacionMinima = calificacionMinima;
    }
    
    if (categoriaSeleccionada !== "Todas") {
      nuevosFiltros.categoria = categoriaSeleccionada;
    }
    
    if (terminoBusqueda.trim() !== "") {
      nuevosFiltros.termino = terminoBusqueda;
    }
    
    setFiltros(nuevosFiltros);
  }, [calificacionMinima, categoriaSeleccionada, terminoBusqueda]);

  const handleVerNegocio = (negocio: any) => {
    setNegocioSeleccionado(negocio);
    setMostrarDetalle(true);
  };

  const limpiarFiltros = () => {
    setTerminoBusqueda("");
    setCategoriaSeleccionada("Todas");
    setCalificacionMinima(0);
    setFiltros({});
  };

  const contarFiltrosActivos = () => {
    let count = 0;
    if (calificacionMinima > 0) count++;
    if (categoriaSeleccionada !== "Todas") count++;
    if (terminoBusqueda.trim() !== "") count++;
    return count;
  };

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
      "Restaurante / Comida": "bg-red-50 border-red-200",
      "Hotel / Hospedaje": "bg-blue-50 border-blue-200",
      "Tours y actividades": "bg-yellow-50 border-yellow-200",
      "Tienda / Retail": "bg-purple-50 border-purple-200",
      "Spa / Belleza": "bg-pink-50 border-pink-200",
      "Transporte": "bg-cyan-50 border-cyan-200",
      "Otro": "bg-gray-50 border-gray-200",
    };
    return colors[categoria] || "bg-gray-50 border-gray-200";
  };

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}
          />
        ))}
        <span className="text-xs font-semibold text-gray-700 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Ordenar negocios
  const getNegociosOrdenados = () => {
    const sorted = [...negociosFiltrados];
    switch (ordenarPor) {
      case "calificacion":
        sorted.sort((a, b) => (b.calificacion || 0) - (a.calificacion || 0));
        break;
      case "nombre":
        sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "reciente":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    return sorted;
  };

  const negociosOrdenados = getNegociosOrdenados();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando sugerencias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Título */}
            <div className="flex items-center justify-between md:justify-start flex-1">
              <div>
                <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                  <span>💡</span>
                  Sugerencias de Negocios
                </h1>
                <p className="text-sm text-gray-500">
                  {negociosFiltrados.length} de {negocios.length} negocios encontrados
                </p>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                >
                  <X size={24} />
                </button>
              )}
            </div>

            {/* Barra de búsqueda */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, categoría..."
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                {terminoBusqueda && (
                  <button
                    onClick={() => setTerminoBusqueda("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  contarFiltrosActivos() > 0
                    ? 'bg-blue-900 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Filtros</span>
                {contarFiltrosActivos() > 0 && (
                  <span className="bg-white text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {contarFiltrosActivos()}
                  </span>
                )}
              </button>
              
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setVista("grid")}
                  className={`p-2 transition ${
                    vista === "grid" ? 'bg-blue-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                  title="Vista en cuadrícula"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setVista("lista")}
                  className={`p-2 transition ${
                    vista === "lista" ? 'bg-blue-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                  title="Vista en lista"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Panel de filtros */}
          {filtrosAbiertos && (
            <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Calificación */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">⭐ Calificación mínima</label>
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
                          size={28}
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
                    <p className="text-xs text-gray-500 mt-1">{calificacionMinima}+ estrellas</p>
                  )}
                </div>

                {/* Categoría */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">📂 Categoría</label>
                  <div className="flex flex-wrap gap-1.5">
                    {categorias.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoriaSeleccionada(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          categoriaSeleccionada === cat
                            ? 'bg-blue-900 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ordenar */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">🔄 Ordenar por</label>
                  <select
                    value={ordenarPor}
                    onChange={(e) => setOrdenarPor(e.target.value as typeof ordenarPor)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="calificacion">⭐ Mejor calificación</option>
                    <option value="nombre">🔤 Nombre (A-Z)</option>
                    <option value="reciente">📅 Más reciente</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={limpiarFiltros}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                >
                  Limpiar filtros
                </button>
                <button
                  onClick={() => setFiltrosAbiertos(false)}
                  className="px-4 py-2 bg-blue-900 text-white text-sm rounded-lg hover:bg-blue-800 transition"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          )}

          {/* Badges de filtros activos */}
          {contarFiltrosActivos() > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {calificacionMinima > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                  ⭐ {calificacionMinima}+
                  <button onClick={() => setCalificacionMinima(0)} className="hover:text-yellow-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {categoriaSeleccionada !== "Todas" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  📂 {categoriaSeleccionada}
                  <button onClick={() => setCategoriaSeleccionada("Todas")} className="hover:text-blue-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {terminoBusqueda && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  🔍 {terminoBusqueda}
                  <button onClick={() => setTerminoBusqueda("")} className="hover:text-green-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                onClick={limpiarFiltros}
                className="text-xs text-gray-500 hover:text-red-500 transition"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid de negocios */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {negociosOrdenados.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700">No se encontraron negocios</h3>
            <p className="text-gray-500 mt-2">Intenta ajustar tus filtros de búsqueda</p>
            <button
              onClick={limpiarFiltros}
              className="mt-4 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className={`grid ${
            vista === "grid" 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          } gap-4`}>
            {negociosOrdenados.map((negocio) => (
              <div
                key={negocio.id}
                className={`
                  bg-white rounded-2xl border border-gray-200/80 overflow-hidden
                  transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                  ${getCategoryColor(negocio.categoria)}
                  ${vista === "lista" ? 'flex flex-col sm:flex-row sm:items-center gap-4 p-4' : 'p-4'}
                `}
              >
                <div className={vista === "lista" ? 'flex-1' : 'space-y-3'}>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className="text-2xl shrink-0">{getCategoryEmoji(negocio.categoria)}</span>
                      <div className="min-w-0 flex-1">
                        <h3 
                          className="font-semibold text-gray-800 hover:text-blue-700 cursor-pointer transition line-clamp-1"
                          onClick={() => handleVerNegocio(negocio)}
                        >
                          {negocio.nombre}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">{negocio.giro}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorito(negocio.id)}
                      className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition"
                    >
                      <Heart
                        size={18}
                        className={favoritos.includes(negocio.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                      />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-medium px-2 py-0.5 bg-white/70 rounded-full border border-gray-200/50">
                      {negocio.categoria}
                    </span>
                    {negocio.verificado && (
                      <span className="text-[10px] font-medium px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-200/50 flex items-center gap-0.5">
                        <CheckCircle2 size={10} />
                        Verificado
                      </span>
                    )}
                    {negocio.calificacion && (
                      <span className="text-[10px] font-medium px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-200/50 flex items-center gap-0.5">
                        {renderStars(negocio.calificacion)}
                      </span>
                    )}
                  </div>

                  {/* Dirección */}
                  <div className="flex items-start gap-1.5 text-xs text-gray-500 mt-1">
                    <MapPin size={14} className="shrink-0 mt-0.5 text-gray-400" />
                    <span className="line-clamp-1">{negocio.direccion}</span>
                  </div>

                  {/* Botón Ver Detalle */}
                  <button
                    onClick={() => handleVerNegocio(negocio)}
                    className="w-full mt-2 px-4 py-2 bg-blue-900/10 text-blue-700 text-sm font-medium rounded-xl hover:bg-blue-900 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span>Ver detalles</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 border-t border-gray-200/80 pt-6">
          <p>Mostrando {negociosFiltrados.length} de {negocios.length} negocios</p>
          <p className="text-xs mt-1">📍 Todos los negocios están ubicados en Quintana Roo</p>
        </div>
      </div>

      {/* Modal de detalle */}
      {mostrarDetalle && negocioSeleccionado && (
        <DetalleNegocio
          negocio={negocioSeleccionado}
          onClose={() => {
            setMostrarDetalle(false);
            setNegocioSeleccionado(null);
          }}
          onFavoritoToggle={toggleFavorito}
        />
      )}
    </div>
  );
}