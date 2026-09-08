import { z } from 'zod';

export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  addressLine1: z.string().min(5, 'Address line 1 must be at least 5 characters'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  pincode: z.string().min(3, 'Pincode is required'),
  isDefault: z.boolean().optional().default(false),
});

export const addressUpdateSchema = addressSchema.partial();

export const addressValidator = {
  validate: (req, res, next) => {
    try {
      addressSchema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
  validateUpdate: (req, res, next) => {
    try {
      addressUpdateSchema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
};
