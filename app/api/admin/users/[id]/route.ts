import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const db = readDB();
  const idx = db.adminUsers.findIndex((u) => u.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const update: Partial<typeof db.adminUsers[0]> = {
    name: body.name,
    email: body.email,
    role: body.role,
  };

  if (body.password) {
    update.passwordHash = await bcrypt.hash(body.password, 10);
  }

  db.adminUsers[idx] = { ...db.adminUsers[idx], ...update };
  writeDB(db);

  const { passwordHash: _, ...safe } = db.adminUsers[idx];
  return NextResponse.json(safe);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = readDB();

  // Prevent deleting the last admin
  if (db.adminUsers.length <= 1) {
    return NextResponse.json({ error: "Cannot delete the last admin" }, { status: 400 });
  }

  db.adminUsers = db.adminUsers.filter((u) => u.id !== id);
  writeDB(db);
  return NextResponse.json({ success: true });
}
