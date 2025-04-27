
import { useState, useEffect } from 'react';
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

    if (!profile || !profile.id) {
      toast.error("You must be logged in to create a campaign");
      return;
    }

    setIsSubmitting(true);
    try {
      // Ensure user exists in the users table with a more robust approach
      const { data: userData, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', profile.id)
        .maybeSingle();
        
      if (userCheckError) {
        console.error('Error checking user existence:', userCheckError);
      }
      
      // If user doesn't exist in users table, create them with retry logic
      if (!userData) {
        console.log('User not found in users table, creating entry');
        
        const userInsertData = {
          id: profile.id,
          first_name: profile.first_name || profile.email?.split('@')[0] || 'User',
          last_name: profile.last_name || '',
          active: true
        };
        
        // Try up to 3 times to create the user
        let userCreated = false;
        let attempts = 0;
        
        while (!userCreated && attempts < 3) {
          attempts++;
          const { error: insertError } = await supabase
            .from('users')
            .insert(userInsertData);
            
          if (!insertError) {
            console.log('User record created successfully on attempt', attempts);
            userCreated = true;
          } else {
            console.error(`Error creating user record (attempt ${attempts}):`, insertError);
            // Wait a moment before retrying
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        if (!userCreated) {
          toast.error("Failed to create user record. Please try again later.");
          setIsSubmitting(false);
          return;
        }
      }
      
      console.log("Creating campaign with data:", {
        name: campaignName,
        start_date: date.from.toISOString(),
        end_date: date.to.toISOString(),
        organization_id: organizationId,
        created_by: profile.id,
      });

      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          name: campaignName,
          start_date: date.from.toISOString(),
          end_date: date.to.toISOString(),
          organization_id: organizationId,
          created_by: profile.id,
        })
        .select();

      if (error) {
        console.error('Error creating campaign:', error);
        throw error;
      }

      console.log('Campaign created successfully:', data);
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
