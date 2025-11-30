"use client";

import { Button } from "@/components/ui/button";
import { polubTrening } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export default function PulubBtn({ wynikId }: { wynikId: number }) {
  const router = useRouter();
  const [napis, setNapis] = useState<string>("Polub");
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <div>
      <Button
        loading={loading}
        onClick={async () => {
          setLoading(true);
          const reqest = await polubTrening(wynikId);
          toast(reqest.message);
          router.refresh();
          setLoading(false);
          setNapis(reqest.lubi ? "Polubiono" : "Polub");
        }}>
        {napis}
      </Button>
    </div>
  );
}
