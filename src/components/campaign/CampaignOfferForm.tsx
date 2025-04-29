
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { NewCampaignOffer } from '@/hooks/useCampaignOffers';
import { Campaign } from '@/hooks/useCampaignDetails';
import { BasicProductInfo } from './form-sections/BasicProductInfo';
import { PricingInfo } from './form-sections/PricingInfo';
import { CategorySelector } from './form-sections/CategorySelector';
import { ProductDescription } from './form-sections/ProductDescription';
import { MediaUploader } from './form-sections/MediaUploader';
import { offerFormSchema, OfferFormValues } from './schemas/offerFormSchema';

interface CampaignOfferFormProps {
  campaignId: string;
  campaign: Campaign | null;
  onSubmit: (data: { offer: NewCampaignOffer, mediaFile?: File }) => void;
  isSubmitting: boolean;
}

export const CampaignOfferForm: React.FC<CampaignOfferFormProps> = ({
  campaignId,
  campaign,
  onSubmit,
  isSubmitting
}) => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      title: '',
      product_name: '',
      product_code: '',
      description: '',
      offer_price: 0,
      regular_price: 0,
      price_ex_vat: null,
      rrp: null,
      supplier_name: '',
      category_id: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setMediaFile(file);
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setMediaPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (values: OfferFormValues) => {
    if (!campaign) return;
    
    // Create a properly typed NewCampaignOffer object
    const offer: NewCampaignOffer = {
      title: values.title,
      product_name: values.product_name,
      product_code: values.product_code,
      description: values.description,
      offer_price: values.offer_price,
      regular_price: values.regular_price,
      price_ex_vat: values.price_ex_vat,
      rrp: values.rrp,
      supplier_name: values.supplier_name,
      category_id: values.category_id,
      campaign_id: campaignId,
      start_date: campaign.start_date,
      end_date: campaign.end_date,
    };
    
    onSubmit({ offer, mediaFile: mediaFile || undefined });
    
    // Reset form after submission
    form.reset();
    setMediaFile(null);
    setMediaPreview(null);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Add New Offer</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <BasicProductInfo form={form} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategorySelector form={form} />
            <div className="hidden md:block"></div> {/* Spacer for grid alignment */}
          </div>
          
          <PricingInfo form={form} />
          <ProductDescription form={form} />
          <MediaUploader 
            onFileChange={handleFileChange} 
            mediaPreview={mediaPreview} 
            mediaFile={mediaFile}
          />
          
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Adding Offer...' : 'Add Offer'}
          </Button>
        </form>
      </Form>
    </Card>
  );
};
