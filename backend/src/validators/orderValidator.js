import { z } from 'zod';

export const createOrderSchema = z.object({
  addressId: z.string().uuid('Invalid address ID'),
  items: z.array(
    z.object({
      productId: z.string().uuid('Invalid product ID'),
      quantity: z.number().int().positive('Quantity must be at least 1'),
    })
  ).min(1, 'At least one item is required'),
});

export const orderValidator = {
  validateCreate: (req, res, next) => {
    try {
      createOrderSchema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
};
