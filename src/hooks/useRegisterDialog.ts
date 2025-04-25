
import { useState } from 'react';
import { toast } from 'sonner';
import { useOrganizations } from './useOrganizations';

export const useRegisterDialog = () => {
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isCheckingOrgs, setIsCheckingOrgs] = useState(false);
  const { data: organizations, isLoading, error, refetch } = useOrganizations();

  const checkOrganizationsExist = async () => {
    console.log('Starting organization check, current status:', { isCheckingOrgs, isLoading });
    
    if (isCheckingOrgs || isLoading) {
      toast.info("Please wait, checking organizations...");
      return false;
    }
    
    setIsCheckingOrgs(true);
    console.log('Setting isCheckingOrgs to true');
    
    try {
      // Fetch organizations with cache clearing to ensure fresh data
      console.log('Fetching fresh organizations data');
      const { data } = await refetch();
      
      console.log('Organizations data received:', data);
      
      if (!data || data.length === 0) {
        console.log('No organizations found');
        toast.error("No organizations available", {
          description: "Please contact an administrator to set up organizations"
        });
        setIsCheckingOrgs(false);
        return false;
      }
      
      // Organizations exist, open the dialog
      console.log('Organizations exist, opening dialog');
      setIsRegisterDialogOpen(true);
      setIsCheckingOrgs(false);
      return true;
    } catch (error) {
      console.error("Organization check error:", error);
      toast.error("Unable to check organizations");
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
