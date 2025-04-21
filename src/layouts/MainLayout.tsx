
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building, ShoppingBag, Users } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
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
              <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Login</Button>
              <Button size="sm">Sign Up</Button>
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
