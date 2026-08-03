import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { ProfileCard } from '../components/ProfileCard';
import { selectionProfiles } from '../data/registrationFlows';
import { lookupRegisteredUser } from '../services/authService';
import { saveCurrentUser } from '../../catalog/utils/catalogHelpers';

const LOOKUP_FIELDS = {
	estudiante: { label: 'Código de estudiante', placeholder: 'Ingresa tu código universitario' },
	docente: { label: 'DNI', placeholder: 'Ingresa tu DNI' },
	dependencia: { label: 'Nombre de la dependencia', placeholder: 'Ingresa el nombre registrado' },
	institucion: { label: 'RUC', placeholder: 'Ingresa tu RUC' },
	general: { label: 'DNI', placeholder: 'Ingresa tu DNI' },
	externo: { label: 'Documento', placeholder: 'Ingresa tu documento o pasaporte' },
};

export const ProfileSelectionPage = () => {
	const navigate = useNavigate();
	const [selectedProfile, setSelectedProfile] = useState(null);
	const [identifier, setIdentifier] = useState('');
	const [lookupError, setLookupError] = useState('');
	const [loading, setLoading] = useState(false);

	const lookupConfig = useMemo(() => (selectedProfile ? LOOKUP_FIELDS[selectedProfile.id] : null), [selectedProfile]);

	const handleLookupSubmit = async (event) => {
		event.preventDefault();
		setLookupError('');

		if (!selectedProfile) {
			return;
		}

		setLoading(true);
		const response = await lookupRegisteredUser({ profile: selectedProfile.id, identifier });
		setLoading(false);

		if (!response.success) {
			setLookupError(response.message || 'No se pudo encontrar tu registro.');
			return;
		}

		saveCurrentUser(response.user);
		navigate('/dashboard', { replace: true });
	};

	return (
		<AuthLayout>
			<section className="overflow-hidden rounded-[32px] border border-[#8f0810]/10 bg-[#8f0810] text-white shadow-[0_24px_80px_rgba(127,0,0,0.22)]">
				<div className="relative isolate px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
					<div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(143,8,16,0.95),rgba(111,10,19,0.88)),radial-gradient(circle_at_top_right,rgba(215,163,32,0.22),transparent_28%),radial-gradient(circle_at_left,rgba(255,255,255,0.14),transparent_30%)]" />
					<div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.18))]" />

					<div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
						<div>
							<h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
								Bienvenido al Portal TUPA
							</h2>
							<p className="mt-4 max-w-2xl text-base leading-8 text-red-50/90 sm:text-lg">
								Accede a trámites y servicios administrativos digitales de la UNSAAC de forma rápida, segura y transparente.
							</p>
						</div>

					</div>
				</div>
			</section>

			<section className="mt-8 text-center">
				<h3 className="text-3xl font-semibold text-slate-900">Seleccione su tipo de usuario</h3>
				<p className="mt-3 text-sm text-slate-500">Personalizamos tu experiencia según tu relación con la universidad.</p>
			</section>

			<section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
				{selectionProfiles.map((profile) => (
					<ProfileCard
						key={profile.id}
						{...profile}
						onAlreadyRegistered={() => {
							setSelectedProfile(profile);
							setLookupError('');
							setIdentifier('');
						}}
					/>
				))}
			</section>

			{selectedProfile ? (
				<section className="mt-8 rounded-[24px] border border-[#ecd9d3] bg-white p-6 shadow-sm">
					<h4 className="text-lg font-semibold text-slate-900">Ingresar como {selectedProfile.title}</h4>
					<p className="mt-2 text-sm text-slate-600">Ingresa tu {lookupConfig?.label?.toLowerCase()} para entrar a tu panel sin volver a registrar.</p>

					<form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleLookupSubmit}>
						<input
							type="text"
							value={identifier}
							onChange={(event) => setIdentifier(event.target.value)}
							placeholder={lookupConfig?.placeholder || 'Ingresa tu dato de acceso'}
							className="w-full rounded-lg border border-[#e7d8d0] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#be1e2d] focus:ring-4 focus:ring-[#be1e2d]/10"
						/>
						<button
							type="submit"
							disabled={loading}
							className="rounded-lg bg-[#be1e2d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#a71825] disabled:cursor-not-allowed disabled:opacity-70"
						>
							{loading ? 'Buscando…' : 'Entrar'}
						</button>
					</form>

					{lookupError ? <p className="mt-3 text-sm text-red-600">{lookupError}</p> : null}
				</section>
			) : null}
		</AuthLayout>
	);
};
