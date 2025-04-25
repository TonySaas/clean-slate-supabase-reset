
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserRole {
  id: number;
  name: string;
}

export interface UserProfile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  job_title: string | null;
  organization_id: string;
  roles?: UserRole[];
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          try {
            // Fetch user profile
            let profileData;
            let profileError;

            // First attempt to get the profile
            const profileResult = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            profileData = profileResult.data;
            profileError = profileResult.error;

            if (profileError) {
              console.error('Error fetching profile:', profileError);
              // If profile doesn't exist but user is authenticated, create it from metadata
              if (profileError.code === 'PGRST116') {
                console.log('Profile not found, trying to create from metadata');
                
                // Get user metadata
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user?.user_metadata) {
                  const metadata = user.user_metadata;
                  const { error: insertError } = await supabase
                    .from('user_profiles')
                    .insert({
                      id: user.id,
                      email: user.email,
                      first_name: metadata.first_name,
                      last_name: metadata.last_name,
                      phone: metadata.phone,
                      job_title: metadata.job_title,
                      organization_id: metadata.organization_id
                    });
                    
                  if (insertError) {
                    console.error('Error creating profile from metadata:', insertError);
                    toast.error('Failed to create user profile');
                  } else {
                    // Retry fetching the profile
                    const { data: newProfileData, error: newProfileError } = await supabase
                      .from('user_profiles')
                      .select('*')
                      .eq('id', user.id)
                      .single();
                      
                    if (!newProfileError && newProfileData) {
                      profileData = newProfileData;
                      profileError = null;
                    }
                  }
                }
              } else {
                throw profileError;
              }
            }
            
            if (profileData?.organization_id) {
              // Fetch user roles in a separate query
              const { data: userRolesData, error: rolesError } = await supabase
                .from('user_roles')
                .select(`
                  role_id,
                  roles (id, name)
                `)
                .eq('user_id', session.user.id);
              
              if (rolesError) {
                console.error('Error fetching user roles:', rolesError);
              }
              
              // Transform roles data (if roles were fetched successfully)
              const roles = userRolesData ? userRolesData.map(ur => ({
                id: ur.role_id,
                name: ur.roles?.name || ''
              })) : [];
              
              // Create the user profile with roles
              const userProfile: UserProfile = {
                ...profileData,
                roles
              };

              setOrganizationId(profileData.organization_id);
              setProfile(userProfile);
              
              // Navigate to dashboard with organization ID
              console.log(`Redirecting to dashboard/${profileData.organization_id}`);
              navigate(`/dashboard/${profileData.organization_id}`);
            } else {
              console.error('User profile has no organization_id:', profileData);
              toast.error('Your account is not associated with an organization');
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            toast.error('Error loading user profile');
          }
        } else {
          setOrganizationId(null);
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // The onAuthStateChange event will handle the redirect to dashboard
      console.log('Login successful for user:', data?.user?.email);
      
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error logging out');
    }
  };

  // Helper method to check if user has a specific role
  const hasRole = (roleName: string) => {
    return profile?.roles?.some(role => role.name === roleName) || false;
  };

  return { 
    login, 
    logout, 
    isLoading, 
    organizationId, 
    profile,
    hasRole 
  };
};
