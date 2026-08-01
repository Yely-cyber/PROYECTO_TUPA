import React, { useRef } from 'react';
import { Upload, Download, Trash2, FileText, Video, File as FileIcon } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import useDocuments from '../hooks/useDocuments';
import adminService from '../services/adminService';
import { formatFileSize } from '../utils/adminHelpers';

const PILL = {
	PDF: { Icon: FileText, cls: 'pdf' },
	Video: { Icon: Video, cls: 'video' },
	DOC: { Icon: FileIcon, cls: 'doc' },
};

/**
 * Fig. 29 — Interfaz de Gestión Documental.
 * Sin tabla propia en tu base de datos: los archivos se guardan y listan
 * directamente en disco (uploads/admin-documentos), vía admin.service.js.
 */
export default function DocumentManagerPage() {
	const { documentos, loading, error, subirDocumento, eliminarDocumento } = useDocuments();
	const inputRef = useRef(null);

	const totales = {
		pdf: documentos.filter((d) => d.tipo === 'PDF').length,
		video: documentos.filter((d) => d.tipo === 'Video').length,
		doc: documentos.filter((d) => d.tipo === 'DOC').length,
	};

	function handleUploadClick() {
		inputRef.current?.click();
	}

	async function handleFileChange(e) {
		const file = e.target.files?.[0];
		if (file) await subirDocumento(file);
		e.target.value = '';
	}

	async function handleDelete(id) {
		if (window.confirm('¿Eliminar este documento?')) await eliminarDocumento(id);
	}

	return (
		<AdminLayout>
			<div className="admin-page-header">
				<div>
					<h1 className="admin-page-title">Gestión Documental</h1>
					<p className="admin-page-sub">Administre manuales, formatos y recursos del sistema</p>
				</div>
				<button className="admin-btn admin-btn-primary" onClick={handleUploadClick}>
					<Upload size={16} /> Subir Documento
				</button>
				<input type="file" ref={inputRef} style={{ display: 'none' }} onChange={handleFileChange} />
			</div>

			{error && <div className="admin-error-banner">{error}</div>}

			<div className="admin-grid admin-grid-3">
				<div className="admin-card admin-doc-stat" style={{ background: 'var(--admin-maroon-600)' }}>
					<div className="admin-metric-value">{totales.pdf}</div>
					<div className="admin-metric-label">Manuales PDF</div>
				</div>
				<div className="admin-card admin-doc-stat" style={{ background: 'var(--admin-gold-600)' }}>
					<div className="admin-metric-value">{totales.video}</div>
					<div className="admin-metric-label">Videos Tutoriales</div>
				</div>
				<div className="admin-card admin-doc-stat" style={{ background: 'var(--admin-ink-900)' }}>
					<div className="admin-metric-value">{totales.doc}</div>
					<div className="admin-metric-label">Formatos</div>
				</div>
			</div>

			<div className="admin-card" style={{ marginTop: 20 }}>
				{loading ? (
					<div className="admin-loading">Cargando documentos...</div>
				) : (
					<table className="admin-table">
						<thead>
							<tr>
								<th>Documento</th>
								<th>Tipo</th>
								<th>Tamaño</th>
								<th>Fecha</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{documentos.map((doc) => {
								const { Icon, cls } = PILL[doc.tipo] || PILL.DOC;
								return (
									<tr key={doc.id}>
										<td>{doc.nombre}</td>
										<td>
											<span className={`admin-file-pill ${cls}`}>
												<Icon size={12} style={{ marginRight: 4, verticalAlign: '-2px' }} />
												{doc.tipo}
											</span>
										</td>
										<td>{formatFileSize(doc.tamano)}</td>
										<td>{doc.fecha}</td>
										<td className="admin-table-actions">
											<a
												className="admin-btn-icon neutral"
												href={adminService.descargarDocumentoUrl(doc.id)}
												style={{ display: 'inline-flex' }}
											>
												<Download size={15} />
											</a>
											<button className="admin-btn-icon danger" onClick={() => handleDelete(doc.id)}>
												<Trash2 size={15} />
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
				{!loading && documentos.length === 0 && (
					<div className="admin-empty">Aún no se han subido documentos.</div>
				)}
			</div>
		</AdminLayout>
	);
}
