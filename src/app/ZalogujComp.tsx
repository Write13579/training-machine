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
      className="relative z-20 
      mx-auto min-h-[300px] h-[60%] w-[32%] rounded-[32px] bg-[#ffffff] min-w-[300px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 m-6">
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
            name="haslo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-MySerif flex justify-center text-[24px] text-[#000000]">
                  Hasło
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="border-2 border-gray-300 focus:border-black text-black bg-white/20"
                    placeholder={"Hasło"}
                    {...field}
                  />
                </FormControl>

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
        </form>
      </Form>
    </div>
  );
}
