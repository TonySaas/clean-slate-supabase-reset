
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

  // Generate next 12 months from today
  const futureMonths = Array.from({ length: 12 }, (_, i) => {
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
        <div className="relative border-border py-4 max-sm:order-1 max-sm:border-t sm:w-40">
          <div className="h-full border-border sm:border-e">
            <div className="flex flex-col px-2 space-y-1">
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
