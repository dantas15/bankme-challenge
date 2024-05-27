import { z } from 'zod';

export const accessTokenResponseSchema = z.object({
  access_token: z.string(),
});

export type AccessTokenResponse = z.infer<typeof accessTokenResponseSchema>;
