
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  jobTitle: string;
}

export const useRegistration = (organizationId: string | null) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleRegistration = async (formData: RegistrationData) => {
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
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', authData.user.id)
        .single();
        
      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        console.error('Error checking for profile:', profileCheckError);
      }
      
      if (!existingProfile) {
        console.log('No profile found, creating one manually');
        
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
          console.error('Failed to create user profile:', profileError);
        } else {
          console.log('User profile created successfully');
        }
      } else {
        console.log('User profile already exists, skipping creation');
      }
      
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
      
      toast.success('Registration successful!');
      navigate(`/dashboard/${organizationId}`);
      
    } catch (error: any) {
      console.error('Unexpected registration error:', error);
      setErrorDetails(error.message || 'An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  return {
    handleRegistration,
    isSubmitting,
    errorDetails,
    emailError
  };
};
