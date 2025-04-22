
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useOrganizations, type Organization } from '@/hooks/useOrganizations';
import { OrganizationStatsCards } from '@/components/organization/OrganizationStatsCards';
import { OrganizationTabs } from '@/components/organization/OrganizationTabs';
import { UIOrganization } from '@/components/organization/OrganizationList';

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
    const org = organizations.find(o => o.id === uiOrg.id) || null;
    setSelectedOrganization(org);
    setActiveTab("details");
  };

  const handleCreateNew = () => {
    setSelectedOrganization(null);
    setIsEditMode(true);
    setActiveTab("details");
  };

  const handleEditSave = () => setIsEditMode(false);
  const handleEditCancel = () => {
    setIsEditMode(false);
    setActiveTab("organizations");
  };

  if (isLoading) return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
      <div className="text-xl">Loading organizations...</div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load organizations. Please try again later.
          {error instanceof Error && (
            <div className="mt-2 text-sm opacity-80">{error.message}</div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );

  const uiOrganizations = organizations.map(mapToUIOrganization);
  const selectedUiOrg = selectedOrganization ? mapToUIOrganization(selectedOrganization) : null;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Organization Management</h1>
        <p className="text-gray-600">Configure and manage organizations within the platform</p>
      </div>
      <OrganizationStatsCards
        organizations={organizations}
        onCreateNew={handleCreateNew}
      />
      <OrganizationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        uiOrganizations={uiOrganizations}
        handleOrganizationSelect={handleOrganizationSelect}
        selectedOrganization={selectedUiOrg}
        isEditMode={isEditMode}
        onEditSave={handleEditSave}
        onEditCancel={handleEditCancel}
        onCreateNew={handleCreateNew}
      />
    </div>
  );
};

export default OrganizationManagement;

