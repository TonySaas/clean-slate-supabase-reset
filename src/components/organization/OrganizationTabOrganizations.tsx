
import React from "react";
import { UIOrganization } from "./OrganizationList";
import { OrganizationList } from "./OrganizationList";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, PlusCircle } from "lucide-react";

interface OrganizationTabOrganizationsProps {
  uiOrganizations: UIOrganization[];
  onSelect: (org: UIOrganization) => void;
  onCreateNew: () => void;
}

export const OrganizationTabOrganizations: React.FC<OrganizationTabOrganizationsProps> = ({
  uiOrganizations,
  onSelect,
  onCreateNew
}) => (
  <>
    {uiOrganizations.length > 0 ? (
      <OrganizationList
        organizations={uiOrganizations}
        onSelect={onSelect}
        onCreateNew={onCreateNew}
      />
    ) : (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Building className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Organizations Found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first organization</p>
            <Button onClick={onCreateNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Organization
            </Button>
          </div>
        </CardContent>
      </Card>
    )}
  </>
);
