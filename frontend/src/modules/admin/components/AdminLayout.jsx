// src/modules/admin/components/AdminLayout.jsx
import { Link } from 'react-router-dom';

export const AdminLayout = ({ children, title }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Administrativo */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-5 font-bold text-lg border-b border-slate-800">TUPA Admin</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="block p-2 hover:bg-slate-800 rounded">Dashboard</Link>
          <Link to="/admin/tramites" className="block p-2 hover:bg-slate-800 rounded">Gestión Trámites</Link>
          <Link to="/admin/expedientes" className="block p-2 hover:bg-slate-800 rounded">Expedientes</Link>
          <Link to="/admin/categorias" className="block p-2 hover:bg-slate-800 rounded">Categorías</Link>
          <Link to="/admin/documentos" className="block p-2 hover:bg-slate-800 rounded">Documentos</Link>
        </nav>
      </aside>

      {/* Área de trabajo */}
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">{title}</h1>
        {children}
      </main>
    </div>
  );
};