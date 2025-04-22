
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  parent_id: string | null;
}

export const useProductCategories = () => {
  return useQuery({
    queryKey: ['product_categories'],
    queryFn: async (): Promise<ProductCategory[]> => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('id, name, description, icon, parent_id');

      if (error) {
        toast({
          title: "Error fetching categories",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data ?? [];
    },
    retry: 1,
  });
};
