import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, genId, now } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const db = readDB();
  const type = req.nextUrl.searchParams.get("type");
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20");
  const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0");

  // Admin can see all; others only see their session's
  const session = await getServerSession(authOptions);

  const includeArchived = req.nextUrl.searchParams.get("includeArchived") === "true";

  let prompts = db.savedPrompts;
  if (!session && sessionId) {
    prompts = prompts.filter((p) => p.sessionId === sessionId);
  }
  if (!includeArchived) prompts = prompts.filter(p => !p.archived);
  if (type) prompts = prompts.filter((p) => p.type === type);

  const sorted = prompts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({
    prompts: sorted.slice(offset, offset + limit),
    total: sorted.length,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = readDB();

  const prompt = {
    id: genId(),
    templateId: body.templateId || null,
    title: body.title || "Untitled Prompt",
    prompt: body.prompt,
    type: body.type,
    tags: body.tags || [],
    likes: 0,
    starred: false,
    archived: false,
    note: "",
    createdAt: now(),
    sessionId: body.sessionId || genId(),
  };

  db.savedPrompts.push(prompt);

  // Increment template usage count
  if (body.templateId) {
    const tmpl = db.templates.find((t) => t.id === body.templateId);
    if (tmpl) tmpl.usageCount += 1;
  }

  writeDB(db);
  return NextResponse.json(prompt, { status: 201 });
}
