
import { Megaphone, UserRound, Store, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function DashboardActionButtons() {
  return (
    <div className="flex flex-wrap gap-4 mb-10">
      <Button className="flex items-center gap-2" size="lg">
        <Megaphone size={18} />
        Create Campaign
      </Button>
      <Button variant="outline" className="flex items-center gap-2 bg-white" size="lg">
        <UserRound size={18} />
        Add Supplier
      </Button>
      <Button variant="outline" className="flex items-center gap-2 bg-white" size="lg">
        <Store size={18} />
        Add Merchant
      </Button>
      <Button variant="outline" className="flex items-center gap-2 bg-white" size="lg">
        <FileText size={18} />
        View Offers
      </Button>
    </div>
  );
}
