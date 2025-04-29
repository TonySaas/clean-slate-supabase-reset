
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DateRange } from 'react-day-picker';
import { CampaignCalendar } from '../CampaignCalendar';
import { CampaignFormValues } from '../schemas/campaignFormSchema';

interface CalendarSelectorProps {
  form: UseFormReturn<CampaignFormValues>;
}

export const CalendarSelector: React.FC<CalendarSelectorProps> = ({ form }) => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  
  // Update the date range when the form fields change
  useEffect(() => {
    const startDate = form.watch('start_date');
    const endDate = form.watch('end_date');
    
    if (startDate && endDate) {
      setDateRange({
        from: startDate,
        to: endDate
      });
    }
  }, [form.watch('start_date'), form.watch('end_date')]);

  // Update form fields when date range changes
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    
    if (range?.from) {
      form.setValue('start_date', range.from);
    }
    
    if (range?.to) {
      form.setValue('end_date', range.to);
    }
  };

  return (
    <CampaignCalendar
      selected={dateRange}
      onSelect={handleDateRangeChange}
    />
  );
};
