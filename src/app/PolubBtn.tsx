"use client";

import { Button } from "@/components/ui/button";
import { polubTrening } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Polubienie } from "@/lib/database/scheme";

export default function PulubBtn({
  wynikId,
  mojeLajki,
}: {
  wynikId: number;
  mojeLajki: Polubienie[];
}) {
  const router = useRouter();
  const [napis, setNapis] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const lubi = mojeLajki.find((like) => like.wynikId === wynikId);
    if (lubi) {
      setNapis(true);
    } else {
      setNapis(false);
    }
  }, [mojeLajki]);

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
          setNapis(reqest.lubi ? true : false);
        }}>
        <span className="inline-flex items-center">
          <Heart
            className={`${napis ? "text-[#FF4D6D]" : "text-black"} w-8 h-8`}
          />
          <span className="ml-2">{napis}</span>
        </span>
      </Button>
    </div>
  );
}
