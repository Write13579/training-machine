"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { zacznijObserwowac } from "./actions";

export default function DodajZnajomegoComp({ ja }: { ja: number }) {
  const [szukajTypa, setSzukajTypa] = useState<string>("");
  const router = useRouter();
  return (
    <div>
      <span>wpisz login typa co chcesz obserwować:</span>
      <Input
        placeholder="np. hitler123"
        value={szukajTypa}
        onChange={(e) => setSzukajTypa(e.target.value)}
      />
      <Button
        onClick={async () => {
          const result = await zacznijObserwowac(ja, szukajTypa);
          toast(result.info);
          if (result.error === 0) {
            setSzukajTypa("");
            router.refresh();
          }
        }}>
        Dodaj
      </Button>
    </div>
  );
}
