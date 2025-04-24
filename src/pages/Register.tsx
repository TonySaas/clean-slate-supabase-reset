
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RegistrationForm } from '@/components/auth/RegistrationForm';
import { AlertCircle } from 'lucide-react';

interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  jobTitle: string;
}

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const organizationId = searchParams.get('organization');

  useEffect(() => {
    if (!organizationId) {
      toast.error('No organization selected');
      navigate('/login');
    }
  }, [organizationId, navigate]);

  const handleSubmit = async (formData: RegistrationData) => {
    setErrorDetails(null);
    setEmailError(null);
    setIsSubmitting(true);
    
    try {
      console.log('Starting registration process with organization:', organizationId);
      
      // Step 1: Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            job_title: formData.jobTitle,
            organization_id: organizationId
          }
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        
        if (error.message?.toLowerCase().includes('user already registered') || 
            error.message?.toLowerCase().includes('already exists')) {
          setEmailError('This email is already registered. Please use a different email address.');
        } else {
          setErrorDetails(error.message || 'Unknown error occurred during registration');
        }
        
        setIsSubmitting(false);
        return;
      }
      
      if (!data.user) {
        setErrorDetails('No user data returned');
        setIsSubmitting(false);
        return;
      }
      
      console.log('User created successfully:', data.user.id);
      
      // Let's explicitly wait for the user to be created in the database
      // This longer timeout helps ensure the user exists before continuing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use the built-in trigger in Supabase to handle profile creation and role assignment
      // Many Supabase setups use database triggers to automatically create profiles
      // and assign roles when a new user is created in auth.users
      
      // If your Supabase project doesn't have these triggers set up, you need to check
      // with your database administrator or review the database configuration
      
      // Sign out and redirect to login
      await supabase.auth.signOut();
      toast.success('Registration successful! You can now log in with your new account.');
      navigate('/login');
    } catch (error: any) {
      console.error('Unexpected error during registration:', error);
      setErrorDetails(error.message || 'An unexpected error occurred');
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
        
        <RegistrationForm 
          onSubmit={handleSubmit}
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
}
