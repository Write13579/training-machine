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
        className="text-sm text-blue-500 mt-2"
      >
        {editing ? "Zapisz" : "Edytuj"}
      </button>
      <div className="font-MySerif mt-0 mb-4 text-[12px] text-[#858383] font-bold">
        Imię i nazwisko //pseudonim?
      </div>
    </div>
  );
}
