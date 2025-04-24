
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
      
      // First, check if user already exists to provide a better error message
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', formData.email)
        .single();
        
      if (existingUser) {
        setEmailError('This email is already registered. Please use a different email address.');
        setIsSubmitting(false);
        return;
      }
      
      // User signup with metadata but WITHOUT auto handling of profiles/roles
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
      
      // Manual creation of user profile to avoid race conditions
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
      
      // Manual assignment of user roles
      const { data: roleData } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'user')
        .single();
        
      if (roleData) {
        await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role_id: roleData.id
          });
      }
      
      // If organization_id is provided, assign org_admin role
      if (organizationId) {
        const { data: orgAdminRoleData } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'org_admin')
          .single();
          
        if (orgAdminRoleData) {
          await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role_id: orgAdminRoleData.id
            });
        }
      }
      
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
