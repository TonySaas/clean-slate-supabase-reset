
import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
}

export default function Dashboard() {
  const { organizationId: userOrgId, logout, isLoading } = useAuth();
  const { organizationId } = useParams<{ organizationId: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);

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

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };
  
  const handleLogoutToLogin = async () => {
    await logout();
    // Navigate to login with param to force showing login screen even if there's a session
    window.location.href = '/login?logout=true';
  };

  // Redirect if not logged in or wrong organization
  if (!isLoading && (!userOrgId || userOrgId !== organizationId)) {
    return <Navigate to="/login" replace />;
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {organization.name} Dashboard
          </h1>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut size={16} />
            Sign out
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600 mb-4">
            Welcome to your organization's dashboard!
          </p>
          <div className="border-t pt-4 mt-4">
            <h2 className="text-lg font-medium mb-2">Testing Options</h2>
            <div className="flex flex-col space-y-2">
              <Button variant="destructive" onClick={handleLogoutToLogin} className="flex items-center gap-2 w-fit">
                <LogOut size={16} />
                Sign out to test registration/login
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
