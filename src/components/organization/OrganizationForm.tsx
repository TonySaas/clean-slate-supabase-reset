import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building, Save, X } from "lucide-react";
import { UIOrganization } from './OrganizationList';

interface OrganizationFormProps {
  organization: UIOrganization | null;
  isEditMode: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const OrganizationForm: React.FC<OrganizationFormProps> = ({
  organization,
  isEditMode,
  onSave,
  onCancel
}) => {
  const isNewOrg = !organization?.id;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isNewOrg ? "Create New Organization" : `Edit ${organization?.name}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input 
                id="name" 
                placeholder="Enter organization name" 
                defaultValue={organization?.name || ''} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Brand Color</Label>
              <div className="flex space-x-2">
                <Input 
                  id="primaryColor" 
                  type="color"
                  className="w-16 p-1 h-10" 
                  defaultValue={organization?.primaryColor || '#0066CC'} 
                />
                <Input 
                  id="primaryColorText" 
                  placeholder="#000000" 
                  defaultValue={organization?.primaryColor || '#0066CC'} 
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="logo">Organization Logo</Label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                {organization?.logo ? (
                  <img 
                    src={organization.logo} 
                    alt={organization.name || 'Organization logo'} 
                    className="max-w-full max-h-full p-2" 
                  />
                ) : (
                  <Building className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <Button variant="outline" type="button">Upload Logo</Button>
            </div>
            <p className="text-sm text-gray-500">
              Recommended size: 512x512px. PNG or SVG format.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name</Label>
              <Input 
                id="domain" 
                placeholder="example.com" 
              />
              <p className="text-sm text-gray-500">
                Used for branded portals
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Administrator Email</Label>
              <Input 
                id="adminEmail" 
                type="email" 
                placeholder="admin@example.com" 
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          {isNewOrg ? "Create Organization" : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};
