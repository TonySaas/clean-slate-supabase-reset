
import { useState } from 'react';
import { toast } from 'sonner';
import { useOrganizations } from './useOrganizations';

export const useRegisterDialog = () => {
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isCheckingOrgs, setIsCheckingOrgs] = useState(false);
  const { data: organizations, isLoading, error, refetch } = useOrganizations();

  const checkOrganizationsExist = async () => {
    if (isCheckingOrgs || isLoading) {
      toast.info("Please wait, checking organizations...");
      return false;
    }
    
    setIsCheckingOrgs(true);
    
    try {
      // Fetch organizations with cache clearing to ensure fresh data
      const { data } = await refetch();
      
      console.log('Organizations data:', data);
      
      if (!data || data.length === 0) {
        toast.error("No organizations available", {
          description: "Please contact an administrator to set up organizations"
        });
        setIsCheckingOrgs(false);
        return false;
      }
      
      // Organizations exist, open the dialog
      setIsRegisterDialogOpen(true);
      setIsCheckingOrgs(false);
      return true;
    } catch (error: any) {
      console.error("Organization check error:", error);
      toast.error("Unable to check organizations", {
        description: error.message || "Please try again"
      });
      setIsCheckingOrgs(false);
      return false;
    }
  };

  return {
    isRegisterDialogOpen,
    setIsRegisterDialogOpen,
    isCheckingOrgs,
    checkOrganizationsExist,
    organizations,
    isLoading,
    error,
    refetch
  };
};
