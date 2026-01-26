"use client";

import { Button } from "@/components/ui/button";
import { polubTrening } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Polubienie, User } from "@/lib/database/scheme";

export default function PulubBtn({
  wynikId,
  mojeLajki,
  user,
}: {
  wynikId: number;
  mojeLajki: Polubienie[];
  user: User | null;
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
        className="cursor-pointer"
        loading={loading}
        disabled={!user}
        onClick={async () => {
          if (!user) return;
          setLoading(true);
          const reqest = await polubTrening(wynikId);
          toast(reqest.message);
          router.refresh();
          setLoading(false);
          setNapis(reqest.lubi ? true : false);
        }}>
        <span className="inline-flex items-center">
          <Heart
            className={`${
              napis && user ? "text-[#FF4D6D]" : "text-black"
            } w-8 h-8`}
          />
        </span>
      </Button>
    </div>
  );
}
