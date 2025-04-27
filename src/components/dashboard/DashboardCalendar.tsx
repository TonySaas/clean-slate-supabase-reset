
import { useState } from 'react';
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DashboardCalendar() {
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-medium mb-4">Campaign Calendar</h2>
        <div className="space-y-4">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            className="rounded-md border"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                value={date.from ? format(date.from, "PPP") : ""}
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
                value={date.to ? format(date.to, "PPP") : ""}
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
      </CardContent>
    </Card>
  );
}
