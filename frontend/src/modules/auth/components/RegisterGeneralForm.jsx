import { RegisterWizardForm } from './RegisterWizardForm';
import { registrationFlows } from '../data/registrationFlows';

export const RegisterGeneralForm = () => <RegisterWizardForm {...registrationFlows.general} cancelPath="/" />;
