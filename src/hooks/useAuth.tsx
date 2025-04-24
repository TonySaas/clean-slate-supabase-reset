
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
            // Fetch user profile with roles
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select(`
                *,
                user_roles (
                  role_id,
                  roles (name)
                )
              `)
              .eq('id', session.user.id)
              .single();

            if (profileError) throw profileError;
            
            if (profileData?.organization_id) {
              // Transform roles data
              const userProfile: UserProfile = {
                ...profileData,
                roles: profileData.user_roles?.map(ur => ({
                  id: ur.role_id,
                  name: ur.roles?.name || ''
                })) || []
              };

              setOrganizationId(profileData.organization_id);
              setProfile(userProfile);
              navigate(`/dashboard/${profileData.organization_id}`);
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
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
