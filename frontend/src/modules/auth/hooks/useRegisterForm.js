import { useMemo, useState } from 'react';
import { completeRegistration, saveRegistrationStep } from '../services/authService';
import { validateField, validateStep } from '../utils/authValidators';

const buildInitialValues = (steps, defaults = {}) => {
	return steps.reduce((accumulator, step) => {
		step.fields.forEach((field) => {
			accumulator[field.name] = defaults[field.name] ?? (field.type === 'checkbox' ? Boolean(field.defaultChecked) : field.defaultValue ?? '');
		});
		return accumulator;
	}, {});
};

export const useRegisterForm = ({ profile, steps, defaultValues = {}, onSuccess }) => {
	const initialValues = useMemo(() => buildInitialValues(steps, defaultValues), [steps, defaultValues]);
	const [currentStep, setCurrentStep] = useState(0);
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [registrationId, setRegistrationId] = useState(null);

	const activeStep = steps[currentStep];

	const reset = () => {
		setValues(initialValues);
		setCurrentStep(0);
		setErrors({});
		setSubmitted(false);
		setRegistrationId(null);
	};

	const setValue = (fieldName, nextValue) => {
		setValues((currentValues) => ({ ...currentValues, [fieldName]: nextValue }));
		setErrors((currentErrors) => {
			if (!currentErrors[fieldName]) {
				return currentErrors;
			}

			const nextErrors = { ...currentErrors };
			delete nextErrors[fieldName];
			return nextErrors;
		});
	};

	const handleFieldChange = (field) => (event) => {
		const { type, checked, value } = event.target;
		setValue(field.name, type === 'checkbox' ? checked : value);
	};

	const canGoBack = currentStep > 0;
	const isLastStep = currentStep === steps.length - 1;

	const next = async () => {
		const nextErrors = validateStep(activeStep.fields, values);
		setErrors(nextErrors);

		if (Object.keys(nextErrors).length > 0) {
			return { success: false, errors: nextErrors };
		}

		if (!isLastStep) {
			const response = await saveRegistrationStep({
				profile,
				stepKey: activeStep.key,
				data: values,
				registrationId,
			});

			if (!response.success) {
				setErrors({ form: response.message || 'No se pudo guardar el paso.' });
				return response;
			}

			setRegistrationId(response.registration?.id ?? registrationId);
			setCurrentStep((step) => step + 1);
			return { success: true, step: currentStep + 1, registration: response.registration };
		}

		setSubmitting(true);
		const response = await completeRegistration({
			profile,
			stepKey: activeStep.key,
			data: values,
			registrationId,
		});
		setSubmitting(false);

		if (!response.success) {
			setErrors({ form: response.message || 'No se pudo registrar la información.' });
			return response;
		}

		setSubmitted(true);
		setRegistrationId(response.registration?.id ?? registrationId);
		if (typeof onSuccess === 'function') {
			onSuccess(response.registration, values);
		}

		return response;
	};

	const back = () => {
		if (canGoBack) {
			setCurrentStep((step) => step - 1);
		}
	};

	const validateCurrentField = (fieldName, fieldValue, rules = {}) => validateField(fieldName, fieldValue, rules);

	return {
		values,
		errors,
		currentStep,
		activeStep,
		submitting,
		submitted,
		canGoBack,
		isLastStep,
		setValue,
		handleFieldChange,
		next,
		back,
		reset,
		setCurrentStep,
		validateCurrentField,
		registrationId,
	};
};
