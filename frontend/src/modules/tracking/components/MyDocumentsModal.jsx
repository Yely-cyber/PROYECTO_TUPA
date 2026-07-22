// src/modules/tracking/components/MyDocumentsModal.jsx
import { useUserDocuments } from '../hooks/useUserDocuments';

export const MyDocumentsModal = ({ isOpen, onClose }) => {
  const { documents, loading, uploadDocument, deleteDocument } = useUserDocuments();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Mis Documentos</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
        {/* Lista de documentos */}
        {loading ? (
          <p>Cargando archivos...</p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex justify-between items-center border p-3 rounded">
                <div>
                  <p className="font-semibold">{doc.name}</p>
                  <span className="text-xs text-gray-500">{doc.size} • {doc.date}</span>
                </div>
                <button onClick={() => deleteDocument(doc.id)} className="text-red-600 text-sm">Eliminar</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};