import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, now } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** POST /api/collections/[id]/prompts  { promptId } — add prompt to manual collection */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { promptId } = await req.json();
  const db = readDB();
  const col = db.collections.find(c => c.id === id);
  if (!col) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (col.type !== "manual") return NextResponse.json({ error: "Cannot add to smart collection" }, { status: 400 });
  if (!col.promptIds.includes(promptId)) {
    col.promptIds.push(promptId);
    col.updatedAt = now();
    writeDB(db);
  }
  return NextResponse.json({ success: true });
}

/** DELETE /api/collections/[id]/prompts  { promptId } — remove prompt from manual collection */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { promptId } = await req.json();
  const db = readDB();
  const col = db.collections.find(c => c.id === id);
  if (!col) return NextResponse.json({ error: "Not found" }, { status: 404 });
  col.promptIds = col.promptIds.filter(pid => pid !== promptId);
  col.updatedAt = now();
  writeDB(db);
  return NextResponse.json({ success: true });
}
