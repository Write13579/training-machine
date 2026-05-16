"use client";
import { Button } from "@/components/ui/button";
import { share } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function UdostepnijComp({
  wynikiDoWyswietlenia,
}: {
  wynikiDoWyswietlenia: {
    id: number;
    planId: number;
    userId: number;
    exerciseId: number;
    serie: number;
    powtorzenia: number;
    ciezar: number;
    dataWykonania: Date;
    udostepniony: boolean;
    exercise: {
      id: number;
      nazwa: string;
      opis: string;
    };
  }[];
}) {
  const router = useRouter();
  const [opis, setOpis] = useState<string>("");
  return (
    <div>
      {wynikiDoWyswietlenia.length > 0 &&
      !wynikiDoWyswietlenia[0].udostepniony ? (
        <div>
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button variant="outline">UDOSTĘPNIJ SWOJE WYNIKI</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Udostępnij swoje wyniki</DialogTitle>
                  <DialogDescription>
                    Udostępniając wyniki każdy może je zobaczyć oraz polubić.
                    Możesz dodać do wyniku komentarz.
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="opis">opis</Label>
                    <Input
                      id="opis"
                      name="opis"
                      value={opis}
                      onChange={(e) => setOpis(e.target.value)}
                    />
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    onClick={async () => {
                      const response = await share(
                        wynikiDoWyswietlenia[0].dataWykonania,
                        opis,
                      );
                      toast(response.info);
                      router.refresh();
                    }}
                    className="w-full my-2 py-[8.75px] rounded-full cursor-pointer border-0 bg-black text-white uppercase text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]">
                    Udostępnij swoje wyniki
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>
      ) : wynikiDoWyswietlenia.length > 0 ? (
        <div>
          <div className="text-black font-bold items-center bg-white rounded-[20px] shadow-md shadow-black/40 ring-1 ring-black/5 p-4 flex flex-col gap-4 mb-2">
            Wyniki zostały już udostępnione
          </div>
          <Button
            onClick={async () => {
              const przestanUdostepniac = true;
              const response = await share(
                wynikiDoWyswietlenia[0].dataWykonania,
                "",
                przestanUdostepniac,
              );
              toast(response.info);
              router.refresh();
            }}
            className="w-full my-2 py-[8.75px] rounded-full cursor-pointer border-0 bg-[#FF4D6D] uppercase text-[15px] text-black font-bold transition-all duration-500 ease-in-out hover:tracking-[1px] active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[200ms]">
            Przestań udostępniać
          </Button>
        </div>
      ) : null}
    </div>
  );
}
