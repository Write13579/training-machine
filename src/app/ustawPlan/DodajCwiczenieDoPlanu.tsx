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
import { useRouter } from "next/navigation";
import { dodajCwiczenieDoDnia } from "./actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DzienTreningowy } from "./columns";

export default function DodajCwiczenieDoPlanu({
  row,
  listaCwiczen,
}: {
  row: DzienTreningowy;
  listaCwiczen: { id: number; nazwa: string; opis: string }[];
}) {
  const formSchema = z.object({
    cwiczenie: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cwiczenie: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const errors = await dodajCwiczenieDoDnia(row.dzień, values.cwiczenie);
    if (errors.length > 0) {
      errors.forEach((error) => {
        toast(error.error);
      });
    } else {
      toast("Dodano ćwiczenie do dnia");
      router.refresh();
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
}
