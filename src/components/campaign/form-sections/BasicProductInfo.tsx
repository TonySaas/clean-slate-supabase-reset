
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { OfferFormValues } from '../schemas/offerFormSchema';

interface BasicProductInfoProps {
  form: UseFormReturn<OfferFormValues>;
}

export const BasicProductInfo: React.FC<BasicProductInfoProps> = ({ form }) => {
  return (
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
    </div>
  );
};
