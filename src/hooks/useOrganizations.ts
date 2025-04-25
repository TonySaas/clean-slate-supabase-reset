
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Organization {
  id: string;
  name: string;
  logo_url: string | null;
  primary_color: string | null;
  membersCount?: number;
  offersCount?: number;
}

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async (): Promise<Organization[]> => {
      try {
        console.log('Fetching organizations data');
        const { data: orgsData, error: orgsError } = await supabase
          .from('organizations')
          .select('id, name, logo_url, primary_color');
        
        if (orgsError) {
          console.error('Error fetching organizations:', orgsError);
          toast.error("Error fetching organizations", {
            description: orgsError.message
          });
          throw orgsError;
        }

        if (!orgsData) {
          console.log('No organizations data returned (null)');
          return [];
        }
        
        console.log('Raw organizations data:', orgsData);
        
        if (orgsData.length === 0) {
          console.log('No organizations found in the database (empty array)');
          return [];
        }

        const organizations: Organization[] = orgsData.map(org => ({
          id: org.id,
          name: org.name,
          logo_url: org.logo_url,
          primary_color: org.primary_color,
          membersCount: 0,
          offersCount: 0,
        }));

        console.log('Successfully transformed organizations:', organizations);
        return organizations;
      } catch (error: any) {
        console.error("Error in useOrganizations:", error);
        toast.error("Failed to fetch organizations", {
          description: error.message || "Please try again later"
        });
        throw error;
      }
    },
    retry: 2,
    staleTime: 5000, // Consider data fresh for 5 seconds
    refetchOnWindowFocus: false,
  });
};
