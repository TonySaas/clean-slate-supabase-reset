
import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/hooks/useAuth';
import { useCampaignDetails } from '@/hooks/useCampaignDetails';
import { useCampaignOffers } from '@/hooks/useCampaignOffers';
import { CampaignOfferForm } from '@/components/campaign/CampaignOfferForm';
import { CampaignOffersList } from '@/components/campaign/CampaignOffersList';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function CampaignOfferManagement() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { profile, isLoading: authLoading } = useAuth();
  const [activeView, setActiveView] = useState<'list' | 'form'>('list');
  
  const { 
    data: campaign,
    isLoading: campaignLoading,
    error: campaignError 
  } = useCampaignDetails(campaignId);
  
  const { 
    offers, 
    isLoading: offersLoading,
    selectedOffer,
    setSelectedOffer,
    createOffer,
    deleteOffer,
    isCreating,
    isDeleting
  } = useCampaignOffers(campaignId);

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (campaignLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#f9f9f9]">
          <DashboardSidebar />
          <div className="flex-1 p-8">
            <div className="flex items-center justify-center h-full">
              Loading campaign details...
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (campaignError || !campaign) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#f9f9f9]">
          <DashboardSidebar />
          <div className="flex-1 p-8">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-2">Campaign Not Found</h2>
              <p className="text-gray-600">The campaign you're looking for doesn't exist or you don't have access to it.</p>
              <Button
                className="mt-4"
                onClick={() => window.history.back()}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const handleCreateOffer = (data: Parameters<typeof createOffer>[0]) => {
    createOffer(data, {
      onSuccess: () => {
        setActiveView('list');
      }
    });
  };

  const handleSelectOffer = (offer: typeof offers[0]) => {
    setSelectedOffer(offer);
    // In a real implementation, this would open an edit form
    // Currently we're only implementing the create functionality
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#f9f9f9]">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{campaign.name}</h1>
                <p className="text-gray-600">
                  {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                </p>
                {campaign.description && (
                  <p className="mt-2 text-sm">{campaign.description}</p>
                )}
              </div>
              
              <div>
                {activeView === 'list' ? (
                  <Button onClick={() => setActiveView('form')}>
                    Add New Offer
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setActiveView('list')}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Offers
                  </Button>
                )}
              </div>
            </div>
          </div>

          {activeView === 'form' && campaignId && (
            <CampaignOfferForm
              campaignId={campaignId}
              campaign={campaign}
              onSubmit={handleCreateOffer}
              isSubmitting={isCreating}
            />
          )}

          {activeView === 'list' && (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Campaign Offers</h2>
                <p className="text-gray-500 text-sm">
                  {offers.length} {offers.length === 1 ? 'offer' : 'offers'} in this campaign
                </p>
              </div>
              
              {offersLoading ? (
                <div className="text-center py-8">Loading offers...</div>
              ) : (
                <CampaignOffersList
                  offers={offers}
                  onSelect={handleSelectOffer}
                  onDelete={deleteOffer}
                  isDeleting={isDeleting}
                />
              )}
            </>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}
