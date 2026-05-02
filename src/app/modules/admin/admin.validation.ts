import z from "zod";

const createAdmin = z.object({
  body: z.object({
    email: z
      .string({ error: "Email must be a string" })
      .trim()
      .email({ error: "Please provide a valid email address" }),
    password: z
      .string({ error: "Password must be a string" })
      .min(6, { error: "Password must be at least 6 characters long" }),
    name: z
      .string({ error: "Name must be a string" })
      .trim()
      .min(2, { error: "Name must be at least 2 characters long" }),

    contactNumber: z
      .string({ error: "Contact number must be a string" })
      .trim()
      .regex(/^\d+$/, { error: "Contact number must contain only digits" })
      .min(10, { error: "Contact number must be at least 10 digits" })
      .max(15, { error: "Contact number must be at most 15 digits" })
      .optional(),
  }),
});

const adminIdParamSchema = z.object({
  params: z.object({
    id: z.string({ error: "Admin id is required" }).trim().min(1),
  }),
});

const updateAdmin = z.object({
  params: z.object({
    id: z.string({ error: "Admin id is required" }).trim().min(1),
  }),
  body: z
    .object({
      name: z
        .string({ error: "Name must be a string" })
        .trim()
        .min(2, { error: "Name must be at least 2 characters long" })
        .optional(),
      profilePhoto: z
        .string({ error: "Profile photo must be a string" })
        .trim()
        .url({ error: "Profile photo must be a valid URL" })
        .optional(),
      contactNumber: z
        .string({ error: "Contact number must be a string" })
        .trim()
        .regex(/^\d+$/, { error: "Contact number must contain only digits" })
        .min(10, { error: "Contact number must be at least 10 digits" })
        .max(15, { error: "Contact number must be at most 15 digits" })
        .optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field is required to update admin",
    }),
});

export const adminValidation = {
  createAdmin,
  adminIdParamSchema,
  updateAdmin,
};
