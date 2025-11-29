"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { przestanObserwowac } from "./actions";
import { Trash } from "lucide-react";
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
      className="border-2 cursor-pointer bg-amber-800"
      onClick={async () => {
        const result = await przestanObserwowac(ja, on);
        toast(result);
        router.refresh();
      }}>
      <Trash color="red" />
    </Button>
  );
}
