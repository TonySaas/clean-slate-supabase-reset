
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

      if (!organizationId) {
        throw new Error('Organization ID is required for registration');
      }

      // Step 1: Create the Auth user
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
      
      // Wait a longer delay to ensure the auth process completes
      // This gives more time for the database trigger to run if it exists
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 2: Check if profile already exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', authData.user.id)
        .single();
        
      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        console.error('Error checking for profile:', profileCheckError);
      }
      
      // Step 3: Manually create profile if it doesn't exist
      if (!existingProfile) {
        console.log('No profile found, creating one manually');
        
        // First try using the RPC endpoint if available
        try {
          const { error: rpcError } = await supabase.rpc('create_user_profile', {
            user_id: authData.user.id,
            org_id: organizationId,
            user_email: formData.email,
            first: formData.firstName,
            last: formData.lastName,
            user_phone: formData.phone,
            job: formData.jobTitle
          });
          
          if (rpcError) {
            console.log('RPC method not available, falling back to direct insert:', rpcError);
            // Fall back to direct insert
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
              // Try upsert as a last resort
              const { error: upsertError } = await supabase
                .from('user_profiles')
                .upsert({
                  id: authData.user.id,
                  organization_id: organizationId,
                  email: formData.email,
                  first_name: formData.firstName,
                  last_name: formData.lastName,
                  phone: formData.phone,
                  job_title: formData.jobTitle
                }, { onConflict: 'id' });
                
              if (upsertError) {
                console.error('Failed to upsert user profile:', upsertError);
                setErrorDetails(`Profile creation failed: ${upsertError.message}`);
                setIsSubmitting(false);
                return;
              } else {
                console.log('User profile upserted successfully');
              }
            } else {
              console.log('User profile created successfully via direct insert');
            }
          } else {
            console.log('User profile created successfully via RPC');
          }
        } catch (createError: any) {
          console.error('Exception during profile creation:', createError);
          
          // Final fallback - direct insert with minimal data
          try {
            const { error: lastResortError } = await supabase
              .from('user_profiles')
              .insert({
                id: authData.user.id,
                organization_id: organizationId,
                email: formData.email
              });
              
            if (lastResortError) {
              console.error('Final attempt to create profile failed:', lastResortError);
              setErrorDetails(`Profile creation failed: ${lastResortError.message}`);
              setIsSubmitting(false);
              return;
            } else {
              console.log('Basic user profile created successfully as last resort');
            }
          } catch (finalError) {
            console.error('All profile creation attempts failed:', finalError);
            setErrorDetails('Could not create user profile after multiple attempts');
            setIsSubmitting(false);
            return;
          }
        }
      } else {
        console.log('User profile already exists, skipping creation');
      }
      
      // Step 4: Assign default role to the user
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
      
      // Step 5: Auto sign in the user
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
