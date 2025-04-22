
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, Plus, Trash2 } from "lucide-react";

interface Organization {
  id: number;
  name: string;
  logo: string;
  primaryColor: string;
  membersCount: number;
  offersCount: number;
}

interface OrganizationRulesProps {
  organization: Organization;
}

// Sample rule data
const dummyRules = [
  { id: 1, name: "Offer Approval", description: "All offers require admin approval", enabled: true, scope: "Global" },
  { id: 2, name: "Retailer Discount Cap", description: "Maximum discount of 25% for retailers", enabled: true, scope: "Offers" },
  { id: 3, name: "Geographic Restrictions", description: "Offers can be limited to specific regions", enabled: false, scope: "Targeting" },
  { id: 4, name: "Member-Only Offers", description: "Some offers can be restricted to members", enabled: true, scope: "Access" },
];

export const OrganizationRules: React.FC<OrganizationRulesProps> = ({ organization }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Rules for {organization.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Active Business Rules</h3>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Rule
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Rule Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>
                  <input 
                    type="checkbox" 
                    checked={rule.enabled} 
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </TableCell>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>{rule.description}</TableCell>
                <TableCell>{rule.scope}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-8 border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Rule Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input id="ruleName" placeholder="Enter rule name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ruleScope">Rule Scope</Label>
              <select className="w-full border border-gray-300 rounded-md h-10 px-3">
                <option>Global</option>
                <option>Offers</option>
                <option>Users</option>
                <option>Retailers</option>
                <option>Targeting</option>
                <option>Access</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2 mb-6">
            <Label htmlFor="ruleDescription">Rule Description</Label>
            <textarea 
              id="ruleDescription" 
              placeholder="Describe the business rule..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
            ></textarea>
          </div>
          
          <div className="space-y-2 mb-6">
            <Label htmlFor="ruleConditions">Rule Conditions</Label>
            <div className="border rounded-md p-4 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <select className="border border-gray-300 rounded-md h-9 px-2">
                  <option>If Offer Type</option>
                  <option>If User Role</option>
                  <option>If Location</option>
                </select>
                <select className="border border-gray-300 rounded-md h-9 px-2">
                  <option>is equal to</option>
                  <option>contains</option>
                  <option>is greater than</option>
                </select>
                <Input className="h-9" placeholder="Value" />
                <Button variant="ghost" size="sm" className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-3 w-3" />
                Add Condition
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ruleActions">Rule Actions</Label>
            <div className="border rounded-md p-4 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <select className="border border-gray-300 rounded-md h-9 px-2 w-48">
                  <option>Require Approval</option>
                  <option>Limit Discount</option>
                  <option>Restrict Access</option>
                </select>
                <Input className="h-9" placeholder="Parameters" />
                <Button variant="ghost" size="sm" className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-3 w-3" />
                Add Action
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="mr-2">Cancel</Button>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Rule Configuration
        </Button>
      </CardFooter>
    </Card>
  );
};
