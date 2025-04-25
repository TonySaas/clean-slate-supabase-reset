
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
    refetch
  } = useRegisterDialog();

  useEffect(() => {
    const justRegistered = searchParams.get('registered');
    if (justRegistered === 'true') {
      toast.success('Registration successful! Please log in.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (organizationId && !authLoading) {
      navigate(`/dashboard/${organizationId}`, { replace: true });
    }
  }, [organizationId, authLoading, navigate]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials'
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
  
  const handleRegisterClick = async () => {
    await checkOrganizationsExist();
  };

  if (organizationId && !authLoading) {
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
            onClick={handleRegisterClick}
            disabled={isCheckingOrgs}
          >
            {isCheckingOrgs ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
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
        onRefetch={refetch}
      />
    </div>
  );
}
