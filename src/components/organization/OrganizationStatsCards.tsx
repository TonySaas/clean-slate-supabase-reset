
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Organization } from "@/hooks/useOrganizations";

interface OrganizationStatsCardsProps {
  organizations: Organization[];
  onCreateNew: () => void;
}

export const OrganizationStatsCards: React.FC<OrganizationStatsCardsProps> = ({
  organizations,
  onCreateNew
}) => (
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
          onClick={onCreateNew}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Organization
        </Button>
      </CardContent>
    </Card>
  </div>
);
