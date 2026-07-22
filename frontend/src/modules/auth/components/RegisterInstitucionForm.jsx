import { RegisterWizardForm } from './RegisterWizardForm';
import { registrationFlows } from '../data/registrationFlows';

export const RegisterInstitucionForm = () => <RegisterWizardForm {...registrationFlows.institucion} cancelPath="/" />;
