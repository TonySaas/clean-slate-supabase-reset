
import { useEffect, useState } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardKPICards } from '@/components/dashboard/DashboardKPICards';
import { DashboardActionButtons } from '@/components/dashboard/DashboardActionButtons';
import { DashboardCalendar } from '@/components/dashboard/DashboardCalendar';
import { DashboardActivity } from '@/components/dashboard/DashboardActivity';
import { CreateCampaign } from '@/components/campaign/CreateCampaign';
import { toast } from 'sonner';

interface Organization {
  id: string;
  name: string;
}

export default function Dashboard() {
  const { organizationId: userOrgId, isLoading, profile } = useAuth();
  const { organizationId } = useParams<{ organizationId: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const location = useLocation();
  const isCreateCampaign = location.pathname.includes('/campaign/new');
  
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('id, name')
          .eq('id', organizationId)
          .single();

        if (error) throw error;
        setOrganization(data);
      } catch (error) {
        console.error('Error fetching organization:', error);
        toast.error('Error loading organization details');
      }
    };

    if (organizationId) {
      fetchOrganization();
    }
  }, [organizationId]);

  if (!isLoading && (!userOrgId || userOrgId !== organizationId)) {
    return <Navigate to="/login" replace />;
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const firstName = profile?.first_name || 'User';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#f9f9f9]">
        <DashboardSidebar />
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
    </SidebarProvider>
  );
}
