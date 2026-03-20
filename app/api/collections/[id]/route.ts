import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, now } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const col = db.collections.find(c => c.id === id);
  if (!col) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Resolve prompts for this collection
  let prompts: typeof db.savedPrompts = [];
  if (col.type === "smart") {
    if (col.query === "starred") prompts = db.savedPrompts.filter(p => p.starred && !p.archived);
    else if (col.query === "type:image") prompts = db.savedPrompts.filter(p => p.type === "image" && !p.archived);
    else if (col.query === "type:music") prompts = db.savedPrompts.filter(p => p.type === "music" && !p.archived);
    else if (col.query.startsWith("tag:")) {
      const tag = col.query.slice(4);
      prompts = db.savedPrompts.filter(p => p.tags.includes(tag) && !p.archived);
    }
  } else {
    prompts = col.promptIds.map(pid => db.savedPrompts.find(p => p.id === pid)).filter(Boolean) as typeof db.savedPrompts;
    prompts = prompts.filter(p => !p.archived);
  }

  return NextResponse.json({ ...col, prompts });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const db = readDB();
  const idx = db.collections.findIndex(c => c.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  db.collections[idx] = { ...db.collections[idx], ...body, updatedAt: now() };
  writeDB(db);
  return NextResponse.json(db.collections[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = readDB();
  db.collections = db.collections.filter(c => c.id !== id);
  writeDB(db);
  return NextResponse.json({ success: true });
}
