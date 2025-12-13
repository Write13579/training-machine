"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Path, useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createExercise } from "./adminActions";
import { Dumbbell } from "lucide-react";

export default function CreateExComp() {
  const formSchema = z.object({
    name: z.string().min(1, { message: "To pole nie może być puste" }),
    description: z.string().min(1, { message: "To pole nie może być puste" }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const errors = await createExercise(values.name, values.description);
    if (errors.length === 0) {
      toast(`Dodano ćwiczenie ${values.name}!`);
      form.reset();
      router.refresh();
    }
    errors.forEach((formerror) => {
      form.setError(formerror.field as Path<z.infer<typeof formSchema>>, {
        message: formerror.error,
      });
    });
  }

  return (
    <div>
      <div className="flex flex-col items-center mb-6 mt-10">
        <Dumbbell
          className="w-12 h-12 mb-4"
          stroke="url(#loginGradient)"
          strokeWidth={1.8}
          aria-hidden="true"
        />

        <div className="text-black text-2xl md:text-3xl font-bold">
          Stwórz ćwiczenie
        </div>
        <div className="font-MySerif mt-5 mb-10 text-[12px] text-[#858383] font-bold">
          Uzupełnij opis ćwiczenia poniżej
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 m-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Wpisz nazwę ćwiczenia"
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Wpisz opis ćwiczenia"
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
            type="submit"
            className="
              w-full
              py-[17px]
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
            ">
            Utwórz
          </Button>
        </form>
      </Form>
    </div>
  );
}
