// Mock temporal para el resumen del Dashboard.
// Cuando el módulo `tracking` (Desarrollador 3) exponga el historial real
// de trámites vía `trackingService`, esto debe reemplazarse por esa fuente.

export const mockDashboardStats = [
	{
		key: 'total',
		label: 'Total trámites',
		value: 10,
		trend: '+2 este mes',
		trendTone: 'positive',
		icon: 'chart',
	},
	{
		key: 'revision',
		label: 'En revisión',
		value: 2,
		trend: '2 pendientes',
		trendTone: 'neutral',
		icon: 'clock',
	},
	{
		key: 'aprobados',
		label: 'Aprobados',
		value: 5,
		trend: '+15%',
		trendTone: 'positive',
		icon: 'check',
	},
	{
		key: 'observados',
		label: 'Observados',
		value: 1,
		trend: 'Req. atención',
		trendTone: 'negative',
		icon: 'alert',
	},
];

export const mockRecentActivity = [
	{ id: '4592', title: 'Certificado de Estudios', date: '15 oct. 2024', status: 'Aprobado' },
	{ id: '4591', title: 'Grados y Títulos', date: '14 oct. 2024', status: 'En revisión' },
	{ id: '4590', title: 'Carnet Universitario', date: '12 oct. 2024', status: 'Iniciado' },
];