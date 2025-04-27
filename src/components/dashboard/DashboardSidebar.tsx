
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  LayoutDashboard,
  Megaphone,
  Factory,
  Store,
  FileText,
  ChartBar,
  Settings,
  LogOut
} from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  logo_url: string | null;
}

export function DashboardSidebar() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { profile, logout } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const firstName = profile?.first_name || 'User';

  useEffect(() => {
    const fetchOrganization = async () => {
      if (organizationId) {
        try {
          const { data, error } = await supabase
            .from('organizations')
            .select('id, name, logo_url')
            .eq('id', organizationId)
            .single();

          if (error) {
            console.error('Error fetching organization:', error);
          } else if (data) {
            setOrganization(data);
          }
        } catch (err) {
          console.error('Error in fetching organization details:', err);
        }
      }
    };

    fetchOrganization();
  }, [organizationId]);

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, url: `/dashboard/${organizationId}` },
    { title: 'Campaigns', icon: Megaphone, url: '#' },
    { title: 'Suppliers', icon: Factory, url: '#' },
    { title: 'Merchants', icon: Store, url: '#' },
    { title: 'Offers', icon: FileText, url: '#' },
    { title: 'Analytics', icon: ChartBar, url: '#' },
    { title: 'Settings', icon: Settings, url: '#' },
  ];

  return (
    <Sidebar className="bg-[#1f2937] text-white border-r-0">
      <SidebarHeader className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 h-12 w-12 rounded-md flex items-center justify-center overflow-hidden">
            {organization?.logo_url ? (
              <img 
                src={organization.logo_url} 
                alt={`${organization?.name || 'Organization'} logo`} 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-xl">
                {organization?.name?.charAt(0) || 'O'}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-base truncate max-w-[150px]">
              {organization?.name || 'Organization'}
            </span>
            <span className="text-white/70 text-xs">
              Admin Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={item.title === 'Dashboard'}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <a href={item.url} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={firstName} />
            <AvatarFallback className="bg-white/10 text-white">
              {firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{firstName}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-red-400"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
