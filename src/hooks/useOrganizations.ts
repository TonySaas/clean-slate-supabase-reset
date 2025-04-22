
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
  organization_members?: { count: number }[];
}

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async (): Promise<Organization[]> => {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select(`
            *,
            organization_members(count)
          `);
        
        if (error) {
          toast.error("Error fetching organizations", {
            description: error.message
          });
          throw error;
        }
        
        // Transform the data to include member counts
        return (data || []).map(org => ({
          ...org,
          membersCount: org.organization_members?.[0]?.count || 0,
          offersCount: 0, // TODO: Implement offers count when that feature is added
        }));
      } catch (error) {
        console.error("Error in useOrganizations:", error);
        toast.error("Failed to load organizations");
        throw error;
      }
    }
  });
};
