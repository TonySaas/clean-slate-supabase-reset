
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface OrganizationManagementErrorProps {
  error: unknown;
}

export const OrganizationManagementError: React.FC<OrganizationManagementErrorProps> = ({ error }) => (
  <div className="container mx-auto px-4 py-8">
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load organizations. Please try again later.
        {error instanceof Error && (
          <div className="mt-2 text-sm opacity-80">{error.message}</div>
        )}
      </AlertDescription>
    </Alert>
  </div>
);
