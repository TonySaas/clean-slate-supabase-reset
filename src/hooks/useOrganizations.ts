
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
        // Fetch all organizations first
        const { data: orgsData, error: orgsError } = await supabase
          .from('organizations')
          .select('id, name, logo_url, primary_color, domain, created_at, updated_at');
        
        if (orgsError) {
          console.error('Error fetching organizations:', orgsError);
          toast.error("Error fetching organizations", {
            description: orgsError.message
          });
          throw orgsError;
        }

        // If there's no organizations data, return an empty array
        if (!orgsData || orgsData.length === 0) {
          console.log('No organizations found in the database');
          return [];
        }

        // Map the data to our Organization interface
        // Setting default counts to 0 since tables may be empty
        const organizations: Organization[] = orgsData.map(org => ({
          id: org.id,
          name: org.name,
          logo_url: org.logo_url,
          primary_color: org.primary_color,
          domain: org.domain,
          membersCount: 0, // Default to 0 since the members table is empty
          offersCount: 0,  // Default to 0 for now
        }));
        
        console.log('Successfully fetched organizations:', organizations);
        return organizations;
      } catch (error) {
        console.error("Error in useOrganizations:", error);
        toast.error("Failed to load organizations");
        throw error;
      }
    },
    retry: 1, // Only retry once to avoid flooding with errors
  });
};
