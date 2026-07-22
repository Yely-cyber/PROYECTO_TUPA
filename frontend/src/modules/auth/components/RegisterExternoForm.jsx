import { RegisterWizardForm } from './RegisterWizardForm';
import { registrationFlows } from '../data/registrationFlows';

export const RegisterExternoForm = () => <RegisterWizardForm {...registrationFlows.externo} cancelPath="/" />;
