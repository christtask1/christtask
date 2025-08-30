import NextAuth from "next-auth"
import { WhopServerSdk } from "@whop/api"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    userId?: string
  }
  interface JWT {
    accessToken?: string
    userId?: string
  }
}

// Check if required environment variables are set
if (!process.env.WHOP_API_KEY || !process.env.NEXT_PUBLIC_WHOP_APP_ID) {
  console.error('Missing environment variables:', {
    WHOP_API_KEY: !!process.env.WHOP_API_KEY,
    NEXT_PUBLIC_WHOP_APP_ID: !!process.env.NEXT_PUBLIC_WHOP_APP_ID
  })
  throw new Error('Missing required environment variables: WHOP_API_KEY and NEXT_PUBLIC_WHOP_APP_ID')
}

const whopApi = WhopServerSdk({
  appApiKey: process.env.WHOP_API_KEY,
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
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
        token.userId = account.providerAccountId as string
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider
      session.accessToken = token.accessToken as string
      session.userId = token.userId as string
      return session
    },
  },
})

export const { GET, POST } = handlers
