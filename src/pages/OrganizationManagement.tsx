
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
import { OrganizationList, UIOrganization } from '@/components/organization/OrganizationList';
import { OrganizationForm } from '@/components/organization/OrganizationForm';
import { OrganizationBranding } from '@/components/organization/OrganizationBranding';
import { OrganizationRules } from '@/components/organization/OrganizationRules';
import { useOrganizations, type Organization } from '@/hooks/useOrganizations';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const OrganizationManagement = () => {
  const [activeTab, setActiveTab] = useState("organizations");
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: organizations = [], isLoading, error } = useOrganizations();

  // Convert Organization to UIOrganization format
  const mapToUIOrganization = (org: Organization): UIOrganization => ({
    id: org.id,
    name: org.name,
    logo: org.logo_url || '/placeholder.svg',
    primaryColor: org.primary_color || '#0066CC',
    membersCount: org.membersCount || 0,
    offersCount: org.offersCount || 0,
  });

  const handleOrganizationSelect = (uiOrg: UIOrganization) => {
    // Find the original organization from our data
    const org = organizations.find(o => o.id === uiOrg.id) || null;
    setSelectedOrganization(org);
    setActiveTab("details");
  };

  const handleCreateNew = () => {
    setSelectedOrganization(null);
    setIsEditMode(true);
    setActiveTab("details");
  };

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading organizations...</div>;
  
  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load organizations. Please try again later.</AlertDescription>
      </Alert>
    </div>
  );

  const uiOrganizations = organizations.map(mapToUIOrganization);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Organization Management</h1>
        <p className="text-gray-600">Configure and manage organizations within the platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
            <CardDescription>Total registered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{organizations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>Across all organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {organizations.reduce((sum, org) => sum + (org.membersCount || 0), 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Offers</CardTitle>
            <CardDescription>Currently running</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {organizations.reduce((sum, org) => sum + (org.offersCount || 0), 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full mb-2 justify-start" 
              onClick={handleCreateNew}
            >
              <Building className="mr-2 h-4 w-4" />
              Create Organization
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="organizations">All Organizations</TabsTrigger>
          <TabsTrigger value="details">Organization Details</TabsTrigger>
          <TabsTrigger value="branding">Branding Controls</TabsTrigger>
          <TabsTrigger value="rules">Business Rules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="organizations">
          <OrganizationList 
            organizations={uiOrganizations} 
            onSelect={handleOrganizationSelect} 
            onCreateNew={handleCreateNew}
          />
        </TabsContent>
        
        <TabsContent value="details">
          {selectedOrganization && (
            <OrganizationForm 
              organization={mapToUIOrganization(selectedOrganization)} 
              isEditMode={isEditMode} 
              onSave={() => setIsEditMode(false)}
              onCancel={() => {
                setIsEditMode(false);
                setActiveTab("organizations");
              }}
            />
          )}
          {!selectedOrganization && isEditMode && (
            <OrganizationForm 
              organization={null} 
              isEditMode={true} 
              onSave={() => setIsEditMode(false)}
              onCancel={() => {
                setIsEditMode(false);
                setActiveTab("organizations");
              }}
            />
          )}
        </TabsContent>
        
        <TabsContent value="branding">
          {selectedOrganization && (
            <OrganizationBranding 
              organization={mapToUIOrganization(selectedOrganization)} 
            />
          )}
          {!selectedOrganization && (
            <div className="text-center p-8">
              <h3 className="text-lg font-medium">No organization selected</h3>
              <p className="text-gray-500">Please select an organization to manage branding</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rules">
          {selectedOrganization && (
            <OrganizationRules 
              organization={mapToUIOrganization(selectedOrganization)} 
            />
          )}
          {!selectedOrganization && (
            <div className="text-center p-8">
              <h3 className="text-lg font-medium">No organization selected</h3>
              <p className="text-gray-500">Please select an organization to manage rules</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationManagement;
