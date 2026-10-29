import Link from "next/link";
import { readDB } from "@/lib/db";
import { formatNumber } from "@/lib/utils";
import Navbar from "@/components/public/Navbar";
import Badge from "@/components/ui/Badge";
import { ImageIcon, Music, Wand2, TrendingUp, Star, ArrowRight, Zap, Layers, Globe } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-black grid-bg-hero">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 px-4 overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-40 left-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-60 right-1/4 w-80 h-80 bg-fuchsia-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/4 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black border border-[#00d4ff22] text-xs font-mono text-cyan-400 mb-10 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
            FUTUROEVOLAB // AI PROMPT STUDIO
            <span className="text-slate-600">v2.0</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-5 leading-[1.05] tracking-tight">
            Generate Perfect
            <br />
            <span className="gradient-text">AI Prompts</span>
          </h1>

          <p className="text-lg text-slate-500 mb-12 max-w-xl mx-auto leading-relaxed">
            Craft powerful prompts for image generators and music AI tools.
            Templates for <span className="text-slate-300">Midjourney</span>, <span className="text-slate-300">DALL-E</span>, <span className="text-slate-300">Suno</span>, and more.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/image"
              className="group flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:shadow-[0_0_50px_rgba(0,212,255,0.5)] hover:-translate-y-0.5 text-sm tracking-wide"
            >
              <ImageIcon size={17} />
              Image Prompts
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/music"
              className="group flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 text-white font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(244,114,182,0.25)] hover:shadow-[0_0_50px_rgba(244,114,182,0.4)] hover:-translate-y-0.5 text-sm tracking-wide"
            >
              <Music size={17} />
              Music Prompts
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────────── */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Prompts Generated", value: formatNumber(totalUsage), icon: Wand2, accent: "cyan" },
            { label: "Image Templates", value: imageTemplates.length.toString(), icon: ImageIcon, accent: "cyan" },
            { label: "Music Templates", value: musicTemplates.length.toString(), icon: Music, accent: "pink" },
            { label: "Categories", value: db.categories.length.toString(), icon: Layers, accent: "pink" },
          ].map(({ label, value, icon: Icon, accent }) => (
            <div
              key={label}
              className={`relative bg-[#050508] border rounded-xl p-5 text-center overflow-hidden group transition-all hover:-translate-y-0.5 ${
                accent === "cyan"
                  ? "border-[#00d4ff15] hover:border-[#00d4ff35] hover:shadow-[0_0_20px_rgba(0,212,255,0.08)]"
                  : "border-[#f472b615] hover:border-[#f472b635] hover:shadow-[0_0_20px_rgba(244,114,182,0.08)]"
              }`}
            >
              <div className={`absolute top-0 left-0 right-0 h-px ${accent === "cyan" ? "bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" : "bg-gradient-to-r from-transparent via-pink-500/40 to-transparent"}`} />
              <Icon size={20} className={`mx-auto mb-3 ${accent === "cyan" ? "text-cyan-400" : "text-pink-400"}`} />
              <div className="text-2xl font-black text-white mb-0.5 tracking-tight">{value}</div>
              <div className="text-xs text-slate-600 leading-tight font-mono tracking-wider uppercase">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Templates ────────────────────────────────────────────────── */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-white mb-1 tracking-tight">
                <Star size={16} className="inline text-yellow-400 fill-yellow-400 mr-2" />
                Featured Templates
              </h2>
              <p className="text-slate-600 text-xs font-mono tracking-wider">MOST POPULAR PROMPT BUILDERS</p>
            </div>
            <Link
              href="/image"
              className="text-xs text-cyan-500 hover:text-cyan-300 flex items-center gap-1 transition-colors font-mono tracking-wider"
            >
              VIEW ALL <ArrowRight size={12} />
            </Link>
          </div>

          {/* Cyber separator */}
          <div className="cyber-sep mb-8" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTemplates.map((template) => {
              const category = db.categories.find((c) => c.id === template.categoryId);
              const isImage = template.type === "image";
              return (
                <Link
                  key={template.id}
                  href={isImage ? `/image?template=${template.id}` : `/music?template=${template.id}`}
                  className={`group relative block bg-[#050508] rounded-xl p-5 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 corner-accent ${
                    isImage
                      ? "border border-[#00d4ff12] hover:border-[#00d4ff35] hover:shadow-[0_0_25px_rgba(0,212,255,0.08)]"
                      : "border border-[#f472b612] hover:border-[#f472b635] hover:shadow-[0_0_25px_rgba(244,114,182,0.08)]"
                  }`}
                >
                  {/* Top line */}
                  <div className={`absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity ${isImage ? "bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" : "bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"}`} />

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{category?.icon || "✨"}</span>
                      <Badge variant={isImage ? "blue" : "pink"} className="font-mono text-[10px] tracking-widest">
                        {isImage ? "IMAGE" : "MUSIC"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-600 font-mono">
                      <TrendingUp size={9} />
                      {formatNumber(template.usageCount)}
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-200 group-hover:text-white mb-1.5 transition-colors text-sm leading-snug">
                    {template.title}
                    {template.featured && (
                      <Star size={11} className="inline ml-1.5 text-yellow-400 fill-yellow-400" />
                    )}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] bg-white/4 text-slate-500 px-2 py-0.5 rounded-md font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────────── */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="cyber-sep mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Wand2,
                title: "Smart Templates",
                desc: "Guided fields that help you craft perfect prompts for any AI tool.",
                accent: "cyan",
              },
              {
                icon: Globe,
                title: "Multi-Platform",
                desc: "Optimized for Midjourney, DALL-E, Stable Diffusion, Suno, Udio.",
                accent: "pink",
              },
              {
                icon: Zap,
                title: "Instant Generation",
                desc: "Generate and copy prompts in seconds. No account required.",
                accent: "cyan",
              },
            ].map(({ icon: Icon, title, desc, accent }) => (
              <div
                key={title}
                className={`relative bg-[#050508] rounded-xl p-6 group transition-all hover:-translate-y-0.5 overflow-hidden ${
                  accent === "cyan"
                    ? "border border-[#00d4ff12] hover:border-[#00d4ff30]"
                    : "border border-[#f472b612] hover:border-[#f472b630]"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${accent === "cyan" ? "bg-cyan-500/10" : "bg-pink-500/10"}`}>
                  <Icon size={18} className={accent === "cyan" ? "text-cyan-400" : "text-pink-400"} />
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">{title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#00d4ff0d] px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Zap size={13} className="text-cyan-500" />
            <span className="text-xs font-mono text-slate-600 tracking-wider">FUTUROEVOLAB // PROMPT STUDIO</span>
          </div>
          <p className="text-xs text-slate-700 font-mono">Heal the Mind. Evolve the Future.</p>
          <Link href="/admin" className="text-xs text-slate-700 hover:text-slate-400 transition-colors font-mono tracking-wider">
            ADMIN →
          </Link>
        </div>
      </footer>
    </div>
  );
}
