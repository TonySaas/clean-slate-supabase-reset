
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { OfferFormValues } from '../schemas/offerFormSchema';

interface ProductDescriptionProps {
  form: UseFormReturn<OfferFormValues>;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ form }) => {
  return (
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
  );
};
