
import { useState } from 'react';
import { format } from "date-fns";
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { CampaignCalendar } from "./CampaignCalendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function CreateCampaign() {
  const { organizationId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date?.from || !date?.to || !campaignName.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('campaigns')
        .insert({
          name: campaignName,
          start_date: date.from.toISOString(),
          end_date: date.to.toISOString(),
          organization_id: organizationId,
          created_by: profile?.id,
        });

      if (error) throw error;

      toast.success("Campaign created successfully");
      navigate(`/dashboard/${organizationId}`);
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast.error(error.message || "Failed to create campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Create Campaign</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="campaignName">Campaign Name</Label>
                <Input 
                  id="campaignName" 
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter campaign name"
                  className="max-w-md"
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Campaign Duration</Label>
                <CampaignCalendar 
                  selected={date}
                  onSelect={setDate}
                />
                
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      value={date?.from ? format(date.from, "yyyy-MM-dd") : ""}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        if (!isNaN(newDate.getTime())) {
                          setDate(prev => ({ ...prev, from: newDate }));
                        }
                      }}
                      type="date"
                      className="w-full"
                      placeholder="YYYY-MM-DD"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Format: YYYY-MM-DD</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      value={date?.to ? format(date.to, "yyyy-MM-dd") : ""}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        if (!isNaN(newDate.getTime())) {
                          setDate(prev => ({ ...prev, to: newDate }));
                        }
                      }}
                      type="date"
                      className="w-full"
                      placeholder="YYYY-MM-DD"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Format: YYYY-MM-DD</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full max-w-md"
                >
                  {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
