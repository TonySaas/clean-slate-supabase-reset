
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthActions = () => {
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      console.log('Login successful for user:', data?.user?.email);
      console.log('Login response data:', data);
      
      // Check if user has a profile and create one if missing
      if (data.user) {
        try {
          // First check if profile exists
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', data.user.id)
            .single();
            
          if (profileError && profileError.code === 'PGRST116') {
            console.log('No profile found for user, creating one...');
            
            // Get user metadata
            const metadata = data.user.user_metadata || {};
            
            // Get organization ID from metadata or fetch default
            let organizationId = metadata.organization_id;
            if (!organizationId) {
              const { data: orgData } = await supabase
                .from('organizations')
                .select('id')
                .limit(1)
                .single();
                
              organizationId = orgData?.id;
            }
            
            if (organizationId) {
              // Create user profile with upsert to handle race conditions
              const { error: insertError } = await supabase
                .from('user_profiles')
                .upsert({
                  id: data.user.id,
                  email: data.user.email,
                  first_name: metadata.first_name,
                  last_name: metadata.last_name,
                  phone: metadata.phone,
                  job_title: metadata.job_title,
                  organization_id: organizationId
                }, { onConflict: 'id' });
                
              if (insertError) {
                console.error('Failed to create user profile during login:', insertError);
              } else {
                console.log('Created user profile during login');
              }
              
              // Assign default role if needed
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
                      user_id: data.user.id,
                      role_id: roleData.id
                    });
                    
                  if (!roleError) {
                    console.log('Assigned default user role');
                  }
                }
              } catch (roleErr) {
                console.error('Error finding or assigning role:', roleErr);
              }
            }
          }
        } catch (profileErr) {
          console.error('Error checking/creating user profile:', profileErr);
        }
      }
      
      toast.success('Login successful');
      
      // The onAuthStateChange event will handle the redirect
      return data;
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async (redirectToLogin: boolean = false) => {
    try {
      console.log('Logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      console.log('Logout successful, redirecting to login page');
      toast.success('Logged out successfully');
      
      if (redirectToLogin) {
        // Force showing login page even if there's a session
        navigate('/login?logout=true');
      } else {
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error('Error logging out: ' + (error.message || 'Unknown error'));
    }
  };

  return { login, logout };
};
