// src/app/data/NegociosEjemplo.ts

export interface BusinessData {
  id: string;
  userId: string;
  nombre: string;
  rfc: string;
  giro: string;
  direccion: string;
  telefono: string;
  categoria: string;
  verificado: boolean;
  createdAt: string;
  calificacion?: number;
  descripcion?: string;
  horario?: string;
  ultimaReseña?: string; // 👈 NUEVO: fecha de la última reseña
  lat?: number;
  lng?: number;
  redes?: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

export const NEGOCIOS_EJEMPLO: BusinessData[] = [
  {
    id: "biz_001",
    userId: "user_001",
    nombre: "La Parrilla del Chef",
    rfc: "PARF850101ABC",
    giro: "Restaurante de Carnes",
    direccion: "Av. Tulum #123, Centro, Cancún, Q.Roo",
    telefono: "998-123-4567",
    categoria: "Restaurante / Comida",
    verificado: true,
    createdAt: "2024-01-15T10:00:00Z",
    calificacion: 4.8,
    descripcion: "El mejor restaurante de carnes en Cancún.",
    horario: "Lunes a Domingo 12:00 - 23:00",
    ultimaReseña: "2024-12-20T14:30:00Z",
    lat: 21.1619,
    lng: -86.8515,
    redes: {
      facebook: "@laparrilladelchef",
      instagram: "@laparrilladelchef",
      whatsapp: "9981234567"
    }
  },
  {
    id: "biz_002",
    userId: "user_002",
    nombre: "Hotel Caribe Sunset",
    rfc: "HOCA980202XYZ",
    giro: "Hotel Boutique",
    direccion: "Blvd. Kukulcan Km 9, Zona Hotelera, Cancún, Q.Roo",
    telefono: "998-234-5678",
    categoria: "Hotel / Hospedaje",
    verificado: true,
    createdAt: "2024-02-20T10:00:00Z",
    calificacion: 4.5,
    descripcion: "Hotel boutique con vista al mar Caribe.",
    horario: "Check-in 15:00 / Check-out 12:00",
    ultimaReseña: "2024-12-18T10:00:00Z",
    lat: 21.1375,
    lng: -86.7422,
    redes: {
      facebook: "@caribesunset",
      instagram: "@caribesunset",
      whatsapp: "9982345678"
    }
  },
  {
    id: "biz_003",
    userId: "user_003",
    nombre: "Aventuras Mayas Tours",
    rfc: "AMT780303DEF",
    giro: "Tours y Excursiones",
    direccion: "Calle 5 #456, El Centro, Playa del Carmen, Q.Roo",
    telefono: "984-345-6789",
    categoria: "Tours y actividades",
    verificado: true,
    createdAt: "2024-03-10T10:00:00Z",
    calificacion: 4.9,
    descripcion: "Descubre la magia de la cultura Maya.",
    horario: "Lunes a Domingo 08:00 - 20:00",
    ultimaReseña: "2024-12-22T16:00:00Z",
    lat: 20.6296,
    lng: -87.0793,
    redes: {
      facebook: "@aventurasmayas",
      instagram: "@aventurasmayas",
      whatsapp: "9843456789"
    }
  },
  {
    id: "biz_004",
    userId: "user_004",
    nombre: "Spa del Mar",
    rfc: "SPA890404GHI",
    giro: "Spa y Bienestar",
    direccion: "Av. Cozumel #789, Centro, Cozumel, Q.Roo",
    telefono: "987-456-7890",
    categoria: "Spa / Belleza",
    verificado: false,
    createdAt: "2024-04-05T10:00:00Z",
    calificacion: 4.2,
    descripcion: "Relájate con nuestros tratamientos de spa.",
    horario: "Lunes a Sábado 09:00 - 21:00",
    ultimaReseña: "2024-11-30T11:00:00Z",
    lat: 20.5127,
    lng: -86.9448,
    redes: {
      facebook: "@spadelmar",
      instagram: "@spadelmar",
      whatsapp: "9874567890"
    }
  },
  {
    id: "biz_005",
    userId: "user_005",
    nombre: "Rent Car Cancún",
    rfc: "RCC780505JKL",
    giro: "Renta de Autos",
    direccion: "Av. Bonampak #234, Centro, Cancún, Q.Roo",
    telefono: "998-567-8901",
    categoria: "Transporte",
    verificado: true,
    createdAt: "2024-05-12T10:00:00Z",
    calificacion: 4.0,
    descripcion: "Renta de autos en Cancún.",
    horario: "Lunes a Domingo 07:00 - 22:00",
    ultimaReseña: "2024-11-25T09:00:00Z",
    lat: 21.1619,
    lng: -86.8515,
    redes: {
      facebook: "@rentcarcancun",
      instagram: "@rentcarcancun",
      whatsapp: "9985678901"
    }
  },
  {
    id: "biz_006",
    userId: "user_006",
    nombre: "La Tienda del Pueblo",
    rfc: "LTP890606MNO",
    giro: "Tienda de Artesanías",
    direccion: "Calle 34 #567, Centro, Valladolid, Q.Roo",
    telefono: "985-678-9012",
    categoria: "Tienda / Retail",
    verificado: false,
    createdAt: "2024-06-18T10:00:00Z",
    calificacion: 4.3,
    descripcion: "Artesanías típicas de la región.",
    horario: "Lunes a Domingo 09:00 - 20:00",
    ultimaReseña: "2024-10-15T15:00:00Z",
    lat: 20.6883,
    lng: -88.2002,
    redes: {
      facebook: "@latiendadelpueblo",
      instagram: "@latiendadelpueblo"
    }
  },
  {
    id: "biz_007",
    userId: "user_007",
    nombre: "Mariscos El Puerto",
    rfc: "MEP890707PQR",
    giro: "Restaurante de Mariscos",
    direccion: "Paseo del Mar #890, Puerto Morelos, Q.Roo",
    telefono: "998-789-0123",
    categoria: "Restaurante / Comida",
    verificado: true,
    createdAt: "2024-07-22T10:00:00Z",
    calificacion: 4.7,
    descripcion: "Los mejores mariscos frescos del Caribe.",
    horario: "Martes a Domingo 11:00 - 22:00",
    ultimaReseña: "2024-12-19T13:00:00Z",
    lat: 20.8478,
    lng: -86.8775,
    redes: {
      facebook: "@mariscoselpuerto",
      instagram: "@mariscoselpuerto",
      whatsapp: "9987890123"
    }
  },
  {
    id: "biz_008",
    userId: "user_008",
    nombre: "Hotel Paraíso Maya",
    rfc: "HPM890808STU",
    giro: "Hotel Todo Incluido",
    direccion: "Av. Maya #123, Playacar, Playa del Carmen, Q.Roo",
    telefono: "984-890-1234",
    categoria: "Hotel / Hospedaje",
    verificado: true,
    createdAt: "2024-08-30T10:00:00Z",
    calificacion: 4.6,
    descripcion: "Hotel todo incluido con temática maya.",
    horario: "Check-in 15:00 / Check-out 12:00",
    ultimaReseña: "2024-12-21T12:00:00Z",
    lat: 20.6301,
    lng: -87.0787,
    redes: {
      facebook: "@paraisomaya",
      instagram: "@paraisomaya",
      whatsapp: "9848901234"
    }
  },
  {
    id: "biz_009",
    userId: "user_009",
    nombre: "Eco Tours Isla Mujeres",
    rfc: "ETI890909VWX",
    giro: "Tours Ecológicos",
    direccion: "Muelle de Isla Mujeres, Isla Mujeres, Q.Roo",
    telefono: "998-901-2345",
    categoria: "Tours y actividades",
    verificado: false,
    createdAt: "2024-09-14T10:00:00Z",
    calificacion: 4.1,
    descripcion: "Explora la belleza natural de Isla Mujeres.",
    horario: "Lunes a Domingo 08:00 - 18:00",
    ultimaReseña: "2024-11-10T08:00:00Z",
    lat: 21.2413,
    lng: -86.7398,
    redes: {
      facebook: "@ecotoursisla",
      instagram: "@ecotoursisla",
      whatsapp: "9989012345"
    }
  },
  {
    id: "biz_010",
    userId: "user_010",
    nombre: "Farmacia del Caribe",
    rfc: "FDC891010ABC",
    giro: "Farmacia",
    direccion: "Av. Tulum #456, Centro, Cancún, Q.Roo",
    telefono: "998-012-3456",
    categoria: "Otro",
    verificado: true,
    createdAt: "2024-10-28T10:00:00Z",
    calificacion: 4.4,
    descripcion: "Farmacia con servicio 24/7.",
    horario: "24 horas / 7 días",
    ultimaReseña: "2024-12-01T14:00:00Z",
    lat: 21.1619,
    lng: -86.8515,
    redes: {
      facebook: "@farmaciacaribe",
      whatsapp: "9980123456"
    }
  }
];

export const cargarNegociosEjemplo = () => {
  const negociosExistentes = localStorage.getItem("businesses");
  
  if (!negociosExistentes) {
    localStorage.setItem("businesses", JSON.stringify(NEGOCIOS_EJEMPLO));
    console.log("✅ Negocios de ejemplo cargados:", NEGOCIOS_EJEMPLO.length);
    return true;
  }
  
  const negocios = JSON.parse(negociosExistentes);
  if (negocios.length === 0) {
    localStorage.setItem("businesses", JSON.stringify(NEGOCIOS_EJEMPLO));
    console.log("✅ Negocios de ejemplo cargados:", NEGOCIOS_EJEMPLO.length);
    return true;
  }
  
  console.log("ℹ️ Ya existen negocios en el sistema:", negocios.length);
  return false;
};

export const obtenerNegocios = (): BusinessData[] => {
  const negocios = localStorage.getItem("businesses");
  if (negocios) {
    return JSON.parse(negocios);
  }
  return [];
};

export const obtenerNegocioPorId = (id: string): BusinessData | null => {
  const negocios = obtenerNegocios();
  return negocios.find(n => n.id === id) || null;
};

export const buscarNegocios = (termino: string): BusinessData[] => {
  const negocios = obtenerNegocios();
  const terminoLower = termino.toLowerCase();
  return negocios.filter(n => 
    n.nombre.toLowerCase().includes(terminoLower) ||
    n.giro.toLowerCase().includes(terminoLower) ||
    n.categoria.toLowerCase().includes(terminoLower) ||
    n.direccion.toLowerCase().includes(terminoLower)
  );
};

// ============ FILTROS AVANZADOS ============

export interface FiltrosBusqueda {
  calificacionMinima?: number;
  fechaUltimaReseña?: string; // fecha límite (ej: "2024-01-01")
  categoria?: string;
  termino?: string;
}

export const filtrarNegocios = (
  negocios: BusinessData[],
  filtros: FiltrosBusqueda
): BusinessData[] => {
  let resultado = [...negocios];

  // Filtrar por calificación mínima
  if (filtros.calificacionMinima && filtros.calificacionMinima > 0) {
    resultado = resultado.filter(
      n => (n.calificacion || 0) >= filtros.calificacionMinima!
    );
  }

  // Filtrar por fecha de última reseña
  if (filtros.fechaUltimaReseña) {
    const fechaLimite = new Date(filtros.fechaUltimaReseña);
    // Ajustar a fin del día para incluir toda la fecha
    fechaLimite.setHours(23, 59, 59, 999);
    
    resultado = resultado.filter(n => {
      if (!n.ultimaReseña) return false;
      const fechaReseña = new Date(n.ultimaReseña);
      return fechaReseña >= fechaLimite;
    });
  }

  // Filtrar por categoría
  if (filtros.categoria && filtros.categoria !== "Todas") {
    resultado = resultado.filter(n => n.categoria === filtros.categoria);
  }

  // Filtrar por término de búsqueda
  if (filtros.termino && filtros.termino.trim() !== "") {
    const terminoLower = filtros.termino.toLowerCase().trim();
    resultado = resultado.filter(n =>
      n.nombre.toLowerCase().includes(terminoLower) ||
      n.giro.toLowerCase().includes(terminoLower) ||
      n.direccion.toLowerCase().includes(terminoLower)
    );
  }

  return resultado;
};

// Obtener categorías únicas
export const obtenerCategorias = (negocios: BusinessData[]): string[] => {
  const categorias = new Set(negocios.map(n => n.categoria));
  return ["Todas", ...Array.from(categorias)];
};

// Obtener estadísticas de negocios
export const obtenerEstadisticas = (negocios: BusinessData[]) => {
  const total = negocios.length;
  const verificado = negocios.filter(n => n.verificado).length;
  const promedioCalificacion = negocios.reduce((acc, n) => acc + (n.calificacion || 0), 0) / total || 0;
  
  const categorias = negocios.reduce((acc, n) => {
    acc[n.categoria] = (acc[n.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    verificado,
    promedioCalificacion: Math.round(promedioCalificacion * 10) / 10,
    categorias
  };
};