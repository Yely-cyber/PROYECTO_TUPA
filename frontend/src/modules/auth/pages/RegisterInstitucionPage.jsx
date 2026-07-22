import { AuthLayout } from '../components/AuthLayout';
import { RegisterWizardForm } from '../components/RegisterWizardForm';
import { registrationFlows } from '../data/registrationFlows';

export const RegisterInstitucionPage = () => {
	const flow = registrationFlows.institucion;

	return (
		<AuthLayout>
			<RegisterWizardForm {...flow} cancelPath="/" />
		</AuthLayout>
	);
};