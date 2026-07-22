import { RegisterWizardForm } from './RegisterWizardForm';
import { registrationFlows } from '../data/registrationFlows';

export const RegisterEstudianteForm = () => <RegisterWizardForm {...registrationFlows.estudiante} cancelPath="/" />;
