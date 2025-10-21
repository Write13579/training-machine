import Link from "next/link";
import RejestracjaComp from "./RejestrujComp";

export default async function RejestracjaPage() {
  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Rejestracja</h1>
      <RejestracjaComp />
      <Link href="/">
        <div className="mt-4 text-blue-500 underline cursor-pointer">
          Powrót do strony głównej
        </div>
      </Link>
    </div>
  );
}
