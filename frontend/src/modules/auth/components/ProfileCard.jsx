const toneStyles = {
	red: 'border-[#efc3bf] bg-white hover:border-[#be1e2d] hover:shadow-[0_14px_40px_rgba(190,30,45,0.12)]',
	gold: 'border-[#eadab1] bg-white hover:border-[#d7a320] hover:shadow-[0_14px_40px_rgba(215,163,32,0.12)]',
	slate: 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-[0_14px_40px_rgba(71,85,105,0.12)]',
};

const iconStyles = {
	red: 'bg-[#fde8e5] text-[#be1e2d]',
	gold: 'bg-[#f9ebbe] text-[#8f6a00]',
	slate: 'bg-slate-200 text-slate-700',
};

export const ProfileCard = ({ title, description, href, icon, tone = 'slate' }) => {
	return (
		<div className={`group rounded-2xl border p-5 shadow-sm transition duration-200 ${toneStyles[tone] ?? toneStyles.slate}`}>
			<div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl text-xl ${iconStyles[tone] ?? iconStyles.slate}`}>
				{icon}
			</div>

			<h3 className="text-lg font-semibold text-slate-900">{title}</h3>
			<p className="mt-2 min-h-[3.5rem] text-sm leading-6 text-slate-600">{description}</p>

			<a
				href={href}
				className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#be1e2d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#a71825]"
			>
				Acceder <span className="ml-2 transition-transform group-hover:translate-x-0.5">→</span>
			</a>
		</div>
	);
};
