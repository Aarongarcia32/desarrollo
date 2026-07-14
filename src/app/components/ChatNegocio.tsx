// src/app/components/ChatNegocio.tsx
import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Check, CheckCheck } from 'lucide-react';
import { chatService, MensajeChat } from '../../services/chat.service';
import { filterBadWords, containsBadWords } from '../../utils/badWords';

interface ChatNegocioProps {
  onClose: () => void;
  negocioId: string;
  negocioNombre: string;
  usuarioId: string;
  usuarioNombre: string;
}

export default function ChatNegocio({ onClose, negocioId, negocioNombre, usuarioId, usuarioNombre }: ChatNegocioProps) {
  const [mensajes, setMensajes] = useState<MensajeChat[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cargarMensajes();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const cargarMensajes = async () => {
    try {
      setLoading(true);
      const data = await chatService.obtenerPorNegocio(negocioId);
      setMensajes(data);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnviar = async () => {
    if (!nuevoMensaje.trim()) return;

    // Detectar malas palabras
    if (containsBadWords(nuevoMensaje)) {
      setError('⚠️ El mensaje contiene palabras inapropiadas');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setEnviando(true);
    setError('');

    const mensajeLimpio = filterBadWords(nuevoMensaje.trim());

    try {
      const resultado = await chatService.enviar({
        usuario_id: usuarioId,
        usuario_nombre: usuarioNombre,
        mensaje: mensajeLimpio,
        negocio_id: negocioId,
        negocio_nombre: negocioNombre
      });

      if (resultado) {
        setMensajes([...mensajes, resultado]);
        setNuevoMensaje('');
      } else {
        setError('❌ Error al enviar mensaje');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('❌ Error al enviar mensaje');
    } finally {
      setEnviando(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    const hoy = new Date();
    if (date.toDateString() === hoy.toDateString()) {
      return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-blue-900 text-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} />
            <div>
              <h3 className="font-semibold">Chat con {negocioNombre}</h3>
              <p className="text-xs opacity-75">Soporte al negocio</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-blue-800 p-1 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ maxHeight: '400px' }}>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
            </div>
          ) : mensajes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
              <p>No hay mensajes aún</p>
              <p className="text-sm">Escribe tu consulta para el administrador</p>
            </div>
          ) : (
            mensajes.map((msg, index) => (
              <div key={msg.id || index}>
                {msg.usuario_id === usuarioId ? (
                  // Mensaje del negocio (derecha)
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-br-none px-4 py-2 max-w-[80%]">
                      <p className="text-sm">{msg.mensaje}</p>
                      <p className="text-[10px] opacity-70 mt-1 text-right">{formatearFecha(msg.created_at!)}</p>
                    </div>
                  </div>
                ) : (
                  // Mensaje del admin (izquierda)
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2 max-w-[80%] shadow-sm">
                      <p className="text-sm font-semibold text-blue-600 mb-0.5">🛡️ Administrador</p>
                      <p className="text-sm text-gray-800">{msg.mensaje}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{formatearFecha(msg.created_at!)}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white rounded-b-2xl">
          {error && (
            <div className="text-red-500 text-sm mb-2 text-center">{error}</div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleEnviar()}
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={enviando}
            />
            <button
              onClick={handleEnviar}
              disabled={!nuevoMensaje.trim() || enviando}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                !nuevoMensaje.trim() || enviando
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-900 hover:bg-blue-800 text-white'
              }`}
            >
              {enviando ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Los mensajes son revisados por el administrador
          </p>
        </div>
      </div>
    </div>
  );
}