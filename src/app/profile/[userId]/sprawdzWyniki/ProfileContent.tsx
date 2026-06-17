"use client";

import dynamic from "next/dynamic";

const WynikiZDniaComp = dynamic(() => import("./WynikiZDniaComp"), {
  ssr: false,
});

const WykresyComp = dynamic(() => import("./WykresyComp"), {
  ssr: false,
});

export default function ProfileContent({
  wynikiUsera,
}: {
  wynikiUsera: {
    id: number;
    planId: number;
    userId: number;
    exerciseId: number;
    serie: number;
    powtorzenia: number;
    ciezar: number;
    dataWykonania: Date;
    udostepniony: boolean;
    exercise: {
      id: number;
      nazwa: string;
      opis: string;
    };
  }[];
}) {
  const sortedWynikiUsera = [...wynikiUsera].sort(
    (a, b) => a.dataWykonania.getTime() - b.dataWykonania.getTime(),
  );
  return (
    <div>
      <WynikiZDniaComp wynikiUsera={wynikiUsera} />
      <WykresyComp wynikiUsera={sortedWynikiUsera} />
    </div>
  );
}
