
import { Link } from 'react-router-dom';
import { Bell, Settings, Home, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface DashboardTopNavProps {
  organizationId: string;
}

export function DashboardTopNav({ organizationId }: DashboardTopNavProps) {
  const { profile, logout } = useAuth();
  const firstName = profile?.first_name || 'User';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white font-bold h-8 w-8 rounded flex items-center justify-center">
            O
          </div>
          <span className="font-semibold">Organization</span>
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
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarImage src="" alt={firstName} />
                  <AvatarFallback className="bg-blue-100 text-blue-800">
                    {firstName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
