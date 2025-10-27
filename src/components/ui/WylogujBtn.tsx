"use client";

import { Wyloguj } from "@/app/auth-actions";
import { Button } from "./button";
import { toast } from "sonner";

export default function WylogujBtn() {
  return (
    <Button
      variant="outline"
      className="
                w-full
              py-[17px]
              my-2
              rounded-full
              cursor-pointer
              border-0
              bg-[#FF4D6D]
              uppercase
              text-[15px]
              text-black
              font-bold
              transition-all duration-500 ease-in-out
              hover:tracking-[1px]
              active:tracking-[3px]
              active:bg-white
              active:text-black
              active:translate-y-[-2px]
              active:duration-[200ms]
              "
      onClick={async () => {
        await Wyloguj();
        toast("Wylogowano cię poprawnie!");
      }}>
      Wyloguj
    </Button>
  );
}
