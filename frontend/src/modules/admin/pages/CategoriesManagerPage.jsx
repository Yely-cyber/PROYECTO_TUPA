import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import CategoryFormModal from '../components/CategoryFormModal';
import useCategories from '../hooks/useCategories';

const COLORES = ['#a91d3a', '#c99a2e', '#93192f', '#2b5aa3', '#1f9d55'];

/**
 * Fig. 28 — Interfaz de Gestión de Categorías.
 * IMPORTANTE: no hay tabla `categorias`; esto agrupa `tramites.categoria`.
 * No existe "Nueva Categoría" suelta (aparece al asignarla a un trámite).
 */
export default function CategoriesManagerPage() {
	const { categorias, loading, error, renombrarCategoria, eliminarCategoria } = useCategories();
	const [modalCategoria, setModalCategoria] = useState(null);
	const [accionError, setAccionError] = useState('');

	async function handleSave(nombreActual, nombreNuevo) {
		setAccionError('');
		const response = await renombrarCategoria(nombreActual, nombreNuevo);
		if (!response.success) {
			setAccionError(response.message);
			return;
		}
		setModalCategoria(null);
	}

	async function handleDelete(nombre) {
		if (!window.confirm(`Los trámites de "${nombre}" quedarán sin categoría. ¿Continuar?`)) return;
		const response = await eliminarCategoria(nombre);
		if (!response.success) setAccionError(response.message);
	}

	return (
		<AdminLayout>
			<div className="admin-page-header">
				<div>
					<h1 className="admin-page-title">Categorías</h1>
					<p className="admin-page-sub">
						Organice las categorías usadas en el catálogo de trámites (campo de texto, no tabla propia)
					</p>
				</div>
			</div>

			{(error || accionError) && <div className="admin-error-banner">{error || accionError}</div>}

			{loading ? (
				<div className="admin-loading">Cargando categorías...</div>
			) : (
				<div className="admin-grid admin-grid-3">
					{categorias.map((cat, i) => (
						<div className="admin-card admin-category-card" key={cat.nombre}>
							<div className="admin-category-icon" style={{ background: COLORES[i % COLORES.length] }}>
								{cat.nombre.charAt(0).toUpperCase()}
							</div>
							<div>
								<div className="admin-category-name">{cat.nombre}</div>
								<div className="admin-category-count">{cat.tramitesAsociados} trámites asociados</div>
							</div>
							<div className="admin-category-actions">
								<button className="admin-btn admin-btn-outline" onClick={() => setModalCategoria(cat)}>
									Renombrar
								</button>
								<button
									className="admin-btn admin-btn-outline"
									style={{ color: 'var(--admin-red-600)' }}
									onClick={() => handleDelete(cat.nombre)}
								>
									Vaciar
								</button>
							</div>
						</div>
					))}
					{categorias.length === 0 && (
						<div className="admin-empty">Aún no hay categorías asignadas a ningún trámite.</div>
					)}
				</div>
			)}

			{modalCategoria && (
				<CategoryFormModal
					categoria={modalCategoria}
					onClose={() => setModalCategoria(null)}
					onSave={handleSave}
				/>
			)}
		</AdminLayout>
	);
}
