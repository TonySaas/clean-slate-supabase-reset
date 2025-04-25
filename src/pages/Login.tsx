
import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useOrganizations } from '@/hooks/useOrganizations';
import { AlertTriangle } from 'lucide-react';

export default function Login() {
  const { login, isLoading, organizationId } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const { data: organizations, isLoading: isLoadingOrgs } = useOrganizations();
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
  if (organizationId && !isLoading) {
    console.log('User already logged in, redirecting to dashboard');
    return <Navigate to={`/dashboard/${organizationId}`} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      // The redirect will happen automatically in the useAuth hook
    } catch (error: any) {
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
              onClick={() => setIsRegisterDialogOpen(true)}
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
              <p className="text-center text-gray-500">Loading organizations...</p>
            ) : (
              organizations?.map((org) => (
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
