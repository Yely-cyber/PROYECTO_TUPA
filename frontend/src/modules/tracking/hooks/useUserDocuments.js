import { useState } from 'react';

export const useUserDocuments = () => {
  const [documents, setDocuments] = useState([]);

  const uploadDocument = (document) => {
    setDocuments((current) => [...current, document]);
  };

  const deleteDocument = (documentId) => {
    setDocuments((current) => current.filter((document) => document.id !== documentId));
  };

  return {
    documents,
    loading: false,
    uploadDocument,
    deleteDocument,
  };
};
