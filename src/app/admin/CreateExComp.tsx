"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Path, useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
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
      <div className="flex flex-col items-center mb-6">
        <Dumbbell
          className="w-12 h-12 mb-4"
          stroke="url(#loginGradient)"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <div className="text-black text-2xl md:text-3xl font-bold">
          Stwórz ćwiczenie
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 m-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-MySerif mb-2 text-sm text-black/90">
                  Nazwa ćwiczenia
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="np. bench press"
                    className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 transition-none placeholder-gray-500 py-2"
                  />
                </FormControl>
                <div className="h-[2px] bg-black w-full mt-0" aria-hidden="true" />

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
                <FormLabel className="font-MySerif mb-2 text-sm text-black/90">
                  Opis
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    placeholder="np. sztanga góra dół na płaskiej"
                    className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 transition-none placeholder-gray-500 py-2"
                  />
                </FormControl>

                <div className="h-[2px] bg-black w-full mt-0" aria-hidden="true" />

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
            Utwórz
          </Button>
        </form>
      </Form>
    </div>
  );
}
