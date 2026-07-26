import { FileUploadZone } from './FileUploadZone';

const fieldClassName =
	'mt-1 w-full rounded-lg border border-[#ecd9d3] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#be1e2d] focus:ring-4 focus:ring-[#be1e2d]/10';

export const TramiteFormStep1 = ({ form }) => (
	<div className="space-y-6">
		<label className="block">
			<span className="text-sm font-medium text-slate-700">Detalle de tu petición</span>
			<textarea
				rows={5}
				value={form.peticion}
				onChange={(event) => form.setPeticion(event.target.value)}
				placeholder="Describe con detalle qué necesitas (motivo, fechas, datos específicos, etc.)"
				className={fieldClassName}
			/>
			{form.errors.peticion ? <span className="mt-1 block text-xs text-red-600">{form.errors.peticion}</span> : null}
		</label>

		<div>
			<span className="text-sm font-medium text-slate-700">Archivos adjuntos</span>
			<p className="mt-1 text-xs text-slate-400">
				Adjunta los documentos que sustenten tu solicitud (DNI, recibos, formatos, etc.).
			</p>
			<div className="mt-3">
				<FileUploadZone files={form.archivos} onAddFiles={form.addArchivos} onRemoveFile={form.removeArchivo} />
			</div>
		</div>

		<label className="block max-w-sm">
			<span className="text-sm font-medium text-slate-700">Código de pago</span>
			<input
				type="text"
				value={form.codigoPago}
				onChange={(event) => form.setCodigoPago(event.target.value)}
				placeholder="Ej. 2026-000123"
				className={fieldClassName}
			/>
			{form.errors.codigoPago ? (
				<span className="mt-1 block text-xs text-red-600">{form.errors.codigoPago}</span>
			) : null}
		</label>
	</div>
);
