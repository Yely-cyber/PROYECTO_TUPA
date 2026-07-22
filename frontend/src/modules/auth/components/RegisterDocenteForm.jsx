import { RegisterWizardForm } from './RegisterWizardForm';
import { registrationFlows } from '../data/registrationFlows';

export const RegisterDocenteForm = () => <RegisterWizardForm {...registrationFlows.docente} cancelPath="/" />;
