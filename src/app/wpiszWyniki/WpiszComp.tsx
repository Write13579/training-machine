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
import { DataTable } from "./data-table-wpisz-wyniki";
import { columns, WynikType } from "./columns";

export default function WpiszComp({ data }: { data: WynikType[] }) {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [chosenData, setChosenData] = useState<WynikType[]>([]);

  const [dataWybranegoDnia, setDataWybranegoDnia] = useState<Date>(new Date());
  const dzisiaj = new Date();

  useEffect(() => {
    const filteredData = data.filter(
      (item) => item.dzienTygodnia === selectedDay,
    );

    setChosenData(filteredData);

    const todayDow = dzisiaj.getDay();
    const deltaDays = (todayDow - selectedDay + 7) % 7;
    const targetDate = new Date(
      dzisiaj.getFullYear(),
      dzisiaj.getMonth(),
      dzisiaj.getDate() - deltaDays,
    );
    setDataWybranegoDnia(targetDate);
  }, [selectedDay, columns, data]);

  return (
    <div className="text-center">
      <h2 className="text-[#C9184A] text-2xl md:text-2xl font-bold">
        {dataWybranegoDnia.toDateString()}
      </h2>
      <div id="select" className="flex justify-center w-full mb-5">
        <Select
          value={selectedDay.toString()}
          onValueChange={(newVal) => setSelectedDay(Number(newVal))}>
          <SelectTrigger className="w-full inline-flex items-center justify-center gap-2 border-0 bg-[#FF4D6D] rounded-[14px] px-4 shadow-md shadow-black/40 ring-0 hover:shadow-lg transition-shadow duration-200">
            <SelectValue
              className="w-full text-center text-black font-semibold"
              placeholder="Wybierz dzień"
            />
          </SelectTrigger>

          <SelectContent className="w-[min(95vw,720px)] max-h-[60vh] overflow-y-auto bg-[#ffffff] rounded-[14px] p-4 shadow-2xl shadow-black/40 ring-0 ring-black/0 text-black">
            {[0, 1, 2, 3, 4, 5, 6].map((dayNum) => (
              <SelectItem
                key={dayNum}
                value={dayNum.toString()}
                className="py-2 px-3 rounded-md hover:bg-[#FFCCD5] text-black">
                {numerTygodniaNaString(dayNum)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <DataTable columns={columns} data={chosenData} />
      </div>
    </div>
  );
}
