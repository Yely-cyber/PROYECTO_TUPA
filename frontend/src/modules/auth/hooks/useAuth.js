import { useEffect, useState } from 'react';
import { getSession, loginAdmin, logout } from '../services/authService';

export const useAuth = () => {
	const [session, setSession] = useState(() => getSession());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		setSession(getSession());
	}, []);

	const signInAdmin = async (credentials) => {
		setLoading(true);
		setError('');

		const response = await loginAdmin(credentials);

		if (!response.success) {
			setError(response.message || 'No se pudo iniciar sesión.');
			setLoading(false);
			return response;
		}

		setSession(getSession());
		setLoading(false);
		return response;
	};

	const signOut = () => {
		logout();
		setSession(null);
	};

	return {
		session,
		loading,
		error,
		signInAdmin,
		signOut,
		isAuthenticated: Boolean(session),
	};
};
