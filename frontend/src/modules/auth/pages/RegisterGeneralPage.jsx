import { AuthLayout } from '../components/AuthLayout';
import { RegisterWizardForm } from '../components/RegisterWizardForm';
import { registrationFlows } from '../data/registrationFlows';

export const RegisterGeneralPage = () => {
	const flow = registrationFlows.general;

	return (
		<AuthLayout>
			<RegisterWizardForm {...flow} cancelPath="/" />
		</AuthLayout>
	);
};