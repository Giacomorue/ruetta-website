"use server";

import { signIn } from "@/auth";
import { LoginSchema, LoginSchemaType } from "@/schemas/schema-auth";

export async function Login(data: LoginSchemaType) {
  const formValidation = LoginSchema.safeParse(data);

  if (!formValidation.success) {
    return { error: "Impossibile accedere" };
  }

  const { email, password } = formValidation.data;

  if (email === "info@ruetta.it" && password === "Franci_0702") {
    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/admin",
      });

      return { success: true };
    } catch (err) {
      throw err;
    }
  }

  return { error: "Credenziali non valide" };
}
