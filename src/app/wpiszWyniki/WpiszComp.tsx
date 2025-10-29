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
import { PlanWithExercise } from "@/lib/database/scheme";
import { DataTable } from "./data-table-wpisz-wyniki";
import { columns } from "./columns";

export default function WpiszComp({ data }: { data: PlanWithExercise[] }) {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [chosenData, setChosenData] = useState<PlanWithExercise[]>([]);

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
      <br />
      <div>
        <DataTable columns={columns} data={chosenData} />
      </div>
    </div>
  );
}
