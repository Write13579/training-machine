import { db } from "@/lib/database";
import { users, usersToUsers } from "@/lib/database/scheme";
import { eq } from "drizzle-orm";
import PrzestanObserwowacBtn from "../PrzestanObserwowacBtn";
import DodajZnajomegoComp from "../DodajZnajomegoComp";
import Link from "next/link";
import { getMe } from "@/app/authutils";

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

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    // with: {
    //   obserwujacy: true, // kogo ja
    //   obserwatorzy: true, // kto mnie
    // },
  });

  const moiObserwatorzy = await db.query.usersToUsers.findMany({
    where: eq(usersToUsers.osobaObserwowanaId, userId),
    with: {
      obserwatorzy: true,
    },
  });

  const osobyKtoreObserwuje = await db.query.usersToUsers.findMany({
    where: eq(usersToUsers.osobaObserwujacaId, userId),
    with: {
      obserwujacy: true,
    },
  });

  //const usersAll = await db.query.users.findMany();

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <div>{user.name}</div>
      <div className="text-white/50">{user.login}</div>

      <div>liczba obserwatorów: {moiObserwatorzy.length}</div>
      {moiObserwatorzy.length > 0 && (
        <div id="kto mnie obserwuje">
          <div>obserwują mnie:</div>
          <div>
            {moiObserwatorzy.map((relacja) => (
              <div
                key={`${relacja.osobaObserwowanaId}-${relacja.osobaObserwujacaId}`}>
                <Link href={`/profile/${relacja.obserwatorzy.id}`}>
                  {relacja.obserwatorzy.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      {osobyKtoreObserwuje.length > 0 && (
        <div id="kogo ja obserwuje">
          <div>obserwuję:</div>
          <div>
            {osobyKtoreObserwuje.map((relacja) => (
              <div
                id="wrapper"
                key={`${relacja.osobaObserwujacaId}-${relacja.osobaObserwowanaId}`}>
                <Link href={`/profile/${relacja.obserwujacy.id}`}>
                  {relacja.obserwujacy.name}
                </Link>
                <div>
                  <PrzestanObserwowacBtn
                    ja={userId}
                    on={relacja.osobaObserwowanaId}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {userId == ja.id && (
        <div id="dodajZnajomego w sensie ze obserwuj wiesz jak jest byku eszkere">
          <DodajZnajomegoComp ja={userId} />
        </div>
      )}
    </div>
  );
}
