
import React, { useState } from 'react';
import { useOrganizations, type Organization } from '@/hooks/useOrganizations';
import { OrganizationStatsCards } from '@/components/organization/OrganizationStatsCards';
import { OrganizationTabs } from '@/components/organization/OrganizationTabs';
import { UIOrganization } from '@/components/organization/OrganizationList';

import { OrganizationManagementHeader } from "./organization/OrganizationManagementHeader";
import { OrganizationManagementLoading } from "./organization/OrganizationManagementLoading";
import { OrganizationManagementError } from "./organization/OrganizationManagementError";
import MainLayout from '@/layouts/MainLayout';

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
    domain: '',       // Initialize with empty string
    adminEmail: '',   // Initialize with empty string
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

  if (isLoading) return <OrganizationManagementLoading />;

  if (error) return <OrganizationManagementError error={error} />;

  const uiOrganizations = organizations.map(mapToUIOrganization);
  const selectedUiOrg = selectedOrganization ? mapToUIOrganization(selectedOrganization) : null;

  return (
    <MainLayout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <OrganizationManagementHeader />
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
    </MainLayout>
  );
};

export default OrganizationManagement;
