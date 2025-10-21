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

      {
        !user && (
          <div>
            <ZalogujPage />
            <Link href="/rejestracja">
              <div className="border-2 flex justify-center items-center m-4 p-4">
                Zarejestruj się
              </div>
            </Link>
          </div>
        ) // q9tBm49FvB
      }

      <div className="border-2 p-3 flex justify-center mx-10 flex-col min-h-[10vh]">
        <div>blog/feed</div>
        {user && <div>Witaj, {user.name}!</div>}
      </div>

      {user && (
        <div>
          <WylogujBtn />
        </div>
      )}
    </div>
  );
}
