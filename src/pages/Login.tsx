
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterDialog } from '@/components/auth/RegisterDialog';
import { useRegisterDialog } from '@/hooks/useRegisterDialog';

export default function Login() {
  const { login, isLoading: authLoading, organizationId } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    isRegisterDialogOpen,
    setIsRegisterDialogOpen,
    isCheckingOrgs,
    checkOrganizationsExist,
    organizations,
    isLoading: isLoadingOrgs,
    error: orgsError,
    refetch: refetchOrgs
  } = useRegisterDialog();

  useEffect(() => {
    const justRegistered = searchParams.get('registered');
    if (justRegistered === 'true') {
      toast.success('Registration successful! Please log in to continue.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (organizationId && !authLoading) {
      console.log('User already logged in, redirecting to dashboard with org ID:', organizationId);
      navigate(`/dashboard/${organizationId}`, { replace: true });
    }
  }, [organizationId, authLoading, navigate]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsSubmitting(true);
      console.log('Attempting login for:', email);
      await login(email, password);
      console.log('Login function completed');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials and try again'
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = (organizationId: string) => {
    setIsRegisterDialogOpen(false);
    navigate(`/register?organization=${organizationId}`);
  };

  if (organizationId && !authLoading) {
    console.log('Redirecting to dashboard in render with org ID:', organizationId);
    return <Navigate to={`/dashboard/${organizationId}`} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <LoginForm onSubmit={handleLogin} isSubmitting={isSubmitting} />
        
        <div className="mt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={() => checkOrganizationsExist()}
            disabled={isCheckingOrgs}
          >
            {isCheckingOrgs ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Checking organizations...
              </>
            ) : 'Register'}
          </Button>
        </div>
      </div>

      <RegisterDialog
        isOpen={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
        organizations={organizations}
        isLoading={isLoadingOrgs}
        error={orgsError}
        onSelectOrganization={handleRegister}
        onRefetch={refetchOrgs}
      />
    </div>
  );
}
