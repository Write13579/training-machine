"use client";

import { Button } from "@/components/ui/button";
import { submitWynik } from "./actions";
import { fixDate } from "@/lib/utils";
import { toast } from "sonner";
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
  const router = useRouter();
  return (
    <div>
      <Button
        className="border-2 cursor-pointer"
        onClick={async () => {
          const result = await submitWynik(
            id,
            serie,
            powtorzenia,
            ciezar,
            fixDate(targetDate)
          );
          toast(result);
          router.refresh();
        }}>
        submit
      </Button>
    </div>
  );
}
