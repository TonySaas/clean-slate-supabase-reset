
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterDialog } from '@/components/auth/RegisterDialog';
import { useRegisterDialog } from '@/hooks/useRegisterDialog';
import { supabase } from '@/integrations/supabase/client';

export default function Login() {
  const { login, isLoading: authLoading, organizationId, profile, hasRole } = useAuth();
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
  const [forceShowLogin, setForceShowLogin] = useState(false);

  useEffect(() => {
    const justRegistered = searchParams.get('registered');
    if (justRegistered === 'true') {
      toast.success('Registration successful! Please log in.');
    }
    
    // Check if we have a logout parameter to force showing login
    const showLogin = searchParams.get('logout');
    if (showLogin === 'true') {
      setForceShowLogin(true);
    }
  }, [searchParams]);

  // Use this effect to redirect users based on their role
  useEffect(() => {
    if (profile && !authLoading && !forceShowLogin) {
      if (hasRole('platform_admin')) {
        navigate('/organizations', { replace: true });
      } else if (hasRole('org_admin')) {
        navigate('/organization-dashboard', { replace: true });
      } else if (organizationId) {
        navigate(`/dashboard/${organizationId}`, { replace: true });
      }
    }
  }, [profile, authLoading, organizationId, navigate, forceShowLogin, hasRole]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsSubmitting(true);
      console.log('Login attempt for:', email);
      await login(email, password);
      // The redirect will happen via the useEffect above once profile is set
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials'
      });
      setIsSubmitting(false);
    }
  };

  const handleRegister = (organizationId: string) => {
    console.log('Selected organization for registration:', organizationId);
    setIsRegisterDialogOpen(false);
    navigate(`/register?organization=${organizationId}`);
  };
  
  const handleRegisterClick = () => {
    console.log('Register button clicked, checking organizations...');
    checkOrganizationsExist();
  };

  // Handle manual logout if needed
  const handleForceLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    setForceShowLogin(true);
  };

  // If user is already authenticated and has an organization, and we're not forcing login display,
  // the useEffect will handle the redirection
  if (profile && !authLoading && !forceShowLogin) {
    // Return loading while the useEffect handles the redirection
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        {/* Show a "Force Logout" button if user is already authenticated but we're forcing login screen */}
        {profile && forceShowLogin && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-4">
            <p className="text-yellow-800 text-sm mb-2">
              You're already logged in but viewing the login page.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleForceLogout}
              className="w-full"
            >
              Sign out to login as different user
            </Button>
          </div>
        )}
        
        <LoginForm onSubmit={handleLogin} isSubmitting={isSubmitting} />
        
        <div className="mt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={handleRegisterClick}
            disabled={isCheckingOrgs || isLoadingOrgs}
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
