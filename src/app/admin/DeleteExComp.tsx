"use client";

import { Button } from "@/components/ui/button";
import { deleteExercise } from "./adminActions";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteEx({ exerciseId }: { exerciseId: number }) {
  const router = useRouter();

  return (
    <Button
      variant="destructive"
      onClick={async () => {
        await deleteExercise(exerciseId);
        toast("Ćwiczenie zostało usunięte");
        router.refresh();
      }}>
      <div className="cursor-pointer inline-flex items-center px-2 py-2 bg-black transition ease-in-out delay-75 hover:bg-[#FF4D6D] active:bg-[#C9184A] text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110">
        <Trash2 />
      </div>
    </Button>
  );
}
