"use client";

import { Button } from "@/components/ui/button";
import { submitWynik } from "./actions";
import { fixDate } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ZapiszWynikBtn({
  id,
  serie,
  powtorzenia,
  ciezar,
  targetDate,
}: {
  id: number;
  serie: number;
  powtorzenia: number;
  ciezar: number;
  targetDate: Date;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <Button
      type="button"
      loading={loading}
      className="flex items-center justify-center bg-white text-black px-4 mx-8 w-full 
                rounded-full 
                cursor-pointer 
                uppercase 
                text-[15px]
                transition-all 
                duration-500 
                ease-in-out 
                hover:tracking-[1px] 
                hover:text-black 
                active:tracking-[3px] 
                active:bg-white 
                active:text-black 
                active:translate-y-[-2px] 
                active:duration-[300ms]"
      onClick={async () => {
        setLoading(true);
        try {
          const result = await submitWynik(
            id,
            serie,
            powtorzenia,
            ciezar,
            fixDate(targetDate)
          );
          
          toast(result);

          if (result === "Wynik zapisany" || result === "Wynik zaktualizowany") {
            router.refresh(); 
          } else {
            setLoading(false);
          }
        } catch (error) {
          toast("Wystąpił nieoczekiwany błąd");
          setLoading(false);
        }
      }}>
      Zapisz
    </Button>
  );
}