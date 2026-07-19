import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { chatService, MensajeChat } from '../../services/chat.service';
import { containsBadWords } from '../../utils/badWords';

interface ChatNegocioProps {
  onClose: () => void;
  negocioId: string;
  negocioNombre: string;
  usuarioId: string;
  usuarioNombre: string;
}

export default function ChatNegocio({
  onClose,
  negocioId,
  negocioNombre,
  usuarioId,
  usuarioNombre,
}: ChatNegocioProps) {
  const [mensajes, setMensajes] = useState<MensajeChat[]>([]);
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMensajes(await chatService.obtenerPorNegocio(negocioId));
      setLoading(false);
    })();

    // Realtime: los mensajes del admin aparecen solos.
    const cortar = chatService.suscribir(negocioId, (nuevo) => {
      setMensajes((prev) => (prev.some((m) => m.id === nuevo.id) ? prev : [...prev, nuevo]));
    });
    return cortar;
  }, [negocioId]);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const enviar = async () => {
    const t = texto.trim();
    if (!t || enviando) return;
    if (containsBadWords(t)) {
      setError('⚠️ El mensaje contiene palabras inapropiadas');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setEnviando(true);
    setError('');
    const nuevo = await chatService.enviar({
      negocio_id: negocioId,
      negocio_nombre: negocioNombre,
      usuario_id: usuarioId,
      usuario_nombre: usuarioNombre,
      mensaje: t,
    });
    if (nuevo) {
      setMensajes((prev) => (prev.some((m) => m.id === nuevo.id) ? prev : [...prev, nuevo]));
      setTexto('');
    } else {
      setError('❌ No se pudo enviar. Revisá la consola (F12).');
    }
    setEnviando(false);
  };

  const hora = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-blue-900 text-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} />
            <div>
              <h3 className="font-semibold">Soporte</h3>
              <p className="text-xs opacity-75">{negocioNombre}</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-blue-800 p-1 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50" style={{ maxHeight: '400px' }}>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
            </div>
          ) : mensajes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
              <p>No hay mensajes aún</p>
              <p className="text-sm">Escribe tu consulta para el administrador</p>
            </div>
          ) : (
            mensajes.map((m) =>
              m.remitente === 'negocio' ? (
                <div key={m.id} className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-2xl rounded-br-none px-4 py-2 max-w-[80%]">
                    <p className="text-sm whitespace-pre-wrap break-words">{m.mensaje}</p>
                    <p className="text-[10px] opacity-70 mt-1 text-right">{hora(m.created_at)}</p>
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2 max-w-[80%] shadow-sm">
                    <p className="text-sm font-semibold text-blue-600 mb-0.5">🛡️ Administrador</p>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{m.mensaje}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{hora(m.created_at)}</p>
                  </div>
                </div>
              ),
            )
          )}
          <div ref={finRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white rounded-b-2xl">
          {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
          <div className="flex gap-2">
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviar()}
              placeholder="Escribe tu mensaje..."
              maxLength={2000}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={enviando}
            />
            <button
              onClick={enviar}
              disabled={!texto.trim() || enviando}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                !texto.trim() || enviando ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800 text-white'
              }`}
            >
              {enviando ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
