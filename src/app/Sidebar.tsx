import { User, Heart, LogOut, X, Home } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onPerfil: () => void;
  onFavoritos: () => void;
  onLogout: () => void;
  onHome: () => void;
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  onPerfil, 
  onFavoritos, 
  onLogout,
  onHome 
}: SidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-blue-900">Menú</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => { 
                onHome(); 
                onClose(); 
              }} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              <Home size={20} />
              <span>Inicio</span>
            </button>

            <button 
              onClick={() => { 
                onPerfil(); 
                onClose(); 
              }} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              <User size={20} />
              <span>Mi Perfil</span>
            </button>

            <button 
              onClick={() => { 
                onFavoritos(); 
                onClose(); 
              }} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              <Heart size={20} />
              <span>Mis Favoritos</span>
            </button>

            <div className="border-t my-4" />

            <button 
              onClick={() => { 
                onLogout(); 
                onClose(); 
              }} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition text-red-600"
            >
              <LogOut size={20} />
              <span>Cerrar sesión</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}