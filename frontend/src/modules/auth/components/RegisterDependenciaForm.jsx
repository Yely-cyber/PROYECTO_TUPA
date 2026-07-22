import { RegisterWizardForm } from './RegisterWizardForm';
import { registrationFlows } from '../data/registrationFlows';

export const RegisterDependenciaForm = () => <RegisterWizardForm {...registrationFlows.dependencia} cancelPath="/" />;
