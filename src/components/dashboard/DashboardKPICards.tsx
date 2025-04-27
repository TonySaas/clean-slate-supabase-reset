
import { UserRound, Store, FileText, Megaphone } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export function DashboardKPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Suppliers</span>
            <UserRound className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold mt-2">5</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Active Offers</span>
            <FileText className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">12</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Merchants</span>
            <Store className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold mt-2">8</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Current Campaigns</span>
            <Megaphone className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold mt-2">2</p>
        </CardContent>
      </Card>
    </div>
  );
}
