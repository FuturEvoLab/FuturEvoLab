import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDB();

  const totalPrompts = db.savedPrompts.length;
  const totalTemplates = db.templates.length;
  const totalCategories = db.categories.length;
  const totalUsage = db.templates.reduce((sum, t) => sum + t.usageCount, 0);

  const imagePrompts = db.savedPrompts.filter((p) => p.type === "image").length;
  const musicPrompts = db.savedPrompts.filter((p) => p.type === "music").length;

  const topTemplates = [...db.templates]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 5)
    .map((t) => ({ id: t.id, title: t.title, type: t.type, usageCount: t.usageCount }));

  // Prompts per day for last 7 days
  const now = new Date();
  const dailyStats = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const count = db.savedPrompts.filter((p) => {
      const pd = new Date(p.createdAt);
      return (
        pd.getDate() === d.getDate() &&
        pd.getMonth() === d.getMonth() &&
        pd.getFullYear() === d.getFullYear()
      );
    }).length;
    return { date: dateStr, count };
  });

  return NextResponse.json({
    totalPrompts,
    totalTemplates,
    totalCategories,
    totalUsage,
    imagePrompts,
    musicPrompts,
    topTemplates,
    dailyStats,
  });
}
