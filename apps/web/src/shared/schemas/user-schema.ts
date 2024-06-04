import { z } from 'zod';

const usernameSchema = z
  .string()
  .min(1, {
    message: 'username is required',
  })
  .max(140, {
    message: 'username must have less than 140 characters',
  });
const passwordSchema = z.string().min(1, {
  message: 'password is required',
});

export const userSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});
export const loginSchema = z.object({
  login: usernameSchema,
  password: passwordSchema,
});

export type User = z.infer<typeof userSchema>;
export type LoginData = z.infer<typeof loginSchema>;
