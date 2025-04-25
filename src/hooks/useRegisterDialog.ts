
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

  // Clear any timeout when component unmounts or when checking status changes
  useEffect(() => {
    let timeoutId: number | undefined;
    
    if (isCheckingOrgs) {
      timeoutId = window.setTimeout(() => {
        setIsCheckingOrgs(false);
        toast.error("Operation timed out", {
          description: "Failed to check organizations. Please try again."
        });
      }, 5000); // Reduced timeout to 5 seconds
    }
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [isCheckingOrgs]);

  const checkOrganizationsExist = async () => {
    // If already checking, don't start another check
    if (isCheckingOrgs) return false;
    
    setIsCheckingOrgs(true);
    
    try {
      // First check if we already have organizations in cache
      if (organizations && organizations.length > 0) {
        setIsRegisterDialogOpen(true);
        setIsCheckingOrgs(false);
        return true;
      }
      
      // Clear the cache before refetching
      await refetch({ throwOnError: true });
      
      // Check if organizations exist after refetch
      if (!organizations || organizations.length === 0) {
        toast.error("No organizations found", {
          description: "Please contact an administrator to set up organizations"
        });
        return false;
      }
      
      // If we have organizations, open the dialog
      setIsRegisterDialogOpen(true);
      return true;
    } catch (error: any) {
      console.error("Error checking organizations:", error);
      toast.error("Failed to check organizations", {
        description: "Please try again or contact support"
      });
      return false;
    } finally {
      // Always reset checking state
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
