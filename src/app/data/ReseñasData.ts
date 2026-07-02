// src/app/data/ReseñasData.ts
export interface Reseña {
  id: string;
  negocioId: string;
  usuarioId: string;
  usuarioNombre: string;
  calificacion: number; // 1-5
  comentario: string;
  fecha: string;
  imagenes?: string[]; // Para futuras implementaciones
  util?: number; // Votos de utilidad
}

// Reseñas de ejemplo para mostrar
export const RESEÑAS_EJEMPLO: Reseña[] = [
  {
    id: "res_001",
    negocioId: "biz_001",
    usuarioId: "user_001",
    usuarioNombre: "María González",
    calificacion: 5,
    comentario: "Excelente servicio, la comida es deliciosa y el ambiente es muy agradable. Definitivamente volveré.",
    fecha: "2024-01-20T14:30:00Z",
  },
  {
    id: "res_002",
    negocioId: "biz_001",
    usuarioId: "user_002",
    usuarioNombre: "Carlos Pérez",
    calificacion: 4,
    comentario: "Muy buena atención, los precios son accesibles. Solo faltaría más variedad en el menú.",
    fecha: "2024-01-18T10:00:00Z",
  },
  {
    id: "res_003",
    negocioId: "biz_002",
    usuarioId: "user_003",
    usuarioNombre: "Ana Martínez",
    calificacion: 5,
    comentario: "Hotel increíble, vistas espectaculares y excelente servicio al cliente.",
    fecha: "2024-01-15T09:00:00Z",
  },
  {
    id: "res_004",
    negocioId: "biz_003",
    usuarioId: "user_004",
    usuarioNombre: "Roberto Sánchez",
    calificacion: 5,
    comentario: "El mejor tour que he tomado. Los guías son muy conocedores y atentos.",
    fecha: "2024-01-12T16:00:00Z",
  }
];

// Funciones para manejar reseñas
export const cargarReseñasEjemplo = () => {
  const reseñasExistentes = localStorage.getItem("reseñas");
  
  if (!reseñasExistentes) {
    localStorage.setItem("reseñas", JSON.stringify(RESEÑAS_EJEMPLO));
    console.log("✅ Reseñas de ejemplo cargadas:", RESEÑAS_EJEMPLO.length);
    return true;
  }
  return false;
};

export const obtenerReseñas = (): Reseña[] => {
  const reseñas = localStorage.getItem("reseñas");
  if (reseñas) {
    return JSON.parse(reseñas);
  }
  return [];
};

export const obtenerReseñasPorNegocio = (negocioId: string): Reseña[] => {
  const reseñas = obtenerReseñas();
  return reseñas.filter(r => r.negocioId === negocioId);
};

export const obtenerReseñaUsuario = (negocioId: string, usuarioId: string): Reseña | null => {
  const reseñas = obtenerReseñas();
  return reseñas.find(r => r.negocioId === negocioId && r.usuarioId === usuarioId) || null;
};

export const agregarReseña = (reseña: Omit<Reseña, 'id' | 'fecha'>): Reseña => {
  const reseñas = obtenerReseñas();
  
  const nuevaReseña: Reseña = {
    ...reseña,
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
  };
  
  reseñas.push(nuevaReseña);
  localStorage.setItem("reseñas", JSON.stringify(reseñas));
  return nuevaReseña;
};

export const eliminarReseña = (id: string): boolean => {
  const reseñas = obtenerReseñas();
  const filtradas = reseñas.filter(r => r.id !== id);
  if (filtradas.length !== reseñas.length) {
    localStorage.setItem("reseñas", JSON.stringify(filtradas));
    return true;
  }
  return false;
};

export const actualizarCalificacionNegocio = (negocioId: string) => {
  const reseñas = obtenerReseñasPorNegocio(negocioId);
  if (reseñas.length === 0) return null;
  
  const total = reseñas.reduce((sum, r) => sum + r.calificacion, 0);
  const promedio = total / reseñas.length;
  
  // Actualizar el negocio en localStorage
  const negocios = JSON.parse(localStorage.getItem("businesses") || "[]");
  const negocioIndex = negocios.findIndex((n: any) => n.id === negocioId);
  if (negocioIndex !== -1) {
    negocios[negocioIndex].calificacion = Math.round(promedio * 10) / 10;
    localStorage.setItem("businesses", JSON.stringify(negocios));
  }
  
  return promedio;
};