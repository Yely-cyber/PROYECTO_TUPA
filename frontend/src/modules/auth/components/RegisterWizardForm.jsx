import { useMemo } from 'react';
import { useRegisterForm } from '../hooks/useRegisterForm';

const fieldClassName =
	'mt-1 w-full rounded-lg border border-[#e7d8d0] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#be1e2d] focus:ring-4 focus:ring-[#be1e2d]/10';

const navigateTo = (path) => {
	if (path) {
		window.location.assign(path);
	}
};

export const RegisterWizardForm = ({
	profile,
	title,
	subtitle,
	steps,
	cancelPath = '/',
	defaultValues = {},
	finishMessage = 'Registro completado.',
	successReturnLabel = 'Volver al inicio',
}) => {
	const {
		values,
		errors,
		currentStep,
		activeStep,
		submitting,
		submitted,
		handleFieldChange,
		next,
		back,
		reset,
	} = useRegisterForm({ profile, steps, defaultValues });

	const handleSubmit = async (event) => {
		event.preventDefault();
		await next();
	};

	if (submitted) {
		return (
			<section className="mx-auto max-w-4xl rounded-[28px] border border-[#ecd9d3] bg-white/95 p-6 shadow-[0_18px_60px_rgba(127,0,0,0.08)] backdrop-blur sm:p-8">
				<div className="mx-auto max-w-2xl text-center">
					<div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#ebf7ec] text-2xl text-[#2e7d32]">
						✓
					</div>
					<h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{finishMessage}</h2>
					<p className="mt-3 text-sm leading-6 text-slate-600">
						Tu información quedó lista para continuar con la siguiente interfaz del proceso.
					</p>

					<div className="mt-8 grid gap-3 sm:grid-cols-2">

						<button
							type="button"
							onClick={() => navigateTo(cancelPath)}
							className="rounded-lg bg-[#be1e2d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#a71825]"
						>
							{successReturnLabel}
						</button>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="mx-auto max-w-5xl rounded-[28px] border border-[#ecd9d3] bg-white/95 p-5 shadow-[0_18px_60px_rgba(127,0,0,0.08)] backdrop-blur sm:p-8 lg:p-10">
			<div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#be1e2d]">UNSAAC | TUPA Digital</p>
					<h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
					<p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{subtitle}</p>

					<div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
						{steps.map((step, index) => (
							<span
								key={step.key}
								className={`rounded-full border px-3 py-2 ${index === currentStep ? 'border-[#be1e2d] bg-[#fdeceb] text-[#be1e2d]' : 'border-slate-200 bg-slate-50'}`}
							>
								{index + 1}. {step.label}
							</span>
						))}
					</div>

					{errors.form ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p> : null}

					<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
						<div className="grid gap-4 sm:grid-cols-2">
							{activeStep.fields.map((field) => {
								const widthClass = field.span === 2 ? 'sm:col-span-2' : '';

								return (
									<label key={field.name} className={`block ${widthClass}`}>
										<span className="text-sm font-medium text-slate-700">{field.label}</span>

										{field.type === 'select' ? (
											<select
												required={field.required !== false}
												value={values[field.name] ?? ''}
												onChange={handleFieldChange(field)}
												className={fieldClassName}
											>
												<option value="">Selecciona una opción</option>
												{field.options.map((option) => (
													<option key={option} value={option}>
														{option}
													</option>
												))}
											</select>
										) : field.type === 'textarea' ? (
											<textarea
												rows={field.rows ?? 4}
												required={field.required !== false}
												value={values[field.name] ?? ''}
												onChange={handleFieldChange(field)}
												placeholder={field.placeholder}
												className={fieldClassName}
											/>
										) : field.type === 'checkbox' ? (
											<div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
												<input
													type="checkbox"
													checked={Boolean(values[field.name])}
													onChange={handleFieldChange(field)}
													className="h-4 w-4 rounded border-slate-300 text-[#be1e2d] focus:ring-[#be1e2d]"
												/>
												<span className="text-sm text-slate-700">{field.description}</span>
											</div>
										) : (
											<input
												type={field.type ?? 'text'}
												required={field.required !== false}
												value={values[field.name] ?? ''}
												onChange={handleFieldChange(field)}
												placeholder={field.placeholder}
												className={fieldClassName}
											/>
										)}

										{errors[field.name] ? <span className="mt-2 block text-xs text-red-600">{errors[field.name]}</span> : null}
									</label>
								);
							})}
						</div>

						<div className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-4">
							<button
								type="button"
								onClick={() => navigateTo(cancelPath)}
								className="rounded-lg border border-[#e7d8d0] bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#be1e2d] hover:text-[#be1e2d]"
							>
								Cancelar
							</button>
							<button
								type="button"
								onClick={() => (currentStep > 0 ? back() : navigateTo(cancelPath))}
								className="rounded-lg border border-[#e7d8d0] bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
							>
								Volver
							</button>
							<button
								type="button"
								onClick={reset}
								className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
							>
								Limpiar
							</button>
							<button
								type="submit"
								disabled={submitting}
								className="rounded-lg bg-[#be1e2d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#a71825]"
							>
								{currentStep < steps.length - 1 ? 'Siguiente' : 'Finalizar'}
							</button>
						</div>
					</form>
				</div>

				<aside className="rounded-[24px] bg-[#fbf4f2] p-5 ring-1 ring-[#ecd9d3]">
					<p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#be1e2d]">Vista previa</p>
					<h3 className="mt-2 text-lg font-semibold text-slate-900">{activeStep.label}</h3>
					<p className="mt-2 text-sm leading-6 text-slate-600">{activeStep.description}</p>

					<div className="mt-6 space-y-3">
						{Object.entries(values).slice(0, 6).map(([key, value]) => (
							<div key={key} className="rounded-xl border border-white bg-white px-4 py-3 shadow-sm">
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{key.replaceAll('_', ' ')}</p>
								
								<p className="mt-1 text-sm font-medium text-slate-800">{String(value || 'Sin completar')}</p>
							</div>
						))}
					</div>
				</aside>
			</div>
		</section>
	);
};