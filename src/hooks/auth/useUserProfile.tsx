
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
      
      // First, check if user exists in users table
      const { data: userExists, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', session.user.id)
        .single();
        
      if (userError || !userExists) {
        console.log('User does not exist in users table, creating...');
        
        // Extract user metadata
        const firstName = session.user.user_metadata?.first_name;
        const lastName = session.user.user_metadata?.last_name;
        const phone = session.user.phone;
        
        await supabase
          .from('users')
          .insert({
            id: session.user.id,
            first_name: firstName || session.user.email?.split('@')[0] || 'User',
            last_name: lastName || '',
            phone: phone,
            active: true
          });
          
        console.log('Created user in users table');
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
              first_name: session.user.user_metadata?.first_name || session.user.email?.split('@')[0] || 'User',
              last_name: session.user.user_metadata?.last_name || '',
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
          
          // Add the user to organization_admins table if they have the org_admin role
          const { data: userRoles } = await supabase
            .from('user_roles')
            .select('roles(name)')
            .eq('user_id', session.user.id);
            
          const isOrgAdmin = userRoles?.some(role => 
            role.roles?.name === 'org_admin'
          );
            
          if (isOrgAdmin) {
            console.log('User is an org admin, adding to organization_admins table');
            await supabase
              .from('organization_admins')
              .upsert({
                organization_id: newProfile.organization_id,
                user_id: session.user.id
              });
          }
          
          return addUserRolesToProfile(newProfile, session.user.id);
        } else {
          toast.error('Error loading user profile');
          return null;
        }
      }
      
      // Add roles to the profile
      const roleData = await addUserRolesToProfile(userProfile, session.user.id);
      
      // Set the profile state
      setProfile(roleData);
      
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
