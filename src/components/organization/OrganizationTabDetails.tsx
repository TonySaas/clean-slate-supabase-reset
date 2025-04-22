
import React from "react";
import { UIOrganization } from "./OrganizationList";
import { OrganizationForm } from "./OrganizationForm";

interface OrganizationTabDetailsProps {
  selectedOrganization: UIOrganization | null;
  isEditMode: boolean;
  onEditSave: () => void;
  onEditCancel: () => void;
}

export const OrganizationTabDetails: React.FC<OrganizationTabDetailsProps> = ({
  selectedOrganization,
  isEditMode,
  onEditSave,
  onEditCancel
}) => {
  if (selectedOrganization) {
    return (
      <OrganizationForm
        organization={selectedOrganization}
        isEditMode={isEditMode}
        onSave={onEditSave}
        onCancel={onEditCancel}
      />
    );
  }
  if (!selectedOrganization && isEditMode) {
    return (
      <OrganizationForm
        organization={null}
        isEditMode={true}
        onSave={onEditSave}
        onCancel={onEditCancel}
      />
    );
  }
  return (
    <div className="text-center p-8">
      <h3 className="text-lg font-medium">No organization selected</h3>
      <p className="text-gray-500">Please select an organization to view details</p>
    </div>
  );
};
