
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSession = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    console.log('Setting up auth state change listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          try {
            // First, check if user has a profile
            const { data: userProfile, error: profileError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              console.error('Error fetching user profile:', profileError);
              
              // If error is PGRST116 (not found), create the profile
              if (profileError.code === 'PGRST116') {
                console.log('User profile not found, creating new profile');
                const metadata = session.user.user_metadata || {};
                
                const { data: newProfile, error: createError } = await supabase
                  .from('user_profiles')
                  .insert({
                    id: session.user.id,
                    email: session.user.email,
                    first_name: metadata.first_name,
                    last_name: metadata.last_name,
                    phone: metadata.phone,
                    job_title: metadata.job_title,
                    organization_id: metadata.organization_id || (
                      // Fallback to get any organization if none specified
                      await supabase.from('organizations').select('id').limit(1).single()
                    ).data?.id
                  })
                  .select()
                  .single();
                
                if (createError) {
                  console.error('Error creating user profile:', createError);
                  toast.error('Error creating user profile');
                  setIsLoading(false);
                  return;
                }
                
                console.log('Created new profile:', newProfile);
                const userProfile = newProfile;
              } else {
                toast.error('Error loading user profile');
                setIsLoading(false);
                return;
              }
            }
            
            if (!userProfile.organization_id) {
              console.error('User profile has no organization_id:', userProfile);
              toast.error('Your account is not associated with an organization');
              setIsLoading(false);
              return;
            }
            
            // Fetch user roles
            const { data: userRolesData } = await supabase
              .from('user_roles')
              .select(`
                role_id,
                roles (id, name)
              `)
              .eq('user_id', session.user.id);
            
            const roles = userRolesData ? userRolesData.map(ur => ({
              id: ur.role_id,
              name: ur.roles?.name || ''
            })) : [];
            
            // Set user state
            const completeProfile = {
              ...userProfile,
              roles
            };
            
            setOrganizationId(userProfile.organization_id);
            setProfile(completeProfile);
            
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
      if (!session?.user) {
        console.log('No existing session found');
        setIsLoading(false);
      }
    };
    
    checkSession();

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  return { isLoading, organizationId, profile };
};

export type UserProfile = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  job_title: string | null;
  organization_id: string;
  roles?: UserRole[];
};

export type UserRole = {
  id: number;
  name: string;
};
