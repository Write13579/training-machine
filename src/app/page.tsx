import { getMe } from "./authutils";
import { Wyloguj } from "./auth-actions";
import WylogujBtn from "@/components/ui/WylogujBtn";
import ZalogujPage from "./zaloguj/page";

export default async function Home() {
  const user = await getMe();

  return (
    <div>
      <div className="border-2 p-2 font-bold">
        <h1 className="text-red-500 justify-center flex">TRAINING MACHINE</h1>
      </div>

      {!user && <ZalogujPage />}

      <div className="border-2 p-3 flex justify-center mx-10 flex-col">
        <div>blog/feed</div>
        {user && <div>Witaj, {JSON.stringify(user)}!</div>}
      </div>

      {user && (
        <div>
          <WylogujBtn />
        </div>
      )}
    </div>
  );
}
