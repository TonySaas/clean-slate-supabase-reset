
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DateField } from './DateField';
import { CampaignFormValues } from '../schemas/campaignFormSchema';

interface CampaignFormProps {
  form: UseFormReturn<CampaignFormValues>;
  onSubmit: (values: CampaignFormValues) => void;
  isSubmitting: boolean;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({ 
  form,
  onSubmit, 
  isSubmitting 
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="Summer Sale 2025" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateField 
            name="start_date" 
            label="Start Date" 
            placeholder="Pick a date"
            control={form.control}
            disabledDate={(date) => date < new Date()}
          />
          
          <DateField 
            name="end_date" 
            label="End Date" 
            placeholder="Pick a date"
            control={form.control}
            disabledDate={(date) => {
              const startDate = form.getValues().start_date;
              return date < new Date() || 
                (startDate && date < startDate);
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter campaign description..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
        </Button>
      </form>
    </Form>
  );
};
