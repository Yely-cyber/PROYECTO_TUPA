import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileStack,
  FolderOpen,
  Tags,
  FileArchive,
  LogOut,
  User,
  Bell,
} from "lucide-react";
import "../admin.css";
// AJUSTA esta ruta a donde vive tu logout()/getSession() real (authService.js).
import { getSession, logout } from "../../auth/services/authService";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/tramites", label: "Gestión de Trámites", icon: FileStack },
  { to: "/admin/expedientes", label: "Expedientes y Solicitudes", icon: FolderOpen },
  { to: "/admin/categorias", label: "Categorías", icon: Tags },
  { to: "/admin/documentos", label: "Gestión Documental", icon: FileArchive },
];

/**
 * Layout compartido por todas las páginas del panel administrativo:
 * sidebar de navegación + barra superior con el perfil del administrador.
 */
export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const session = getSession();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-root">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <div className="admin-brand-badge">O</div>
            <div>
              <div className="admin-brand-title">Panel Administrativo</div>
              <div className="admin-brand-sub">Gestión TUPA Digital</div>
            </div>
          </div>

          <nav className="admin-nav">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `admin-nav-item${isActive ? " active" : ""}`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <button className="admin-logout" onClick={handleLogout}>
            <LogOut size={16} /> Salir
          </button>
        </aside>

        <div className="admin-main">
          <header className="admin-topbar">
            <div className="admin-topbar-title">UNSAAC | TUPA Digital</div>
            <div className="admin-topbar-profile">
              <Bell size={18} />
              <div>
                <div style={{ fontWeight: 600 }}>{session?.nombre || "Administrador"}</div>
                <div style={{ opacity: 0.75, fontSize: 12 }}>{session?.email || ""}</div>
              </div>
              <div className="admin-topbar-avatar">
                <User size={16} />
              </div>
            </div>
          </header>

          <main className="admin-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
