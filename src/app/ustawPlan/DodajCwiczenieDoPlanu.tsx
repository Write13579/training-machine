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
import { Plus, BicepsFlexed } from "lucide-react";
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
          <Button className="bg-white rounded-full w-10 h-10 p-0 text-center text-black justify-center
              transition-all
              cursor-pointer 
              duration-500 
              ease-in-out
              hover:rotate-90
              hover:bg-[#FFCCD5]
              active:tracking-[3px]
              active:bg-[#FF758F]
              active:text-black
              active:translate-y-[-2px]
              active:duration-[200ms]">
            <Plus className="w-6 h-6"/>
          </Button>
        </DialogTrigger>
        <DialogContent className="mx-auto mtd-10 min-w-[340px] w-[44%] rounded-[20px] bg-white p-4 shadow-2xl shadow-black/40 ring-1 ring-black/5 ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <div className="flex flex-col items-center">
                  <BicepsFlexed
                    className="w-12 h-12 my-4"
                    stroke="url(#loginGradient)"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <DialogTitle className="text-black text-2xl font-bold">
                    Dodaj Ćwiczenie
                  </DialogTitle>
                  <DialogDescription className="font-MySerif mt-3 mb-2 text-[12px] text-[#858383] font-bold">
                    Wybierz ćwiczenie z listy, które chcesz dodać do planu
                  </DialogDescription>
                </div>
              </DialogHeader>
              <FormField
                control={form.control}
                name="cwiczenie"
                render={({ field }) => (
                  <FormItem>
                    <div className="max-h-[40vh] sm:max-h-[60vh] overflow-y-auto p-1">
                      {listaCwiczen.map((cwiczenie, index) => {
                        const selected = field.value === cwiczenie.nazwa;
                        return (
                          <button
                            type="button"
                            key={index}
                            onClick={() => field.onChange(cwiczenie.nazwa)}
                            className={`w-full flex flex-col p-3 rounded-lg transition-colors text-left ${selected
                                ? "bg-[#FF4D6D] text-white"
                                : "hover:bg-[#FFCCD5] bg-transparent text-black"
                              }`}
                          >
                            <div className="w-full">
                              <div className="font-medium">{cwiczenie.nazwa}</div>
                              <div className="text-[12px] text-black mt-1">
                                {cwiczenie.opis}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    className="w-full
              py-[8.75px]
              rounded-full
              cursor-pointer
              border-0
              bg-[#FF4D6D]
              uppercase
              text-[15px]
              text-black
              font-bold
              transition-all duration-500 ease-in-out
              hover:tracking-[1px]
              active:tracking-[3px]
              active:bg-white
              active:text-black
              active:translate-y-[-2px]
              active:duration-[200ms]"
                  >Cancel
                  </Button>
                </DialogClose>
                <Button type="submit"
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
              ">Dodaj
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
