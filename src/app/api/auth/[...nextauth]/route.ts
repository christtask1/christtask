import NextAuth from "next-auth"
import { WhopServerSdk } from "@whop/api"

const whopApi = new WhopServerSdk({
  appApiKey: process.env.WHOP_API_KEY!,
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
})

const WhopProvider = whopApi.oauth.authJsProvider({
  scope: ["read_user"],
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [WhopProvider],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider
      session.accessToken = token.accessToken
      return session
    },
  },
})

export const { GET, POST } = handlers
