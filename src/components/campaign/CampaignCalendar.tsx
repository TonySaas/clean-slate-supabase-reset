
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  startOfMonth,
  endOfMonth,
  addMonths,
  format,
} from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

interface CampaignCalendarProps {
  selected?: DateRange;
  onSelect: (date: DateRange | undefined) => void;
}

export function CampaignCalendar({ selected, onSelect }: CampaignCalendarProps) {
  const today = new Date();
  const [month, setMonth] = useState(today);

  // Generate next 7 months from today
  const futureMonths = Array.from({ length: 7 }, (_, i) => {
    const monthDate = addMonths(today, i);
    return {
      date: monthDate,
      label: format(monthDate, 'MMMM yyyy')
    };
  });

  const handleMonthSelect = (selectedMonth: Date) => {
    setMonth(selectedMonth);
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    onSelect({ from: start, to: end });
  };

  return (
    <div className="rounded-lg border border-border">
      <div className="flex max-sm:flex-col">
        <div className="relative border-border py-4 max-sm:order-1 sm:w-40">
          <div className="h-full border-border sm:border-e">
            <ScrollArea className="h-60 px-2">
              <div className="flex flex-col space-y-1">
                {futureMonths.map((monthItem) => (
                  <Button
                    key={monthItem.label}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => handleMonthSelect(monthItem.date)}
                  >
                    {monthItem.label}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <Calendar
          mode="range"
          selected={selected}
          onSelect={onSelect}
          month={month}
          onMonthChange={setMonth}
          className="p-2 bg-background pointer-events-auto"
          disabled={[{ before: today }]}
        />
      </div>
    </div>
  );
}
