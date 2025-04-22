
import React from "react";
import { useProductCategories } from "@/hooks/useProductCategories";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

export const ProductCategoriesList: React.FC = () => {
  const { data: categories = [], isLoading, error } = useProductCategories();

  if (isLoading) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load product categories.
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Package className="h-10 w-10 mx-auto mb-3 text-gray-400" />
          <div className="font-medium mb-1">No categories found</div>
          <div className="text-gray-500">No product categories exist yet.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {categories.map(cat => (
        <Card key={cat.id}>
          <CardContent className="p-5 flex gap-4 items-center">
            <Package className="flex-none text-primary" />
            <div>
              <div className="font-semibold">{cat.name}</div>
              {cat.description && (
                <div className="text-xs text-muted-foreground">{cat.description}</div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
