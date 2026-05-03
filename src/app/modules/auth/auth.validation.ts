import z from "zod";

const userLoginSchema = z.object({
  body: z.object({
    email: z
      .string({ error: "Email must be a string" })
      .trim()
      .email({ error: "Please provide a valid email address" }),
    password: z
      .string({ error: "Password must be a string" })
      .min(6, { error: "Password must be at least 6 characters long" }),
  }),
});

const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z
      .string({ error: "Refresh token must be a string" })
      .trim()
      .min(1, { error: "Refresh token is required" }),
  }),
});

const logoutSchema = z.object({
  cookies: z.object({
    refreshToken: z
      .string({ error: "Refresh token must be a string" })
      .trim()
      .min(1, { error: "Refresh token is required" }),
  }),
});

export const authValidation = {
  userLoginSchema,
  refreshTokenSchema,
  logoutSchema,
};
