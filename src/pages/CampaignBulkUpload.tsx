import React, { useState, useCallback } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function CampaignBulkUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const uploadedFile = e.dataTransfer.files[0];
      validateAndSetFile(uploadedFile);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (fileType !== 'csv' && fileType !== 'xlsx') {
      toast.error('Invalid file format', {
        description: 'Please upload a CSV or Excel file'
      });
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Maximum file size is 5MB'
      });
      return;
    }
    
    setFile(file);
    toast.success('File selected', {
      description: `${file.name} is ready to upload`
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would actually process the file and upload to Supabase
      // const formData = new FormData();
      // formData.append('file', file);
      // Actual implementation would send to an API endpoint or process directly

      toast.success('Upload successful', {
        description: 'Your file has been processed successfully'
      });
      
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed', {
        description: 'There was a problem processing your file'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#f9f9f9]">
        <DashboardSidebar />
        <main className="flex-1 px-8 py-8">
          <h1 className="text-2xl font-bold mb-6">Bulk Upload Campaign Offers</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Campaign Offers Bulk Upload Tool</CardTitle>
            </CardHeader>
            <CardContent>
              {!file ? (
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-10 
                    flex flex-col items-center justify-center
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} 
                    transition-colors duration-200
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-center mb-4">
                    Drag and drop your CSV or Excel file here, or click to select files
                  </p>
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="mb-2" onClick={() => document.getElementById('file-upload')?.click()}>
                      Select Files
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".csv,.xlsx"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="text-xs text-gray-500">
                    Supported formats: .csv, .xlsx (max 5MB)
                  </p>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-center p-4 mb-6 border rounded-lg bg-gray-50">
                    <FileText className="h-8 w-8 text-blue-500 mr-4" />
                    <div className="flex-grow">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      disabled={isUploading}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleUpload} 
                      disabled={isUploading}
                      className="flex items-center"
                    >
                      {isUploading ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload and Process
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>File Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">CSV or Excel Format</p>
                    <p className="text-sm text-gray-500">Your file must be in .csv or .xlsx format</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Required Columns</p>
                    <p className="text-sm text-gray-500">
                      Must include: product_name, product_code, description, offer_price, regular_price
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium">File Size</p>
                    <p className="text-sm text-gray-500">Maximum file size is 5MB</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
}
