// src/modules/catalog/pages/CatalogPage.jsx
import { useState } from 'react';
import { RoleFilterTabs } from '../components/RoleFilterTabs';
import { CatalogGrid } from '../components/CatalogGrid';
import { SearchBar } from '../components/SearchBar';
import { useCatalog } from '../hooks/useCatalog';

export const CatalogPage = () => {
  // Maneja el rol seleccionado: 'estudiantes' | 'docentes' | 'externos' | etc.
  const [selectedRole, setSelectedRole] = useState('estudiantes');
  const { tramites, loading, search, setSearch } = useCatalog(selectedRole);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Catálogo de Trámites</h1>
      
      {/* Buscador de trámites */}
      <SearchBar value={search} onChange={setSearch} />

      {/* Pestañas para alternar entre Figuras 10 a 15 */}
      <RoleFilterTabs 
        activeRole={selectedRole} 
        onSelectRole={(role) => setSelectedRole(role)} 
      />

      {/* Tarjetas de trámites según el rol seleccionado */}
      <CatalogGrid items={tramites} isLoading={loading} />
    </div>
  );
};