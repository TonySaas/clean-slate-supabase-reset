
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
      
      // First, check if the email already exists
      const { data: existingUser, error: checkError } = await supabase.auth.admin
        .listUsers({
          filter: {
            email: formData.email,
          },
        });

      if (checkError) {
        console.log('Error checking existing user:', checkError);
        // Continue with registration attempt even if check fails
      } else if (existingUser && existingUser.length > 0) {
        setEmailError('This email is already registered. Please use a different email address.');
        setIsSubmitting(false);
        return;
      }
      
      // Create the user through auth API - WITHOUT metadata to reduce complexity
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
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
      
      // Wait a short moment to ensure auth user creation is fully processed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        // Now create the user profile separately
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
          console.error('Error creating user profile:', profileError);
          setErrorDetails('Error creating user profile: ' + profileError.message);
          setIsSubmitting(false);
          return;
        }
        
        // Get role IDs first before trying to assign them
        const { data: userRoleData, error: userRoleError } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'user')
          .single();
          
        const { data: adminRoleData, error: adminRoleError } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'org_admin')
          .single();
        
        if (userRoleError) {
          console.error('Error getting user role ID:', userRoleError);
        } else {
          // Assign user role
          const { error: assignUserRoleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role_id: userRoleData.id
            });
            
          if (assignUserRoleError) {
            console.error('Error assigning user role:', assignUserRoleError);
          }
        }
        
        if (adminRoleError) {
          console.error('Error getting admin role ID:', adminRoleError);
        } else {
          // Assign org_admin role
          const { error: assignAdminRoleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role_id: adminRoleData.id
            });
            
          if (assignAdminRoleError) {
            console.error('Error assigning admin role:', assignAdminRoleError);
          }
        }
        
        // Sign out the user after successful registration
        await supabase.auth.signOut();
        toast.success('Registration successful! You can now log in with your new account.');
        navigate('/login');
      } catch (error: any) {
        console.error('Error in profile/role creation:', error);
        setErrorDetails('Error setting up user account: ' + error.message);
        setIsSubmitting(false);
      }
      
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
