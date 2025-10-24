"use client";

import { Button } from "@/components/ui/button";
import { deleteExercise } from "./adminActions";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteEx({ exerciseId }: { exerciseId: number }) {
  const router = useRouter();

  return (
    <Button
      variant="destructive"
      onClick={async () => {
        deleteExercise(exerciseId);
        router.refresh();
      }}>
      <Trash2 /> {/*  <--  https://lucide.dev/icons/  stąd bierz se ikony  */}
    </Button>
  );
}
