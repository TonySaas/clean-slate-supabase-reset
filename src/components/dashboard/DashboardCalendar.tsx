
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

export function DashboardCalendar() {
  const [date, setDate] = useState<Date>(new Date());
  
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-medium mb-4">Campaign Calendar</h2>
        <div className="border rounded-lg p-4 bg-white">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md pointer-events-auto"
          />
        </div>
      </CardContent>
    </Card>
  );
}
