import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";
import { verifyRequestAuth } from "@/app/api/_lib/auth";

const updateIssueSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
  assignedToId: z.string().cuid().nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = verifyRequestAuth(request);
  if (auth.response) return auth.response;

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await request.json();
  const parsed = updateIssueSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json(parsed.error, { status: 400 });

  const data: {
    title?: string;
    description?: string;
    status?: "OPEN" | "IN_PROGRESS" | "CLOSED";
    assignedTo?: { disconnect: true } | { connect: { id: string } };
  } = {};
  if (parsed.data.title !== undefined) data.title = parsed.data.title;
  if (parsed.data.description !== undefined) data.description = parsed.data.description;
  if (parsed.data.status !== undefined) data.status = parsed.data.status;

  if (parsed.data.assignedToId !== undefined) {
    if (parsed.data.assignedToId === null) {
      data.assignedTo = { disconnect: true };
    } else {
      const assignee = await prisma.user.findUnique({ where: { id: parsed.data.assignedToId } });
      if (!assignee) return NextResponse.json({ error: "Assigned user not found" }, { status: 400 });
      data.assignedTo = { connect: { id: parsed.data.assignedToId } };
    }
  }

  const updated = await prisma.issue.update({
    where: { id: Number(id) },
    data,
  });

  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = verifyRequestAuth(request);
  if (auth.response) return auth.response;

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const deleted = await prisma.issue.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(deleted, { status: 200 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === "P2025") {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


