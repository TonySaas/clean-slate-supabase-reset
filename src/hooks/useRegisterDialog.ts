
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useOrganizations } from './useOrganizations';

export const useRegisterDialog = () => {
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isCheckingOrgs, setIsCheckingOrgs] = useState(false);
  const { data: organizations, isLoading, error, refetch } = useOrganizations();

  useEffect(() => {
    if (isRegisterDialogOpen) {
      refetch();
    }
  }, [isRegisterDialogOpen, refetch]);

  const checkOrganizationsExist = async () => {
    if (isCheckingOrgs) {
      toast.info("Please wait...");
      return false;
    }
    
    setIsCheckingOrgs(true);
    
    try {
      // First try to use cached data
      if (organizations && organizations.length > 0) {
        setIsRegisterDialogOpen(true);
        return true;
      }
      
      // If no cached data, fetch fresh data
      const { data } = await refetch();
      
      if (!data || data.length === 0) {
        toast.error("No organizations available", {
          description: "Please contact an administrator"
        });
        return false;
      }
      
      setIsRegisterDialogOpen(true);
      return true;
    } catch (error: any) {
      console.error("Organization check error:", error);
      toast.error("Unable to check organizations", {
        description: "Please try again"
      });
      return false;
    } finally {
      setIsCheckingOrgs(false);
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
