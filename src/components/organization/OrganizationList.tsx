
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface UIOrganization {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  membersCount: number;
  offersCount: number;
}

interface OrganizationListProps {
  organizations: UIOrganization[];
  onSelect: (organization: UIOrganization) => void;
  onCreateNew: () => void;
}

export const OrganizationList: React.FC<OrganizationListProps> = ({
  organizations,
  onSelect,
  onCreateNew
}) => {
  const getDefaultLogo = (orgName: string) => {
    // Use the first letter of the organization name as a default "logo"
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <rect width="40" height="40" fill="#E0E0E0" />
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="20" fill="#333">
          ${orgName.charAt(0).toUpperCase()}
        </text>
      </svg>
    `)}`;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Organizations</h2>
          <Button onClick={onCreateNew}>
            <Building className="mr-2 h-4 w-4" />
            Add Organization
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Active Offers</TableHead>
              <TableHead>Brand Color</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md overflow-hidden mr-3 bg-gray-100 flex items-center justify-center">
                      <img 
                        src={org.logo || getDefaultLogo(org.name)} 
                        alt={`${org.name} logo`} 
                        className="w-6 h-6 object-contain" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getDefaultLogo(org.name);
                        }}
                      />
                    </div>
                    {org.name}
                  </div>
                </TableCell>
                <TableCell>{org.membersCount}</TableCell>
                <TableCell>{org.offersCount}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div 
                      className="w-5 h-5 rounded-full mr-2" 
                      style={{ backgroundColor: org.primaryColor }}
                    ></div>
                    {org.primaryColor}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onSelect(org)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
