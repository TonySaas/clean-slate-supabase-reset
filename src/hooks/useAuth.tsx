
import { useSession } from './auth/useSession';
import { useAuthActions } from './auth/useAuthActions';
import { useRoleCheck } from './auth/useRoleCheck';

export const useAuth = () => {
  const { isLoading, organizationId, profile } = useSession();
  const { login, logout } = useAuthActions();
  const { hasRole } = useRoleCheck(profile);

  return { 
    login, 
    logout, 
    isLoading, 
    organizationId, 
    profile,
    hasRole 
  };
};

export type { UserProfile, UserRole } from './auth/useSession';
