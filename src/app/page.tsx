import { getMe } from "./authutils";
import WylogujBtn from "@/components/ui/WylogujBtn";
import Link from "next/link";
import ZalogujPage from "./ZalogujComp";

export default async function Home() {
  const user = await getMe();

  return (
    <div
      id="tlo"
      className="relative items-center justify-center min-h-[100vh] min-w-[320px]">

      {!user && (
        <div className="flex flex-col items-center w-full">
          <ZalogujPage  />
        </div>
      )}
      {user && (
        <div>
          <div>Witaj, {user.name}!</div>
          <Link href="/ustawPlan">ustaw plan treningowy</Link>
        </div>
      )}
      <div className="border-2 p-3 flex justify-center mx-10 flex-col min-h-[10vh]">
        <div>blog/feed</div>
      </div>

      {user && (
        <div>
          <WylogujBtn />
        </div>
      )}
      {user && user.admin && (
        <div className="mt-4 flex justify-center border-2 bg-red-600">
          <Link href="/admin">Admin Panel</Link>
        </div>
      )}
    </div>
  );
}
