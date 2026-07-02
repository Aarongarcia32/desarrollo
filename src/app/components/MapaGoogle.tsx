// src/app/components/MapaGoogle.tsx
/*
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useState, useEffect, useCallback, useRef } from 'react';
import { X, MapPin, Navigation, ExternalLink } from 'lucide-react';
import { obtenerNegocios, BusinessData } from '../data/NegociosEjemplo';
import DetalleNegocio from './DetalleNegocio';

interface MapaGoogleProps {
  onClose: () => void;
}

// Tu API Key de Google Maps (guárdala en variables de entorno)
const GOOGLE_MAPS_API_KEY = 'TU_API_KEY_AQUI';

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
};

export default function MapaGoogle({ onClose }: MapaGoogleProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [negocios, setNegocios] = useState<BusinessData[]>([]);
  const [selectedNegocio, setSelectedNegocio] = useState<BusinessData | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [negocioSeleccionadoDetalle, setNegocioSeleccionadoDetalle] = useState<BusinessData | null>(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [userPosition, setUserPosition] = useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    const todos = obtenerNegocios();
    setNegocios(todos);

    // Obtener ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log('No se pudo obtener la ubicación');
        }
      );
    }
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds();
    
    // Agregar todos los negocios al bounds
    negocios.forEach(negocio => {
      const ubicacion = ubicaciones[negocio.nombre];
      if (ubicacion) {
        bounds.extend(ubicacion);
      }
    });

    // Si hay ubicación del usuario, agregarla
    if (userPosition) {
      bounds.extend(userPosition);
    }

    map.fitBounds(bounds);
    setMap(map);
  }, [negocios, userPosition]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = (negocio: BusinessData) => {
    setSelectedNegocio(negocio);
    setShowInfoWindow(true);
  };

  const handleVerDetalle = (negocio: BusinessData) => {
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
    const favs = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]");
    if (!favs.includes(id)) {
      favs.push(id);
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favs));
      alert("❤️ Agregado a favoritos");
    } else {
      const newFavs = favs.filter((f: string) => f !== id);
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavs));
      alert("❌ Eliminado de favoritos");
    }
  };

  const abrirEnGoogleMaps = (negocio: BusinessData) => {
    const ubicacion = ubicaciones[negocio.nombre];
    if (ubicacion) {
      const url = `https://www.google.com/maps/search/?api=1&query=${ubicacion.lat},${ubicacion.lng}&query_place_id=${encodeURIComponent(negocio.nombre)}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(negocio.direccion)}`;
      window.open(url, '_blank');
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
          {/* Header */}/*
          <div className="flex justify-between items-center p-4 border-b bg-white shrink-0">
            <div className="flex items-center gap-3">
              <MapPin size={24} className="text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">Mapa de Negocios</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                {negocios.length} negocios
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mapa */}
          <div className="flex-1 relative bg-gray-100">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={userPosition || defaultCenter}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={options}
            >
              {/* Marcadores de negocios */}
              {negocios.map((negocio) => {
                const ubicacion = ubicaciones[negocio.nombre];
                if (!ubicacion) return null;

                const isSelected = selectedNegocio?.id === negocio.id;

                return (
                  <Marker
                    key={negocio.id}
                    position={ubicacion}
                    onClick={() => handleMarkerClick(negocio)}
                    icon={{
                      url: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='16' fill='%231E3A8A' stroke='white' stroke-width='2'/%3E%3Ctext x='20' y='24' text-anchor='middle' fill='white' font-size='16' font-weight='bold'%3E${negocio.nombre.charAt(0)}%3C/text%3E%3C/svg%3E`,
                      scaledSize: new google.maps.Size(40, 40),
                      origin: new google.maps.Point(0, 0),
                      anchor: new google.maps.Point(20, 20),
                    }}
                  />
                );
              })}

              {/* Ubicación del usuario */}
              {userPosition && (
                <Marker
                  position={userPosition}
                  icon={{
                    url: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='12' fill='%234285F4' stroke='white' stroke-width='2'/%3E%3Ccircle cx='16' cy='16' r='6' fill='white'/%3E%3C/svg%3E`,
                    scaledSize: new google.maps.Size(32, 32),
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
                    <h3 className="font-bold text-gray-800 text-sm">{selectedNegocio.nombre}</h3>
                    <p className="text-xs text-gray-500">{selectedNegocio.giro}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {selectedNegocio.categoria}
                      </span>
                      {selectedNegocio.verificado && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          ✓ Verificado
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleVerDetalle(selectedNegocio)}
                        className="flex-1 px-3 py-1 bg-blue-900 text-white text-xs rounded-lg hover:bg-blue-800 transition"
                      >
                        Ver detalle
                      </button>
                      <button
                        onClick={() => abrirEnGoogleMaps(selectedNegocio)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition flex items-center gap-1"
                      >
                        <ExternalLink size={12} />
                        Google Maps
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>

            {/* Controles */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-2">
              {userPosition && (
                <button
                  onClick={() => {
                    if (map && userPosition) {
                      map.panTo(userPosition);
                      map.setZoom(15);
                    }
                  }}
                  className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm"
                >
                  <Navigation size={16} className="text-blue-600" />
                  Mi ubicación
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t bg-white shrink-0 max-h-32 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {negocios.slice(0, 6).map((negocio) => (
                <button
                  key={negocio.id}
                  onClick={() => abrirEnGoogleMaps(negocio)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-full text-sm transition group"
                >
                  <span>{negocio.nombre}</span>
                  <ExternalLink size={12} className="text-blue-500 opacity-0 group-hover:opacity-100 transition" />
                </button>
              ))}
              {negocios.length > 6 && (
                <span className="text-xs text-gray-400 px-2 py-1.5">
                  +{negocios.length - 6} más
                </span>
              )}
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
*/ 