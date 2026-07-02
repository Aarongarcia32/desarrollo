import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  Eye,
  EyeOff,
  Star,
  CheckCircle2,
  ChevronRight,
  MapPin,
} from "lucide-react";
import logoImg from "../imports/Captura_de_pantalla_2026-06-08_211927.png";
import Home from "./home";
import { cargarNegociosEjemplo } from "./data/NegociosEjemplo";
import { cargarReseñasEjemplo } from "./data/ReseñasData";

// ============ TIPOS ============
type Screen = "login" | "register" | "home";
type AccountType = "usuario" | "negocio";

interface UserData {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  accountType: AccountType;
  createdAt: string;
}

interface BusinessData {
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
  lat?: number;
  lng?: number;
}

const BUSINESS_CATEGORIES = [
  "Restaurante / Comida",
  "Hotel / Hospedaje",
  "Tours y actividades",
  "Tienda / Retail",
  "Spa / Belleza",
  "Transporte",
  "Otro",
];

// ============ COMPONENTES ============
function InputField({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  rightElement,
  error,
}: {
  icon: React.ElementType;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rightElement?: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="w-full">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Icon size={18} />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-11 pr-10 py-3 rounded-xl border ${
            error ? "border-red-500" : "border-border"
          } bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all`}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ============ PANTALLA DE LOGIN ============
function LoginScreen({ onSwitch, onLoginSuccess }: { onSwitch: () => void; onLoginSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Mostrar mensaje de registro exitoso
  useEffect(() => {
    const justRegistered = localStorage.getItem("justRegistered");
    if (justRegistered) {
      setSuccessMessage("✅ ¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.");
      localStorage.removeItem("justRegistered");
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  }, []);

  // Cargar credenciales recordadas
  useEffect(() => {
    const remembered = localStorage.getItem("rememberedUser");
    if (remembered) {
      const { email: rememberedEmail, password: rememberedPass } = JSON.parse(remembered);
      setEmail(rememberedEmail);
      setPassword(rememberedPass);
      setRemember(true);
    }
  }, []);

  const handleLogin = () => {
    setError("");
    setSuccessMessage("");
    
    const users: UserData[] = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      if (remember) {
        localStorage.setItem("rememberedUser", JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem("rememberedUser");
      }
      
      localStorage.setItem("currentUser", JSON.stringify(user));
      
      setEmail("");
      setPassword("");
      setRemember(false);
      
      onLoginSuccess();
    } else {
      setError("❌ Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-3xl shadow-xl shadow-black/8 p-8 md:p-10">
        <div className="flex flex-col items-center mb-8">
          <img src={logoImg} alt="Ojo al Negocio logo" className="w-24 h-24 object-contain" />
          <h1 className="mt-3 text-primary tracking-tight" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Ojo al Negocio
          </h1>
          <div className="flex gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill="#10B981" color="#10B981" />
            ))}
          </div>
        </div>

        <div className="text-center mb-7">
          <h2 className="text-foreground" style={{ fontSize: "1.375rem", fontWeight: 700 }}>
            Iniciar sesión
          </h2>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "0.9rem" }}>
            Bienvenido de vuelta
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl text-center text-sm">
            {successMessage}
          </div>
        )}

        <div className="space-y-4">
          <InputField
            icon={Mail}
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={setEmail}
            error={error}
          />
          <InputField
            icon={Lock}
            type={showPass ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={setPassword}
            rightElement={
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-muted-foreground hover:text-foreground transition-colors">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center gap-2 cursor-pointer select-none" style={{ fontSize: "0.875rem" }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-muted-foreground">Recordarme</span>
          </label>
          <button type="button" className="hover:underline transition-colors" style={{ fontSize: "0.875rem", color: "#10B981", fontWeight: 500 }}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          className="w-full mt-6 py-3.5 rounded-xl text-primary-foreground flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] shadow-md"
          style={{ background: "#1E3A8A", fontWeight: 600 }}
        >
          Ingresar
          <ChevronRight size={18} />
        </button>

        <p className="text-center mt-7 text-muted-foreground" style={{ fontSize: "0.875rem" }}>
          ¿No tienes cuenta?{" "}
          <button type="button" onClick={onSwitch} className="hover:underline font-semibold" style={{ color: "#1E3A8A" }}>
            Regístrate
          </button>
        </p>
      </div>

      <div className="flex justify-center gap-5 mt-5">
        {["Términos de uso", "Aviso de privacidad"].map((t) => (
          <button key={t} type="button" className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: "0.78rem" }}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ PANTALLA DE REGISTRO ============
function RegisterScreen({ onSwitch, onRegisterSuccess }: { onSwitch: () => void; onRegisterSuccess: () => void }) {
  const [accountType, setAccountType] = useState<AccountType>("usuario");
  const [showPass, setShowPass] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  // User fields
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");

  // Business fields
  const [bizNombre, setBizNombre] = useState("");
  const [bizRfc, setBizRfc] = useState("");
  const [bizGiro, setBizGiro] = useState("");
  const [bizDir, setBizDir] = useState("");
  const [bizTel, setBizTel] = useState("");
  const [businessCoords, setBusinessCoords] = useState<{ lat: number; lng: number } | null>(null);

  const isNegocio = accountType === "negocio";

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!email.trim()) newErrors.email = "El correo es requerido";
    if (!email.includes("@")) newErrors.email = "Correo inválido";
    if (!tel.trim()) newErrors.tel = "El teléfono es requerido";
    if (password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    
    const users: UserData[] = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some(u => u.email === email)) {
      newErrors.email = "Este correo ya está registrado";
    }
    
    if (isNegocio) {
      if (!bizNombre.trim()) newErrors.bizNombre = "El nombre del negocio es requerido";
      if (!bizRfc.trim()) newErrors.bizRfc = "El RFC es requerido";
      if (bizRfc.length < 12) newErrors.bizRfc = "RFC inválido (mínimo 12 caracteres)";
      if (!bizDir.trim()) newErrors.bizDir = "La dirección es requerida";
      if (!selectedCategory) newErrors.categoria = "Selecciona una categoría";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validateForm()) return;
    
    const users: UserData[] = JSON.parse(localStorage.getItem("users") || "[]");
    const businesses: BusinessData[] = JSON.parse(localStorage.getItem("businesses") || "[]");
    
    const newUser: UserData = {
      id: generateId(),
      nombre,
      email,
      telefono: tel,
      password,
      accountType,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    if (isNegocio) {
      // Generar coordenadas aleatorias cerca de Cancún si no se seleccionaron
      const lat = businessCoords?.lat || 21.1619 + (Math.random() - 0.5) * 0.05;
      const lng = businessCoords?.lng || -86.8515 + (Math.random() - 0.5) * 0.05;
      
      const newBusiness: BusinessData = {
        id: generateId(),
        userId: newUser.id,
        nombre: bizNombre,
        rfc: bizRfc,
        giro: bizGiro,
        direccion: bizDir,
        telefono: bizTel,
        categoria: selectedCategory,
        verificado: false,
        createdAt: new Date().toISOString(),
        lat: lat,
        lng: lng,
      };
      businesses.push(newBusiness);
      localStorage.setItem("businesses", JSON.stringify(businesses));
    }
    
    // Limpiar formulario
    setNombre("");
    setEmail("");
    setTel("");
    setPassword("");
    setBizNombre("");
    setBizRfc("");
    setBizGiro("");
    setBizDir("");
    setBizTel("");
    setSelectedCategory("");
    setAccountType("usuario");
    setBusinessCoords(null);
    
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    
    setSuccessMessage(`✅ ¡Cuenta creada exitosamente${isNegocio ? " y negocio registrado" : ""}!`);
    
    setTimeout(() => {
      setSuccessMessage("");
      onRegisterSuccess();
    }, 1500);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-card rounded-3xl shadow-xl shadow-black/8 p-8 md:p-10">
        <div className="flex flex-col items-center mb-6">
          <img src={logoImg} alt="Ojo al Negocio logo" className="w-20 h-20 object-contain" />
          <h1 className="mt-2 text-primary tracking-tight" style={{ fontSize: "1.375rem", fontWeight: 700 }}>
            Ojo al Negocio
          </h1>
          <div className="flex gap-0.5 mt-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} fill="#10B981" color="#10B981" />
            ))}
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-foreground" style={{ fontSize: "1.375rem", fontWeight: 700 }}>
            Crear cuenta
          </h2>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>
            Únete a la comunidad de reseñas verificadas
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl text-center text-sm">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          {(["usuario", "negocio"] as const).map((type) => {
            const active = accountType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setAccountType(type)}
                className={`rounded-2xl p-4 border-2 text-left transition-all ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-border bg-muted/50 text-foreground hover:border-primary/40"
                }`}
              >
                <div className="flex justify-center mb-2">
                  {type === "usuario" ? (
                    <User size={28} className={active ? "opacity-100" : "text-muted-foreground"} />
                  ) : (
                    <Building2 size={28} className={active ? "opacity-100" : "text-muted-foreground"} />
                  )}
                </div>
                <p className="text-center font-semibold capitalize" style={{ fontSize: "0.925rem" }}>
                  {type === "usuario" ? "Usuario" : "Negocio"}
                </p>
                <p className={`text-center mt-1 leading-snug ${active ? "opacity-80" : "text-muted-foreground"}`} style={{ fontSize: "0.75rem" }}>
                  {type === "usuario"
                    ? "Turista o residente que consulta y publica reseñas."
                    : "Dueño o representante de un establecimiento local."}
                </p>
              </button>
            );
          })}
        </div>

        <div className="space-y-3.5">
          <InputField icon={User} placeholder="Nombre completo" value={nombre} onChange={setNombre} error={errors.nombre} />
          <InputField icon={Mail} type="email" placeholder="Correo electrónico" value={email} onChange={setEmail} error={errors.email} />
          <InputField icon={Phone} type="tel" placeholder="Número de celular" value={tel} onChange={setTel} error={errors.tel} />
          <InputField
            icon={Lock}
            type={showPass ? "text" : "password"}
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={password}
            onChange={setPassword}
            error={errors.password}
            rightElement={
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-muted-foreground hover:text-foreground transition-colors">
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            }
          />
        </div>

        {isNegocio && (
          <div className="mt-6 rounded-2xl p-5 border" style={{ background: "#ECFDF5", borderColor: "#6EE7B7" }}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={18} color="#10B981" />
              <h3 className="font-semibold" style={{ fontSize: "0.95rem", color: "#065F46" }}>
                Datos del negocio
              </h3>
            </div>

            <div className="space-y-3">
              <InputField icon={Building2} placeholder="Nombre del negocio" value={bizNombre} onChange={setBizNombre} error={errors.bizNombre} />
              <InputField icon={CheckCircle2} placeholder="RFC del negocio" value={bizRfc} onChange={setBizRfc} error={errors.bizRfc} />
              <InputField icon={Star} placeholder="Giro del negocio" value={bizGiro} onChange={setBizGiro} />
              <InputField icon={MapPin} placeholder="Dirección" value={bizDir} onChange={setBizDir} error={errors.bizDir} />
              <InputField icon={Phone} type="tel" placeholder="Teléfono del negocio" value={bizTel} onChange={setBizTel} />
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium mb-2" style={{ color: "#065F46", fontSize: "0.82rem" }}>
                Categoría del negocio
              </p>
              <div className="flex flex-wrap gap-2">
                {BUSINESS_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? "border-accent bg-accent text-accent-foreground shadow-sm"
                        : "border-[#6EE7B7] bg-white text-[#065F46] hover:bg-[#D1FAE5]"
                    }`}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>}
            </div>

            <div className="mt-4 flex gap-2.5 p-3 rounded-xl bg-white/70 border border-[#A7F3D0]">
              <MapPin size={16} color="#10B981" className="shrink-0 mt-0.5" />
              <p style={{ fontSize: "0.75rem", color: "#047857", lineHeight: "1.5" }}>
                Para verificar tu negocio se solicitarán datos oficiales. Solo se aceptan establecimientos ubicados en{" "}
                <strong>Quintana Roo</strong>.
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleRegister}
          className="w-full mt-6 py-3.5 rounded-xl text-primary-foreground flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] shadow-md"
          style={{ background: "#1E3A8A", fontWeight: 600, fontSize: "0.9rem" }}
        >
          {isNegocio ? "Crear cuenta y solicitar verificación" : "Crear cuenta"}
          <ChevronRight size={18} />
        </button>

        <p className="text-center mt-6 text-muted-foreground" style={{ fontSize: "0.875rem" }}>
          ¿Ya tienes cuenta?{" "}
          <button type="button" onClick={onSwitch} className="hover:underline font-semibold" style={{ color: "#1E3A8A" }}>
            Iniciar sesión
          </button>
        </p>
      </div>

      <div className="flex justify-center gap-5 mt-5">
        {["Términos de uso", "Aviso de privacidad"].map((t) => (
          <button key={t} type="button" className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: "0.78rem" }}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ APP PRINCIPAL ============
export default function App() {
  const [screen, setScreen] = useState<Screen>("login");

  // Cargar datos de ejemplo y verificar sesión al iniciar
  useEffect(() => {
    cargarNegociosEjemplo();
    cargarReseñasEjemplo();
    
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setScreen("home");
    }
  }, []);

  const handleLoginSuccess = () => {
    setScreen("home");
  };

  const handleRegisterSuccess = () => {
    setScreen("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rememberedUser");
    setScreen("login");
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center py-10 px-4"
      style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F9FAFB 50%, #ECFDF5 100%)" }}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-10" style={{ background: "#1E3A8A" }} />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-8" style={{ background: "#10B981" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5" style={{ border: "2px solid #1E3A8A" }} />
      </div>

      <div className="relative z-10 w-full">
        {screen === "login" && (
          <LoginScreen 
            onSwitch={() => setScreen("register")} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        {screen === "register" && (
          <RegisterScreen 
            onSwitch={() => setScreen("login")} 
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}
        {screen === "home" && (
          <Home onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}