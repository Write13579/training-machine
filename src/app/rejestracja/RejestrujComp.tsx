"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Path, useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { sprawdzLogowanie, zarejestruj } from "../auth-actions";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RejestracjaComp() {
  const formSchema = z.object({
    login: z.string().min(1, { message: "To pole nie może być puste" }),
    name: z.string().min(1, { message: "To pole nie może być puste" }),
    email: z.string().min(1, { message: "To pole nie może być puste" }),
    haslo: z.string().min(1, { message: "To pole nie może być puste" }),
    potworzHaslo: z.string().min(1, { message: "To pole nie może być puste" }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      name: "",
      email: "",
      haslo: "",
      potworzHaslo: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const errors = await zarejestruj(
      values.login,
      values.name,
      values.email,
      values.haslo,
      values.potworzHaslo
    );
    if (errors.length === 0) {
      toast("Zarejestrowano pomyślnie!");
      router.push("/");
    }
    errors.forEach((formerror) => {
      form.setError(formerror.field as Path<z.infer<typeof formSchema>>, {
        message: formerror.error,
      });
    });
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa użytkownika</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormDescription>
                  To jest twoja publiczna nazwa wyświetlana.
                </FormDescription>
                <FormMessage className="text-red-600 font-bold text-sm" />
                {/* wyswietla bledy */}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="login"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Login</FormLabel>
                <FormControl>
                  <Input placeholder="login" {...field} />
                </FormControl>
                <FormDescription>Tym się logujesz do konta.</FormDescription>
                <FormMessage className="text-red-600 font-bold text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                {/* <FormDescription>To jest twój adres email.</FormDescription> */}
                <FormMessage className="text-red-600 font-bold text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="haslo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hasło</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="hasło" {...field} />
                </FormControl>
                <FormMessage className="text-red-600 font-bold text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="potworzHaslo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Powtórz hasło</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="powtórz hasło"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600 font-bold text-sm" />
              </FormItem>
            )}
          />
          <Button type="submit" className="border-2 cursor-pointer">
            Zarejestruj
          </Button>
        </form>
      </Form>
    </div>
  );
}
