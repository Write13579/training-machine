"use client";

import { Button } from "@/components/ui/button";
import { numerTygodniaNaString } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Crown, Plus } from "lucide-react";
import { dodajCwiczenieDoDnia, usunCwiczenieZDnia } from "./actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DzienTreningowy = {
  dzień: number;
  ćwiczenia: string[];
};

export const columns = (
  listaCwiczen: { id: number; nazwa: string; opis: string }[]
): ColumnDef<DzienTreningowy>[] => [
  {
    accessorKey: "dzień",
    header: "Dzień",
    cell: ({ row }) => numerTygodniaNaString(row.original.dzień),
  },
  {
    accessorKey: "ćwiczenia",
    header: "Ćwiczenia",
    cell: ({ row }) => (
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {row.original.ćwiczenia.length} ćwiczeń
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              {row.original.ćwiczenia.map((nazwa, index) => (
                <div key={index} className="p-2 flex border rounded">
                  <span>{nazwa}</span>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      usunCwiczenieZDnia(row.original.dzień, nazwa);
                      toast("Usunięto ćwiczenie z dnia");
                    }}>
                    Usuń
                  </Button>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    ),
  },
  {
    accessorKey: "akcje",
    header: "Akcje",
    cell: ({ row }) => {
      const formSchema = z.object({
        cwiczenie: z.string(),
      });

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          cwiczenie: "",
        },
      });

      async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);

        const errors = await dodajCwiczenieDoDnia(
          row.original.dzień,
          values.cwiczenie
        );
        if (errors.length > 0) {
          errors.forEach((error) => {
            toast(error.error);
          });
        } else {
          toast("Dodano ćwiczenie do dnia");
        }
      }

      return (
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-600">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <DialogHeader>
                    <DialogTitle>Dodaj Cwiczenie</DialogTitle>
                    <DialogDescription>
                      napisz tu cos madrego albo usun
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="cwiczenie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">
                            Wybierz ćwiczenie
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="cwiczenie" />
                            </SelectTrigger>
                            <SelectContent>
                              {listaCwiczen.map((cwiczenie, index) => (
                                <SelectItem key={index} value={cwiczenie.nazwa}>
                                  {cwiczenie.nazwa}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Dodaj</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
