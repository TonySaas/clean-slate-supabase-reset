
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CampaignOffer {
  id: string;
  title: string;
  product_name: string;
  product_code: string;
  description: string;
  offer_price: number;
  regular_price: number;
  price_ex_vat: number | null;
  rrp: number | null;
  supplier_name: string | null;
  category_id: string | null;
  campaign_id: string;
  start_date: string;
  end_date: string;
  media?: {
    id: string;
    url: string;
    media_type: string;
    thumbnail_url?: string | null;
  }[];
}

export interface NewCampaignOffer {
  title: string;
  product_name: string;
  product_code: string;
  description: string;
  offer_price: number;
  regular_price: number;
  price_ex_vat?: number | null;
  rrp?: number | null;
  supplier_name?: string | null;
  category_id?: string | null;
  campaign_id: string;
  start_date: string;
  end_date: string;
}

export const useCampaignOffers = (campaignId?: string) => {
  const queryClient = useQueryClient();
  const [selectedOffer, setSelectedOffer] = useState<CampaignOffer | null>(null);
  
  const { data: offers = [], isLoading, error } = useQuery({
    queryKey: ['campaignOffers', campaignId],
    queryFn: async (): Promise<CampaignOffer[]> => {
      if (!campaignId) return [];
      
      try {
        console.log('Fetching offers for campaign:', campaignId);
        const { data, error } = await supabase
          .from('offers')
          .select(`
            *,
            media:offer_media(id, url, media_type, thumbnail_url)
          `)
          .eq('campaign_id', campaignId);
          
        if (error) throw error;
        
        console.log('Campaign offers data:', data);
        return data || [];
      } catch (error: any) {
        console.error('Error fetching campaign offers:', error);
        toast.error('Failed to load campaign offers', {
          description: error.message
        });
        throw error;
      }
    },
    enabled: !!campaignId,
  });

  const createOfferMutation = useMutation({
    mutationFn: async ({ offer, mediaFile }: { offer: NewCampaignOffer, mediaFile?: File }) => {
      try {
        // Insert the offer
        const { data: offerData, error: offerError } = await supabase
          .from('offers')
          .insert(offer)
          .select()
          .single();
          
        if (offerError) throw offerError;
        
        // Upload media if provided
        if (mediaFile && offerData) {
          const fileExt = mediaFile.name.split('.').pop();
          const mediaType = mediaFile.type.startsWith('image/') ? 'image' : 'video';
          const filePath = `${offerData.id}/${Date.now()}.${fileExt}`;
          
          // Upload file to storage
          const { data: storageData, error: storageError } = await supabase
            .storage
            .from('campaign_media')
            .upload(filePath, mediaFile, {
              cacheControl: '3600',
              upsert: false,
            });
            
          if (storageError) throw storageError;
          
          // Get public URL
          const { data: publicUrl } = supabase
            .storage
            .from('campaign_media')
            .getPublicUrl(filePath);
            
          // Create offer media record
          const { error: mediaError } = await supabase
            .from('offer_media')
            .insert({
              offer_id: offerData.id,
              media_type: mediaType,
              url: publicUrl.publicUrl,
              display_order: 0
            });
            
          if (mediaError) throw mediaError;
        }
        
        return offerData;
      } catch (error: any) {
        console.error('Error creating offer:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaignOffers', campaignId] });
      toast.success('Offer added successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to create offer', {
        description: error.message
      });
    }
  });

  const deleteOfferMutation = useMutation({
    mutationFn: async (offerId: string) => {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId);
        
      if (error) throw error;
      return offerId;
    },
    onSuccess: (offerId) => {
      queryClient.invalidateQueries({ queryKey: ['campaignOffers', campaignId] });
      if (selectedOffer?.id === offerId) {
        setSelectedOffer(null);
      }
      toast.success('Offer deleted successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to delete offer', {
        description: error.message
      });
    }
  });

  return {
    offers,
    isLoading,
    error,
    selectedOffer,
    setSelectedOffer,
    createOffer: createOfferMutation.mutate,
    deleteOffer: deleteOfferMutation.mutate,
    isCreating: createOfferMutation.isPending,
    isDeleting: deleteOfferMutation.isPending
  };
};
