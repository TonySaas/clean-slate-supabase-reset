
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RegistrationForm } from '@/components/auth/RegistrationForm';

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
  const organizationId = searchParams.get('organization');

  useEffect(() => {
    if (!organizationId) {
      toast.error('No organization selected');
      navigate('/login');
    }
  }, [organizationId, navigate]);

  const handleSubmit = async (formData: RegistrationData) => {
    setErrorDetails(null);
    setIsSubmitting(true);
    
    try {
      console.log('Starting registration process with organization:', organizationId);
      
      // First attempt to sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            organization_id: organizationId,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            job_title: formData.jobTitle
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        console.error('Registration error from Supabase:', error);
        setErrorDetails(error.message);
        throw error;
      }

      if (data?.user) {
        console.log('Auth user created successfully:', data.user.id);
        
        // Add a short delay to allow the database trigger to complete
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verify the user profile was created successfully
        const { error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error('Error verifying user profile:', profileError);
          if (profileError.code === 'PGRST116') {
            throw new Error('User profile was not created properly. Please try again.');
          }
        }
        
        // Sign out the user to ensure clean state
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
      
      // Handle specific error cases with more user-friendly messages
      if (error.message?.includes('Database error') || error.message?.includes('foreign key constraint')) {
        toast.error('Registration failed', {
          description: 'There was an issue creating your profile. Please try again with a different email address.'
        });
      } else if (error.message?.includes('already registered')) {
        toast.error('Registration failed', {
          description: 'This email is already registered. Please try logging in or use a different email.'
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
        
        <RegistrationForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
        
        {errorDetails && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            <p className="font-medium">Registration Error Details:</p>
            <p className="mt-1">{errorDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
}
