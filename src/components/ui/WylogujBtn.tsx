"use client";

import { Wyloguj } from "@/app/auth-actions";
import { Button } from "./button";
import { toast } from "sonner";

export default function WylogujBtn() {
  return (
    <Button
      variant="destructive"
      onClick={async () => {
        await Wyloguj();
        toast("Logged out correctly!");
      }}>
      Log out
    </Button>
  );
}
