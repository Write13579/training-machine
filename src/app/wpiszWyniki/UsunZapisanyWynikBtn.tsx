"use client";

import { Button } from "@/components/ui/button";
import { usunZapisanyWynik } from "./actions";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { useState } from "react";

export default function UsunZapisanyWynikBtn({ id }: { id: number }) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      loading={loading}
      className="border-2 cursor-pointer bg-amber-800"
      onClick={async () => {
        setLoading(true);
        const result = await usunZapisanyWynik(id);
        toast(result);
        window.location.reload(); //tymczasowo, bo to hard refresh xd
        setLoading(false);
      }}>
      <Trash color="red" />
    </Button>
  );
}
