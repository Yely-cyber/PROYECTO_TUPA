import { useState } from 'react';

// Cada archivo se guarda como { id, file } — el id es determinístico
// (nombre + tamaño + fecha de modificación) para evitar duplicados si el
// usuario selecciona el mismo archivo dos veces.
const buildFileId = (file) => `${file.name}-${file.size}-${file.lastModified}`;

export const useTramiteForm = () => {
	const [peticion, setPeticion] = useState('');
	const [archivos, setArchivos] = useState([]);
	const [codigoPago, setCodigoPago] = useState('');
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	const addArchivos = (fileList) => {
		const nuevos = Array.from(fileList).map((file) => ({ id: buildFileId(file), file }));

		setArchivos((prev) => {
			const existentes = new Set(prev.map((item) => item.id));
			const sinDuplicados = nuevos.filter((item) => !existentes.has(item.id));
			return [...prev, ...sinDuplicados];
		});
	};

	// Permite "cancelar" la carga de un archivo puntual (p. ej. si el
	// usuario adjuntó el documento equivocado) sin afectar los demás.
	const removeArchivo = (id) => {
		setArchivos((prev) => prev.filter((item) => item.id !== id));
	};

	const validate = () => {
		const nextErrors = {};

		if (!peticion.trim()) {
			nextErrors.peticion = 'Describe tu petición antes de continuar.';
		}

		if (!codigoPago.trim()) {
			nextErrors.codigoPago = 'Ingresa el código de pago.';
		}

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	// `onSubmit` ahora es la función que hace el trabajo real (llamar a
	// catalogService.crearExpediente). Si falla — red caída, backend
	// devolviendo un error de validación, etc. — el mensaje queda en
	// errors.form para mostrarlo en el formulario.
	const submit = async (onSubmit) => {
		if (!validate()) return false;

		setSubmitting(true);
		setErrors((prev) => ({ ...prev, form: undefined }));

		try {
			await onSubmit();
			return true;
		} catch (error) {
			setErrors((prev) => ({
				...prev,
				form: error?.message || 'No se pudo enviar el trámite. Intenta nuevamente.',
			}));
			return false;
		} finally {
			setSubmitting(false);
		}
	};

	return {
		peticion,
		setPeticion,
		archivos,
		addArchivos,
		removeArchivo,
		codigoPago,
		setCodigoPago,
		errors,
		submitting,
		submit,
	};
};