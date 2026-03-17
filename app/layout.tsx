import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FuturEvoLab Prompt Studio — AI Image & Music Prompt Generator",
  description:
    "Generate powerful AI prompts for image generation (Midjourney, Stable Diffusion, DALL-E) and music AI (Suno, Udio). Evolve your creativity with FuturEvoLab.",
  keywords: "AI prompts, Midjourney prompts, Stable Diffusion, Suno AI, music prompts, image generation",
  openGraph: {
    title: "FuturEvoLab Prompt Studio",
    description: "AI Image & Music Prompt Generator",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080812] text-gray-100 antialiased">{children}</body>
    </html>
  );
}
