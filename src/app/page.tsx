import { getMe } from "./authutils";
import WylogujBtn from "@/components/ui/WylogujBtn";
import Link from "next/link";
import ZalogujPage from "./ZalogujComp";
import { Dumbbell } from "lucide-react";

export default async function Home() {
  const user = await getMe();

  return (
    <div
      id="tlo"
      className="relative items-center justify-center min-h-[100vh] min-w-[320px]">
      {!user && (
        <div className="flex flex-col items-center w-full">
          <ZalogujPage />
        </div>
      )}
      {user && (
        <div className="relative z-20 mx-auto mt-10 min-h-[360px] h-auto w-[34%] rounded-[20px] bg-[#ffffff] min-w-[340px] p-8
                 shadow-2xl shadow-black/40 ring-1 ring-black/5">
          <div className="flex flex-col items-center">
            <Dumbbell
              className="w-12 h-12 mb-10"
              stroke="url(#loginGradient)"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <div className="text-center">
            <div className="text-black text-3xl md:text-4xl font-bold leading-tight mb-2">
              WITAJ PONOWNIE
            </div>
            <div className="text-[#FF4D6D] inline-block text-4xl md:text-4xl font-bold leading-tight">
              {user.name}
              <div
                className="mt-[-5px] h-1 bg-black rounded w-auto mx-auto"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="flex flex-col items-center font-MySerif mt-5 mb-10 text-[12px] text-[#858383] font-bold">
            Stwórz swój plan treningowy i śledź postępy!
          </div>

          <Link href="/ustawPlan">
            <button
              type="button"
              className="
                w-full
              py-[8.75px]
              my-2
              rounded-full
              cursor-pointer
              border-0
              bg-black
              uppercase
              text-[15px]
              transition-all duration-500 ease-in-out
              hover:tracking-[1px]
              hover:text-white
              active:tracking-[3px]
              active:bg-white
              active:text-black
              active:translate-y-[-2px]
              active:duration-[200ms]
              ">
              Stwórz trening
            </button>
          </Link>

          <Link href="/wpiszWyniki">
            <button
              type="button"
              className="
                w-full
              py-[8.75px]
              my-2
              rounded-full
              cursor-pointer
              border-0
              bg-black
              uppercase
              text-[15px]
              transition-all duration-500 ease-in-out
              hover:tracking-[1px]
              hover:text-white
              active:tracking-[3px]
              active:bg-white
              active:text-black
              active:translate-y-[-2px]
              active:duration-[200ms]
              ">
              Wpisz wyniki treningu
            </button>
          </Link>
          <div>
            <WylogujBtn />
          </div>
          {user && user.admin && (
            <Link href="/admin">
              <button
                type="button"
                className="w-full
              py-[8.75px]
              my-2
              rounded-full
              cursor-pointer
              border-0
              bg-[#FF4D6D]
              uppercase
              text-[15px]
              text-black
              font-bold
              transition-all duration-500 ease-in-out
              hover:tracking-[1px]
              active:tracking-[3px]
              active:bg-white
              active:text-black
              active:translate-y-[-2px]
              active:duration-[200ms]">
                Panel administratora
              </button>
            </Link>
          )}
        </div>
      )}
      <div className="border-2 p-3 flex justify-center mx-10 flex-col min-h-[10vh]">
        <div>blog/feed</div>
      </div>
    </div>
  );
}
