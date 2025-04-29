
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Package, Upload } from 'lucide-react'; 
import { Card, CardContent } from '@/components/ui/card';

export const DashboardActionButtons = () => {
  const navigate = useNavigate();
  const { organizationId } = useParams<{ organizationId?: string }>();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCreateCampaign = () => {
    setIsLoading(true);
    // If on the organization dashboard (which doesn't have organizationId in params),
    // we need to get the organization ID from the user's profile
    if (organizationId) {
      navigate(`/dashboard/${organizationId}/campaign/new`);
    } else {
      // When on the organization dashboard page
      navigate(`/organization-dashboard/campaign/new`);
    }
    setIsLoading(false);
  };

  const handleManageOffers = () => {
    // Will be implemented in the future
    navigate(`/campaign-offers`);
  };

  const handleBulkUpload = () => {
    // Will be implemented in the future
    navigate(`/campaign-bulk-upload`);
  };

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={handleCreateCampaign} 
            variant="outline" 
            className="h-auto py-6 flex flex-col"
            disabled={isLoading}
          >
            <CalendarPlus className="h-6 w-6 mb-2" />
            <span>Create Campaign</span>
            <span className="text-xs text-gray-500 mt-1">Schedule a new promotional campaign</span>
          </Button>
          
          <Button onClick={handleManageOffers} variant="outline" className="h-auto py-6 flex flex-col">
            <Package className="h-6 w-6 mb-2" />
            <span>Manage Offers</span>
            <span className="text-xs text-gray-500 mt-1">Add or edit campaign offers</span>
          </Button>
          
          <Button onClick={handleBulkUpload} variant="outline" className="h-auto py-6 flex flex-col">
            <Upload className="h-6 w-6 mb-2" />
            <span>Bulk Upload</span>
            <span className="text-xs text-gray-500 mt-1">Upload multiple offers at once</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
