
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building, Database, Users } from "lucide-react";
import { OrganizationList } from '@/components/organization/OrganizationList';
import { OrganizationForm } from '@/components/organization/OrganizationForm';
import { OrganizationBranding } from '@/components/organization/OrganizationBranding';
import { OrganizationRules } from '@/components/organization/OrganizationRules';

// Dummy data for organizations 
const dummyOrganizations = [
  { id: 1, name: 'Toolbank', logo: '/placeholder.svg', primaryColor: '#0066CC', membersCount: 245, offersCount: 32 },
  { id: 2, name: 'NMBS', logo: '/placeholder.svg', primaryColor: '#FF4500', membersCount: 178, offersCount: 27 },
  { id: 3, name: 'IBC', logo: '/placeholder.svg', primaryColor: '#008000', membersCount: 132, offersCount: 18 },
  { id: 4, name: 'BMF', logo: '/placeholder.svg', primaryColor: '#800080', membersCount: 98, offersCount: 15 },
];

const OrganizationManagement = () => {
  const [activeTab, setActiveTab] = useState("organizations");
  const [selectedOrganization, setSelectedOrganization] = useState(dummyOrganizations[0]);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleOrganizationSelect = (org: typeof dummyOrganizations[0]) => {
    setSelectedOrganization(org);
    setActiveTab("details");
  };

  const handleCreateNew = () => {
    setIsEditMode(true);
    setActiveTab("details");
  };

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
            <div className="text-3xl font-bold">{dummyOrganizations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>Across all organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dummyOrganizations.reduce((sum, org) => sum + org.membersCount, 0)}
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
              {dummyOrganizations.reduce((sum, org) => sum + org.offersCount, 0)}
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
            organizations={dummyOrganizations} 
            onSelect={handleOrganizationSelect} 
            onCreateNew={handleCreateNew}
          />
        </TabsContent>
        
        <TabsContent value="details">
          <OrganizationForm 
            organization={selectedOrganization} 
            isEditMode={isEditMode} 
            onSave={() => setIsEditMode(false)}
            onCancel={() => {
              setIsEditMode(false);
              setActiveTab("organizations");
            }}
          />
        </TabsContent>
        
        <TabsContent value="branding">
          <OrganizationBranding organization={selectedOrganization} />
        </TabsContent>
        
        <TabsContent value="rules">
          <OrganizationRules organization={selectedOrganization} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationManagement;
