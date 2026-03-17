import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, now } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const db = readDB();
  const idx = db.categories.findIndex((c) => c.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  db.categories[idx] = { ...db.categories[idx], ...body, updatedAt: now() };
  writeDB(db);
  return NextResponse.json(db.categories[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = readDB();
  db.categories = db.categories.filter((c) => c.id !== id);
  writeDB(db);
  return NextResponse.json({ success: true });
}
