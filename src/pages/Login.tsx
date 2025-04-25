
import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useOrganizations } from '@/hooks/useOrganizations';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Login() {
  const { login, isLoading, organizationId } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const { data: organizations, isLoading: isLoadingOrgs, error: orgsError, refetch: refetchOrgs } = useOrganizations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Show success message if user just registered
  useEffect(() => {
    const justRegistered = searchParams.get('registered');
    if (justRegistered === 'true') {
      toast.success('Registration successful! Please log in to continue.');
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (organizationId && !isLoading) {
      console.log('User already logged in, redirecting to dashboard with org ID:', organizationId);
      navigate(`/dashboard/${organizationId}`, { replace: true });
    }
  }, [organizationId, isLoading, navigate]);

  // Fetch organizations when dialog opens
  useEffect(() => {
    if (isRegisterDialogOpen) {
      refetchOrgs();
    }
  }, [isRegisterDialogOpen, refetchOrgs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);
    
    try {
      console.log('Attempting login for:', email);
      await login(email, password);
      console.log('Login function completed');
      // The redirect will happen automatically in the useAuth hook via useEffect above
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Invalid email or password');
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials and try again'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = (organizationId: string) => {
    setIsRegisterDialogOpen(false);
    navigate(`/register?organization=${organizationId}`);
  };

  // Check if there are any organizations in the database
  const checkOrganizationsExist = async () => {
    try {
      // If we don't have organizations data yet, fetch directly
      if (!organizations || organizations.length === 0) {
        const { data, error } = await supabase
          .from('organizations')
          .select('id, name')
          .limit(1);
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          toast.error("No organizations found", {
            description: "Please contact an administrator to set up organizations"
          });
          return false;
        }
        return true;
      }
      
      return organizations.length > 0;
    } catch (error) {
      console.error("Error checking organizations:", error);
      toast.error("Failed to check organizations");
      return false;
    }
  };

  const handleOpenRegisterDialog = async () => {
    const hasOrgs = await checkOrganizationsExist();
    if (hasOrgs) {
      setIsRegisterDialogOpen(true);
    }
  };

  if (organizationId && !isLoading) {
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
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Enter your email" 
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Enter your password" 
              />
            </div>
            
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2 text-sm text-red-700">
                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={handleOpenRegisterDialog}
            >
              Register
            </Button>
          </div>
        </form>
      </div>

      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Your Organization</DialogTitle>
            <DialogDescription>
              Choose an organization to register with
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {isLoadingOrgs ? (
              <p className="text-center text-gray-500 py-4">Loading organizations...</p>
            ) : orgsError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-center">
                <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                <p className="text-red-700">Failed to load organizations</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2" 
                  onClick={() => refetchOrgs()}
                >
                  Try Again
                </Button>
              </div>
            ) : !organizations || organizations.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded text-center">
                <AlertCircle className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                <p className="text-amber-700">No organizations found</p>
                <p className="text-sm text-amber-600 mt-1">
                  Please contact an administrator to set up organizations
                </p>
              </div>
            ) : (
              organizations.map((org) => (
                <Button
                  key={org.id}
                  variant="outline"
                  className="w-full text-left justify-start h-auto py-4"
                  onClick={() => handleRegister(org.id)}
                >
                  <div className="flex items-center gap-3">
                    {org.logo_url && (
                      <img 
                        src={org.logo_url} 
                        alt={org.name} 
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'placeholder.svg';
                        }}
                      />
                    )}
                    <span>{org.name}</span>
                  </div>
                </Button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
