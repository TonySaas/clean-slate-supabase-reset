
import React from "react";
import { UIOrganization } from "./OrganizationList";
import { OrganizationBranding } from "./OrganizationBranding";

interface OrganizationTabBrandingProps {
  selectedOrganization: UIOrganization | null;
}

export const OrganizationTabBranding: React.FC<OrganizationTabBrandingProps> = ({
  selectedOrganization
}) => (
  selectedOrganization ? (
    <OrganizationBranding organization={selectedOrganization} />
  ) : (
    <div className="text-center p-8">
      <h3 className="text-lg font-medium">No organization selected</h3>
      <p className="text-gray-500">Please select an organization to manage branding</p>
    </div>
  )
);
