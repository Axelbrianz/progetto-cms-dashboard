import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("inserisci un'email valida").trim().toLowerCase(),
  password: z.string().min(8, "La password deve contenere almeno 8 caratteri"),
});

export const registerSchema = z
  .object({
    name: z.string().min(3, "Il nome deve contenere almeno 3 caratteri"),
    email: z.string().email("Inserisci un'email valida").trim().toLowerCase(),
    password: z
      .string()
      .min(6, "La password deve contenere almeno 6 caratteri")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La password deve contenere almeno una maiuscola, una minuscola e un numero",
      ),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Le password non coincidono",
    path: ["passwordConfirm"],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
