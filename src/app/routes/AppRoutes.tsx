// src/app/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import { Usuarios } from "../pages/Usuarios";
import Negocios from "../pages/Negocios";
import Comentarios from "../pages/Comentarios";
import Configuracion from "../pages/Configuracion";
import Perfil from "../pages/Perfil";
import ChatAdmin from "../pages/ChatAdmin";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="negocios" element={<Negocios />} />
        <Route path="comentarios" element={<Comentarios />} />
        <Route path="configuracion" element={<Configuracion />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="chat" element={<ChatAdmin />} />
      </Route>
    </Routes>
  );
}