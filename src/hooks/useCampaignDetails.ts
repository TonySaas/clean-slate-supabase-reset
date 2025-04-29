
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  organization_id: string;
  status: string | null;
  created_by: string;
}

export const useCampaignDetails = (campaignId?: string) => {
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async (): Promise<Campaign | null> => {
      if (!campaignId) return null;
      
      try {
        console.log('Fetching campaign:', campaignId);
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .eq('id', campaignId)
          .single();
          
        if (error) throw error;
        
        console.log('Campaign data:', data);
        return data;
      } catch (error: any) {
        console.error('Error fetching campaign details:', error);
        toast.error('Failed to load campaign details', {
          description: error.message
        });
        throw error;
      }
    },
    enabled: !!campaignId,
  });
};
