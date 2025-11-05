import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { verifyRequestAuth } from "@/app/api/_lib/auth";

const createIssueSchema = z.object({
    title: z.string().min(1,'Title is required').max(255),
    description: z.string().min(1, 'Description is required')
})

export async function POST(request: NextRequest){
    const auth = verifyRequestAuth(request);
    if (auth.response) return auth.response;
    const body=await request.json();
    const validation = createIssueSchema.extend({
        assignedToId: z.string().cuid().optional().nullable(),
    }).safeParse(body);
    if(!validation.success){
        return NextResponse.json(validation.error, {status:400})
    }
    const { title, description, assignedToId } = validation.data;
    let connectAssignee = undefined as undefined | { assignedTo: { connect: { id: string } } };
    if (assignedToId) {
        const user = await prisma.user.findUnique({ where: { id: assignedToId } });
        if (!user) return NextResponse.json({ error: "Assigned user not found" }, { status: 400 });
        connectAssignee = { assignedTo: { connect: { id: assignedToId } } };
    }
    const newIssue=await prisma.issue.create({
        data:{ title, description, ...connectAssignee }
    })

    return NextResponse.json(newIssue, {status:201})
}

export async function GET(request: NextRequest){
    const auth = verifyRequestAuth(request);
    if (auth.response) return auth.response;
    const issues = await prisma.issue.findMany({
        orderBy: { createdAt: 'desc' },
        include: { assignedTo: { select: { id: true, email: true, name: true } } }
    } as Prisma.IssueFindManyArgs)
    return NextResponse.json(issues, { status: 200 })
}