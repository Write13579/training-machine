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
import { useRouter } from "next/navigation";

export default function WpiszComp({ data }: { data: PlanWithExercise[] }) {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [chosenData, setChosenData] = useState<PlanWithExercise[]>([]);

  const [dataWybranegoDnia, setDataWybranegoDnia] = useState<Date>(new Date());
  const dzisiaj = new Date();

  useEffect(() => {
    const filteredData = data.filter(
      (item) => item.dzienTygodnia === selectedDay
    );

    setChosenData(filteredData);

    const todayDow = dzisiaj.getDay();
    const deltaDays = (todayDow - selectedDay + 7) % 7;
    const targetDate = new Date(
      dzisiaj.getFullYear(),
      dzisiaj.getMonth(),
      dzisiaj.getDate() - deltaDays
    );
    setDataWybranegoDnia(targetDate);
  }, [selectedDay, columns]);

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
      <h2>Wybrana data: {dataWybranegoDnia.toDateString()}</h2>

      <br />
      <div>
        <DataTable columns={columns} data={chosenData} />
      </div>
    </div>
  );
}
