"use client";

import { Button } from "@/components/ui/button";
import { polubTrening } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Heart } from "lucide-react";

export default function PulubBtn({ wynikId }: { wynikId: number }) {
  const router = useRouter();
  const [napis, setNapis] = useState<string>("");
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
          setNapis(reqest.lubi ? "" : "");
        }}>
        <span className="inline-flex items-center">
          <Heart className={`${napis === "" ? "text-[#FF4D6D]" : "text-black"} w-8 h-8`} />
          <span className="ml-2">{napis}</span>
        </span>
      </Button>
    </div>
  );
}
