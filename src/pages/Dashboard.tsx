
import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { PanelLeft, PanelRight } from 'lucide-react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardTopNav } from '@/components/dashboard/DashboardTopNav';
import { DashboardKPICards } from '@/components/dashboard/DashboardKPICards';
import { DashboardActionButtons } from '@/components/dashboard/DashboardActionButtons';
import { DashboardCalendar } from '@/components/dashboard/DashboardCalendar';
import { DashboardActivity } from '@/components/dashboard/DashboardActivity';
import { toast } from 'sonner';

interface Organization {
  id: string;
  name: string;
}

export default function Dashboard() {
  const { organizationId: userOrgId, isLoading, profile } = useAuth();
  const { organizationId } = useParams<{ organizationId: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [useSidebar, setUseSidebar] = useState(false);
  
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

  const MainContent = () => (
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
  );

  const SidebarContent = () => (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-[#f9f9f9]">
        <DashboardSidebar />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">Support</Button>
            </div>
          </div>
          <MainContent />
        </main>
      </div>
    </SidebarProvider>
  );

  const TopNavContent = () => (
    <div className="min-h-screen bg-[#f9f9f9]">
      <DashboardTopNav organizationId={organizationId} />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <MainContent />
      </main>
    </div>
  );

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 right-4 z-50"
        onClick={() => setUseSidebar(!useSidebar)}
      >
        {useSidebar ? (
          <PanelLeft className="h-4 w-4" />
        ) : (
          <PanelRight className="h-4 w-4" />
        )}
      </Button>
      {useSidebar ? <SidebarContent /> : <TopNavContent />}
    </div>
  );
}
