"use client";

import { Button } from "@/components/ui/button";
import { deleteExercise } from "./adminActions";
import { Trash2 } from "lucide-react";

export default function DeleteEx({ exerciseId }: { exerciseId: number }) {
  return (
    <Button
      variant="destructive"
      onClick={async () => {
        deleteExercise(exerciseId);
      }}>
      <Trash2 /> {/*  <--  https://lucide.dev/icons/  stąd bierz se ikony  */}
    </Button>
  );
}
