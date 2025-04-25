
import { AlertCircle } from 'lucide-react';
import { RegistrationForm } from './RegistrationForm';

interface RegistrationContainerProps {
  onSubmit: (formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    jobTitle: string;
  }) => void;
  isSubmitting: boolean;
  emailError: string | null;
  errorDetails: string | null;
}

export const RegistrationContainer = ({
  onSubmit,
  isSubmitting,
  emailError,
  errorDetails
}: RegistrationContainerProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        
        <RegistrationForm 
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          emailError={emailError}
        />
        
        {errorDetails && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            <p className="font-medium flex items-center gap-2">
              <AlertCircle size={16} />
              Registration Error:
            </p>
            <p className="mt-1">{errorDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
};
