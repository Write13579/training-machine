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
      className="border-0 cursor-pointer"
      onClick={async () => {
        setLoading(true);
        const result = await usunZapisanyWynik(id);
        toast(result);
        window.location.reload(); //tymczasowo, bo to hard refresh xd
        setLoading(false);
      }}>
      <div className="cursor-pointer inline-flex items-center px-10 py-2 bg-black transition ease-in-out delay-75 hover:bg-[#FF4D6D] active:bg-[#C9184A] text-white text-sm font-medium rounded-full hover:-translate-y-1 hover:scale-110">
          <Trash/>
        </div>
    </Button>
  );
}
