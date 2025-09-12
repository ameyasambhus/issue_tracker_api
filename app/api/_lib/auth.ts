import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export type AuthUser = {
  userId: string;
  email: string;
  name: string;
};

export function extractToken(req: NextRequest): string | undefined {
  const bearer = req.headers.get("authorization");
  if (bearer && bearer.startsWith("Bearer ")) return bearer.slice(7);
  const cookie = req.cookies.get("auth_token")?.value;
  return cookie;
}

export function verifyRequestAuth(req: NextRequest): { response?: NextResponse; user?: AuthUser } {
  const token = extractToken(req);
  const secret = process.env.JWT_SECRET;
  if (!token) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!secret) {
    return { response: NextResponse.json({ error: "Server misconfigured: JWT_SECRET missing" }, { status: 500 }) };
  }
  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload;
    const user: AuthUser = {
      userId: (payload.sub as string) || "",
      email: (payload.email as string) || "",
      name: (payload.name as string) || "",
    };
    return { user };
  } catch {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
}


