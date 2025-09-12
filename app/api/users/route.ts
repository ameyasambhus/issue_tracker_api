import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { verifyRequestAuth } from "@/app/api/_lib/auth";

export async function GET(request: NextRequest) {
  const auth = verifyRequestAuth(request);
  if (auth.response) return auth.response;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true },
  });

  return NextResponse.json(users, { status: 200 });
}


