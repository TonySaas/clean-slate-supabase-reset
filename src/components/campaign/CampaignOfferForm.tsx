
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useQueryClient } from '@tanstack/react-query';
import { useProductCategories } from '@/hooks/useProductCategories';
import { NewCampaignOffer } from '@/hooks/useCampaignOffers';
import { Campaign } from '@/hooks/useCampaignDetails';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  product_name: z.string().min(2, 'Product name is required'),
  product_code: z.string().min(1, 'Product code is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  offer_price: z.coerce.number().positive('Price must be a positive number'),
  regular_price: z.coerce.number().positive('Regular price must be a positive number'),
  price_ex_vat: z.coerce.number().positive('Price ex VAT must be a positive number').optional().nullable(),
  rrp: z.coerce.number().positive('RRP must be a positive number').optional().nullable(),
  supplier_name: z.string().optional(),
  category_id: z.string().optional(),
});

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
  const { data: categories = [] } = useProductCategories();
  const [mediaFile, setMediaFile] = React.useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = React.useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!campaign) return;
    
    const offer: NewCampaignOffer = {
      ...values,
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Special Summer Offer" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Premium Drill Set" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="product_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="DRL-123" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="supplier_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="DeWalt" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="offer_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Price (inc VAT)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" min="0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="regular_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regular Price (inc VAT)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" min="0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price_ex_vat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (ex VAT)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      value={field.value === null ? '' : field.value}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : parseFloat(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rrp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RRP</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      step="0.01" 
                      min="0"
                      value={field.value === null ? '' : field.value}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : parseFloat(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Enter offer description..." 
                    rows={4} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <FormLabel>Product Image/Video</FormLabel>
            <Input 
              type="file" 
              onChange={handleFileChange}
              accept="image/*,video/*"
            />
            
            {mediaPreview && (
              <div className="mt-2 border rounded-md overflow-hidden w-40 h-40">
                {mediaFile?.type.startsWith('image/') ? (
                  <img 
                    src={mediaPreview} 
                    alt="Media preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video 
                    src={mediaPreview} 
                    controls 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}
          </div>
          
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Adding Offer...' : 'Add Offer'}
          </Button>
        </form>
      </Form>
    </Card>
  );
};
