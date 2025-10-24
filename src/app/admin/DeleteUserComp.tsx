"use client";

import { useRouter } from "next/navigation";
import { deleteUser } from "./adminActions";
import { Button } from "@/components/ui/button";

export default function DeleteUserComp({ userId }: { userId: number }) {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        await deleteUser(userId);
        router.refresh();
      }}>
      del
    </Button>
  );
}
