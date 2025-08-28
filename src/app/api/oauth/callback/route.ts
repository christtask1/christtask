import { WhopServerSdk } from "@whop/api";
import { NextResponse } from "next/server";

const whopApi = WhopServerSdk({
  appApiKey: process.env.WHOP_API_KEY!,
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    // redirect to error page
    return NextResponse.redirect("/oauth/error?error=missing_code");
  }

  if (!state) {
    // redirect to error page
    return NextResponse.redirect("/oauth/error?error=missing_state");
  }

  const stateCookie = request.headers
    .get("Cookie")
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith(`oauth-state.${state}=`));

  if (!stateCookie) {
    // redirect to error page
    return NextResponse.redirect("/oauth/error?error=invalid_state");
  }

  // exchange the code for a token
  const authResponse = await whopApi.oauth.exchangeCode({
    code,
    redirectUri: "http://localhost:3000/api/oauth/callback",
  });

  if (!authResponse.ok) {
    return NextResponse.redirect("/oauth/error?error=code_exchange_failed");
  }

  const { access_token } = authResponse.tokens;

  // Restore the `next` parameter from the state cookie set in the previous step.
  const next = decodeURIComponent(stateCookie.split("=")[1]);
  const nextUrl = new URL(next, "http://localhost:3000");

  // This is an example, you should not store the plain user auth token in a cookie in production.

  // After setting the cookie you can now identify the user by reading the cookie when the user visits your website.
  return NextResponse.redirect(nextUrl.toString(), {
    headers: {
      "Set-Cookie": `whop_access_token=${access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`,
    },
  });
}
