import React, { useEffect, useState } from 'react';

const emptyTramite = {
	id_tramite: null,
	codigo_tupa: '',
	nombre: '',
	categoria: '',
	costo: '',
	tiempo: '',
	descripcion: '',
	id_dependencia_destino: '',
};

/**
 * Modal para crear o editar la definición de un trámite TUPA (Fig. 25),
 * ajustado a las columnas reales de `tramites`.
 *
 * dependencias: [{ id_dependencia, nombre }] — cárgalas con tu propio
 * endpoint/hook de dependencias (no incluido aquí porque no me diste esa ruta).
 * categoriasSugeridas: string[] — valores de `tramites.categoria` ya usados,
 * para mostrarlos como <datalist> (categoria sigue siendo texto libre).
 */
export default function TramiteEditModal({ tramite, dependencias = [], categoriasSugeridas = [], onClose, onSave }) {
	const [form, setForm] = useState(emptyTramite);
	const [errores, setErrores] = useState({});

	useEffect(() => {
		setForm(tramite || emptyTramite);
		setErrores({});
	}, [tramite]);

	function handleChange(field, value) {
		setForm((prev) => ({ ...prev, [field]: value }));
	}

	function validar() {
		const errs = {};
		if (!form.codigo_tupa?.trim()) errs.codigo_tupa = 'El código TUPA es obligatorio.';
		if (!form.nombre?.trim()) errs.nombre = 'El nombre del trámite es obligatorio.';
		if (!form.id_dependencia_destino) errs.id_dependencia_destino = 'Selecciona la dependencia destino.';
		if (form.costo === '' || Number(form.costo) < 0) errs.costo = 'Ingresa un costo válido.';
		setErrores(errs);
		return Object.keys(errs).length === 0;
	}

	function handleSubmit() {
		if (!validar()) return;
		onSave(form);
	}

	return (
		<div className="admin-modal-overlay" onClick={onClose}>
			<div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
				<h3 className="admin-modal-title">{form.id_tramite ? 'Editar Trámite' : 'Nuevo Trámite'}</h3>
				<p className="admin-modal-sub">Modifique los datos del trámite (tabla `tramites`)</p>

				<div className="admin-field-row">
					<div className="admin-field">
						<label className="admin-label">Código TUPA *</label>
						<input
							className="admin-input"
							value={form.codigo_tupa}
							onChange={(e) => handleChange('codigo_tupa', e.target.value)}
							placeholder="Ej. TUPA-045"
						/>
						{errores.codigo_tupa && <div className="admin-field-error">{errores.codigo_tupa}</div>}
					</div>
					<div className="admin-field">
						<label className="admin-label">Tiempo estimado (días)</label>
						<input
							className="admin-input"
							type="number"
							min="0"
							value={form.tiempo}
							onChange={(e) => handleChange('tiempo', e.target.value)}
							placeholder="3"
						/>
					</div>
				</div>

				<div className="admin-field">
					<label className="admin-label">Título del trámite *</label>
					<input
						className="admin-input"
						value={form.nombre}
						onChange={(e) => handleChange('nombre', e.target.value)}
						placeholder="Ej. Certificado de Estudios"
					/>
					{errores.nombre && <div className="admin-field-error">{errores.nombre}</div>}
				</div>

				<div className="admin-field">
					<label className="admin-label">Categoría</label>
					<input
						className="admin-input"
						list="categorias-sugeridas"
						value={form.categoria || ''}
						onChange={(e) => handleChange('categoria', e.target.value)}
						placeholder="Ej. Académico (texto libre, sin tabla propia)"
					/>
					<datalist id="categorias-sugeridas">
						{categoriasSugeridas.map((c) => (
							<option key={c} value={c} />
						))}
					</datalist>
				</div>

				<div className="admin-field-row">
					<div className="admin-field">
						<label className="admin-label">Costo (S/) *</label>
						<input
							className="admin-input"
							type="number"
							min="0"
							step="0.01"
							value={form.costo}
							onChange={(e) => handleChange('costo', e.target.value)}
							placeholder="S/ 0.00"
						/>
						{errores.costo && <div className="admin-field-error">{errores.costo}</div>}
					</div>
					<div className="admin-field">
						<label className="admin-label">Dependencia destino *</label>
						<select
							className="admin-select-full"
							value={form.id_dependencia_destino}
							onChange={(e) => handleChange('id_dependencia_destino', e.target.value)}
						>
							<option value="">Selecciona una dependencia</option>
							{dependencias.map((d) => (
								<option key={d.id_dependencia} value={d.id_dependencia}>
									{d.nombre}
								</option>
							))}
						</select>
						{errores.id_dependencia_destino && (
							<div className="admin-field-error">{errores.id_dependencia_destino}</div>
						)}
					</div>
				</div>

				<div className="admin-field">
					<label className="admin-label">Descripción</label>
					<textarea
						className="admin-textarea"
						value={form.descripcion || ''}
						onChange={(e) => handleChange('descripcion', e.target.value)}
						placeholder="Describe brevemente el trámite"
					/>
				</div>

				<div className="admin-modal-actions">
					<button className="admin-btn admin-btn-outline" onClick={onClose}>
						Cancelar
					</button>
					<button className="admin-btn admin-btn-primary" onClick={handleSubmit}>
						Guardar
					</button>
				</div>
			</div>
		</div>
	);
}

export { emptyTramite };
