"use client";

import { Button } from "@/components/ui/button";
import { report } from "process";
import { deleteReport, deleteWynik } from "./adminActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UsunZgloszenieBtn({ reportId }: { reportId: number }) {
  const router = useRouter();
  return (
    <Button
      className="text-red-600"
      onClick={async () => {
        const message = await deleteReport(reportId);
        toast(message.message);
        router.refresh();
      }}>
      usun zgloszenie
    </Button>
  );
}
