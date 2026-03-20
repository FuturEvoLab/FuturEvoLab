import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, genId, now } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const db = readDB();
  // Enrich smart collections with computed counts
  const enriched = db.collections.map(col => {
    let count = 0;
    if (col.type === "smart") {
      if (col.query === "starred") count = db.savedPrompts.filter(p => p.starred && !p.archived).length;
      else if (col.query === "type:image") count = db.savedPrompts.filter(p => p.type === "image" && !p.archived).length;
      else if (col.query === "type:music") count = db.savedPrompts.filter(p => p.type === "music" && !p.archived).length;
      else if (col.query.startsWith("tag:")) {
        const tag = col.query.slice(4);
        count = db.savedPrompts.filter(p => p.tags.includes(tag) && !p.archived).length;
      }
    } else {
      count = col.promptIds.filter(id => db.savedPrompts.find(p => p.id === id && !p.archived)).length;
    }
    return { ...col, count };
  });
  return NextResponse.json(enriched.sort((a, b) => a.sortOrder - b.sortOrder));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = readDB();
  const col = {
    id: genId(),
    name: body.name || "New Collection",
    description: body.description || "",
    icon: body.icon || "📁",
    color: body.color || "#00d4ff",
    type: (body.type as "manual" | "smart") || "manual",
    query: body.query || "",
    promptIds: [],
    sortOrder: db.collections.length + 1,
    createdAt: now(),
    updatedAt: now(),
  };
  db.collections.push(col);
  writeDB(db);
  return NextResponse.json(col, { status: 201 });
}
