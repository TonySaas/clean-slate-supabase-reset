
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
        // First get the organizations without trying to count members
        // This avoids the recursion issue
        const { data: orgsData, error: orgsError } = await supabase
          .from('organizations')
          .select('*');
        
        if (orgsError) {
          toast.error("Error fetching organizations", {
            description: orgsError.message
          });
          throw orgsError;
        }

        // If we need member counts, we'll handle them separately
        // without causing the recursion issue
        const organizations: Organization[] = orgsData.map(org => ({
          ...org,
          membersCount: 0, // Default to 0, we'll update this if possible
          offersCount: 0, // TODO: Implement offers count when that feature is added
        }));

        // Attempt to query member counts separately for each organization
        // This is a safer approach than a join that might trigger the recursion
        try {
          for (const org of organizations) {
            const { count, error: countError } = await supabase
              .from('organization_members')
              .select('*', { count: 'exact', head: true })
              .eq('organization_id', org.id);
            
            if (!countError && count !== null) {
              org.membersCount = count;
            }
          }
        } catch (countError) {
          console.warn("Error counting members, showing organizations without counts:", countError);
          // We don't throw here, as we still want to show orgs even if counts fail
        }
        
        return organizations;
      } catch (error) {
        console.error("Error in useOrganizations:", error);
        toast.error("Failed to load organizations");
        throw error;
      }
    }
  });
};
