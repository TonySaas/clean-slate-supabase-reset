
import { useParams } from 'react-router-dom';
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

export function DashboardSidebar() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { profile, logout } = useAuth();
  const firstName = profile?.first_name || 'User';

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
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white font-bold h-8 w-8 rounded flex items-center justify-center">
            O
          </div>
          <span className="font-semibold">Organization</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={item.title === 'Dashboard'}
                tooltip={item.title}
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

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={firstName} />
            <AvatarFallback className="bg-blue-100 text-blue-800">
              {firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{firstName}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600"
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
