import { AuthLayout } from '../components/AuthLayout';
import { RegisterWizardForm } from '../components/RegisterWizardForm';
import { registrationFlows } from '../data/registrationFlows';

export const RegisterDocentePage = () => {
	const flow = registrationFlows.docente;

	return (
		<AuthLayout>
			<RegisterWizardForm {...flow} cancelPath="/" />
		</AuthLayout>
	);
};