import { AuthLayout } from '../components/AuthLayout';
import { ProfileCard } from '../components/ProfileCard';
import { selectionProfiles } from '../data/registrationFlows';

export const ProfileSelectionPage = () => {
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
					<ProfileCard key={profile.id} {...profile} />
				))}
			</section>
		</AuthLayout>
	);
};
