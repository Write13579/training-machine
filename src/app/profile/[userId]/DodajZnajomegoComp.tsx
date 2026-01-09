"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { zacznijObserwowac } from "./actions";

export default function DodajZnajomegoComp({ ja }: { ja: number }) {
  const [szukajTypa, setSzukajTypa] = useState<string>("");
  const router = useRouter();
  return (
    <div className="space-y-3 mx-6">
      <Input
        className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 transition-none placeholder-gray-500 py-2"
        placeholder="np. nick znajomego"
        value={szukajTypa}
        onChange={(e) => setSzukajTypa(e.target.value)}
      />
      <div className="h-[2px] bg-black w-full mt-0" 
            aria-hidden="true"/>
      <Button
        className=" mt-2 w-full py-[17px] rounded-full cursor-pointer border-0 bg-black uppercase text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] hover:text-white active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[100ms]"
        onClick={async () => {
          const result = await zacznijObserwowac(ja, szukajTypa);
          toast(result.info);
          if (result.error === 0) {
            setSzukajTypa("");
            router.refresh();
          }
        }}>
        Dodaj
      </Button>
    </div>
  );
}
