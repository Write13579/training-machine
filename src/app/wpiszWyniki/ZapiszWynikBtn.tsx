"use client";

import { Button } from "@/components/ui/button";
import { submitWynik } from "./actions";
import { fixDate } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

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

  return (
    <div className="flex items-center justify-center bg-white text-black px-4 mx-8 w-full 
                  rounded-full 
                  cursor-pointer 
                  uppercase 
                  text-[15px]
                  transition-y 
                  duration-500 
                  ease-in-out 
                  hover:tracking-[1px] 
                  hover:text-black 
                  active:tracking-[3px] 
                  active:bg-white 
                  active:text-black 
                  active:translate-y-[-2px] 
                  active:duration-[300ms]">
      <Button
        loading={loading}
        onClick={async () => {
          setLoading(true);
          const result = await submitWynik(
            id,
            serie,
            powtorzenia,
            ciezar,
            fixDate(targetDate)
          );
          toast(result);
          window.location.reload(); //tymczasowo, bo to hard refresh xd
          setLoading(false);
        }}>
        Zapisz
      </Button>
    </div>
  );
}
