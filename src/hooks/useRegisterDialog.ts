
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

  useEffect(() => {
    let timeoutId: number | undefined;
    
    if (isCheckingOrgs) {
      timeoutId = window.setTimeout(() => {
        setIsCheckingOrgs(false);
        toast.error("Operation timed out", {
          description: "Failed to check organizations. Please try again."
        });
      }, 8000);
    }
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [isCheckingOrgs]);

  const checkOrganizationsExist = async () => {
    setIsCheckingOrgs(true);
    try {
      if (organizations && organizations.length > 0) {
        setIsRegisterDialogOpen(true);
        setIsCheckingOrgs(false);
        return true;
      }
      
      const result = await refetch();
      
      if (result.error) {
        throw result.error;
      }
      
      if (!result.data || result.data.length === 0) {
        toast.error("No organizations found", {
          description: "Please contact an administrator to set up organizations"
        });
        setIsCheckingOrgs(false);
        return false;
      }
      
      setIsRegisterDialogOpen(true);
      setIsCheckingOrgs(false);
      return true;
    } catch (error) {
      console.error("Error checking organizations:", error);
      toast.error("Failed to check organizations");
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
