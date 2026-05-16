import { getMe } from "@/app/authutils";
import { db } from "@/lib/database";
import { wyniki } from "@/lib/database/scheme";
import { eq } from "drizzle-orm";
import ProfileContent from "./ProfileContent";

export default async function ProfilePage({
  params,
}: {
  params: { userId: number };
}) {
  const { userId } = await params;

  const ja = await getMe();
  if (!ja) {
    throw new Error("Nieautoryzowany");
  }

  const wynikiUsera = await db.query.wyniki.findMany({
    where: eq(wyniki.userId, userId),
    with: {
      exercise: true,
    },
    orderBy: (wyniki, { desc, asc }) => [
      desc(wyniki.exerciseId),
      asc(wyniki.serie),
    ],
  });

  return <ProfileContent wynikiUsera={wynikiUsera} />;
}
