"use client";

import { useRouter } from "next/navigation";
import { deleteUser } from "./adminActions";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";

export default function DeleteUserComp({ userId }: { userId: number }) {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        await deleteUser(userId);
        router.refresh();
      }}>
      <div className="cursor-pointer inline-flex items-center px-2 py-2 bg-black transition ease-in-out delay-75 hover:bg-[#FF4D6D] active:bg-[#C9184A] text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110">
          <Ban/> {/*  <--  https://lucide.dev/icons/  stąd bierz se ikony  */}
        </div>
    </Button>
  );
}
