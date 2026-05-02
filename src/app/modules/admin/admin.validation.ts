import z from "zod";

const createAdmin = z.object({
  body: z.object({
    name: z
      .string({ error: "Name must be a string" })
      .trim()
      .min(6, { error: "Name must be at least 6 characters long" }),

    contactNumber: z
      .string({ error: "Contact number must be a string" })
      .trim()
      .regex(/^\d+$/, { error: "Contact number must contain only digits" })
      .min(10, { error: "Contact number must be at least 10 digits" })
      .max(15, { error: "Contact number must be at most 15 digits" }),
  }),
});

export const adminValidation = {
  createAdmin,
};
