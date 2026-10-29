import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, genId, now } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDB();
  const users = db.adminUsers.map(({ passwordHash: _, ...u }) => u);
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = readDB();

  if (db.adminUsers.find((u) => u.email === body.email)) {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(body.password, 10);

  const user = {
    id: genId(),
    email: body.email,
    passwordHash,
    name: body.name,
    role: body.role || "editor",
    createdAt: now(),
    lastLoginAt: null,
  };

  db.adminUsers.push(user);
  writeDB(db);

  const { passwordHash: _, ...safe } = user;
  return NextResponse.json(safe, { status: 201 });
}
