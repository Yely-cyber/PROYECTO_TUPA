import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, clearCurrentUser } from '../utils/catalogHelpers';

export const useCurrentUser = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		const current = getCurrentUser();

		if (!current) {
			navigate('/', { replace: true });
		} else {
			setUser(current);
		}

		setChecked(true);
	}, [navigate]);

	const logout = () => {
		clearCurrentUser();
		navigate('/', { replace: true });
	};

	return { user, checked, logout };
};