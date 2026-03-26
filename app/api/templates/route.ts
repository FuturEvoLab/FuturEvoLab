import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, genId, now } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  const db = readDB();
  const type = req.nextUrl.searchParams.get("type");
  const categoryId = req.nextUrl.searchParams.get("categoryId");
  const featured = req.nextUrl.searchParams.get("featured");
  const status = req.nextUrl.searchParams.get("status") || "active";

  let templates = db.templates.filter((t) => t.status === status);
  if (type) templates = templates.filter((t) => t.type === type);
  if (categoryId) templates = templates.filter((t) => t.categoryId === categoryId);
  if (featured === "true") templates = templates.filter((t) => t.featured);

  return NextResponse.json(templates.sort((a, b) => b.usageCount - a.usageCount));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = readDB();

  const template = {
    id: genId(),
    title: body.title,
    description: body.description || "",
    type: body.type,
    categoryId: body.categoryId,
    tags: body.tags || [],
    fields: body.fields || [],
    exampleOutput: body.exampleOutput || "",
    status: body.status || "active",
    usageCount: 0,
    featured: body.featured || false,
    createdAt: now(),
    updatedAt: now(),
  };

  db.templates.push(template);
  writeDB(db);

  revalidatePath("/");
  revalidatePath("/image");
  revalidatePath("/music");

  return NextResponse.json(template, { status: 201 });
}
