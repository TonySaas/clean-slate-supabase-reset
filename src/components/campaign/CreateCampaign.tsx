
import { useState } from 'react';
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { CampaignCalendar } from "./CampaignCalendar";

export function CreateCampaign() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Create Campaign</h1>
      </div>

      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input 
                id="campaignName" 
                placeholder="Enter campaign name"
                className="max-w-md"
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
                    value={date?.from ? format(date.from, "PPP") : ""}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      if (!isNaN(newDate.getTime())) {
                        setDate(prev => ({ ...prev, from: newDate }));
                      }
                    }}
                    className="w-full"
                    placeholder="Select start date"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    value={date?.to ? format(date.to, "PPP") : ""}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      if (!isNaN(newDate.getTime())) {
                        setDate(prev => ({ ...prev, to: newDate }));
                      }
                    }}
                    className="w-full"
                    placeholder="Select end date"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
