
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from './useSession';
import { Session } from '@supabase/supabase-js';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchOrCreateProfile = async (session: Session) => {
    if (!session?.user) return null;
    
    try {
      console.log('Fetching or creating profile for user:', session.user.id);
      
      // First, verify user exists in users table
      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('id', session.user.id);

      if (count === 0) {
        console.log('User does not exist in users table, creating...');
        await supabase
          .from('users')
          .upsert({
            id: session.user.id,
            email: session.user.email,
            first_name: session.user.user_metadata?.first_name,
            last_name: session.user.user_metadata?.last_name,
            phone: session.user.phone,
          });
      }

      // Check if user profile exists
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        
        if (profileError.code === 'PGRST116') {
          console.log('User profile not found, creating new profile');
          
          // Get any organization ID
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('id')
            .limit(1)
            .single();
          
          if (orgError) {
            console.error('Error fetching default organization:', orgError);
            toast.error('Error loading organization data');
            return null;
          }

          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .upsert({
              id: session.user.id,
              email: session.user.email,
              first_name: session.user.user_metadata?.first_name,
              last_name: session.user.user_metadata?.last_name,
              phone: session.user.phone,
              organization_id: session.user.user_metadata?.organization_id || orgData?.id
            })
            .select()
            .single();
          
          if (createError) {
            console.error('Error creating user profile:', createError);
            toast.error('Error creating user profile');
            return null;
          }
          
          console.log('Created new profile:', newProfile);
          return newProfile;
        } else {
          toast.error('Error loading user profile');
          return null;
        }
      }
      
      // Add roles to the profile
      const roleData = await addUserRolesToProfile(userProfile, session.user.id);
      return roleData;
      
    } catch (error) {
      console.error('Error processing authenticated user:', error);
      toast.error('Error loading user profile');
      return null;
    }
  };

  const addUserRolesToProfile = async (profile: UserProfile, userId: string) => {
    const { data: userRolesData } = await supabase
      .from('user_roles')
      .select(`
        role_id,
        roles (id, name)
      `)
      .eq('user_id', userId);
    
    const roles = userRolesData ? userRolesData.map(ur => ({
      id: ur.role_id,
      name: ur.roles?.name || ''
    })) : [];
    
    return {
      ...profile,
      roles
    };
  };

  return {
    profile,
    fetchOrCreateProfile
  };
};
