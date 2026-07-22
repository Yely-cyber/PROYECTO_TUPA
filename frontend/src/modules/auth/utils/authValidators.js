const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const dniPattern = /^\d{8}$/;
const rucPattern = /^\d{11}$/;
const passportPattern = /^[A-Z0-9\-]{6,20}$/i;

export const isRequired = (value) => String(value ?? '').trim().length > 0;

export const isEmail = (value) => emailPattern.test(String(value ?? '').trim());

export const isDni = (value) => dniPattern.test(String(value ?? '').trim());

export const isRuc = (value) => rucPattern.test(String(value ?? '').trim());

export const isPassportOrDni = (value) => isDni(value) || passportPattern.test(String(value ?? '').trim());

export const isPhone = (value) => /^\+?[0-9\s()-]{7,15}$/.test(String(value ?? '').trim());

export const normalizeText = (value) => String(value ?? '').trim();

export const validatorsByField = {
	correo: isEmail,
	email: isEmail,
	telefono: isPhone,
	dni: isDni,
	ruc: isRuc,
	documento: isPassportOrDni,
	'pasaporte o dni': isPassportOrDni,
};

export const validateField = (fieldName, value, rules = {}) => {
	const currentValue = normalizeText(value);

	if (rules.required !== false && !isRequired(currentValue)) {
		return 'Este campo es obligatorio.';
	}

	const validator = rules.validate || validatorsByField[fieldName.toLowerCase()];
	if (validator && currentValue && !validator(currentValue)) {
		return rules.message || 'El valor ingresado no es válido.';
	}

	return '';
};

export const validateStep = (fields, values) => {
	return fields.reduce((accumulator, field) => {
		const error = validateField(field.name, values[field.name], field);
		if (error) {
			accumulator[field.name] = error;
		}
		return accumulator;
	}, {});
};
