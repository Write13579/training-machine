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
import { sprawdzLogowanie } from "./auth-actions";
import { Dumbbell } from 'lucide-react';
import Link from "next/link";

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
      className="relative z-20 mx-auto mt-10 min-h-[360px] h-auto w-[34%] rounded-[20px] bg-[#ffffff] min-w-[340px] p-8
                 shadow-2xl shadow-black/40 ring-1 ring-black/5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 m-6">
          <FormField
            control={form.control}
            name="login"
            render={({ field }) => (
              <FormItem>
                {/* ikona */}
                <div className="flex flex-col items-center">
                  <Dumbbell
                    className="w-12 h-12 mb-10"
                    stroke="url(#loginGradient)"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                  {/* DUŻY TEKST - zmień treść wg potrzeb */}
                  <div className="text-center text-black text-3xl md:text-4xl font-bold leading-tight">
                    WITAJ PONOWNIE!
                  </div>

                  {/* etykieta nad polem (mała) */}
                  <FormLabel className="font-MySerif mt-5 mb-10 text-[12px] text-[#858383] font-bold">
                    Proszę, podać swoje dane
                  </FormLabel>
                </div>

                {/* pole i stała kreska */}
                <div>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Wpisz login"
                      aria-label="login"
                      className="
                        w-full
                        bg-transparent
                        border-0
                        outline-none
                        focus:outline-none
                        focus:ring-0
                        transition-none
                        placeholder-gray-500
                        py-2"
                    />
                  </FormControl>

                  {/* prosta, stała linia pod polem */}
                  <div className="h-[2px] bg-black w-full mt-0" aria-hidden="true" />
                </div>

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

                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Wpisz hasło"
                      aria-label="haslo"
                      className="
                        w-full
                        bg-transparent
                        border-0
                        outline-none
                        focus:outline-none
                        focus:ring-0
                        transition-none
                        placeholder-gray-500
                        py-2
                      "
                    />
                  </FormControl>

                  <div className="h-[2px] bg-black w-full mt-0" aria-hidden="true" />
                </div>

                <div className="min-h-[1.25rem]">
                  <FormMessage className="text-red-600 font-bold text-sm" />
                </div>
              </FormItem>
            )}
          />

          <div id="zalogujBtn" className="flex justify-center">
            <Button
              type="submit"
              loading={form.formState.isSubmitting}
              className="
                w-full
                rounded-full
                cursor-pointer
                border-0
                bg-black
                uppercase
                text-[15px]
                transition-y duration-500 ease-in-out
                hover:tracking-[1px]
                hover:text-white
                active:tracking-[3px]
                active:bg-white
                active:text-black
                active:translate-y-[-2px]
                active:duration-[100ms]
              "
            >
              Zaloguj
            </Button>
          </div>

          {/* wizualny przycisk Rejestracja w tym samym bloku (nie zmienia logiki formularza) */}
          <div className="mt-3 w-full">
            <Link href="/rejestracja">
              <button
                type="button" /* ważne: nie submituje formularza */
                className="
                  w-full pt-[8.75px] mt-4 rounded-full cursor-pointer border-0 bg-[#ffffff] uppercase text-[15px] text-black transition-y duration-500 ease-in-out hover:tracking-[1px] hover:text-black active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[300ms] "
              >
                Rejestracja
              </button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
