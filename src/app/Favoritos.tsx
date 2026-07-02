// src/app/Favoritos.tsx
import { useState, useEffect } from "react";
import { Heart, X } from "lucide-react";
import { obtenerNegocios, BusinessData } from "./data/negociosEjemplo";

interface FavoritosProps {
  onClose: () => void;
}

export default function Favoritos({ onClose }: FavoritosProps) {
  const [favorites, setFavorites] = useState<BusinessData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const allBusinesses = obtenerNegocios();
        const userFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]");
        
        const favoriteBusinesses = allBusinesses.filter((biz: BusinessData) => 
          userFavorites.includes(biz.id)
        );
        
        setFavorites(favoriteBusinesses);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error cargando favoritos:", error);
      setLoading(false);
    }
  }, []);

  const removeFavorite = (businessId: string) => {
    try {
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const userFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]");
        const updatedFavorites = userFavorites.filter((id: string) => id !== businessId);
        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavorites));
        setFavorites(favorites.filter(biz => biz.id !== businessId));
        alert("❌ Eliminado de favoritos");
      }
    } catch (error) {
      console.error("Error eliminando favorito:", error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 p-8">
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando favoritos...</p>
            </div>
          </div>
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
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <Heart size={24} className="fill-red-500 text-red-500" />
            Mis Favoritos
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No tienes favoritos</h3>
            <p className="text-gray-400 mt-2">Explora negocios y guarda tus favoritos ❤️</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Tienes <span className="font-bold text-blue-900">{favorites.length}</span> negocios favoritos
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((business) => (
                <div
                  key={business.id}
                  className="border rounded-xl p-4 hover:shadow-lg transition-all hover:border-blue-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{business.nombre}</h3>
                      <p className="text-sm text-gray-500">{business.giro}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          {business.categoria}
                        </span>
                        {business.verificado && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            ✓ Verificado
                          </span>
                        )}
                        {business.calificacion && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                            ★ {business.calificacion}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFavorite(business.id)}
                      className="text-red-400 hover:text-red-600 transition"
                      title="Eliminar de favoritos"
                    >
                      <Heart size={20} className="fill-red-400" />
                    </button>
                  </div>
                  
                  <div className="mt-3 flex items-start gap-1 text-sm text-gray-500">
                    <span>📍</span>
                    <span>{business.direccion}</span>
                  </div>
                  
                  {business.telefono && (
                    <div className="mt-1 text-sm text-gray-500">
                      📞 {business.telefono}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}