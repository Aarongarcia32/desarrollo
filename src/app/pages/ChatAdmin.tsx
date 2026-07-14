// src/app/pages/ChatAdmin.tsx
import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chat.service';
import type { MensajeChat } from '../services/chat.service';
import { Send, MessageCircle, Users, RefreshCw } from 'lucide-react';

export default function ChatAdmin() {
  const [conversaciones, setConversaciones] = useState<any[]>([]);
  const [mensajes, setMensajes] = useState<MensajeChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [respuesta, setRespuesta] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cargarConversaciones();
    const interval = setInterval(cargarConversaciones, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const cargarConversaciones = async () => {
    try {
      setLoading(true);
      const data = await chatService.obtenerConversacionesAgrupadas();
      setConversaciones(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSeleccionarChat = async (chat: any) => {
    setSelectedChat(chat);
    const historial = await chatService.obtenerPorNegocio(chat.negocio_id);
    setMensajes(historial);
  };

  const handleResponder = async () => {
    if (!respuesta.trim() || !selectedChat) return;

    setEnviando(true);
    try {
      // Buscar el último mensaje de la conversación
      const ultimoMensaje = mensajes[mensajes.length - 1];
      if (ultimoMensaje) {
        const success = await chatService.responder(ultimoMensaje.id!, respuesta.trim(), 'admin');
        if (success) {
          setRespuesta('');
          const historial = await chatService.obtenerPorNegocio(selectedChat.negocio_id);
          setMensajes(historial);
          cargarConversaciones();
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setEnviando(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleString('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>💬 Chat con Negocios</h2>
          <p className="subtitle">Atiende las consultas de los negocios</p>
        </div>
        <button onClick={cargarConversaciones} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Lista de conversaciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
            <Users size={18} className="text-blue-600" />
            <h3 className="font-semibold">Conversaciones</h3>
            {conversaciones.length > 0 && (
              <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {conversaciones.length}
              </span>
            )}
          </div>
          <div className="overflow-y-auto" style={{ height: 'calc(100% - 56px)' }}>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
              </div>
            ) : conversaciones.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
                <p>No hay conversaciones</p>
                <p className="text-sm">Los negocios se comunicarán aquí</p>
              </div>
            ) : (
              conversaciones.map((chat) => (
                <div
                  key={chat.negocio_id}
                  onClick={() => handleSeleccionarChat(chat)}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition ${
                    selectedChat?.negocio_id === chat.negocio_id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{chat.negocio_nombre}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.ultimo_mensaje?.mensaje || 'Sin mensajes'}
                      </p>
                    </div>
                    {chat.no_leidos > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {chat.no_leidos}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {chat.ultimo_mensaje?.created_at ? formatearFecha(chat.ultimo_mensaje.created_at) : ''}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Conversación seleccionada */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-800">{selectedChat.negocio_nombre}</p>
                  <p className="text-sm text-gray-500">ID: {selectedChat.negocio_id}</p>
                  {selectedChat.no_leidos > 0 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      {selectedChat.no_leidos} no leídos
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ maxHeight: '400px' }}>
                {mensajes.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
                    <p>No hay mensajes en esta conversación</p>
                  </div>
                ) : (
                  mensajes.map((msg) => (
                    <div key={msg.id}>
                      {msg.respuesta ? (
                        <div className="flex justify-end">
                          <div className="bg-blue-600 text-white rounded-2xl rounded-br-none px-4 py-2 max-w-[80%]">
                            <p className="text-sm">{msg.respuesta}</p>
                            <p className="text-[10px] opacity-70 mt-1 text-right">
                              {formatearFecha(msg.respondido_at!)}
                            </p>
                          </div>
                        </div>
                      ) : msg.usuario_id ? (
                        <div className="flex justify-start">
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2 max-w-[80%] shadow-sm">
                            <p className="text-sm font-semibold text-blue-600 mb-0.5">
                              {msg.usuario_nombre}
                            </p>
                            <p className="text-sm text-gray-800">{msg.mensaje}</p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              {formatearFecha(msg.created_at!)}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={respuesta}
                    onChange={(e) => setRespuesta(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleResponder()}
                    placeholder="Escribe tu respuesta..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={enviando}
                  />
                  <button
                    onClick={handleResponder}
                    disabled={!respuesta.trim() || enviando}
                    className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                      !respuesta.trim() || enviando
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
                  Los mensajes se envían directamente al negocio
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
                <p>Selecciona una conversación</p>
                <p className="text-sm">Para atender las consultas de los negocios</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}