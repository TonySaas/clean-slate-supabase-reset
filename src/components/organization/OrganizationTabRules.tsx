
import React from "react";
import { UIOrganization } from "./OrganizationList";
import { OrganizationRules } from "./OrganizationRules";

interface OrganizationTabRulesProps {
  selectedOrganization: UIOrganization | null;
}

export const OrganizationTabRules: React.FC<OrganizationTabRulesProps> = ({
  selectedOrganization
}) => (
  selectedOrganization ? (
    <OrganizationRules organization={selectedOrganization} />
  ) : (
    <div className="text-center p-8">
      <h3 className="text-lg font-medium">No organization selected</h3>
      <p className="text-gray-500">Please select an organization to manage rules</p>
    </div>
  )
);
