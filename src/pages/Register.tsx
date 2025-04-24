
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
      
      // First check if email already exists in user profiles
      const { data: existingProfile, error: emailCheckError } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('email', formData.email)
        .single();
        
      if (emailCheckError && emailCheckError.code !== 'PGRST116') {
        // PGRST116 means "no rows returned" which is what we want
        console.error('Error checking email:', emailCheckError);
        throw new Error(`Email check failed: ${emailCheckError.message}`);
      }
      
      if (existingProfile) {
        setEmailError('This email is already registered. Please use a different email address.');
        setIsSubmitting(false);
        return;
      }
      
      // Create the user with auth.signUp but DON'T try to add profile or role data here
      // We'll do that after confirming the user was created successfully
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // Only include minimal metadata for now
          data: {
            organization_id: organizationId,
          }
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        
        if (error.message?.includes('already registered')) {
          setEmailError('This email is already registered. Please use a different email address.');
        } else {
          setErrorDetails(error.message || 'Unknown error occurred');
        }
        
        setIsSubmitting(false);
        return;
      }
      
      if (!data.user || !data.user.id) {
        setErrorDetails('No user data returned');
        setIsSubmitting(false);
        return;
      }
      
      console.log('User created successfully:', data.user.id);

      // Now that user is created, insert into user_profiles manually
      try {
        // Wait a moment to ensure the auth user is fully created
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Now create the profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            job_title: formData.jobTitle,
            organization_id: organizationId
          });
        
        if (profileError) {
          console.error('Error creating profile manually:', profileError);
          setErrorDetails(`Profile creation error: ${profileError.message}`);
          setIsSubmitting(false);
          return;
        }
        
        // Now create the user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role_id: 1 // Assuming 1 is for basic user role
          });
        
        if (roleError) {
          console.error('Error assigning role:', roleError);
          // Continue even if role assignment fails
        }
        
        // Sign out the user
        await supabase.auth.signOut();
        
        toast.success('Registration successful! You can now log in with your new account.');
        navigate('/login');
      } catch (err: any) {
        console.error('Error in profile/role creation:', err);
        setErrorDetails(`Profile error: ${err.message}`);
        setIsSubmitting(false);
      }
      
    } catch (error: any) {
      console.error('Registration process failed:', error);
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
              Registration Error Details:
            </p>
            <p className="mt-1">{errorDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
}
