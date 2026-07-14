import { Link } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Store,
  MessageSquare,
  FileText,
  Settings,
  User
} from "lucide-react";


export default function Sidebar(){

return (

<aside className="sidebar">

<h2>
👁️ Ojo al Negocio
</h2>


<nav>

<Link to="/">
<LayoutDashboard size={20}/>
Dashboard
</Link>


<Link to="/usuarios">
<Users size={20}/>
Usuarios
</Link>


<Link to="/negocios">
<Store size={20}/>
Negocios
</Link>


<Link to="/comentarios">
<MessageSquare size={20}/>
Comentarios
</Link>


<Link to="/configuracion">
<Settings size={20}/>
Configuración
</Link>


<Link to="/perfil">
<User size={20}/>
Perfil
</Link>


<Link to="/chat" className={location.pathname === '/chat' ? 'active' : ''}>
  <span className="icon">⚡</span>
  Chat
</Link>


</nav>

</aside>

);

}