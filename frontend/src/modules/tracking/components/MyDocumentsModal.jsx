// src/modules/tracking/components/MyDocumentsModal.jsx
import { useEffect } from 'react';
import { useUserDocuments } from '../hooks/useUserDocuments';

export const MyDocumentsModal = ({ isOpen, onClose }) => {
  const { documents, loading, deleteDocument } = useUserDocuments();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="documents-modal-title"
        className="w-full max-w-2xl rounded-2xl border border-[#ecd9d3] bg-white p-6 shadow-sm"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="documents-modal-title" className="text-xl font-semibold text-[#7a1220]">Mis Documentos</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar documentos"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-[#fbf1e6] hover:text-[#7a1220] focus:outline-none focus:ring-4 focus:ring-[#be1e2d]/10"
          >
            ✕
          </button>
        </div>
        
        {/* Lista de documentos */}
        {loading ? (
          <p>Cargando archivos...</p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-xl border border-[#ecd9d3] p-3">
                <div>
                  <p className="font-semibold">{doc.name}</p>
                  <span className="text-xs text-gray-500">{doc.size} • {doc.date}</span>
                </div>
                <button
                  type="button"
                  onClick={() => deleteDocument(doc.id)}
                  className="rounded-lg border border-[#be1e2d] bg-white px-3 py-2 text-sm font-semibold text-[#7a1220] transition hover:bg-[#fbf1e6] focus:outline-none focus:ring-4 focus:ring-[#be1e2d]/10"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
