
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
      
      // Check if email is already registered
      const { data: emailCheckData, error: emailCheckError } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('email', formData.email)
        .maybeSingle();
        
      if (emailCheckData) {
        setEmailError('This email is already registered. Please use a different email address.');
        setIsSubmitting(false);
        return;
      }
      
      // Create the auth user
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
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        
        if (error.message?.includes('already registered')) {
          setEmailError('This email is already registered. Please use a different email address.');
        } else {
          setErrorDetails(error.message);
        }
        
        throw error;
      }

      if (data?.user) {
        console.log('User created successfully:', data.user.id);
        
        // Wait a short time to ensure auth user is fully created in the database
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          // Manually insert into profiles table as fallback
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              organization_id: organizationId,
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone: formData.phone,
              job_title: formData.jobTitle
            });
          
          if (profileError) {
            console.error('Profile creation error:', profileError);
            if (!profileError.message.includes('duplicate key')) {
              throw profileError;
            }
          }
          
          // If successfully created the profile, assign user role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role_id: 1 // Assuming 1 is for the basic 'user' role
            });
          
          if (roleError) {
            console.error('Role assignment error:', roleError);
            // Continue even if role assignment fails - we can fix it later
          }
          
          // Sign out the user to ensure clean state
          await supabase.auth.signOut();
          
          toast.success('Registration successful! You can now log in with your new account.');
          navigate('/login');
        } catch (err: any) {
          console.error('Error in profile/role creation:', err);
          setErrorDetails(`Profile error: ${err.message}`);
          
          // We won't try to delete the auth user as that requires admin rights
          // But we'll let the user know there was an issue with profile creation
          toast.error('Account created but there was an issue with profile setup. Please contact support.');
        }
      } else {
        setErrorDetails('No user data returned from sign up');
        throw new Error('No user data returned');
      }
    } catch (error: any) {
      console.error('Registration process failed:', error);
      
      if (!emailError) {
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
          emailError={emailError}
        />
        
        {errorDetails && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            <p className="font-medium flex items-center gap-2">
              <AlertCircle size={16} />
              Registration Error Details:
            </p>
            <p className="mt-1">{errorDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
}
