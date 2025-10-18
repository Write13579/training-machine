"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Path, useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { sprawdzLogowanie } from "../auth-actions";

export default function ZalogujPage() {
  const formSchema = z.object({
    login: z.string().min(1, { message: "To pole nie może być puste" }),
    haslo: z.string().min(1, { message: "To pole nie może być puste" }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      haslo: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const errors = await sprawdzLogowanie(values.login, values.haslo);
    if (errors.length === 0) {
      toast("Zalogowano pomyślnie!");
      router.push("/");
    }
    errors.forEach((formerror) => {
      form.setError(formerror.field as Path<z.infer<typeof formSchema>>, {
        message: formerror.error,
      });
    });
  }

  return (
    <div
      id="obramowowka tego gownoforma"
      className="border-2 border-black/30 rounded-lg py-2.5 px-3 font-semibold bg-gray-300 m-7 sm:max-w-lg
         sm:m-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 m-6 mt-4">
          <FormField
            control={form.control}
            name="login"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Login</FormLabel>
                <FormControl>
                  <Input placeholder={"Login"} {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="haslo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Hasło</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={"Hasło"} {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div id="zalogujBtn" className="flex justify-center">
            <Button
              type="submit"
              className="font-bold"
              loading={form.formState.isSubmitting}>
              Zaloguj
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
