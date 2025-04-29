
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

export default function CampaignBulkUpload() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#f9f9f9]">
        <DashboardSidebar />
        <main className="flex-1 px-8 py-8">
          <h1 className="text-2xl font-bold mb-6">Bulk Upload Offers</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Campaign Offers Bulk Upload</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-10">
              <Upload className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-center mb-4">
                Drag and drop your CSV or Excel file here, or click to select files
              </p>
              <Button variant="outline" className="mb-2">
                Select Files
              </Button>
              <p className="text-xs text-gray-500">
                Supported formats: .csv, .xlsx (max 5MB)
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
}
