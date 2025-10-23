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
      <div className="font-MySerif text-[80px] p-40 font-bold">
        <h1 className="text-[#ffffff] justify-center flex min-w-[320px]">
          Let's move!
        </h1>
      </div>

      {!user && (
        <div className="flex flex-col items-center w-full">
          <ZalogujPage />
          <Link href="/rejestracja" className="w-[24%] min-w-[252px] mx-auto">
            <button
              type="button"
              className="w-full py-[8.75px] mt-4 rounded-full cursor-pointer border-0 bg-[#ffffff] uppercase text-[15px] text-black transition-y duration-500 ease-in-out hover:tracking-[1px] hover:text-black active:tracking-[3px] active:bg-white active:text-black active:translate-y-[-2px] active:duration-[300ms]">
              Rejestracja
            </button>
          </Link>
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
