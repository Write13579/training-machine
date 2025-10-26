"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { numerTygodniaNaString } from "@/lib/utils";
import { Plan } from "@/lib/database/scheme";

export default function WpiszComp({ data }: { data: Plan[] }) {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [chosenData, setChosenData] = useState<Plan[]>([]);

  useEffect(() => {
    const filteredData = data.filter(
      (item) => item.dzienTygodnia === selectedDay
    );
    setChosenData(filteredData);
  }, [selectedDay]);

  return (
    <div>
      <div id="select">
        <Select
          value={selectedDay.toString()}
          onValueChange={(newVal) => setSelectedDay(Number(newVal))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Wybierz dzień" />
          </SelectTrigger>
          <SelectContent>
            {[0, 1, 2, 3, 4, 5, 6].map((dayNum) => (
              <SelectItem key={dayNum} value={dayNum.toString()}>
                {numerTygodniaNaString(dayNum)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        {chosenData.map((item) => (
          <div key={item.id}>{JSON.stringify(item)}</div> // no tu bedzie kiedys tabela na wyniki xd
        ))}
      </div>
    </div>
  );
}
