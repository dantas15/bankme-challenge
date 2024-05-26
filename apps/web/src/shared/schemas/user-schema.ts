import { z } from 'zod';

export const userSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: 'username is required',
    })
    .max(140, {
      message: 'username must have less than 140 characters',
    }),
  password: z.string().min(1, {
    message: 'password is required',
  }),
});
