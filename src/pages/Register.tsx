
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useRegistration } from '@/hooks/useRegistration';
import { RegistrationContainer } from '@/components/auth/RegistrationContainer';

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const organizationId = searchParams.get('organization');
  
  const {
    handleRegistration,
    isSubmitting,
    errorDetails,
    emailError
  } = useRegistration(organizationId);

  useEffect(() => {
    if (!organizationId) {
      toast.error('No organization selected');
      navigate('/login');
    }
  }, [organizationId, navigate]);

  return (
    <RegistrationContainer
      onSubmit={handleRegistration}
      isSubmitting={isSubmitting}
      emailError={emailError}
      errorDetails={errorDetails}
    />
  );
}
