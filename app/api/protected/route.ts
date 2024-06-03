import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSession } from "@/dotstack-app/lib/auth";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const session = await getSession();

  if (!session || !session.user) {
    console.log("Unauthorized");
    return new NextResponse("Failed to fetch user data", {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const randomText = crypto.randomBytes(8).toString("hex");
  return NextResponse.json({ randomText });
};
