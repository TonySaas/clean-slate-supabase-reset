
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

interface CampaignCalendarProps {
  selected?: DateRange;
  onSelect: (date: DateRange | undefined) => void;
}

export function CampaignCalendar({ selected, onSelect }: CampaignCalendarProps) {
  const today = new Date();
  const yesterday = {
    from: subDays(today, 1),
    to: subDays(today, 1),
  };
  const last7Days = {
    from: subDays(today, 6),
    to: today,
  };
  const last30Days = {
    from: subDays(today, 29),
    to: today,
  };
  const monthToDate = {
    from: startOfMonth(today),
    to: today,
  };
  const lastMonth = {
    from: startOfMonth(subMonths(today, 1)),
    to: endOfMonth(subMonths(today, 1)),
  };
  const yearToDate = {
    from: startOfYear(today),
    to: today,
  };
  const lastYear = {
    from: startOfYear(subYears(today, 1)),
    to: endOfYear(subYears(today, 1)),
  };
  const [month, setMonth] = useState(today);

  return (
    <div className="rounded-lg border border-border">
      <div className="flex max-sm:flex-col">
        <div className="relative border-border py-4 max-sm:order-1 max-sm:border-t sm:w-32">
          <div className="h-full border-border sm:border-e">
            <div className="flex flex-col px-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  onSelect({
                    from: today,
                    to: today,
                  });
                  setMonth(today);
                }}
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  onSelect(yesterday);
                  setMonth(yesterday.to);
                }}
              >
                Yesterday
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  onSelect(last7Days);
                  setMonth(last7Days.to);
                }}
              >
                Last 7 days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  onSelect(last30Days);
                  setMonth(last30Days.to);
                }}
              >
                Last 30 days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  onSelect(monthToDate);
                  setMonth(monthToDate.to);
                }}
              >
                Month to date
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  onSelect(lastMonth);
                  setMonth(lastMonth.to);
                }}
              >
                Last month
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  onSelect(yearToDate);
                  setMonth(yearToDate.to);
                }}
              >
                Year to date
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  onSelect(lastYear);
                  setMonth(lastYear.to);
                }}
              >
                Last year
              </Button>
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
        />
      </div>
    </div>
  );
}
