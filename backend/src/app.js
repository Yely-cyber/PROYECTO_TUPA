const express = require('express');
const fs = require('fs');
const path = require('path');

const loadEnvFile = () => {
	const envPath = path.join(__dirname, '..', '.env');
	if (!fs.existsSync(envPath)) {
		return;
	}

	const envContents = fs.readFileSync(envPath, 'utf8');
	envContents.split(/\r?\n/).forEach((line) => {
		const trimmedLine = line.trim();
		if (!trimmedLine || trimmedLine.startsWith('#') || !trimmedLine.includes('=')) {
			return;
		}

		const separatorIndex = trimmedLine.indexOf('=');
		const key = trimmedLine.slice(0, separatorIndex).trim();
		const value = trimmedLine.slice(separatorIndex + 1).trim();

		if (key && !(key in process.env)) {
			process.env[key] = value;
		}
	});
};

loadEnvFile();
console.log('DB_SSL leído como:', JSON.stringify(process.env.DB_SSL));

const app = express();
const port = process.env.PORT || 3000;

app.disable('x-powered-by');

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-id');

	if (req.method === 'OPTIONS') {
		return res.sendStatus(204);
	}

	next();
});

// Sirve los archivos adjuntos guardados por catalog.service.js
// (documentos_adjuntos.ruta_archivo apunta a rutas bajo /uploads/...).
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// IMPORTANTE: los require() deben ser literales (string directo), no una
// variable, para que Vercel pueda detectar y empaquetar estos archivos al
// compilar la función serverless. Un require(variable) no se incluye en el
// bundle y falla en producción con "Cannot find module", aunque funcione
// perfecto en local.
const safeRequire = (label, loader) => {
	try {
		const loadedModule = loader();
		const candidate = loadedModule?.default || loadedModule?.router || loadedModule?.routes || loadedModule;

		if (typeof candidate === 'function' || (candidate && typeof candidate.use === 'function')) {
			return candidate;
		}
	} catch (error) {
		console.warn(`No se pudo cargar ${label}: ${error.message}`);
	}

	return express.Router();
};

const authRouter = safeRequire('./modules/auth/auth.routes', () => require('./modules/auth/auth.routes'));
const adminRouter = safeRequire('./modules/admin/admin.routes', () => require('./modules/admin/admin.routes'));
const catalogRouter = safeRequire('./modules/catalog/catalog.routes', () => require('./modules/catalog/catalog.routes'));
const trackingRouter = safeRequire('./modules/tracking/tracking.routes', () => require('./modules/tracking/tracking.routes'));
const comunicacionesRouter = safeRequire('./modules/comunicaciones/comunicaciones.routes', () => require('./modules/comunicaciones/comunicaciones.routes'));

app.get('/', (_req, res) => {
	res.json({
		success: true,
		message: 'API TUPA en funcionamiento',
	});
});

app.get('/health', (_req, res) => {
	res.json({
		success: true,
		status: 'ok',
		timestamp: new Date().toISOString(),
	});
});

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/tracking', trackingRouter);
app.use('/api/comunicaciones', comunicacionesRouter);

app.use((_req, res) => {
	res.status(404).json({
		success: false,
		message: 'Ruta no encontrada',
	});
});

app.use((error, _req, res, _next) => {
	const status = error.status || 500;

	res.status(status).json({
		success: false,
		message: error.message || 'Error interno del servidor',
	});
});

if (require.main === module) {
	app.listen(port, () => {
		console.log(`Servidor backend escuchando en http://localhost:${port}`);
	});
}

module.exports = app;