import { z } from 'zod';

export const apiErrorResponseSchema = z.object({
  message: z.string().or(z.array(z.string())),
  statusCode: z.number().optional(),
  error: z.string(),
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
