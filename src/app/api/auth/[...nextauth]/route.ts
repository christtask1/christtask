import NextAuth from "next-auth"
import { WhopServerSdk } from "@whop/api"

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
  interface JWT {
    accessToken?: string
  }
}

const whopApi = WhopServerSdk({
  appApiKey: process.env.WHOP_API_KEY!,
  appId: process.env.WHOP_APP_ID!,
})

const WhopProvider = whopApi.oauth.authJsProvider({
  scope: ["read_user"],
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [WhopProvider],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token as string
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider
      session.accessToken = token.accessToken as string
      return session
    },
  },
})

export const { GET, POST } = handlers
