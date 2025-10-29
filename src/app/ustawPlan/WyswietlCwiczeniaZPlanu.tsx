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
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-2">
          {row.ćwiczenia.map((nazwa, index) => (
            <div key={index} className="p-2 flex border rounded">
              <span>{nazwa}</span>
              <Button
                variant="outline" //to jest template wygladu, chcesz to se usun
                onClick={() => {
                  usunCwiczenieZDnia(row.dzień, nazwa);
                  toast("Usunięto ćwiczenie z dnia");
                  router.refresh();
                }}>
                Usuń
              </Button>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
