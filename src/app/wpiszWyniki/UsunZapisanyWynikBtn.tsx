"use client";

import { Button } from "@/components/ui/button";
import { usunZapisanyWynik } from "./actions";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UsunZapisanyWynikBtn({ id }: { id: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <Button
      type="button"
      loading={loading}
      className="cursor-pointer inline-flex items-center px-10 py-2 bg-black transition ease-in-out delay-75 hover:bg-[#FF4D6D] active:bg-[#C9184A] text-white text-sm font-medium rounded-full hover:-translate-y-1 hover:scale-110 border-0"
      onClick={async () => {
        setLoading(true);
        try {
          const result = await usunZapisanyWynik(id);
          toast(result);
          router.refresh();
          setLoading(false);
        } catch (error) {
          toast("Wystąpił błąd podczas usuwania");
          setLoading(false);
        }
      }}>
      <Trash />
    </Button>
  );
}