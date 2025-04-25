
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
      // Log the registration attempt with organization ID
      console.log('Starting registration process:', {
        email: formData.email,
        organizationId,
        metadata: {
          organization_id: organizationId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          job_title: formData.jobTitle
        }
      });

      // Create the user with auth API
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            organization_id: organizationId,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            job_title: formData.jobTitle
          }
        }
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        if (signUpError.message?.toLowerCase().includes('email') || 
            signUpError.message?.toLowerCase().includes('already registered')) {
          setEmailError('This email is already registered');
        } else {
          setErrorDetails(signUpError.message);
        }
        setIsSubmitting(false);
        return;
      }

      if (!authData.user) {
        throw new Error('No user data returned from signup');
      }

      console.log('User created successfully:', {
        userId: authData.user.id,
        email: authData.user.email
      });
      
      // IMPORTANT: Always manually create user profile to ensure it exists
      try {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            job_title: formData.jobTitle,
            organization_id: organizationId
          });
          
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          toast.error('Error creating user profile, but account was created');
        } else {
          console.log('User profile created successfully');
        }

        // Add default user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role_id: 1 // Assuming 1 is the 'user' role ID
          });
          
        if (roleError && !roleError.message?.includes('duplicate')) {
          console.error('Error creating user role:', roleError);
        } else {
          console.log('User role created successfully');
        }
      } catch (err) {
        console.error('Error in profile/role creation:', err);
      }

      // Sign out the user after successful registration
      await supabase.auth.signOut();
      
      toast.success('Registration successful! Please log in to continue.');
      
      // Redirect to login page with success message
      navigate('/login?registered=true');
      
    } catch (error: any) {
      console.error('Unexpected registration error:', error);
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
