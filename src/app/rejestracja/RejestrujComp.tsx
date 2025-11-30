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
import Link from "next/link";
import { Dumbbell } from "lucide-react";

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
      id="obramowowka tego gownoforma"
      className="relative z-20 mx-auto mt-10 min-h-[360px] h-auto w-[34%] rounded-[20px] bg-[#ffffff] min-w-[340px] p-8
                 shadow-2xl shadow-black/40 ring-1 ring-black/5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="m-6">
          <div className="flex flex-col items-center mb-6">
            <Dumbbell
              className="w-12 h-12 mb-10"
              stroke="url(#loginGradient)"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <div className="text-center text-black text-3xl md:text-4xl font-bold leading-tight">
              Dołącz do nas
            </div>
            <FormLabel className="font-MySerif mt-3 mb-2 text-[12px] text-[#858383] font-bold">
              Utwórz nowe konto
            </FormLabel>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nazwa użytkownika"
                    className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 transition-none placeholder-gray-500 py-2"
                  />
                </FormControl>
                <div
                  className="h-[2px] bg-black w-full mt-0"
                  aria-hidden="true"
                />
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
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Login"
                    className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 transition-none placeholder-gray-500 py-2"
                  />
                </FormControl>
                <div
                  className="h-[2px] bg-black w-full mt-0"
                  aria-hidden="true"
                />
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
                <FormControl>
                  <Input
                    {...field}
                    placeholder="email@example.com"
                    className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 transition-none placeholder-gray-500 py-2"
                  />
                </FormControl>
                <div
                  className="h-[2px] bg-black w-full mt-0"
                  aria-hidden="true"
                />
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
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Hasło"
                    className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 transition-none placeholder-gray-500 py-2"
                  />
                </FormControl>
                <div
                  className="h-[2px] bg-black w-full mt-0"
                  aria-hidden="true"
                />
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
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Powtórz hasło"
                    className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 transition-none placeholder-gray-500 py-2"
                  />
                </FormControl>
                <div
                  className="h-[2px] bg-black w-full mt-0"
                  aria-hidden="true"
                />
                <div className="min-h-[1.25rem]">
                  <FormMessage className="text-red-600 font-bold text-sm" />
                </div>
              </FormItem>
            )}
          />

          <Button
            loading={form.formState.isSubmitting}
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
              active:duration-[200ms]
            ">
            Zarejestruj
          </Button>

          <div className="mt-3 w-full">
            <Link href="/">
              <button
                type="button"
                className="
                  w-full
                  pt-[8.75px]
                  mt-4
                  rounded-full
                  cursor-pointer
                  border-0
                  bg-[#ffffff]
                  uppercase
                  text-[15px]
                  text-black
                  transition-y duration-500 ease-in-out
                  hover:tracking-[1px]
                  hover:text-black
                  active:tracking-[3px]
                  active:bg-white
                  active:text-black
                  active:translate-y-[-2px]
                  active:duration-[200ms]
                ">
                Powrót
              </button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
