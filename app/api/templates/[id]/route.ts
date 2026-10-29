import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, now } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const template = db.templates.find((t) => t.id === id);
  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(template);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const db = readDB();
  const idx = db.templates.findIndex((t) => t.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  db.templates[idx] = { ...db.templates[idx], ...body, updatedAt: now() };
  writeDB(db);

  revalidatePath("/");
  revalidatePath("/image");
  revalidatePath("/music");

  return NextResponse.json(db.templates[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = readDB();
  db.templates = db.templates.filter((t) => t.id !== id);
  writeDB(db);

  revalidatePath("/");
  revalidatePath("/image");
  revalidatePath("/music");

  return NextResponse.json({ success: true });
}
