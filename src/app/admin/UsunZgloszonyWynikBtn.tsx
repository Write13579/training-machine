"use client";

import { Button } from "@/components/ui/button";
import { report } from "process";
import { deleteWynik } from "./adminActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UsunZgloszonyWynikBtn({
  wynikId,
}: {
  wynikId: number;
}) {
  const router = useRouter();
  return (
    <Button
      className="text-red-600"
      onClick={async () => {
        const message = await deleteWynik(wynikId);
        toast(message.message);
        router.refresh();
      }}>
      usun wynik
    </Button>
  );
}
