// src/app/components/Mapa.tsx
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useState, useEffect, useCallback, useRef } from 'react';
import { X, MapPin, Navigation, ExternalLink, Star, Heart } from 'lucide-react';
// ✅ Cambiar: importar desde Supabase
import { negocioService, Negocio } from '../../services/negocio.service';
import DetalleNegocio from './DetalleNegocio';

interface MapaProps {
  onClose: () => void;
}

const GOOGLE_MAPS_API_KEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDVZmB_HMNSvEzspRxGfd_-7_OcMo4CnoU';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 21.1619,
  lng: -86.8515
};

// Coordenadas de los negocios
const ubicaciones: Record<string, { lat: number; lng: number }> = {
  "La Parrilla del Chef": { lat: 21.1619, lng: -86.8515 },
  "Hotel Caribe Sunset": { lat: 21.1375, lng: -86.7422 },
  "Aventuras Mayas Tours": { lat: 20.6296, lng: -87.0793 },
  "Spa del Mar": { lat: 20.5127, lng: -86.9448 },
  "Rent Car Cancún": { lat: 21.1619, lng: -86.8515 },
  "La Tienda del Pueblo": { lat: 20.6883, lng: -88.2002 },
  "Mariscos El Puerto": { lat: 20.8478, lng: -86.8775 },
  "Hotel Paraíso Maya": { lat: 20.6301, lng: -87.0787 },
  "Eco Tours Isla Mujeres": { lat: 21.2413, lng: -86.7398 },
  "Farmacia del Caribe": { lat: 21.1619, lng: -86.8515 },
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: true,
  fullscreenControl: true,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

// Función para crear iconos personalizados por categoría
const getMarkerIcon = (categoria: string, isSelected: boolean = false) => {
  const colors: Record<string, string> = {
    "Restaurante / Comida": "#ef4444",
    "Hotel / Hospedaje": "#3b82f6",
    "Tours y actividades": "#f59e0b",
    "Tienda / Retail": "#8b5cf6",
    "Spa / Belleza": "#ec4899",
    "Transporte": "#06b6d4",
    "Otro": "#6b7280",
  };

  const color = colors[categoria] || "#6b7280";
  const size = isSelected ? 50 : 40;
  const borderWidth = isSelected ? 3 : 2;

  return {
    url: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'%3E%3Ccircle cx='${size/2}' cy='${size/2}' r='${size/2 - 2}' fill='${color}' stroke='white' stroke-width='${borderWidth}'/%3E%3Ctext x='${size/2}' y='${size/2 + 6}' text-anchor='middle' fill='white' font-size='${size/2}' font-weight='bold'%3E${categoria === "Restaurante / Comida" ? "🍽" : categoria === "Hotel / Hospedaje" ? "🏨" : categoria === "Tours y actividades" ? "🗺" : categoria === "Tienda / Retail" ? "🛍" : categoria === "Spa / Belleza" ? "💆" : categoria === "Transporte" ? "🚗" : "📍"}%3C/text%3E%3C/svg%3E`,
    scaledSize: new google.maps.Size(size, size),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(size/2, size/2),
  };
};

export default function Mapa({ onClose }: MapaProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [selectedNegocio, setSelectedNegocio] = useState<Negocio | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [negocioSeleccionadoDetalle, setNegocioSeleccionadoDetalle] = useState<Negocio | null>(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [userPosition, setUserPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(12);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    cargarNegocios(); // Cargar negocios desde Supabase al montar el componente

   // Obtener favoritos del usuario actual
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    const user = JSON.parse(currentUser);
    const favs = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]");
    setFavorites(favs);
  }

  // Obtener ubicación del usuario
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserPosition(pos);
        setMapCenter(pos);
        setMapZoom(14);
      },
      () => {
        console.log('No se pudo obtener la ubicación');
      }
    );
  }
}, []);

// ✅ AGREGAR esta función después del useEffect
const cargarNegocios = async () => {
  try {
    const data = await negocioService.getAll();
    console.log('📊 Negocios desde Supabase:', data);
    
    // ✅ Verificar que cada negocio tenga coordenadas
    data.forEach(negocio => {
      console.log(`📍 ${negocio.nombre}: lat=${negocio.lat}, lng=${negocio.lng}`);
    });
    
    setNegocios(data);
  } catch (error) {
    console.error('❌ Error cargando negocios:', error);
  }
};

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds();
    
    negocios.forEach(negocio => {
      const ubicacion = ubicaciones[negocio.nombre];
      if (ubicacion) {
        bounds.extend(ubicacion);
      }
    });

    if (userPosition) {
      bounds.extend(userPosition);
    }

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
    }
    setMap(map);
  }, [negocios, userPosition]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = (negocio: Negocio) => {
    setSelectedNegocio(negocio);
    setShowInfoWindow(true);
  };

  const handleVerDetalle = (negocio: Negocio) => {
    setNegocioSeleccionadoDetalle(negocio);
    setMostrarDetalle(true);
    setShowInfoWindow(false);
  };

  const handleFavoritoToggle = (id: string) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      alert("⚠️ Inicia sesión para agregar favoritos");
      return;
    }
    const user = JSON.parse(currentUser);
    let favs = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]");
    
    if (!favs.includes(id)) {
      favs.push(id);
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favs));
      setFavorites(favs);
      alert("❤️ Agregado a favoritos");
    } else {
      favs = favs.filter((f: string) => f !== id);
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favs));
      setFavorites(favs);
      alert("❌ Eliminado de favoritos");
    }
  };

  const abrirEnGoogleMaps = (negocio: Negocio) => {
    const ubicacion = ubicaciones[negocio.nombre];
    if (ubicacion) {
      const url = `https://www.google.com/maps/search/?api=1&query=${ubicacion.lat},${ubicacion.lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(negocio.direccion)}`;
      window.open(url, '_blank');
    }
  };

  const centrarEnUbicacion = (negocio: Negocio) => {
    const ubicacion = ubicaciones[negocio.nombre];
    if (ubicacion && map) {
      map.panTo(ubicacion);
      map.setZoom(16);
      setSelectedNegocio(negocio);
      setShowInfoWindow(true);
    }
  };

  if (loadError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <p className="text-red-500 text-lg font-semibold">❌ Error al cargar el mapa</p>
          <p className="text-gray-500 mt-2">Verifica tu API Key de Google Maps</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-4 h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b bg-white shrink-0">
            <div className="flex items-center gap-3">
              <MapPin size={24} className="text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">📍 Mapa de Negocios</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                {negocios.length} negocios
              </span>
            </div>
            <div className="flex items-center gap-2">
              {userPosition && (
                <button
                  onClick={() => {
                    if (map && userPosition) {
                      map.panTo(userPosition);
                      map.setZoom(15);
                    }
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm transition"
                >
                  <Navigation size={16} />
                  Mi ubicación
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Mapa */}
          <div className="flex-1 relative bg-gray-100">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={mapZoom}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={options}
            >
              {/* Marcadores de negocios */}
              {negocios.map((negocio) => {
                const ubicacion = ubicaciones[negocio.nombre];
                if (!ubicacion) return null;

                const isSelected = selectedNegocio?.id === negocio.id;
                const isFavorite = favorites.includes(negocio.id);

                return (
                  <Marker
                    key={negocio.id}
                    position={ubicacion}
                    onClick={() => handleMarkerClick(negocio)}
                    icon={getMarkerIcon(negocio.categoria, isSelected)}
                    title={negocio.nombre}
                  />
                );
              })}

              {/* Ubicación del usuario */}
              {userPosition && (
                <Marker
                  position={userPosition}
                  icon={{
                    url: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%234285F4' stroke='white' stroke-width='2'/%3E%3Ccircle cx='16' cy='16' r='6' fill='white'/%3E%3C/svg%3E`,
                    scaledSize: new google.maps.Size(32, 32),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(16, 16),
                  }}
                />
              )}

              {/* InfoWindow */}
              {showInfoWindow && selectedNegocio && (
                <InfoWindow
                  position={ubicaciones[selectedNegocio.nombre]}
                  onCloseClick={() => setShowInfoWindow(false)}
                >
                  <div className="p-2 max-w-xs">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">{selectedNegocio.nombre}</h3>
                        <p className="text-xs text-gray-500">{selectedNegocio.giro}</p>
                      </div>
                      <button
                        onClick={() => handleFavoritoToggle(selectedNegocio.id)}
                        className="text-red-400 hover:text-red-600 transition"
                      >
                        <Heart size={18} className={favorites.includes(selectedNegocio.id) ? 'fill-red-500' : ''} />
                      </button>
                    </div>
                    
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {selectedNegocio.categoria}
                      </span>
                      {selectedNegocio.verificado && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          ✓ Verificado
                        </span>
                      )}
                      {selectedNegocio.calificacion && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Star size={10} className="fill-yellow-500" />
                          {selectedNegocio.calificacion}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleVerDetalle(selectedNegocio)}
                        className="flex-1 px-3 py-1.5 bg-blue-900 text-white text-xs rounded-lg hover:bg-blue-800 transition"
                      >
                        📋 Ver detalle
                      </button>
                      <button
                        onClick={() => abrirEnGoogleMaps(selectedNegocio)}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition flex items-center gap-1"
                      >
                        <ExternalLink size={12} />
                        Maps
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>

            {/* Leyenda de categorías */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">Categorías:</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { cat: "Restaurante / Comida", color: "#ef4444" },
                  { cat: "Hotel / Hospedaje", color: "#3b82f6" },
                  { cat: "Tours y actividades", color: "#f59e0b" },
                  { cat: "Tienda / Retail", color: "#8b5cf6" },
                  { cat: "Spa / Belleza", color: "#ec4899" },
                  { cat: "Transporte", color: "#06b6d4" },
                ].map((item) => (
                  <div key={item.cat} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                    <span className="text-[10px] text-gray-600">{item.cat.split('/')[0].trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer con lista de negocios */}
          <div className="p-3 border-t bg-white shrink-0 max-h-32 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {negocios.map((negocio) => (
                <button
                  key={negocio.id}
                  onClick={() => centrarEnUbicacion(negocio)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-full text-sm transition group"
                >
                  <span className="text-xs">{negocio.nombre}</span>
                  <ExternalLink size={10} className="text-blue-500 opacity-0 group-hover:opacity-100 transition" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalle */}
      {mostrarDetalle && negocioSeleccionadoDetalle && (
        <DetalleNegocio
          negocio={negocioSeleccionadoDetalle}
          onClose={() => {
            setMostrarDetalle(false);
            setNegocioSeleccionadoDetalle(null);
          }}
          onFavoritoToggle={handleFavoritoToggle}
        />
      )}
    </>
  );
}