
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import NotFound from "./pages/NotFound";
import SupplierPortal from "./pages/SupplierPortal";
import RetailerPortal from "./pages/RetailerPortal";
import ConsumerApp from "./pages/ConsumerApp";
import OrganizationManagement from "./pages/OrganizationManagement";
import MainLayout from "./layouts/MainLayout";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

// Protected route component that redirects users based on their role
const ProtectedRoute = ({ children, requirePlatformAdmin = false }) => {
  const { profile, isLoading, hasRole } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  if (!profile) {
    return <Navigate to="/login" replace />;
  }
  
  if (requirePlatformAdmin && !hasRole('platform_admin')) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Component to redirect based on user role
const RoleBasedRedirect = () => {
  const { profile, isLoading, hasRole } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  if (!profile) {
    return <Navigate to="/login" replace />;
  }
  
  if (hasRole('platform_admin')) {
    return <Navigate to="/organizations" replace />;
  }
  
  return <Navigate to="/organization-dashboard" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/:organizationId" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/:organizationId/campaign/new" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/organization-dashboard" element={
            <ProtectedRoute>
              <OrganizationDashboard />
            </ProtectedRoute>
          } />
          <Route path="/" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/supplier" element={<MainLayout><SupplierPortal /></MainLayout>} />
          <Route path="/retailer" element={<MainLayout><RetailerPortal /></MainLayout>} />
          <Route path="/consumer" element={<MainLayout><ConsumerApp /></MainLayout>} />
          <Route 
            path="/organizations" 
            element={
              <ProtectedRoute requirePlatformAdmin={true}>
                <OrganizationManagement />
              </ProtectedRoute>
            } 
          />
          <Route path="/role-redirect" element={<RoleBasedRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
