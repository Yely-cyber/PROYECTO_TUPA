import { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../hooks/useAuth';

export const AdminLoginPage = () => {
	const { signInAdmin, loading, error } = useAuth();
	const [values, setValues] = useState({ email: '', codigoAcceso: '' });

	const handleChange = (event) => {
		const { name, value } = event.target;
		setValues((currentValues) => ({ ...currentValues, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const response = await signInAdmin(values);
		if (response.success) {
			window.location.assign('/');
		}
	};

	return (
		<AuthLayout>
			<section className="mx-auto max-w-xl rounded-[28px] border border-[#ecd9d3] bg-white/95 p-6 shadow-[0_18px_60px_rgba(127,0,0,0.08)] backdrop-blur sm:p-8">
				<p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#be1e2d]">Administración</p>
				<h2 className="mt-3 text-3xl font-semibold text-slate-700">Acceso del administrador</h2>
				<p className="mt-3 text-sm leading-6 text-slate-600">
					Esta pantalla queda como entrada principal para el portal administrativo. Puedes conectar aquí tu autenticación cuando lo necesites.
				</p>

				<form className="mt-8 space-y-4" onSubmit={handleSubmit}>
					<label className="block">
						<span className="text-sm font-medium text-slate-700">Correo institucional</span>
						<input name="email" type="email" value={values.email} onChange={handleChange} className="mt-1 w-full rounded-lg border border-[#e7d8d0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#be1e2d] focus:ring-4 focus:ring-[#be1e2d]/10" />
					</label>
					<label className="block">
						<span className="text-sm font-medium text-slate-700">Código de verificación administrativo</span>
						<input name="codigoAcceso" type="password" value={values.codigoAcceso} onChange={handleChange} className="mt-1 w-full rounded-lg border border-[#e7d8d0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#be1e2d] focus:ring-4 focus:ring-[#be1e2d]/10" />
					</label>

					{error ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

					<div className="grid gap-3 sm:grid-cols-2">
						<button type="button" onClick={() => window.location.assign('/')} className="rounded-lg border border-[#e7d8d0] bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400">
							Volver
						</button>
						<button type="submit" disabled={loading} className="rounded-lg bg-[#be1e2d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#a71825] disabled:cursor-not-allowed disabled:opacity-60">
							{loading ? 'Ingresando...' : 'Ingresar'}
						</button>
					</div>
				</form>
			</section>
		</AuthLayout>
	);
};
