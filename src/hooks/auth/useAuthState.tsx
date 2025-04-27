
import { useState } from 'react';
import { UserProfile } from './useSession';

export const useAuthState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const updateAuthState = (userProfile: UserProfile | null) => {
    if (userProfile) {
      setProfile(userProfile);
      setOrganizationId(userProfile.organization_id);
    } else {
      setProfile(null);
      setOrganizationId(null);
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    setIsLoading,
    profile,
    organizationId,
    updateAuthState
  };
};
