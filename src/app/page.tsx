import { getMe } from "./authutils";
import { Wyloguj } from "./auth-actions";
import WylogujBtn from "@/components/ui/WylogujBtn";
import ZalogujPage from "./zaloguj/page";

export default async function Home() {
  const user = await getMe();

  return (
      <div id="tlo" className="relative items-center justify-center min-h-[100vh] min-w-[320px]">
      <div className="font-MySerif text-[80px] p-40 font-bold">
        <h1 className="text-[#ffffff] justify-center flex min-w-[320px]">Let's move!</h1>
      </div>

      {!user && <ZalogujPage />}

      <div className="border-2 p-3 flex justify-center mx-10 flex-col min-h-[10vh]">
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
