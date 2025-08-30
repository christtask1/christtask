import { whopSdk } from "../../../lib/whop-sdk";
import { auth } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.userId) {
      return NextResponse.json({ hasAccess: false, error: "No session" });
    }

    const hasAccess = await whopSdk.access.checkIfUserHasAccessToAccessPass({
      accessPassId: process.env.PREMIUM_ACCESS_PASS_ID!,
      userId: session.userId,
    });

    return NextResponse.json(hasAccess);
  } catch (error) {
    console.error("Access check failed:", error);
    return NextResponse.json({ hasAccess: false, error: "Check failed" }, { status: 500 });
  }
}
