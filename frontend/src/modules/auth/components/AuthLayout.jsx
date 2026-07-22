// src/modules/auth/components/AuthLayout.jsx
export const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Panel lateral decorativo */}
      <div className="hidden lg:flex lg:w-1/3 bg-blue-900 text-white p-8 flex-col justify-between">
        <h2 className="text-2xl font-bold">TUPA Digital</h2>
        <p className="text-sm opacity-80">Plataforma Digital de Trámites Académicos y Administrativos</p>
      </div>

      {/* Contenido dinámico según el registro */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 lg:px-12">
        <div className="max-w-md w-full mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};