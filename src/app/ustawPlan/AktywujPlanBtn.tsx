"use client";

import { Button } from "@/components/ui/button";
import { aktywujPlan } from "./actions";
import { toast } from "sonner";

export default function AktywujPlanBtn({
  fullPlanId,
}: {
  fullPlanId: number | null;
}) {
  return (
    <div>
      <Button
        className="bg-red-500"
        onClick={async () => {
          if (!fullPlanId) {
            toast("Nie wybrano planu do aktywacji");
            return;
          }
          const result = await aktywujPlan(fullPlanId);
          if (result[0]) {
            toast(result[0].error);
          } else {
            toast("Plan został aktywowany");
          }
        }}>
        AKTYWUJ
      </Button>
    </div>
  );
}
