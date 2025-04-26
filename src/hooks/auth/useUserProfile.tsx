
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from './useSession';

export const useUserProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchOrCreateProfile = async (session: any) => {
    if (!session?.user) return null;
    
    try {
      // First, check if user has a profile
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        
        if (profileError.code === 'PGRST116') {
          console.log('User profile not found, creating new profile');
          const metadata = session.user.user_metadata || {};
          
          // Get any organization - we need an organization ID
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
              first_name: metadata.first_name,
              last_name: metadata.last_name,
              phone: metadata.phone,
              job_title: metadata.job_title,
              organization_id: metadata.organization_id || orgData?.id
            })
            .select()
            .single();
          
          if (createError) {
            console.error('Error creating user profile:', createError);
            toast.error('Error creating user profile');
            return null;
          }
          
          console.log('Created new profile:', newProfile);
          
          // Use the newly created profile
          if (newProfile) {
            const completeProfile = await addUserRolesToProfile(newProfile, session.user.id);
            setProfile(completeProfile);
            return completeProfile;
          }
        } else {
          toast.error('Error loading user profile');
          return null;
        }
      }
      
      if (!userProfile || !userProfile.organization_id) {
        console.error('User profile has no organization_id:', userProfile);
        toast.error('Your account is not associated with an organization');
        return null;
      }
      
      const completeProfile = await addUserRolesToProfile(userProfile, session.user.id);
      setProfile(completeProfile);
      return completeProfile;
      
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
