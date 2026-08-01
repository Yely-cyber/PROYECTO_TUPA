/**
 * admin.middleware.js
 * Protege las rutas /api/admin/* SIN tocar tu flujo de login (auth.service.js).
 *
 * Tu login genera `session.token` con crypto.randomUUID() pero no lo persiste
 * en el servidor, así que no hay forma de "verificarlo" después. Para no
 * inventar un JWT paralelo, el frontend reenvía el `idAdmin` que ya recibió
 * en `session` como header `x-admin-id`, y aquí solo confirmamos que ese
 * administrador exista y siga activo (mismo criterio que tu query de login).
 *
 * Si más adelante quieres algo más fuerte (JWT firmado, expiración real),
 * este es el único archivo que tendrías que cambiar.
 *
 * AJUSTA esta línea a donde definas tu pool real (la misma instancia
 * que usa tu authService.js):
 */
const pool = require('../../config/db');

async function requireAdmin(req, res, next) {
	try {
		const idAdmin = req.header('x-admin-id');
		if (!idAdmin) {
			return res.status(401).json({ success: false, message: 'Falta la sesión de administrador (x-admin-id).' });
		}

		const [rows] = await pool.execute(
			`SELECT id_admin, nombre_admin, email FROM administradores WHERE id_admin = ? AND estado = 'activo' LIMIT 1`,
			[idAdmin]
		);

		if (!rows[0]) {
			return res.status(401).json({ success: false, message: 'Sesión de administrador inválida o inactiva.' });
		}

		req.admin = rows[0];
		next();
	} catch (error) {
		res.status(500).json({ success: false, message: 'Error al validar la sesión de administrador.' });
	}
}

module.exports = { requireAdmin };
