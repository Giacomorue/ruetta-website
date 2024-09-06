import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "./schemas/schema-auth";

export default {
  providers: [
    Credentials({
      name: "credentials",
      async authorize(credentials) {
        const formValid = LoginSchema.safeParse(credentials);

        if (!formValid.success) {
          return null;
        }

        const { email, password } = formValid.data;

        if (email === "info@ruetta.it" && password === "Franci_0702") {
          return credentials;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
