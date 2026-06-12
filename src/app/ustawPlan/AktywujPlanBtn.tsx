"use client";

import { Button } from "@/components/ui/button";
import { aktywujPlan } from "./actions";
import { toast } from "sonner";
import { db } from "@/lib/database";
import { eq } from "drizzle-orm";
import { fullPlans } from "@/lib/database/scheme";

export default function AktywujPlanBtn({
  fullPlanId,
  planName,
}: {
  fullPlanId: number | null;
  planName: string;
}) {
  return (
    <div>
      <Button
        className="bg-red-500 cursor-pointer"
        onClick={async () => {
          const result = await aktywujPlan(fullPlanId, planName);
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
