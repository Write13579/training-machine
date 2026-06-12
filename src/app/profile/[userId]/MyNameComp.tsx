"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { editName } from "./actions";
import { useRouter } from "next/navigation";

export default function MyNameComp({
  name,
  userId,
}: {
  name: string;
  userId: number;
}) {
  const [editing, setEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(name);

  const router = useRouter();
  return (
    <div>
      {!editing ? (
        <div className="text-[#FF4D6D] text-2xl md:text-2xl font-bold leading-tight">
          {name}
        </div>
      ) : (
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="text-[#FF4D6D] text-2xl md:text-2xl font-bold leading-tight"
        />
      )}
      <button
        onClick={async () => {
          if (editing) {
            await editName(newName, userId);
            router.refresh();
          }
          setEditing(!editing);
        }}
        className="flex items-center justify-center w-full py-[8.75px] rounded-full cursor-pointer border-0 bg-black text-white uppercase text-[15px] transition-all duration-500 ease-in-out hover:tracking-[1px] hover:text-white active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[100ms]">
        {editing ? "Zapisz" : "Edytuj"}
      </button>
      <div className="font-MySerif mt-0 mb-4 text-[12px] text-[#858383] font-bold">
        Imię i nazwisko
      </div>
    </div>
  );
}
