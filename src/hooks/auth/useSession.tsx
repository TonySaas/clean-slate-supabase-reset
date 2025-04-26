
import { useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from './useUserProfile';
import { useAuthState } from './useAuthState';

export type UserRole = {
  id: number;
  name: string;
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

export const useSession = () => {
  const { isLoading, organizationId, updateAuthState, setIsLoading } = useAuthState();
  const { profile, fetchOrCreateProfile } = useUserProfile(supabase.auth.getUser()?.data?.user?.id);

  useEffect(() => {
    console.log('Setting up auth state change listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          // Use setTimeout to avoid potential deadlock in Supabase auth
          setTimeout(async () => {
            const profile = await fetchOrCreateProfile(session);
            updateAuthState(profile);
          }, 0);
        } else {
          console.log('No active session, clearing profile state');
          updateAuthState(null);
        }
      }
    );

    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }
        
        if (!session) {
          console.log('No existing session found');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Unexpected error checking session:', err);
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
