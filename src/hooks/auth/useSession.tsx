
import { useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from './useUserProfile';
import { useAuthState } from './useAuthState';
import { toast } from 'sonner';

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
  const { profile, fetchOrCreateProfile } = useUserProfile();

  useEffect(() => {
    console.log('Setting up auth state change listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          try {
            // Use setTimeout to avoid potential deadlock in Supabase auth
            setTimeout(async () => {
              const userProfile = await fetchOrCreateProfile(session);
              
              // Log additional debugging information
              console.log('User Profile:', userProfile);
              console.log('Session User ID:', session.user.id);
              
              // Check if user exists in the users table instead of auth.users
              const userExists = await checkUserExists(session.user.id);
              console.log('User exists in public.users:', userExists);
              
              updateAuthState(userProfile);
            }, 0);
          } catch (error) {
            console.error('Error processing auth state change:', error);
            toast.error('Error processing authentication');
          }
        } else {
          console.log('No active session, clearing profile state');
          updateAuthState(null);
        }
      }
    );

    // Function to check if user exists in public.users table
    const checkUserExists = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('User existence check error:', error);
          return false;
        }

        return !!data;
      } catch (err) {
        console.error('Error checking user existence:', err);
        return false;
      }
    };

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
