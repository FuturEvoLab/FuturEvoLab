import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, genId, now } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const db = readDB();
  const type = req.nextUrl.searchParams.get("type");
  const categories = type
    ? db.categories.filter((c) => c.type === type)
    : db.categories;
  return NextResponse.json(categories.sort((a, b) => a.sortOrder - b.sortOrder));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = readDB();

  const category = {
    id: genId(),
    name: body.name,
    slug: body.slug,
    description: body.description || "",
    type: body.type,
    icon: body.icon || "📁",
    color: body.color || "#7c3aed",
    sortOrder: db.categories.length + 1,
    createdAt: now(),
    updatedAt: now(),
  };

  db.categories.push(category);
  writeDB(db);
  return NextResponse.json(category, { status: 201 });
}
