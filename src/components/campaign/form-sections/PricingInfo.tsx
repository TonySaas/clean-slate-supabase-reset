
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { OfferFormValues } from '../schemas/offerFormSchema';

interface PricingInfoProps {
  form: UseFormReturn<OfferFormValues>;
}

export const PricingInfo: React.FC<PricingInfoProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  );
};
