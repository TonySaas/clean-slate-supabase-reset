
import * as z from 'zod';

export const offerFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  product_name: z.string().min(2, 'Product name is required'),
  product_code: z.string().min(1, 'Product code is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  offer_price: z.coerce.number().positive('Price must be a positive number'),
  regular_price: z.coerce.number().positive('Regular price must be a positive number'),
  price_ex_vat: z.coerce.number().positive('Price ex VAT must be a positive number').optional().nullable(),
  rrp: z.coerce.number().positive('RRP must be a positive number').optional().nullable(),
  supplier_name: z.string().optional(),
  category_id: z.string().optional(),
});

export type OfferFormValues = z.infer<typeof offerFormSchema>;
