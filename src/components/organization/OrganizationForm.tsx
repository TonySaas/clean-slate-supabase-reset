
import React, { useRef, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building, Save, X, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { UIOrganization } from './OrganizationList';
import { useToast } from "@/hooks/use-toast";

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
  const [logoUrl, setLogoUrl] = useState<string | null>(organization?.logo || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  // Handle clicking the Upload Logo button
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // File upload handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      // Use org id if editing, otherwise use temporary name (client-only!)
      const orgId = organization?.id ?? `new-${Date.now()}`;
      const fileExt = file.name.split('.').pop();
      const filePath = `${orgId}.${fileExt}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from("organization-logos")
        .upload(filePath, file, { upsert: true });

      if (error) {
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase
        .storage
        .from("organization-logos")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        toast({
          title: "Could not get logo URL",
          variant: "destructive",
        });
      } else {
        setLogoUrl(publicUrlData.publicUrl);
        toast({
          title: "Logo uploaded!",
          description: "Logo has been successfully uploaded.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error uploading logo",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset input so you can upload the same file again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={organization?.name || 'Organization logo'} 
                    className="max-w-full max-h-full p-2" 
                  />
                ) : (
                  <Building className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleUploadButtonClick}
                disabled={uploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Logo"}
              </Button>
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
