import { z } from 'zod';

export const payableSchema = z.object({
  value: z.number().nonnegative(),
  emissionDate: z.date(),
  assignorId: z.string().uuid(),
});

export type Payable = z.infer<typeof payableSchema>;
