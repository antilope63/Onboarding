"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";

const LoginSchema = z.object({
  email: z
    .string()
    .email("Email invalide")
    .regex(/@pixelplay\.com$/i, "Utilisez une adresse @pixelplay.com"),
  password: z.string().nonempty("Mot de passe requis"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit() {
    router.push("/");
  }

  return (
    <div
      className="h-screen flex items-center justify-end p-12"
      style={{
        background: "conic-gradient(from 270deg at 50% 50%, #663bd6, #1d1e3b)",
      }}
    >
      <section className="w-[800px] h-full text-center bg-white rounded-2xl shadow-xl border flex flex-col justify-center items-center gap-24 p-10">
        <div className="flex flex-col gap-0 items-center">
          <div className="flex items-center justify-center gap-5">
            <p className="text-6xl mb-4" aria-hidden>
              👋
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">
              Bienvenue chez PixelPlay
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Connectez-vous à votre compte pour accéder à votre espace.
          </p>
        </div>

        <Form {...form}>
          <form
            className="w-full max-w-[400px] text-left"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@exemple.com"
                        className="pr-12 rounded-full h-12"
                        {...field}
                      />
                    </FormControl>
                    <span
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg"
                      aria-hidden
                    >
                      ✉️
                    </span>
                  </div>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,margin] duration-200 ease-out",
                      form.formState.errors.email
                        ? "grid-rows-[1fr] -mt-1.5 mb-3"
                        : "grid-rows-[0fr] mt-0"
                    )}
                  >
                    <div
                      className={cn(
                        "overflow-hidden transition-opacity duration-200",
                        form.formState.errors.email
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    >
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={showPassword ? "Test123" : "••••••••"}
                        className="pr-12 rounded-full h-12"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-base text-muted-foreground hover:bg-accent"
                      aria-label={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showPassword ? "🙉" : "🙈"}
                    </button>
                  </div>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,margin] duration-200 ease-out",
                      form.formState.errors.password
                        ? "grid-rows-[1fr] -mt-1.5"
                        : "grid-rows-[0fr] mt-0"
                    )}
                  >
                    <div
                      className={cn(
                        "overflow-hidden transition-opacity duration-200",
                        form.formState.errors.password
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    >
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full cursor-pointer h-12 mt-6 rounded-full text-base font-semibold"
              style={{
                backgroundColor: "var(--color-violet)",
                color: "white",
              }}
            >
              Connexion
            </Button>
          </form>
        </Form>
      </section>
    </div>
  );
}
