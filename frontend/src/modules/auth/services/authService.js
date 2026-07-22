const API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3000/api/auth';
const SESSION_KEY = 'tupa_auth_session';

const readStorage = (key, fallback) => {
	if (typeof window === 'undefined') {
		return fallback;
	}

	try {
		const rawValue = window.localStorage.getItem(key);
		return rawValue ? JSON.parse(rawValue) : fallback;
	} catch {
		return fallback;
	}
};

const writeStorage = (key, value) => {
	if (typeof window === 'undefined') {
		return;
	}

	window.localStorage.setItem(key, JSON.stringify(value));
};

const createId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const requestJson = async (endpoint, options = {}) => {
	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		method: options.method || 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {}),
		},
		...options,
	});

	const body = await response.json().catch(() => ({}));
	if (!response.ok) {
		return { success: false, message: body.message || 'Error al comunicar con el servidor', errors: body.errors || null };
	}

	return body;
};

export const saveRegistrationStep = async ({ profile, stepKey, data, registrationId = null }) => {
	return requestJson('/register/step', {
		method: 'POST',
		body: JSON.stringify({ profile, stepKey, data, registrationId }),
	});
};

export const completeRegistration = async ({ profile, stepKey, data, registrationId = null }) => {
	return requestJson('/register/complete', {
		method: 'POST',
		body: JSON.stringify({ profile, stepKey, data, registrationId }),
	});
};

export const loginAdmin = async ({ email, codigoAcceso }) => {
	const currentEmail = String(email ?? '').trim();
	const currentCodigo = String(codigoAcceso ?? '').trim();

	if (!currentEmail || !currentCodigo) {
		return { success: false, message: 'Debes ingresar correo institucional y código de verificación.' };
	}

	const response = await requestJson('/admin/login', {
		method: 'POST',
		body: JSON.stringify({ email: currentEmail, codigoAcceso: currentCodigo }),
	});

	if (response.success) {
		writeStorage(SESSION_KEY, response.session || null);
	}

	return response;
};

export const getSession = () => readStorage(SESSION_KEY, null);

export const logout = () => {
	if (typeof window === 'undefined') {
		return;
	}

	window.localStorage.removeItem(SESSION_KEY);
};
