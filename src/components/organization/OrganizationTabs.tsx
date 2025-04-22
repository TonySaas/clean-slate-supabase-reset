
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UIOrganization } from './OrganizationList';
import { OrganizationTabOrganizations } from "./OrganizationTabOrganizations";
import { OrganizationTabDetails } from "./OrganizationTabDetails";
import { OrganizationTabBranding } from "./OrganizationTabBranding";
import { OrganizationTabRules } from "./OrganizationTabRules";

interface OrganizationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  uiOrganizations: UIOrganization[];
  handleOrganizationSelect: (org: UIOrganization) => void;
  selectedOrganization: UIOrganization | null;
  isEditMode: boolean;
  onEditSave: () => void;
  onEditCancel: () => void;
  onCreateNew: () => void;
}

export const OrganizationTabs: React.FC<OrganizationTabsProps> = ({
  activeTab,
  setActiveTab,
  uiOrganizations,
  handleOrganizationSelect,
  selectedOrganization,
  isEditMode,
  onEditSave,
  onEditCancel,
  onCreateNew
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="organizations">All Organizations</TabsTrigger>
        <TabsTrigger value="details">Organization Details</TabsTrigger>
        <TabsTrigger value="branding">Branding Controls</TabsTrigger>
        <TabsTrigger value="rules">Business Rules</TabsTrigger>
      </TabsList>
      <TabsContent value="organizations">
        <OrganizationTabOrganizations
          uiOrganizations={uiOrganizations}
          onSelect={handleOrganizationSelect}
          onCreateNew={onCreateNew}
        />
      </TabsContent>
      <TabsContent value="details">
        <OrganizationTabDetails
          selectedOrganization={selectedOrganization}
          isEditMode={isEditMode}
          onEditSave={onEditSave}
          onEditCancel={onEditCancel}
        />
      </TabsContent>
      <TabsContent value="branding">
        <OrganizationTabBranding
          selectedOrganization={selectedOrganization}
        />
      </TabsContent>
      <TabsContent value="rules">
        <OrganizationTabRules
          selectedOrganization={selectedOrganization}
        />
      </TabsContent>
    </Tabs>
  );
};
