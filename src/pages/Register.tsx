
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
      console.log('Starting registration process:', {
        email: formData.email,
        organizationId,
        firstName: formData.firstName,
        lastName: formData.lastName
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
      
      // Explicitly create user profile with a retry mechanism
      let profileCreated = false;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (!profileCreated && retryCount < maxRetries) {
        try {
          // First check if profile already exists
          const { data: existingProfile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', authData.user.id)
            .single();
            
          if (existingProfile) {
            console.log('User profile already exists, skipping creation');
            profileCreated = true;
          } else {
            // Create user profile manually
            const { error: profileError } = await supabase
              .from('user_profiles')
              .insert({
                id: authData.user.id,
                organization_id: organizationId,
                email: formData.email,
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone: formData.phone,
                job_title: formData.jobTitle
              });
              
            if (profileError) {
              console.error(`Error creating user profile (attempt ${retryCount + 1}):`, profileError);
              retryCount++;
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 500));
            } else {
              console.log('User profile created manually successfully');
              profileCreated = true;
            }
          }
        } catch (err) {
          console.error(`Error in profile creation attempt ${retryCount + 1}:`, err);
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      if (!profileCreated) {
        console.error('Failed to create user profile after multiple attempts');
        // Continue anyway, as we'll try to recover later
      }
      
      // Assign a basic user role
      try {
        const { data: roleData } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'user')
          .single();
          
        if (roleData) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: authData.user.id,
              role_id: roleData.id
            });
            
          if (roleError) {
            console.error('Error assigning user role:', roleError);
          } else {
            console.log('User role assigned successfully');
          }
        }
      } catch (roleErr) {
        console.error('Error finding or assigning role:', roleErr);
      }
      
      // Sign in the user immediately after successful registration
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (signInError) {
        console.error('Auto sign-in error:', signInError);
        toast.success('Registration successful! Please log in to continue.');
        navigate('/login?registered=true');
        return;
      }
      
      // Redirect to dashboard with organization ID
      toast.success('Registration successful!');
      navigate(`/dashboard/${organizationId}`);
      
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
