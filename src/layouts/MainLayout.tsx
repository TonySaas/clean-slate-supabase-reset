
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (profile) {
      handleLogout();
    } else {
      navigate('/login');
    }
  };

  const handleSignupClick = () => {
    navigate('/register');
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="font-bold text-2xl text-blue-600">BuildingMerchantHub</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/supplier" className="hover:text-blue-600 transition-colors">Suppliers</Link>
              <Link to="/retailer" className="hover:text-blue-600 transition-colors">Retailers</Link>
              <Link to="/consumer" className="hover:text-blue-600 transition-colors">Consumers</Link>
              <Link to="/organizations" className="hover:text-blue-600 transition-colors">Organizations</Link>
              <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleLoginClick}>
                {profile ? 'Logout' : 'Login'}
              </Button>
              {!profile && (
                <Button size="sm" onClick={handleSignupClick}>Sign Up</Button>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
