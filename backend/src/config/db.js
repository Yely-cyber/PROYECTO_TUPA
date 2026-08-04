const mysql = require('mysql2/promise');

const {
	DB_HOST,
	DB_PORT = '3306',
	DB_USER,
	DB_PASSWORD,
	DB_NAME,
	DB_SSL, // 'true' si tu proveedor lo requiere (TiDB, Aiven, etc.)
} = process.env;

if (!DB_HOST || !DB_USER || !DB_NAME) {
	console.warn(
		'Faltan variables de entorno de base de datos (DB_HOST, DB_USER, DB_NAME). ' +
		'Configúralas en Vercel: Project Settings > Environment Variables.'
	);
}

const pool = mysql.createPool({
	host: DB_HOST,
	port: Number(DB_PORT),
	user: DB_USER,
	password: DB_PASSWORD ? String(DB_PASSWORD).trim() : undefined,
	database: DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
	ssl: DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
});

module.exports = pool;