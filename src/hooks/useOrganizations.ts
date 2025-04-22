
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Organization {
  id: string;
  name: string;
  logo_url: string | null;
  primary_color: string | null;
  domain: string | null;
  membersCount?: number;
  offersCount?: number;
}

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async (): Promise<Organization[]> => {
      try {
        // Fetch only organizations - avoid any join that might trigger RLS recursion
        const { data: orgsData, error: orgsError } = await supabase
          .from('organizations')
          .select('*');
        
        if (orgsError) {
          toast.error("Error fetching organizations", {
            description: orgsError.message
          });
          throw orgsError;
        }

        // Return organizations without member counts for now
        // This ensures we at least show the organizations even if we can't count members
        const organizations: Organization[] = orgsData.map(org => ({
          ...org,
          membersCount: 0, // Default to 0 to avoid the recursion issue entirely
          offersCount: 0,  // Default to 0 for now
        }));
        
        return organizations;
      } catch (error) {
        console.error("Error in useOrganizations:", error);
        toast.error("Failed to load organizations");
        throw error;
      }
    }
  });
};
