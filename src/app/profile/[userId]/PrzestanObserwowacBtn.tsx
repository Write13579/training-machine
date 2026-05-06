"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { przestanObserwowac } from "./actions";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrzestanObserwowacBtn({
  ja,
  on,
}: {
  ja: number;
  on: number;
}) {
  const router = useRouter();

  return (
    <Button
      className="cursor-pointer inline-flex items-center px-2 py-2 bg-black transition ease-in-out delay-75 hover:bg-[#FF4D6D] active:bg-[#C9184A] text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110"
      onClick={async () => {
        const result = await przestanObserwowac(ja, on);
        toast(result);
        router.refresh();
      }}>
       <Trash2 />
    </Button>
  );
}
