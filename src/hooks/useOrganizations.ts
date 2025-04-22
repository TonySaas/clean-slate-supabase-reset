
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
        // Only fetch organizations table data to avoid any RLS recursion issues
        const { data: orgsData, error: orgsError } = await supabase
          .from('organizations')
          .select('id, name, logo_url, primary_color, domain, created_at, updated_at');
        
        if (orgsError) {
          toast.error("Error fetching organizations", {
            description: orgsError.message
          });
          throw orgsError;
        }

        if (!orgsData || orgsData.length === 0) {
          return [];
        }

        // Map the data to our Organization interface with default counts
        const organizations: Organization[] = orgsData.map(org => ({
          ...org,
          membersCount: 0, // Default to 0 since the members table is empty
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
