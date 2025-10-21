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
    
      <div
        className="relative z-20 mx-auto min-h-[300px] min-w-[300px] h-[60%] w-[32%] rounded-[32px] bg-[#ffffff] transition-none"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="m-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-MySerif mt-2 flex justify-center text-[24px] text-[#000000]">
                    Nazwa użytkownika</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormDescription>
                    To jest twoja publiczna nazwa wyświetlana.
                  </FormDescription>
                  <div className="min-h-[1.25rem]">
                    <FormMessage className="text-red-600 font-bold text-sm" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-MySerif mt-2 flex justify-center text-[24px] text-[#000000]">
                    Login
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-2 border-gray-300 focus:border-black text-black bg-white/20"
                      placeholder={"Login"}
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-[1.25rem]">
                    <FormMessage className="text-red-600 font-bold text-sm" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-MySerif mt-2 flex justify-center text-[24px] text-[#000000]">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <div className="min-h-[1.25rem]">
                    <FormMessage className="text-red-600 font-bold text-sm" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="haslo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-MySerif mt-2 flex justify-center text-[24px] text-[#000000]">Hasło</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="hasło" {...field} />
                  </FormControl>
                  <div className="min-h-[1.25rem]">
                    <FormMessage className="text-red-600 font-bold text-sm" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="potworzHaslo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-MySerif mt-2 flex justify-center text-[24px] text-[#000000]">Powtórz hasło</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="powtórz hasło"
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-[1.25rem]">
                    <FormMessage className="text-red-600 font-bold text-sm" />
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="
                w-full
                py-[17px]
                my-4
                rounded-full
                cursor-pointer
                border-0
                bg-black
                uppercase
                text-[15px]
                transition-all duration-500 ease-in-out
                hover:tracking-[1px]
                hover:text-white
                active:tracking-[3px]
                active:bg-white
                active:text-black
                active:translate-y-[-2px]
                active:duration-[100ms]
              "
            >
              Zarejestruj
            </Button>
          </form>
        </Form>
      </div>
  );
}
