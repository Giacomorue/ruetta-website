import * as z from "zod";

export const LoginSchema = z.object({
  email: z
    .string({ message: "Email mancante" })
    .email({ message: "Email non valida" }),
  password: z
    .string({ message: "Password mancante" })
    .min(3, { message: "Password non valida" }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
