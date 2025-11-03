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
        <div className="inline-flex items-center px-2 py-2 bg-black transition ease-in-out delay-75 hover:bg-[#FF4D6D] active:bg-[#C9184A] text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110">
          <Trash2 /> {/*  <--  https://lucide.dev/icons/  stąd bierz se ikony  */}
        </div>
      </Button>
  );
}
