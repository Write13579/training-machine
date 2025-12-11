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
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function WyswietlCwiczeniaZPlanu({
  row,
  nazwaFullPlanu,
}: {
  row: DzienTreningowy;
  nazwaFullPlanu: string;
}) {
  const router = useRouter();

  // filtracja row wg nazwafillplan
  const filteredRow: DzienTreningowy = {
    ...row,
    ćwiczenia: row.ćwiczenia.filter(
      (cwiczenie) => cwiczenie.nazwaPlanu === nazwaFullPlanu
    ),
  };

  console.log(filteredRow);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="inline-flex items-center justify-center w-full h-full">
          {filteredRow.ćwiczenia.length}{" "}
          {formatujSlowoCwiczenieWgLiczby(filteredRow.ćwiczenia.length)}
        </span>
      </PopoverTrigger>
      <PopoverContent className=" bg-white rounded-[20px] p-4 shadow-2xl shadow-black/40 ring-1 ring-black/5">
        <div className="flex flex-col max-h-[35vh] overflow-y-auto ">
          {filteredRow.ćwiczenia.map((cwiczenie, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 p-1 rounded-lg bg-transparent">
              <span className="text-black">{cwiczenie.nazwaCwiczenia}</span>
              <button
                type="button"
                onClick={() => {
                  usunCwiczenieZDnia(
                    filteredRow.dzień,
                    cwiczenie.nazwaCwiczenia,
                    nazwaFullPlanu
                  );
                  toast("Usunięto ćwiczenie z dnia");
                  router.refresh();
                }}
                className="inline-flex items-center justify-center px-2 py-2 bg-black text-white text-sm font-medium rounded-md transition-transform transform hover:bg-[#FF4D6D] active:bg-[#C9184A] hover:-translate-y-0.5"
                aria-label={`Usuń ${cwiczenie.nazwaCwiczenia}`}>
                <Trash2 className="cursor-pointer" />
              </button>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
