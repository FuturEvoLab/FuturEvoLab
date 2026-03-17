import Link from "next/link";
import { readDB } from "@/lib/db";
import { formatNumber } from "@/lib/utils";
import Navbar from "@/components/public/Navbar";
import Badge from "@/components/ui/Badge";
import { Image, Music, Wand2, TrendingUp, Star, ArrowRight, Zap, Layers, Globe } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const db = readDB();
  const featuredTemplates = db.templates
    .filter((t) => t.featured && t.status === "active")
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 6);

  const totalUsage = db.templates.reduce((sum, t) => sum + t.usageCount, 0);
  const imageTemplates = db.templates.filter((t) => t.type === "image" && t.status === "active");
  const musicTemplates = db.templates.filter((t) => t.type === "music" && t.status === "active");

  const stats = [
    { label: "Total Prompts Generated", value: formatNumber(totalUsage), icon: Wand2, color: "text-violet-400" },
    { label: "Image Templates", value: imageTemplates.length.toString(), icon: Image, color: "text-blue-400" },
    { label: "Music Templates", value: musicTemplates.length.toString(), icon: Music, color: "text-pink-400" },
    { label: "Categories", value: db.categories.length.toString(), icon: Layers, color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-violet-400 pulse-dot" />
            AI Prompt Studio — Powered by FuturEvoLab
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Generate Perfect
            <br />
            <span className="gradient-text">AI Prompts</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Craft powerful prompts for AI image generators and music AI tools.
            Templates for Midjourney, DALL-E, Stable Diffusion, Suno, and more.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/image"
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5"
            >
              <Image size={20} />
              Image Prompts
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/music"
              className="flex items-center gap-3 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold text-lg transition-all border border-gray-700 hover:border-gray-600"
            >
              <Music size={20} />
              Music Prompts
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 text-center hover:border-gray-700 transition-colors"
            >
              <Icon size={24} className={`${color} mx-auto mb-3`} />
              <div className="text-3xl font-bold text-white mb-1">{value}</div>
              <div className="text-xs text-gray-500 leading-tight">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Templates */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                <Star size={18} className="inline text-yellow-400 fill-yellow-400 mr-2" />
                Featured Templates
              </h2>
              <p className="text-gray-500 text-sm">Most popular prompt templates</p>
            </div>
            <Link
              href="/image"
              className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTemplates.map((template) => {
              const category = db.categories.find((c) => c.id === template.categoryId);
              return (
                <Link
                  key={template.id}
                  href={template.type === "image" ? `/image?template=${template.id}` : `/music?template=${template.id}`}
                  className="group block bg-gray-900/60 border border-gray-800 rounded-xl p-5 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category?.icon || "✨"}</span>
                      <div>
                        <Badge variant={template.type === "image" ? "purple" : "blue"} className="mb-1">
                          {template.type === "image" ? "Image" : "Music"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <TrendingUp size={10} />
                      {formatNumber(template.usageCount)}
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-200 group-hover:text-white mb-2 transition-colors">
                    {template.title}
                    {template.featured && (
                      <Star size={12} className="inline ml-1 text-yellow-400 fill-yellow-400" />
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-gray-800/80 text-gray-400 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            Why Use Our Prompt Studio?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Wand2,
                title: "Smart Templates",
                desc: "Guided fields that help you craft perfect prompts even if you're a beginner.",
                color: "text-violet-400 bg-violet-500/10",
              },
              {
                icon: Globe,
                title: "Multi-Platform",
                desc: "Prompts optimized for Midjourney, DALL-E, Stable Diffusion, Suno, Udio, and more.",
                color: "text-blue-400 bg-blue-500/10",
              },
              {
                icon: Zap,
                title: "Instant Generation",
                desc: "Generate and copy prompts in seconds. No signup required.",
                color: "text-yellow-400 bg-yellow-500/10",
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 text-center hover:border-gray-700 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-4 py-8 text-center text-gray-600 text-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-violet-400" />
            <span>FuturEvoLab Prompt Studio</span>
          </div>
          <p>Heal the Mind. Evolve the Future.</p>
          <Link href="/admin" className="hover:text-gray-400 transition-colors">
            Admin Panel
          </Link>
        </div>
      </footer>
    </div>
  );
}
