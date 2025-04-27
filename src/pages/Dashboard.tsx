import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  LogOut, UserRound, Bell, Settings, Home, HelpCircle, Store, Megaphone, FileText,
  Calendar as CalendarIcon, LayoutSidebarLeftCollapse, LayoutSidebarRightCollapse
} from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

interface Organization {
  id: string;
  name: string;
}

interface Activity {
  id: string;
  title: string;
  time: string;
  icon: JSX.Element;
}

export default function Dashboard() {
  const { organizationId: userOrgId, logout, isLoading, profile } = useAuth();
  const { organizationId } = useParams<{ organizationId: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [date, setDate] = useState<Date>(new Date());
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

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };
  
  const handleLogoutToLogin = async () => {
    await logout();
    window.location.href = '/login?logout=true';
  };

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
      {/* Welcome Section */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome back, {firstName}!
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white shadow-sm hover:shadow transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Suppliers</span>
              <UserRound className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold mt-2">5</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Active Offers</span>
              <FileText className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold mt-2">12</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Merchants</span>
              <Store className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold mt-2">8</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Current Campaigns</span>
              <Megaphone className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold mt-2">2</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-10">
        <Button className="flex items-center gap-2" size="lg">
          <Megaphone size={18} />
          Create Campaign
        </Button>
        <Button variant="outline" className="flex items-center gap-2 bg-white" size="lg">
          <UserRound size={18} />
          Add Supplier
        </Button>
        <Button variant="outline" className="flex items-center gap-2 bg-white" size="lg">
          <Store size={18} />
          Add Merchant
        </Button>
        <Button variant="outline" className="flex items-center gap-2 bg-white" size="lg">
          <FileText size={18} />
          View Offers
        </Button>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Column */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-4">Campaign Calendar</h2>
            <div className="border rounded-lg p-4 bg-white">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md pointer-events-auto"
              />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Column */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="mt-0.5">{activity.icon}</div>
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testing Options - Keeping this from the original for functionality */}
      <Card className="mt-8 bg-white shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-2">Testing Options</h2>
          <div className="flex flex-col space-y-2">
            <Button variant="destructive" onClick={handleLogoutToLogin} className="flex items-center gap-2 w-fit">
              <LogOut size={16} />
              Sign out to test registration/login
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const TopNavContent = () => (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white font-bold h-8 w-8 rounded flex items-center justify-center">
              {organization.name.charAt(0)}
            </div>
            <span className="font-semibold">{organization.name}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link to={`/dashboard/${organizationId}`} className="text-sm text-gray-700 hover:text-blue-600 flex items-center gap-1">
                <Home size={16} /> Home
              </Link>
              <Link to="#" className="text-sm text-gray-700 hover:text-blue-600 flex items-center gap-1">
                <HelpCircle size={16} /> Support
              </Link>
              <div className="relative">
                <Bell size={20} className="text-gray-700 hover:text-blue-600 cursor-pointer" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
              </div>
              <Link to="#" className="text-sm text-gray-700 hover:text-blue-600">
                <Settings size={20} />
              </Link>
            </nav>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full focus:outline-none">
                  <Avatar className="h-8 w-8 border border-gray-200">
                    <AvatarImage src="" alt={profile?.first_name || "User"} />
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      {firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <UserRound size={16} />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings size={16} />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                  <LogOut size={16} />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <MainContent />
      </main>
    </div>
  );

  const SidebarContent = () => (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-[#f9f9f9]">
        <DashboardSidebar />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <div className="flex items-center gap-4">
              <Bell className="h-5 w-5 text-gray-600 cursor-pointer" />
              <Button variant="ghost" size="sm">Support</Button>
              <Settings className="h-5 w-5 text-gray-600 cursor-pointer" />
            </div>
          </div>
          <MainContent />
        </main>
      </div>
    </SidebarProvider>
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
          <LayoutSidebarLeftCollapse className="h-4 w-4" />
        ) : (
          <LayoutSidebarRightCollapse className="h-4 w-4" />
        )}
      </Button>
      {useSidebar ? <SidebarContent /> : <TopNavContent />}
    </div>
  );
}
