import React, { useState } from 'react';
import ExpedienteStatusBadge from './ExpedienteStatusBadge';

/**
 * Modal clave: revisión, aprobación u observación de un expediente (Fig. 27),
 * ajustado a las columnas reales de `expedientes` + estado derivado del
 * último `movimientos_expediente`.
 */
export default function TramiteReviewModal({ expediente, onClose, onAprobar, onObservar, onRechazar }) {
	const [comentario, setComentario] = useState('');

	if (!expediente) return null;

	return (
		<div className="admin-modal-overlay" onClick={onClose}>
			<div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
				<h3 className="admin-modal-title">Detalles del Trámite</h3>
				<p className="admin-modal-sub">Información completa del expediente</p>

				<div className="admin-detail-grid">
					<div>
						<div className="admin-detail-label">N.° de Expediente</div>
						<div className="admin-detail-value">{expediente.numero_expediente}</div>
					</div>
					<div>
						<div className="admin-detail-label">Tipo de Trámite</div>
						<div className="admin-detail-value">{expediente.tramite}</div>
					</div>
					<div>
						<div className="admin-detail-label">Estado</div>
						<ExpedienteStatusBadge estado={expediente.estado} />
					</div>
					<div>
						<div className="admin-detail-label">Fecha de Solicitud</div>
						<div className="admin-detail-value">
							{new Date(expediente.fecha_registro).toLocaleDateString('es-PE')}
						</div>
					</div>
				</div>

				<hr className="admin-divider" />

				<div className="admin-detail-label">Usuario Responsable</div>
				<div className="admin-detail-value" style={{ marginBottom: 12 }}>
					{expediente.usuario_responsable}
					{expediente.usuario_email ? ` (${expediente.usuario_email})` : ''}
				</div>

				<div className="admin-detail-label">Asunto</div>
				<div className="admin-detail-value" style={{ fontWeight: 400, marginBottom: 12 }}>
					{expediente.asunto}
				</div>

				{expediente.peticion && (
					<>
						<div className="admin-detail-label">Petición</div>
						<div className="admin-detail-value" style={{ fontWeight: 400 }}>
							{expediente.peticion}
						</div>
					</>
				)}

				<div className="admin-field" style={{ marginTop: 16 }}>
					<label className="admin-label">Comentario (opcional, para observar/rechazar)</label>
					<textarea
						className="admin-textarea"
						value={comentario}
						onChange={(e) => setComentario(e.target.value)}
						placeholder="Motivo de la observación o el rechazo..."
					/>
				</div>

				<div className="admin-modal-actions">
					<button className="admin-btn admin-btn-outline" onClick={() => onRechazar(expediente.id_expediente, comentario)}>
						Rechazar
					</button>
					<button className="admin-btn admin-btn-outline" onClick={() => onObservar(expediente.id_expediente, comentario)}>
						Observar
					</button>
					<button className="admin-btn admin-btn-primary" onClick={() => onAprobar(expediente.id_expediente, comentario)}>
						Aprobar
					</button>
					<button className="admin-btn admin-btn-outline" onClick={onClose}>
						Cerrar
					</button>
				</div>
			</div>
		</div>
	);
}
