
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
      
      // Check if email is already in use first
      const { data: existingUserData } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: 'temporary-check-only',  // We expect this to fail, but differently if user exists
      });
      
      if (existingUserData?.user) {
        setEmailError('This email is already registered. Please use a different email address.');
        setIsSubmitting(false);
        return;
      }
      
      // Now attempt to sign up the user - without metadata to simplify the process
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('Registration error from Supabase:', error);
        
        // Handle email already registered error - though we tried to catch this earlier
        if (error.message?.includes('already registered')) {
          setEmailError('This email is already registered. Please use a different email address.');
        } else {
          setErrorDetails(error.message);
        }
        
        throw error;
      }

      if (data?.user) {
        console.log('Auth user created successfully:', data.user.id);
        
        // Now update the user metadata and insert profile manually
        try {
          // Update metadata
          const { error: updateError } = await supabase.auth.updateUser({
            data: {
              organization_id: organizationId,
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone: formData.phone,
              job_title: formData.jobTitle
            }
          });
          
          if (updateError) throw updateError;
          
          // Manually insert into profiles table
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
          
          if (profileError) throw profileError;
          
          // Manually insert into user_roles table
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role_id: 1 // Assuming 1 is for the basic 'user' role
            });
          
          if (roleError) throw roleError;
          
          // Sign out the user to ensure clean state
          await supabase.auth.signOut();
          
          toast.success('Registration successful! You can now log in with your new account.');
          navigate('/login');
        } catch (profileError: any) {
          console.error('Error creating user profile or roles:', profileError);
          setErrorDetails(`Profile error: ${profileError.message}`);
          
          // Try to delete the user if profile creation failed
          try {
            // This requires admin rights, so it may not work
            // In a real app, you'd need a server function to handle this cleanup
            const { error: deleteError } = await supabase.auth.admin.deleteUser(data.user.id);
            if (deleteError) console.error('Failed to clean up user after profile creation error:', deleteError);
          } catch (cleanupError) {
            console.error('Failed to clean up after error:', cleanupError);
          }
        }
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
      } else if (!emailError) {
        // Only show general toast if we don't have a specific email error
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
