"use client";

import { usunCwiczenieZDnia } from "./actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatujSlowoCwiczenieWgLiczby } from "@/lib/utils";
import { toast } from "sonner";
import { DzienTreningowy } from "./columns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function WyswietlCwiczeniaZPlanu({
  row,
}: {
  row: DzienTreningowy;
}) {
  const router = useRouter();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {row.ćwiczenia.length}{" "}
          {formatujSlowoCwiczenieWgLiczby(row.ćwiczenia.length)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(60vw,720px)] max-h-[80vh] bg-[#ffffff] rounded-[14px] p-4 shadow-2xl shadow-black/40 ring-1 ring-black/5">
        <div className="flex flex-col max-h-[60vh] overflow-y-auto ">
          {row.ćwiczenia.map((nazwa, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 p-1 rounded-lg bg-transparent"
            >
              <span className="text-black/90 truncate">{nazwa}</span>
              <button
                type="button"
                onClick={() => {
                  usunCwiczenieZDnia(row.dzień, nazwa);
                  toast("Usunięto ćwiczenie z dnia");
                  router.refresh();
                }}
                className="inline-flex items-center justify-center px-2 py-2 bg-black text-white text-sm font-medium rounded-md transition-transform transform hover:bg-[#FF4D6D] active:bg-[#C9184A] hover:-translate-y-0.5"
                aria-label={`Usuń ${nazwa}`}
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
