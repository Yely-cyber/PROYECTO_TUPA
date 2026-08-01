import React, { useEffect, useState } from 'react';

export default function CategoryFormModal({ categoria, onClose, onSave }) {
	const [nombreNuevo, setNombreNuevo] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		setNombreNuevo(categoria?.nombre || '');
		setError('');
	}, [categoria]);

	function handleSubmit() {
		if (!nombreNuevo.trim()) {
			setError('El nombre de la categoría es obligatorio.');
			return;
		}
		onSave(categoria.nombre, nombreNuevo.trim());
	}

	if (!categoria) return null;

	return (
		<div className="admin-modal-overlay" onClick={onClose}>
			<div className="admin-modal" onClick={(e) => e.stopPropagation()}>
				<h3 className="admin-modal-title">Renombrar Categoría</h3>
				<p className="admin-modal-sub">
					Se actualizarán los {categoria.tramitesAsociados} trámite(s) que usan "{categoria.nombre}"
				</p>

				{error && <div className="admin-error-banner">{error}</div>}

				<div className="admin-field">
					<label className="admin-label">Nuevo nombre *</label>
					<input
						className="admin-input"
						value={nombreNuevo}
						onChange={(e) => setNombreNuevo(e.target.value)}
						placeholder="Ej. Académico"
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
