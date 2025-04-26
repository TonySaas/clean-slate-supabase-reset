
import { useState } from 'react';
import { User } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  const updateAuthState = (profile: any | null) => {
    if (profile) {
      setOrganizationId(profile.organization_id);
    } else {
      setOrganizationId(null);
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    setIsLoading,
    organizationId,
    updateAuthState
  };
};
