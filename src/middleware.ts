import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getMe } from "./app/authutils";

export async function middleware(request: NextRequest) {
  //podstrony gdzie musisz byc zalogowany, żeby wejść
  const AUTH_PAGES = [{ url: "/xxx", admin: false }];

  //podstrony widoczne TYLKO dla niezalogowanych
  const PUBLIC_ONLY_PAGES = ["/rejestracja"];

  const authPage = AUTH_PAGES.find((authPageUrl) =>
    request.nextUrl.pathname.startsWith(authPageUrl.url)
  );

  const PublicOnlyPage = PUBLIC_ONLY_PAGES.find((publicPageUrl) =>
    request.nextUrl.pathname.startsWith(publicPageUrl)
  );

  const user = await getMe();

  if (PublicOnlyPage && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (authPage) {
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (authPage.admin && !user.admin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/(.*)",
};
