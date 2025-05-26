import { z } from "zod";

export const googleUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  picture: z.string().url(),
  accessToken: z.string(),
});

export type GoogleUser = z.infer<typeof googleUserSchema>;
