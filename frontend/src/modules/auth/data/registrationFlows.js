import { mockCarreras, mockFacultades } from './mockFacultades';

const sharedContactStep = {
	key: 'contacto',
	label: 'Contacto',
	description: 'Completa los datos de contacto y confirma la información antes de continuar.',
	fields: [
		{ name: 'telefono', label: 'Teléfono', type: 'tel', placeholder: 'Ej. 987 654 321' },
		{ name: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Ingresa tu dirección', span: 2 },
		{ name: 'email', label: 'E-mail', type: 'email', placeholder: 'usuario@correo.com', span: 2 },
		{
			name: 'confirmacion',
			label: 'Confirmación',
			type: 'checkbox',
			description: 'Confirmo que la información ingresada es correcta.',
			required: false,
		},
	],
};

export const selectionProfiles = [
	{
		id: 'estudiante',
		title: 'Estudiante',
		description: 'Trámites académicos, certificados, carné universitario y servicios estudiantiles regulares.',
		href: '/registro/estudiante',
		icon: '🎓',
		tone: 'red',
	},
	{
		id: 'docente',
		title: 'Docente/Administrativo',
		description: 'Gestiones de personal, escalafón, licencias y procesos administrativos internos.',
		href: '/registro/docente',
		icon: '👤',
		tone: 'slate',
	},
	{
		id: 'dependencia',
		title: 'Dependencia',
		description: 'Gestión entre oficinas, solicitudes de presupuesto, requerimientos y trámites institucionales internos.',
		href: '/registro/dependencia',
		icon: '🏛️',
		tone: 'gold',
	},
	{
		id: 'institucion',
		title: 'Institución',
		description: 'Convenios, alianzas estratégicas, proveedores y entidades públicas o privadas externas.',
		href: '/registro/institucion',
		icon: '🏢',
		tone: 'red',
	},
	{
		id: 'general',
		title: 'Público General',
		description: 'Atención, consulta de estados, servicios culturales y trámites abiertos a la comunidad.',
		href: '/registro/general',
		icon: '🌐',
		tone: 'slate',
	},
	{
		id: 'externo',
		title: 'Usuario Externo',
		description: 'Expediente de otros interesados, investigadores y trámites específicos para personas ajenas a la UNSAAC.',
		href: '/registro/externo',
		icon: '🧾',
		tone: 'gold',
	},
];

export const registrationFlows = {
	estudiante: {
		profile: 'estudiante',
		title: 'Información del Estudiante',
		subtitle: 'Completa tus datos personales y académicos para acceder al sistema de trámites UNSAAC.',
		finishMessage: 'Registro de estudiante listo para continuar.',
		steps: [
			{
				key: 'datos-academicos',
				label: 'Datos académicos',
				description: 'Ingresa la información principal del estudiante.',
				fields: [
					{ name: 'codigo', label: 'Código', type: 'text', placeholder: 'Ej. 220252' },
					{ name: 'nombre_completo', label: 'Nombre completo', type: 'text', placeholder: 'Nombres y apellidos', span: 2 },
					{ name: 'facultad', label: 'Facultad', type: 'select', options: mockFacultades },
					{ name: 'carrera_profesional', label: 'Carrera profesional', type: 'select', options: mockCarreras },
				],
			},
			sharedContactStep,
		],
	},
	docente: {
		profile: 'docente',
		title: 'Información del Docente',
		subtitle: 'Registra los datos institucionales del personal docente o administrativo.',
		finishMessage: 'Registro del docente completado.',
		steps: [
			{
				key: 'datos-institucionales',
				label: 'Datos institucionales',
				description: 'Ingresa la información principal del docente.',
				fields: [
					{ name: 'dni', label: 'DNI', type: 'text', placeholder: 'Número de documento' },
					{ name: 'nombre_completo', label: 'Nombre completo', type: 'text', placeholder: 'Nombres y apellidos', span: 2 },
					{ name: 'categoria', label: 'Categoría', type: 'text', placeholder: 'Principal, asociado, auxiliar...' },
					{ name: 'dependencia', label: 'Dependencia', type: 'text', placeholder: 'Facultad, escuela, oficina o área', span: 2 },
				],
			},
			sharedContactStep,
		],
	},
	dependencia: {
		profile: 'dependencia',
		title: 'Información de la Dependencia',
		subtitle: 'Registra una oficina o unidad orgánica para gestionar trámites internos.',
		finishMessage: 'Registro de dependencia completado.',
		steps: [
			{
				key: 'datos-dependencia',
				label: 'Datos de la dependencia',
				description: 'Ingresa la información principal de la oficina o área.',
				fields: [
					{ name: 'dependencia', label: 'Dependencia', type: 'text', placeholder: 'Nombre de la dependencia', span: 2 },
				],
			},
			sharedContactStep,
		],
	},
	institucion: {
		profile: 'institucion',
		title: 'Información de la Institución',
		subtitle: 'Registra entidades, aliados o proveedores externos vinculados a la universidad.',
		finishMessage: 'Registro de institución completado.',
		steps: [
			{
				key: 'datos-institucion',
				label: 'Datos de la institución',
				description: 'Ingresa la información principal de la entidad.',
				fields: [
					{ name: 'ruc', label: 'RUC', type: 'text', placeholder: 'Número de RUC' },
					{ name: 'entidad', label: 'Entidad', type: 'text', placeholder: 'Nombre de la institución', span: 2 },
				],
			},
			sharedContactStep,
		],
	},
	general: {
		profile: 'general',
		title: 'Información del Público General',
		subtitle: 'Crea un acceso para ciudadanía, consultas y servicios abiertos al público.',
		finishMessage: 'Registro de usuario general completado.',
		steps: [
			{
				key: 'datos-personales',
				label: 'Datos personales',
				description: 'Ingresa la información principal del usuario.',
				fields: [
					{ name: 'dni', label: 'DNI', type: 'text', placeholder: 'Número de documento' },
					{ name: 'nombre_completo', label: 'Nombre completo', type: 'text', placeholder: 'Nombres y apellidos', span: 2 },
				],
			},
			sharedContactStep,
		],
	},
	externo: {
		profile: 'externo',
		title: 'Información del Usuario Externo',
		subtitle: 'Registra a una persona ajena a la UNSAAC que necesita ingresar a la plataforma.',
		finishMessage: 'Registro de usuario externo completado.',
		steps: [
			{
				key: 'datos-externos',
				label: 'Datos del externo',
				description: 'Completa la información principal del usuario externo.',
				fields: [
					{ name: 'documento', label: 'Pasaporte o DNI', type: 'text', placeholder: 'Pasaporte o DNI' },
					{ name: 'nombres', label: 'Nombres', type: 'text', placeholder: 'Nombres y apellidos', span: 2 },
				],
			},
			sharedContactStep,
		],
	},
};