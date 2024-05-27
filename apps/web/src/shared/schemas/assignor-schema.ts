import { z } from 'zod';

export const assignorSchema = z.object({
  document: z
    .string()
    .regex(/^[0-9]{11}$|^[0-9]{14}$/)
    .max(14),
  email: z.string().email().max(140),
  phone: z.string().max(20),
  name: z.string().max(140),
});

export type Assignor = z.infer<typeof assignorSchema>;
