import Link from "next/link";
import RejestracjaComp from "./RejestrujComp";

export default async function RejestracjaPage() {
  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Rejestracja</h1>
      <RejestracjaComp />
      
      
      
      <Link href="/" className="w-[24%] min-w-[252px] mx-auto">
              <button
                type="button"
                className="
                  w-full
                  py-[8.75px]
                  mt-4
                  rounded-full
                  cursor-pointer
                  border-0
                  bg-[#ffffff]                  uppercase
                  text-[15px]
                  text-black
                  transition-y duration-500 ease-in-out
                  hover:tracking-[1px]
                  hover:text-black
                  active:tracking-[3px]
                  active:bg-white
                  active:text-black
                  active:translate-y-[-2px]
                  active:duration-[300ms]
                "
              >
                Powrót
              </button>
            </Link>
    </div>
  );
}
