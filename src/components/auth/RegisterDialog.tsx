
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Organization } from '@/hooks/useOrganizations';

interface RegisterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  organizations: Organization[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onSelectOrganization: (organizationId: string) => void;
  onRefetch: () => void;
}

export const RegisterDialog = ({
  isOpen,
  onOpenChange,
  organizations,
  isLoading,
  error,
  onSelectOrganization,
  onRefetch
}: RegisterDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Your Organization</DialogTitle>
          <DialogDescription>
            Choose an organization to register with
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {isLoading ? (
            <p className="text-center text-gray-500 py-4">Loading organizations...</p>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-center">
              <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-red-700">Failed to load organizations</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={onRefetch}
              >
                Try Again
              </Button>
            </div>
          ) : !organizations || organizations.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded text-center">
              <AlertCircle className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <p className="text-amber-700">No organizations found</p>
              <p className="text-sm text-amber-600 mt-1">
                Please contact an administrator to set up organizations
              </p>
            </div>
          ) : (
            organizations.map((org) => (
              <Button
                key={org.id}
                variant="outline"
                className="w-full text-left justify-start h-auto py-4"
                onClick={() => onSelectOrganization(org.id)}
              >
                <div className="flex items-center gap-3">
                  {org.logo_url && (
                    <img 
                      src={org.logo_url} 
                      alt={org.name} 
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'placeholder.svg';
                      }}
                    />
                  )}
                  <span>{org.name}</span>
                </div>
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
