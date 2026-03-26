import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = readDB();
  db.savedPrompts = db.savedPrompts.filter((p) => p.id !== id);
  writeDB(db);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const db = readDB();
  const idx = db.savedPrompts.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.like) db.savedPrompts[idx].likes += 1;
  if (body.starred !== undefined) db.savedPrompts[idx].starred = body.starred;
  if (body.archived !== undefined) db.savedPrompts[idx].archived = body.archived;
  if (body.note !== undefined) db.savedPrompts[idx].note = body.note;
  writeDB(db);
  return NextResponse.json(db.savedPrompts[idx]);
}
