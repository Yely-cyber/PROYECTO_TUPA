import { mockTramites } from '../data/mockTramites';
import { getCategoriesForRole } from '../data/mockCategories';

// Envuelto en Promise a propósito: mantiene la misma forma que tendrá la
// llamada real (fetch/axios) cuando el backend de `catalog` esté listo,
// para no tener que tocar los componentes ni el hook `useCatalog` al migrar.

export const getCategories = async (role) => getCategoriesForRole(role);

export const getTramitesByRole = async (role) => mockTramites.filter((tramite) => tramite.role === role);