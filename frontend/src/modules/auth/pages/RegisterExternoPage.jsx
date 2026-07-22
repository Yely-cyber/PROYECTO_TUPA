import { AuthLayout } from '../components/AuthLayout';
import { RegisterWizardForm } from '../components/RegisterWizardForm';
import { registrationFlows } from '../data/registrationFlows';

export const RegisterExternoPage = () => {
	const flow = registrationFlows.externo;

	return (
		<AuthLayout>
			<RegisterWizardForm {...flow} cancelPath="/" />
		</AuthLayout>
	);
};