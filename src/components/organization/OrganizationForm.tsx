
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
  // State for form fields
  const [name, setName] = useState<string>(organization?.name || '');
  const [primaryColor, setPrimaryColor] = useState<string>(organization?.primaryColor || '#0066CC');
  const [primaryColorText, setPrimaryColorText] = useState<string>(organization?.primaryColor || '#0066CC');
  const [logoUrl, setLogoUrl] = useState<string | null>(organization?.logo || null);
  const [domain, setDomain] = useState<string>(organization?.domain || '');
  const [adminEmail, setAdminEmail] = useState<string>(organization?.adminEmail || '');

  // Upload logic
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  // Saving logic
  const [saving, setSaving] = useState(false);

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

  // Save organization data to Supabase
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Compose slug
      const slug = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, '')
        .substring(0, 50);

      // Upsert to organizations table
      const { error } = await supabase
        .from("organizations")
        .upsert([{
          id: organization?.id, // will insert if null, update if exists
          name: name.trim(),
          logo_url: logoUrl,
          primary_color: primaryColor,
          slug,
        }]);

      if (error) {
        toast({
          title: "Save failed",
          description: error.message,
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      toast({
        title: isNewOrg ? "Organization created!" : "Organization updated!",
        description: isNewOrg
          ? "The new organization was created successfully."
          : "The organization changes were saved successfully."
      });

      onSave();
    } catch (err: any) {
      toast({
        title: "Error saving",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Color input sync
  const handlePrimaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
    setPrimaryColorText(e.target.value);
  };
  const handlePrimaryColorTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColorText(e.target.value);
    // Only update color input if valid hex
    if (/^#([A-Fa-f0-9]{6})$/.test(e.target.value.trim())) {
      setPrimaryColor(e.target.value.trim());
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
        <form className="space-y-6" onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                placeholder="Enter organization name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Brand Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="primaryColor"
                  type="color"
                  className="w-16 p-1 h-10"
                  value={primaryColor}
                  onChange={handlePrimaryColorChange}
                />
                <Input
                  id="primaryColorText"
                  placeholder="#000000"
                  value={primaryColorText}
                  onChange={handlePrimaryColorTextChange}
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
                value={domain}
                onChange={e => setDomain(e.target.value)}
                disabled
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
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                disabled
              />
            </div>
          </div>
          <div className="invisible w-0 h-0">
            {/* so enter submits form */}
            <input type="submit" />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} type="button">
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving || uploading}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : isNewOrg ? "Create Organization" : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};
