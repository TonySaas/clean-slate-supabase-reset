import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building, Database, Users } from "lucide-react";
import { OrganizationList } from '@/components/organization/OrganizationList';
import { OrganizationForm } from '@/components/organization/OrganizationForm';
import { OrganizationBranding } from '@/components/organization/OrganizationBranding';
import { OrganizationRules } from '@/components/organization/OrganizationRules';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/toast";

type Organization = {
  id: string;
  name: string;
  logo_url?: string | null;
  primary_color?: string | null;
  domain?: string | null;
};

const OrganizationManagement = () => {
  const [activeTab, setActiveTab] = useState("organizations");
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: organizations = [], isLoading, error } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*');
      
      if (error) {
        toast({
          title: "Error fetching organizations",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      return data as Organization[];
    }
  });

  const handleOrganizationSelect = (org: Organization) => {
    setSelectedOrganization(org);
    setActiveTab("details");
  };

  const handleCreateNew = () => {
    setSelectedOrganization(null);
    setIsEditMode(true);
    setActiveTab("details");
  };

  if (isLoading) return <div>Loading organizations...</div>;
  if (error) return <div>Error loading organizations</div>;

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
              {organizations.reduce((sum, org) => sum + org.membersCount, 0)}
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
              {organizations.reduce((sum, org) => sum + org.offersCount, 0)}
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
            organizations={organizations.map(org => ({
              id: org.id,
              name: org.name,
              logo: org.logo_url || '/placeholder.svg',
              primaryColor: org.primary_color || '#0066CC',
              membersCount: 0,
              offersCount: 0,
            }))} 
            onSelect={handleOrganizationSelect} 
            onCreateNew={handleCreateNew}
          />
        </TabsContent>
        
        <TabsContent value="details">
          <OrganizationForm 
            organization={selectedOrganization ? {
              id: selectedOrganization.id,
              name: selectedOrganization.name,
              logo: selectedOrganization.logo_url || '/placeholder.svg',
              primaryColor: selectedOrganization.primary_color || '#0066CC',
              membersCount: 0,
              offersCount: 0,
            } : null} 
            isEditMode={isEditMode} 
            onSave={() => setIsEditMode(false)}
            onCancel={() => {
              setIsEditMode(false);
              setActiveTab("organizations");
            }}
          />
        </TabsContent>
        
        <TabsContent value="branding">
          <OrganizationBranding 
            organization={selectedOrganization ? {
              id: selectedOrganization.id,
              name: selectedOrganization.name,
              logo: selectedOrganization.logo_url || '/placeholder.svg',
              primaryColor: selectedOrganization.primary_color || '#0066CC',
              membersCount: 0,
              offersCount: 0,
            } : null} 
          />
        </TabsContent>
        
        <TabsContent value="rules">
          <OrganizationRules 
            organization={selectedOrganization ? {
              id: selectedOrganization.id,
              name: selectedOrganization.name,
              logo: selectedOrganization.logo_url || '/placeholder.svg',
              primaryColor: selectedOrganization.primary_color || '#0066CC',
              membersCount: 0,
              offersCount: 0,
            } : null} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationManagement;
