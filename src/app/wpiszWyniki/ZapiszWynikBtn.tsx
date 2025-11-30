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
    <div>
      <Button
        loading={loading}
        className="border-2 cursor-pointer"
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
        submit
      </Button>
    </div>
  );
}
