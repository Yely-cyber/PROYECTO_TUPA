// Categorías de trámites por perfil, según la clasificación oficial
// proporcionada para el catálogo de "Nuevo Trámite".

export const TODAS_CATEGORIA = 'TODOS';

export const mockCategoriesByRole = {
	estudiante: [
		'ESCUELA DE POSTGRADO ESTUDIANTES',
		'FACULTADES ESTUDIANTES',
		'UNIDAD DE BIBLIOTECA ESTUDIANTES',
		'CENTRO DE CÓMPUTO',
		'DIRECCIÓN DE BIENESTAR UNIVERSITARIO',
		'DIRECCIÓN DE REGISTRO Y SERVICIOS ACADÉMICOS',
		'INSTITUTO DE IDIOMAS',
	],
	docente: [
		'UNIDAD DE BIBLIOTECA DOCENTES Y ADMINISTRATIVOS',
		'CENTRO DE CÓMPUTO',
		'DIRECCIÓN DE BIENESTAR UNIVERSITARIO',
		'DIRECCIÓN DE REGISTRO Y SERVICIOS ACADÉMICOS',
		'INSTITUTO DE IDIOMAS',
	],
	dependencia: ['RECTORADO - SECRETARIA GENERAL', 'CENTRO DE CÓMPUTO', 'DIRECCIÓN DE REGISTRO Y SERVICIOS ACADÉMICOS'],
	institucion: ['RECTORADO - SECRETARIA GENERAL', 'FACULTADES OTROS'],
	general: [
		'DIRECCIÓN GENERAL DE ADMISIÓN',
		'ESCUELA DE POSTGRADO ADMISIÓN Y TRASLADO EXTERNO',
		'FACULTADES OTROS',
		'RESIDENTADO MEDICO',
		'INSTITUTO DE IDIOMAS',
		'CENTRO DE CÓMPUTO',
	],
	// ⚠️ PROVISIONAL: no se especificó la lista oficial de categorías para
	// el perfil "externo". Se reutilizan categorías de "institución" como
	// aproximación temporal — reemplazar en cuanto se confirme la lista real.
	externo: ['RECTORADO - SECRETARIA GENERAL', 'FACULTADES OTROS'],
};

export const getCategoriesForRole = (role) => mockCategoriesByRole[role] || [];