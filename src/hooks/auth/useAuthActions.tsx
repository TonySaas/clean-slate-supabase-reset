
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthActions = () => {
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      console.log('Login successful for user:', data?.user?.email);
      toast.success('Login successful');
      
      // The onAuthStateChange event will handle the redirect
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Logout successful, redirecting to login page');
      navigate('/login');
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error('Error logging out');
    }
  };

  return { login, logout };
};
