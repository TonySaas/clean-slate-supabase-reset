
import * as z from 'zod';

export const campaignFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date({
    required_error: "End date is required",
  }),
}).refine(data => data.start_date <= data.end_date, {
  message: "End date must be after start date",
  path: ["end_date"],
});

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;
