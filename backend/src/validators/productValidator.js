import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be a positive number'),
  comparePrice: z.number().positive('Compare price must be a positive number').optional(),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.string().url('Each image must be a valid URL')),
  stock: z.number().int().nonnegative('Stock cannot be negative').default(0),
  isActive: z.boolean().optional().default(true),
});

export const productUpdateSchema = productSchema.partial();
