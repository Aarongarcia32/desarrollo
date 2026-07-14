// src/app/data/ReseñasData.ts
import { resenaService } from "../../services/resena.service"; // ← RUTA CORREGIDA

export interface Reseña {
  id: string;
  negocioId: string;
  usuarioId: string;
  usuarioNombre: string;
  calificacion: number;
  comentario: string;
  fecha: string;
}

const RESEÑAS_KEY = "reseñas";

// ==========================================
// FUNCIONES EXISTENTES
// ==========================================

const generarId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// Cargar reseñas de ejemplo (solo si no hay datos)
export const cargarReseñasEjemplo = () => {
  const reseñas = obtenerReseñas();
  if (reseñas.length > 0) return;

  const ejemplo: Reseña[] = [
    {
      id: "r1",
      negocioId: "n1",
      usuarioId: "u1",
      usuarioNombre: "María González",
      calificacion: 5,
      comentario: "Excelente servicio, muy recomendado. La atención fue increíble.",
      fecha: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "r2",
      negocioId: "n1",
      usuarioId: "u2",
      usuarioNombre: "Carlos Pérez",
      calificacion: 4,
      comentario: "Buena comida, pero el precio es un poco alto.",
      fecha: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  localStorage.setItem(RESEÑAS_KEY, JSON.stringify(ejemplo));
};

// Obtener todas las reseñas
export const obtenerReseñas = (): Reseña[] => {
  const reseñas = localStorage.getItem(RESEÑAS_KEY);
  if (!reseñas) return [];
  try {
    return JSON.parse(reseñas);
  } catch {
    return [];
  }
};

// Obtener reseñas de un negocio específico
export const obtenerReseñasPorNegocio = (negocioId: string): Reseña[] => {
  const reseñas = obtenerReseñas();
  return reseñas.filter(r => r.negocioId === negocioId);
};

// Obtener reseña de un usuario para un negocio específico
export const obtenerReseñaUsuario = (negocioId: string, usuarioId: string): Reseña | null => {
  const reseñas = obtenerReseñas();
  return reseñas.find(r => r.negocioId === negocioId && r.usuarioId === usuarioId) || null;
};

// ✅ MODIFICADA: Agregar una nueva reseña
export const agregarReseña = (datos: Omit<Reseña, "id" | "fecha">): Reseña => {
  const reseñas = obtenerReseñas();
  
  const nuevaReseña: Reseña = {
    id: generarId(),
    ...datos,
    fecha: new Date().toISOString(),
  };
  
  // 1. Guardar en localStorage
  reseñas.unshift(nuevaReseña);
  localStorage.setItem(RESEÑAS_KEY, JSON.stringify(reseñas));
  
  // 2. ✅ Enviar a Supabase
  resenaService.guardar(nuevaReseña);
  
  return nuevaReseña;
};

// Actualizar calificación promedio de un negocio
export const actualizarCalificacionNegocio = (negocioId: string) => {
  const reseñas = obtenerReseñasPorNegocio(negocioId);
  if (reseñas.length === 0) return;
  
  const total = reseñas.reduce((sum, r) => sum + r.calificacion, 0);
  const promedio = total / reseñas.length;
  
  // Actualizar el negocio en localStorage
  const negocios = JSON.parse(localStorage.getItem('businesses') || '[]');
  const negocioIndex = negocios.findIndex((n: any) => n.id === negocioId);
  if (negocioIndex !== -1) {
    negocios[negocioIndex].calificacion = promedio;
    localStorage.setItem('businesses', JSON.stringify(negocios));
  }
};