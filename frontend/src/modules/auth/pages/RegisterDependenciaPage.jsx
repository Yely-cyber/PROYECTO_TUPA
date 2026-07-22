import { AuthLayout } from '../components/AuthLayout';
import { RegisterWizardForm } from '../components/RegisterWizardForm';
import { registrationFlows } from '../data/registrationFlows';

export const RegisterDependenciaPage = () => {
	const flow = registrationFlows.dependencia;

	return (
		<AuthLayout>
			<RegisterWizardForm {...flow} cancelPath="/" />
		</AuthLayout>
	);
};