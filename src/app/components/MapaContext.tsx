// src/app/context/MapaContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BusinessData, obtenerNegocios, filtrarNegocios, FiltrosBusqueda, obtenerCategorias } from '../data/NegociosEjemplo';

interface MapaContextType {
  negocios: BusinessData[];
  negociosFiltrados: BusinessData[];
  filtros: FiltrosBusqueda;
  setFiltros: (filtros: FiltrosBusqueda) => void;
  loading: boolean;
  categorias: string[];
  negocioSeleccionado: BusinessData | null;
  setNegocioSeleccionado: (negocio: BusinessData | null) => void;
  favoritos: string[];
  toggleFavorito: (id: string) => void;
  actualizarFiltros: () => void;
}

const MapaContext = createContext<MapaContextType | undefined>(undefined);

export function MapaProvider({ children }: { children: ReactNode }) {
  const [negocios, setNegocios] = useState<BusinessData[]>([]);
  const [negociosFiltrados, setNegociosFiltrados] = useState<BusinessData[]>([]);
  const [filtros, setFiltros] = useState<FiltrosBusqueda>({});
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [negocioSeleccionado, setNegocioSeleccionado] = useState<BusinessData | null>(null);
  const [favoritos, setFavoritos] = useState<string[]>([]);

  const cargarDatos = () => {
    try {
      const todos = obtenerNegocios();
      setNegocios(todos);
      
      const cats = obtenerCategorias(todos);
      setCategorias(cats);
      
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const favs = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]");
        setFavoritos(favs);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setLoading(false);
    }
  };

  const actualizarFiltros = () => {
    const filtrados = filtrarNegocios(negocios, filtros);
    setNegociosFiltrados(filtrados);
  };

  const toggleFavorito = (id: string) => {
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
      setFavoritos([...favoritos, id]);
    } else {
      favs = favs.filter((f: string) => f !== id);
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favs));
      setFavoritos(favs);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (negocios.length > 0) {
      actualizarFiltros();
    }
  }, [negocios, filtros]);

  return (
    <MapaContext.Provider value={{
      negocios,
      negociosFiltrados,
      filtros,
      setFiltros,
      loading,
      categorias,
      negocioSeleccionado,
      setNegocioSeleccionado,
      favoritos,
      toggleFavorito,
      actualizarFiltros
    }}>
      {children}
    </MapaContext.Provider>
  );
}

export const useMapa = () => {
  const context = useContext(MapaContext);
  if (context === undefined) {
    throw new Error('useMapa debe ser usado dentro de un MapaProvider');
  }
  return context;
};