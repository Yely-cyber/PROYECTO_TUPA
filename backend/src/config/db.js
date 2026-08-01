const mysql = require('mysql2/promise');

const {
    DB_HOST = 'localhost',
    DB_PORT = '3306',
    DB_USER = 'root',
    DB_PASSWORD = 'MySQLDiana',
    DB_NAME = 'tupa_unsaac',
} = process.env;

const pool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: String(DB_PASSWORD).trim(),
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool;