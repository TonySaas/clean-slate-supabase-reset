
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

  // Function to ensure user profile exists
  const ensureUserProfile = async (userId: string, userEmail: string | undefined, metadata: any) => {
    console.log('Ensuring user profile exists for:', userId);
    
    try {
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error checking profile:', profileError);
        throw profileError;
      }
      
      // If profile exists, return it
      if (existingProfile) {
        console.log('Found existing profile:', existingProfile);
        return existingProfile;
      }
      
      // Profile doesn't exist, create it
      console.log('Profile not found, creating from metadata:', metadata);
      
      // Get the first organization if no organization_id is specified
      let orgId = metadata?.organization_id;
      if (!orgId) {
        const { data: firstOrg } = await supabase
          .from('organizations')
          .select('id')
          .limit(1)
          .single();
          
        orgId = firstOrg?.id;
        console.log('No organization ID found, using first organization:', orgId);
        
        if (!orgId) {
          throw new Error('No organization found and none specified in metadata');
        }
      }
      
      // Create profile
      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          email: userEmail,
          organization_id: orgId,
          first_name: metadata?.first_name || null,
          last_name: metadata?.last_name || null,
          phone: metadata?.phone || null,
          job_title: metadata?.job_title || null
        })
        .select();
      
      if (insertError) {
        console.error('Error creating profile:', insertError);
        throw insertError;
      }
      
      console.log('Created new profile:', newProfile);
      
      // Add default user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: 1 // Assuming 1 is the default 'user' role
        });
        
      if (roleError && !roleError.message?.includes('duplicate')) {
        console.error('Error adding role:', roleError);
        // Don't throw here, just log the error
      } else {
        console.log('Added default user role');
      }
      
      return newProfile?.[0] || null;
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      throw error;
    }
  };
  
  // Function to fetch user roles
  const fetchUserRoles = async (userId: string) => {
    try {
      const { data: userRolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles (id, name)
        `)
        .eq('user_id', userId);
      
      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        return [];
      }
      
      // Transform roles data
      const roles = userRolesData ? userRolesData.map(ur => ({
        id: ur.role_id,
        name: ur.roles?.name || ''
      })) : [];
      
      console.log('Fetched roles:', roles);
      return roles;
    } catch (error) {
      console.error('Error in fetchUserRoles:', error);
      return [];
    }
  };

  useEffect(() => {
    console.log('Setting up auth state change listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          try {
            // Get user metadata
            const metadata = session.user.user_metadata || {};
            console.log('User metadata:', metadata);
            
            // Ensure user profile exists
            const userProfile = await ensureUserProfile(
              session.user.id, 
              session.user.email,
              metadata
            );
            
            if (!userProfile) {
              console.error('Failed to get or create user profile');
              toast.error('Error loading user profile');
              setIsLoading(false);
              return;
            }
            
            if (!userProfile.organization_id) {
              console.error('User profile has no organization_id:', userProfile);
              toast.error('Your account is not associated with an organization');
              setIsLoading(false);
              return;
            }
            
            // Fetch user roles
            const roles = await fetchUserRoles(session.user.id);
            
            // Set user state
            const completeProfile: UserProfile = {
              ...userProfile,
              roles
            };
            
            setOrganizationId(userProfile.organization_id);
            setProfile(completeProfile);
            
            // Navigate to dashboard
            console.log(`Redirecting to dashboard/${userProfile.organization_id}`);
            navigate(`/dashboard/${userProfile.organization_id}`);
          } catch (error) {
            console.error('Error processing authenticated user:', error);
            toast.error('Error loading user profile');
          }
        } else {
          console.log('No active session, clearing profile state');
          setOrganizationId(null);
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log('Found existing session for user:', session.user.id);
        // The onAuthStateChange handler will process this session
      } else {
        console.log('No existing session found');
        setIsLoading(false);
      }
    };
    
    checkSession();

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [navigate]);

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
      toast.success('Login successful');
      
      // The onAuthStateChange event will handle the redirect
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Logout successful, redirecting to login page');
      setOrganizationId(null);
      setProfile(null);
      navigate('/login');
    } catch (error: any) {
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
