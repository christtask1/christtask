import { WhopServerSdk } from "@whop/api";

export const whopSdk = WhopServerSdk({
  appApiKey: process.env.WHOP_API_KEY!,
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
});
