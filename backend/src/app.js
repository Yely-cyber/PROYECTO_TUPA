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

const app = express();
const port = process.env.PORT || 3000;

app.disable('x-powered-by');

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (req.method === 'OPTIONS') {
		return res.sendStatus(204);
	}

	next();
});

const loadRouter = (modulePath) => {
	try {
		const loadedModule = require(modulePath);
		const candidate = loadedModule?.default || loadedModule?.router || loadedModule?.routes || loadedModule;

		if (typeof candidate === 'function' || (candidate && typeof candidate.use === 'function')) {
			return candidate;
		}
	} catch (error) {
		console.warn(`No se pudo cargar ${modulePath}: ${error.message}`);
	}

	return express.Router();
};

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

app.use('/api/auth', loadRouter('./modules/auth/auth.routes'));
app.use('/api/admin', loadRouter('./modules/admin/admin.routes'));
app.use('/api/catalog', loadRouter('./modules/catalog/catalog.routes'));
app.use('/api/tracking', loadRouter('./modules/tracking/tracking.routes'));

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
