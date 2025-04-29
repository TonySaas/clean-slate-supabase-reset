
import { useEffect, useState } from 'react';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardTopNav } from '@/components/dashboard/DashboardTopNav';
import { DashboardKPICards } from '@/components/dashboard/DashboardKPICards';
import { DashboardActionButtons } from '@/components/dashboard/DashboardActionButtons';
import { DashboardCalendar } from '@/components/dashboard/DashboardCalendar';
import { DashboardActivity } from '@/components/dashboard/DashboardActivity';
import { CreateCampaign } from '@/components/campaign/CreateCampaign';
import { toast } from 'sonner';

export default function OrganizationDashboard() {
  const { profile, isLoading, hasRole } = useAuth();
  const [organization, setOrganization] = useState<{ id: string; name: string } | null>(null);
  const location = useLocation();
  const isCreateCampaign = location.pathname.includes('/campaign/new');
  
  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        if (!profile?.organization_id) return;
        
        const { data, error } = await supabase
          .from('organizations')
          .select('id, name')
          .eq('id', profile.organization_id)
          .single();

        if (error) throw error;
        setOrganization(data);
      } catch (error) {
        console.error('Error fetching organization:', error);
        toast.error('Error loading organization details');
      }
    };

    if (profile) {
      fetchOrganizationData();
    }
  }, [profile]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!profile && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  // If platform admin, redirect to organizations management
  if (hasRole('platform_admin')) {
    return <Navigate to="/organizations" replace />;
  }

  // If no organization found, show error
  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">No organization found for your account.</div>
      </div>
    );
  }

  // Use optional chaining and nullish coalescing for safer access to profile data
  const firstName = profile?.first_name || profile?.email?.split('@')[0] || 'User';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#f9f9f9]">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardTopNav organizationId={organization.id} />
          <main className="flex-1 px-8 py-8">
            {isCreateCampaign ? (
              <CreateCampaign />
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  Welcome back, {firstName}!
                </h1>
                <DashboardKPICards />
                <DashboardActionButtons />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <DashboardCalendar />
                  <DashboardActivity />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
