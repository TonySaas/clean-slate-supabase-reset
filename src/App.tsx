import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SupplierPortal from "./pages/SupplierPortal";
import RetailerPortal from "./pages/RetailerPortal";
import ConsumerApp from "./pages/ConsumerApp";
import OrganizationManagement from "./pages/OrganizationManagement";
import MainLayout from "./layouts/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/:organizationId" element={<Dashboard />} />
          <Route path="/dashboard/:organizationId/campaign/new" element={<Dashboard />} />
          <Route path="/" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/supplier" element={<MainLayout><SupplierPortal /></MainLayout>} />
          <Route path="/retailer" element={<MainLayout><RetailerPortal /></MainLayout>} />
          <Route path="/consumer" element={<MainLayout><ConsumerApp /></MainLayout>} />
          <Route path="/organizations" element={<MainLayout><OrganizationManagement /></MainLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
