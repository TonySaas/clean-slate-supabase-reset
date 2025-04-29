
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { CampaignForm } from './form-sections/CampaignForm';
import { CalendarSelector } from './form-sections/CalendarSelector';
import { campaignFormSchema, CampaignFormValues } from './schemas/campaignFormSchema';

export const CreateCampaign = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isCreating, setIsCreating] = React.useState(false);
  
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: '',
      description: '',
      start_date: undefined,
      end_date: undefined,
    },
  });

  const handleSubmit = async (values: CampaignFormValues) => {
    if (!profile?.organization_id) {
      toast.error("No organization found for your account");
      return;
    }

    try {
      setIsCreating(true);
      
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          name: values.name,
          description: values.description || null,
          start_date: values.start_date.toISOString().split('T')[0],
          end_date: values.end_date.toISOString().split('T')[0],
          organization_id: profile.organization_id,
          created_by: profile.id,
          status: 'draft'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Campaign created successfully!');
      
      // Navigate to the campaign offers page
      navigate(`/dashboard/campaign/${data.id}/offers`);
      
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign', {
        description: error.message
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Campaign</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <CampaignForm 
                form={form}
                onSubmit={handleSubmit}
                isSubmitting={isCreating}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <CalendarSelector 
            form={form}
          />
        </div>
      </div>
    </div>
  );
};
