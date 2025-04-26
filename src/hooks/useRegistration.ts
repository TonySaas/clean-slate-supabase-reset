
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
      
      // Create the user profile directly instead of waiting for trigger
      console.log('Creating user profile manually...');
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
        console.error('Failed to create profile:', profileError);
        
        // Try upsert as fallback
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
          console.error('Failed to upsert profile:', upsertError);
        } else {
          console.log('Profile created via upsert');
        }
      } else {
        console.log('Profile created successfully');
      }
      
      // Assign roles: both 'user' and 'org_admin' roles
      console.log('Assigning user roles...');
      
      // Get the regular user role
      const { data: userRoleData } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'user')
        .single();
        
      if (userRoleData) {
        const { error: userRoleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role_id: userRoleData.id
          });
          
        if (userRoleError) {
          console.error('Failed to assign user role:', userRoleError);
        } else {
          console.log('User role assigned successfully');
        }
      }
      
      // Get the org_admin role
      const { data: adminRoleData } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'org_admin')
        .single();
        
      if (adminRoleData) {
        const { error: adminRoleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role_id: adminRoleData.id
          });
          
        if (adminRoleError) {
          console.error('Failed to assign org_admin role:', adminRoleError);
        } else {
          console.log('Org admin role assigned successfully');
        }
      } else {
        console.error('Could not find org_admin role');
      }
      
      // Also add entry to organization_admins table
      const { error: orgAdminError } = await supabase
        .from('organization_admins')
        .insert({
          user_id: authData.user.id,
          organization_id: organizationId
        });
        
      if (orgAdminError) {
        console.error('Failed to add to organization_admins table:', orgAdminError);
      } else {
        console.log('Added to organization_admins table');
      }
      
      // Auto sign in the user
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
