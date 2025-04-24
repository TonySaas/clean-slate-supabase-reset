
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const organizationId = searchParams.get('organization');

  useEffect(() => {
    if (!organizationId) {
      toast.error('No organization selected');
      navigate('/login');
    }
  }, [organizationId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetails(null);
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Starting registration process with organization:', organizationId);
      
      // 1. Create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            organization_id: organizationId,
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            job_title: jobTitle
          },
          // Don't auto-confirm email during registration to allow time for the database operations
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        console.error('Registration error:', error);
        setErrorDetails(error.message);
        throw error;
      }

      if (data?.user) {
        console.log('Registration successful, user created:', data.user.id);
        
        // 2. Wait a moment to ensure database operations complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 3. Sign out the user (to prevent auto-login before profile is fully created)
        await supabase.auth.signOut();
        
        toast.success('Registration successful! Please check your email to verify your account.');
        navigate('/login');
      } else {
        const msg = 'No user data returned from sign up';
        console.error(msg);
        setErrorDetails(msg);
        throw new Error(msg);
      }
    } catch (error: any) {
      console.error('Registration process failed:', error);
      
      // Show a more user-friendly error message for the database error
      if (error.message?.includes('Database error') || error.message?.includes('foreign key constraint')) {
        toast.error('Registration failed', {
          description: 'There was an issue creating your user profile. Please try again later or contact support.'
        });
      } else {
        toast.error('Registration failed', {
          description: error.message || 'An unexpected error occurred'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Input 
                  id="firstName" 
                  type="text" 
                  required 
                  value={firstName} 
                  onChange={e => setFirstName(e.target.value)} 
                  placeholder="Enter your first name" 
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <Input 
                  id="lastName" 
                  type="text" 
                  required 
                  value={lastName} 
                  onChange={e => setLastName(e.target.value)} 
                  placeholder="Enter your last name" 
                />
              </div>
            </div>
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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input 
                id="phone" 
                type="tel" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="Enter your phone number" 
              />
            </div>
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <Input 
                id="jobTitle" 
                type="text" 
                value={jobTitle} 
                onChange={e => setJobTitle(e.target.value)} 
                placeholder="Enter your job title" 
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
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input 
                id="confirmPassword" 
                type="password" 
                required 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder="Confirm your password" 
              />
            </div>
          </div>
          
          {errorDetails && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <p className="font-medium">Registration Error Details:</p>
              <p className="mt-1">{errorDetails}</p>
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </div>
    </div>
  );
}
