
import { UserProfile } from './useSession';

export const useRoleCheck = (profile: UserProfile | null) => {
  const hasRole = (roleName: string) => {
    return profile?.roles?.some(role => role.name === roleName) || false;
  };

  return { hasRole };
};
