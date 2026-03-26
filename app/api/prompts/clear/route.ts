import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDB();
  const count = db.savedPrompts.length;
  db.savedPrompts = [];
  writeDB(db);

  return NextResponse.json({ success: true, cleared: count });
}
