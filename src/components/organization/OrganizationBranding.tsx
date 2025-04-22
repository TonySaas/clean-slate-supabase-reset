
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";

interface Organization {
  id: number;
  name: string;
  logo: string;
  primaryColor: string;
  membersCount: number;
  offersCount: number;
}

interface OrganizationBrandingProps {
  organization: Organization;
}

export const OrganizationBranding: React.FC<OrganizationBrandingProps> = ({ organization }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding Controls for {organization.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="logos">Logos & Icons</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="primaryColor" 
                    type="color"
                    className="w-12 p-1 h-10" 
                    defaultValue={organization.primaryColor} 
                  />
                  <Input 
                    id="primaryColorText" 
                    placeholder="#000000" 
                    defaultValue={organization.primaryColor} 
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="secondaryColor" 
                    type="color"
                    className="w-12 p-1 h-10" 
                    defaultValue="#34D399" 
                  />
                  <Input 
                    id="secondaryColorText" 
                    placeholder="#000000" 
                    defaultValue="#34D399" 
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="accentColor" 
                    type="color"
                    className="w-12 p-1 h-10" 
                    defaultValue="#F59E0B" 
                  />
                  <Input 
                    id="accentColorText" 
                    placeholder="#000000" 
                    defaultValue="#F59E0B" 
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Theme Preview</h3>
              <div className="border rounded-lg p-6">
                <div className="flex flex-wrap gap-4">
                  <div 
                    className="w-24 h-24 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: organization.primaryColor }}
                  >
                    Primary
                  </div>
                  <div 
                    className="w-24 h-24 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: "#34D399" }}
                  >
                    Secondary
                  </div>
                  <div 
                    className="w-24 h-24 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: "#F59E0B" }}
                  >
                    Accent
                  </div>
                  <div className="w-24 h-24 rounded-lg flex items-center justify-center bg-gray-100">
                    Background
                  </div>
                  <div className="w-24 h-24 rounded-lg flex items-center justify-center bg-white border">
                    Surface
                  </div>
                </div>
                
                <div className="mt-4 p-4 border rounded-lg bg-white">
                  <div className="mb-2 font-bold" style={{ color: organization.primaryColor }}>
                    Sample Header Text
                  </div>
                  <p className="text-gray-800 mb-2">This is sample body text in the organization brand colors.</p>
                  <button 
                    className="px-4 py-2 rounded-md text-white"
                    style={{ backgroundColor: organization.primaryColor }}
                  >
                    Primary Button
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="typography" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="headingFont">Heading Font</Label>
                <select className="w-full border border-gray-300 rounded-md h-10 px-3">
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Open Sans</option>
                  <option>Montserrat</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bodyFont">Body Font</Label>
                <select className="w-full border border-gray-300 rounded-md h-10 px-3">
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Open Sans</option>
                  <option>Lato</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Typography Preview</h3>
              <div className="border rounded-lg p-6 bg-white">
                <h1 className="text-3xl font-bold mb-2">Heading 1</h1>
                <h2 className="text-2xl font-bold mb-2">Heading 2</h2>
                <h3 className="text-xl font-bold mb-2">Heading 3</h3>
                <p className="mb-2">This is regular paragraph text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p className="text-sm mb-2">This is small text that might be used for captions or notes.</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-md text-white" style={{ backgroundColor: organization.primaryColor }}>
                    Button Text
                  </button>
                  <button className="px-4 py-2 rounded-md border" style={{ borderColor: organization.primaryColor, color: organization.primaryColor }}>
                    Button Text
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Primary Logo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center h-40 bg-gray-50">
                  {organization.logo ? (
                    <img 
                      src={organization.logo} 
                      alt={organization.name} 
                      className="max-w-full max-h-full"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <p>No logo uploaded</p>
                      <Button variant="outline" className="mt-2">Upload Logo</Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Alternative Logo (Light/Dark)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center h-40 bg-gray-900">
                  <div className="text-center text-gray-400">
                    <p>No alternative logo</p>
                    <Button variant="outline" className="mt-2 border-gray-700 text-gray-300">Upload Alternative</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label>Favicon</Label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <img src="/placeholder.svg" alt="Favicon" className="w-8 h-8" />
                </div>
                <Button variant="outline">Upload Favicon</Button>
                <p className="text-sm text-gray-500">
                  32x32px recommended (PNG, ICO)
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Logo Usage Guidelines</h3>
              <div className="border rounded-lg p-4 bg-white">
                <p className="text-sm text-gray-600 mb-2">
                  - Maintain clear space around the logo equal to 25% of its height
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  - Do not stretch, distort, or change the colors of the logo
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  - Minimum logo size: 24px in height for digital use
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">Consumer App Template</p>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium">Consumer App</h4>
                  <p className="text-sm text-gray-500">Mobile-first design</p>
                  <Button variant="ghost" size="sm" className="mt-2 w-full">Customize</Button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">Retailer Portal Template</p>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium">Retailer Portal</h4>
                  <p className="text-sm text-gray-500">Dashboard-focused</p>
                  <Button variant="ghost" size="sm" className="mt-2 w-full">Customize</Button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">Supplier Portal Template</p>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium">Supplier Portal</h4>
                  <p className="text-sm text-gray-500">Advanced controls</p>
                  <Button variant="ghost" size="sm" className="mt-2 w-full">Customize</Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label>Email Templates</Label>
              <div className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Welcome Email</h4>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Offer Notification</h4>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Password Reset</h4>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto">
          <Save className="mr-2 h-4 w-4" />
          Save Branding Settings
        </Button>
      </CardFooter>
    </Card>
  );
};
