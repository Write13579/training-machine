"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useRouter } from "next/navigation";
import { dodajWlasneCwiczenieDoDniaIPlanu } from "./actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BicepsFlexed, ListPlus } from "lucide-react";
import { DzienTreningowy } from "./columns";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DodajWlasneCwiczenieDoPlanu({
  row,
  nazwaFullPlanu,
  kategorie,
}: {
  row: DzienTreningowy;
  nazwaFullPlanu: string;
  kategorie: { id: number; nazwa: string }[];
}) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const formSchema = z.object({
    nazwaCwiczenia: z.string().min(2).max(100),
    opisCwiczenia: z.string().min(5).max(500),
    kategoriaCwiczenia: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nazwaCwiczenia: "",
      opisCwiczenia: "",
      kategoriaCwiczenia: undefined,
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const errors = await dodajWlasneCwiczenieDoDniaIPlanu(
      row.dzień,
      values.nazwaCwiczenia,
      values.opisCwiczenia,
      nazwaFullPlanu,
      values.kategoriaCwiczenia ? Number(values.kategoriaCwiczenia) : undefined,
    );
    if (errors.length > 0) {
      errors.forEach((error) => {
        toast(error);
      });
    } else {
      toast("Dodano ćwiczenie do dnia");
      router.refresh();
    }
  }

  return (
    <div>
      <Dialog open={dialogOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-white rounded-full w-10 h-10 p-0 text-center text-black justify-center transition-all cursor-pointer  duration-500  ease-in-out hover:rotate-90 hover:bg-[#FFCCD5] active:tracking-[3px] active:bg-[#FF758F] active:text-black active:translate-y-[-2px] active:duration-[200ms]">
            <ListPlus className="w-6 h-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="mx-auto mtd-10 min-w-[340px] w-[44%] rounded-[20px] bg-white p-4 shadow-2xl shadow-black/40 ring-1 ring-black/5 ">
          <DialogHeader>
            <div className="flex flex-col items-center">
              <BicepsFlexed
                className="w-12 h-12 my-4"
                stroke="url(#loginGradient)"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <DialogTitle className="text-black text-2xl font-bold">
                Dodaj własne ćwiczenie
              </DialogTitle>
              <DialogDescription className="font-MySerif mt-3 mb-2 text-[12px] text-[#858383] font-bold">
                Tutaj możesz dodać własne ćwiczenie, którego nie ma w naszej
                bazie.
              </DialogDescription>
            </div>
          </DialogHeader>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="nazwaCwiczenia"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-rhf-demo-nazwaCwiczenia"
                      className="text-black">
                      Nazwa ćwiczenia
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-nazwaCwiczenia"
                      aria-invalid={fieldState.invalid}
                      placeholder="np. bench press"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="opisCwiczenia"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-rhf-demo-opisCwiczenia"
                      className="text-black">
                      Opis ćwiczenia
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-opisCwiczenia"
                      aria-invalid={fieldState.invalid}
                      placeholder="np. sztanga góra dół na płaskiej"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="kategoriaCwiczenia"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="bg-red-600">
                    <FieldLabel
                      htmlFor="form-rhf-demo-kategoriaCwiczenia"
                      className="text-black">
                      Kategoria ćwiczenia
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value?.toString()}
                      onValueChange={field.onChange}>
                      <SelectTrigger
                        className="text-black"
                        id="form-rhf-demo-kategoriaCwiczenia"
                        aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Wybierz kategorię" />
                      </SelectTrigger>
                      <SelectContent className="text-black">
                        {kategorie.map((kategoria) => {
                          return (
                            <SelectItem
                              value={kategoria.id.toString()}
                              key={kategoria.id}>
                              {kategoria.nazwa}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  onClick={() => setDialogOpen(false)}
                  className="w-full py-[8.75px] rounded-full cursor-pointer border-0 bg-[#FF4D6D] uppercase text-[15px] text-black font-bold transition-all duration-500 ease-in-out hover:tracking-[1px] active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]">
                  Wyjdź
                </Button>
              </DialogClose>
              <Button
                onClick={() => setDialogOpen(true)}
                type="submit"
                className="w-full py-[17px] my-4 rounded-full cursor-pointer border-0 bg-black uppercase text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] hover:text-white active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]">
                Dodaj
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
