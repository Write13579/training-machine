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
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BicepsFlexed, ListFilterPlus, ListPlus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { nowaKategoriaUsera } from "./actions";
import { toast } from "sonner";

export default function DodajWlasnaKategorie() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const router = useRouter();

  const [nazwaKategorii, setNazwaKategorii] = useState<string>("");

  async function onSubmit() {
    const errors = await nowaKategoriaUsera(nazwaKategorii);
    if (errors && errors.length > 0) {
      toast(errors[0].error);
      setDialogOpen(false);
      return;
    }
    setDialogOpen(false);
    toast.success("Kategoria została dodana");
    router.refresh();
  }

  return (
    <div>
      <Dialog open={dialogOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-white rounded-full w-10 h-10 p-0 text-center text-black justify-center transition-all cursor-pointer  duration-500  ease-in-out hover:rotate-90 hover:bg-[#FFCCD5] active:tracking-[3px] active:bg-[#FF758F] active:text-black active:translate-y-[-2px] active:duration-[200ms]">
            <ListFilterPlus className="w-6 h-6" />
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
                Dodaj własną kategorię
              </DialogTitle>
              <DialogDescription className="font-MySerif mt-3 mb-2 text-[12px] text-[#858383] font-bold">
                Tutaj możesz dodać własną kategorię, której nie ma w naszej
                bazie.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div id="zawartosc">
            <Input
              placeholder="Nazwa kategorii"
              value={nazwaKategorii}
              onChange={(e) => setNazwaKategorii(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={() => setDialogOpen(false)}
                className="w-full py-[8.75px] rounded-full cursor-pointer border-0 bg-[#FF4D6D] uppercase text-[15px] text-black font-bold transition-all duration-500 ease-in-out hover:tracking-[1px] active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]">
                Wyjdź
              </Button>
            </DialogClose>
            <Button
              onClick={onSubmit}
              type="submit"
              className="w-full py-[17px] my-4 rounded-full cursor-pointer border-0 bg-black uppercase text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] hover:text-white active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]">
              Dodaj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
