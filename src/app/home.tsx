import { useState, useEffect } from "react";
import { Search, Menu, User, Heart, MapPin, MessageCircle } from "lucide-react";
import logoImg from "../imports/Captura_de_pantalla_2026-06-08_211927.png";
import Perfil from "./Perfil";
import Favoritos from "./Favoritos";
import Mapa from "./components/Mapa";
import DetalleNegocio from "./components/DetalleNegocio";
import ChatNegocio from "./components/ChatNegocio";
import { negocioService, Negocio } from "../services/negocio.service";
// ← AGREGADO: sin este import, el fetch de bloqueos de abajo tira ReferenceError.
import { API_URL, ENDPOINTS, getHeaders } from "../services/api";

type HomeProps = {
  onLogout: () => void;
};

export default function Home({ onLogout }: HomeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);
  const [showFavoritos, setShowFavoritos] = useState(false);
  const [showMapa, setShowMapa] = useState(false);
  const [showDetalleNegocio, setShowDetalleNegocio] = useState(false);
  const [negocioSeleccionado, setNegocioSeleccionado] = useState<Negocio | null>(null);
  const [userName, setUserName] = useState("");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState<Negocio[]>([]);
  const [mostrandoResultados, setMostrandoResultados] = useState(false);
  const [negociosDestacados, setNegociosDestacados] = useState<Negocio[]>([]);
  const [allNegocios, setAllNegocios] = useState<Negocio[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        // 1. Verificar si el usuario está bloqueado
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
          const user = JSON.parse(currentUser);

          try {
            const bloqueoResponse = await fetch(
              `${API_URL}${ENDPOINTS.BLOQUEOS}?usuario_id=eq.${user.id}&activo=eq.true`,
              { headers: getHeaders() }
            );

            if (bloqueoResponse.ok) {
              const bloqueoData = await bloqueoResponse.json();
              if (bloqueoData.length > 0) {
                alert(`🚫 Tu cuenta ha sido bloqueada. Motivo: ${bloqueoData[0].motivo}`);
                localStorage.removeItem("currentUser");
                window.location.reload();
                return;
              }
            }
          } catch (error) {
            console.error("❌ Error al verificar bloqueo:", error);
          }

          setUserName(user.nombre || "Usuario");
          setUserId(user.id || "");
        }

        // 2. Cargar negocios
        const data = await negocioService.getAll();
        setAllNegocios(data);
        setNegociosDestacados(data.slice(0, 4));
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarTodo();
  }, []);

  const handleBuscar = () => {
    if (terminoBusqueda.trim() === "") {
      setMostrandoResultados(false);
      return;
    }

    const terminoLower = terminoBusqueda.toLowerCase();
    const resultados = allNegocios.filter(
      (n) =>
        n.nombre?.toLowerCase().includes(terminoLower) ||
        n.descripcion?.toLowerCase().includes(terminoLower) ||
        n.categoria?.toLowerCase().includes(terminoLower)
    );
    setResultadosBusqueda(resultados);
    setMostrandoResultados(true);
  };

  const handleLogout = () => {
    if (confirm("¿Seguro que quieres cerrar sesión?")) {
      localStorage.removeItem("currentUser");
      onLogout();
    }
  };

  const handleVerNegocio = (negocio: Negocio) => {
    setNegocioSeleccionado(negocio);
    setShowDetalleNegocio(true);
  };

  const getCategoryIcon = (categoria: string) => {
    const icons: Record<string, any> = {
      "Restaurante / Comida": () => <span>🍽️</span>,
      "Hotel / Hospedaje": () => <span>🏨</span>,
      "Tienda / Retail": () => <span>🛍️</span>,
      "Tours y actividades": () => <span>🗺️</span>,
      "Spa / Belleza": () => <span>💆</span>,
      Transporte: () => <span>🚗</span>,
    };
    const Icon = icons[categoria] || (() => <span>📍</span>);
    return <Icon />;
  };

  const cerrarTodosModales = () => {
    setShowPerfil(false);
    setShowFavoritos(false);
    setShowMapa(false);
    setShowDetalleNegocio(false);
    setMenuOpen(false);
  };

  return (
    <div
      className="h-screen overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #EFF6FF 0%, #F9FAFB 50%, #ECFDF5 100%)",
      }}
    >
      {/* Fondo decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-10" style={{ background: "#1E3A8A" }} />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: "#10B981" }} />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={cerrarTodosModales}>
            <img src={logoImg} alt="Ojo al Negocio logo" className="w-14 h-14 object-contain" />
            <h1 className="font-bold text-2xl text-blue-900">Ojo al Negocio</h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <span className="text-gray-600">👋 Hola, {userName}</span>
            <button
              onClick={() => {
                setShowPerfil(true);
                setShowFavoritos(false);
                setShowMapa(false);
                setMostrandoResultados(false);
              }}
              className="flex items-center gap-2 hover:text-blue-900 transition px-3 py-2 bg-blue-50 rounded-lg"
            >
              <User size={18} />
              Perfil
            </button>
            <button
              onClick={() => {
                setShowFavoritos(true);
                setShowPerfil(false);
                setShowMapa(false);
                setMostrandoResultados(false);
              }}
              className="flex items-center gap-2 hover:text-blue-900 transition px-3 py-2 bg-red-50 rounded-lg"
            >
              <Heart size={18} />
              Favoritos
            </button>
            <button
              onClick={() => {
                setShowMapa(true);
                setShowPerfil(false);
                setShowFavoritos(false);
                setMostrandoResultados(false);
              }}
              className="flex items-center gap-2 hover:text-blue-900 transition px-3 py-2 bg-green-50 rounded-lg"
            >
              <MapPin size={18} />
              Mapa
            </button>
            <button onClick={handleLogout} className="hover:text-red-600 transition">
              Cerrar sesión
            </button>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition md:hidden"
          >
            <Menu />
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-36 pb-10 overflow-y-auto h-screen">
        {/* Modales */}
        {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        {showFavoritos && <Favoritos onClose={() => setShowFavoritos(false)} />}
        {showMapa && <Mapa onClose={() => setShowMapa(false)} />}

        {showDetalleNegocio && negocioSeleccionado && (
          <DetalleNegocio
            negocio={negocioSeleccionado}
            onClose={() => {
              setShowDetalleNegocio(false);
              setNegocioSeleccionado(null);
            }}
            onFavoritoToggle={(id) => {
              console.log("Favorito toggled:", id);
            }}
          />
        )}

        {/* Chat con soporte — cualquier usuario logueado */}
        {showChat && userId && (
          <ChatNegocio
            onClose={() => setShowChat(false)}
            negocioId={userId}
            negocioNombre={userName}
            usuarioId={userId}
            usuarioNombre={userName}
          />
        )}

        {!showPerfil && !showFavoritos && !showMapa && !showDetalleNegocio && (
          <>
            <h2 className="text-center text-4xl font-bold text-slate-800">
              Elige mejor con cada opción
            </h2>
            <p className="text-center text-gray-600 mt-4">
              Encuentra los mejores negocios y comparte tu experiencia.
            </p>

            {/* Buscador */}
            <div className="mt-8 flex justify-center">
              <div className="bg-white rounded-full shadow-lg flex items-center px-5 py-3 w-full max-w-2xl">
                <Search className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar negocio..."
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                  className="flex-1 px-4 outline-none bg-transparent"
                />
                <button
                  onClick={handleBuscar}
                  className="bg-blue-900 text-white px-5 py-2 rounded-full hover:bg-blue-800 transition"
                >
                  Buscar
                </button>
              </div>
            </div>

            {/* Resultados de búsqueda */}
            {mostrandoResultados && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Resultados encontrados: {resultadosBusqueda.length}
                </h3>
                {resultadosBusqueda.length === 0 ? (
                  <div className="text-center py-8 bg-white/50 rounded-xl">
                    <p className="text-gray-500">No se encontraron negocios</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resultadosBusqueda.map((negocio) => (
                      <div
                        key={negocio.id}
                        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer hover:border-blue-300 border-2 border-transparent"
                        onClick={() => handleVerNegocio(negocio)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg text-xl">
                            {getCategoryIcon(negocio.categoria)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{negocio.nombre}</h4>
                            <p className="text-sm text-gray-500">{negocio.giro}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                {negocio.categoria}
                              </span>
                              {negocio.verificado && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  ✓ Verificado
                                </span>
                              )}
                              {negocio.calificacion && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  ★ {negocio.calificacion}
                                </span>
                              )}
                            </div>
                            <div className="mt-2 flex items-start gap-1 text-sm text-gray-500">
                              <span>📍</span>
                              <span>{negocio.direccion}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setMostrandoResultados(false)}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Limpiar resultados
                </button>
              </div>
            )}

            {/* Categorías rápidas */}
            {!mostrandoResultados && (
              <>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  {["Restaurantes", "Hoteles", "Tiendas"].map((cat) => (
                    <div
                      key={cat}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm hover:shadow-md transition cursor-pointer hover:bg-white"
                      onClick={() => {
                        setTerminoBusqueda(cat);
                        handleBuscar();
                      }}
                    >
                      <p className="font-medium text-gray-700 text-lg">{cat}</p>
                      <p className="text-xs text-gray-400">Explorar</p>
                    </div>
                  ))}
                </div>

                {/* Negocios destacados */}
                {negociosDestacados.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                      🌟 Negocios Destacados
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {negociosDestacados.map((negocio) => (
                        <div
                          key={negocio.id}
                          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer hover:border-blue-300 border-2 border-transparent"
                          onClick={() => handleVerNegocio(negocio)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-xl">
                              {getCategoryIcon(negocio.categoria)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{negocio.nombre}</h4>
                              <p className="text-sm text-gray-500">{negocio.giro}</p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  {negocio.categoria}
                                </span>
                                {negocio.verificado && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    ✓ Verificado
                                  </span>
                                )}
                                {negocio.calificacion && (
                                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    ★ {negocio.calificacion}
                                  </span>
                                )}
                              </div>
                              <div className="mt-2 flex items-start gap-1 text-sm text-gray-500">
                                <span>📍</span>
                                <span>{negocio.direccion}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Botón flotante de chat — para cualquier usuario logueado */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 bg-blue-900 text-white p-4 rounded-full shadow-lg hover:bg-blue-800 transition z-50 flex items-center gap-2"
      >
        <MessageCircle size={24} />
        <span className="text-sm font-medium hidden sm:inline">Soporte</span>
      </button>
    </div>
  );
}