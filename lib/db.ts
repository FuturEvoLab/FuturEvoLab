import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

// ─── Types ───────────────────────────────────────────────────────────────────

export type PromptType = "image" | "music";
export type PromptStatus = "active" | "inactive";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: PromptType;
  icon: string;
  color: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  type: PromptType;
  categoryId: string;
  tags: string[];
  fields: TemplateField[];
  exampleOutput: string;
  status: PromptStatus;
  usageCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateField {
  id: string;
  label: string;
  key: string;
  type: "text" | "select" | "multiselect" | "textarea" | "number";
  placeholder?: string;
  options?: string[];
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface SavedPrompt {
  id: string;
  templateId: string | null;
  title: string;
  prompt: string;
  type: PromptType;
  tags: string[];
  likes: number;
  starred: boolean;
  archived: boolean;
  note: string;
  createdAt: string;
  sessionId: string;
}

export interface PromptCollection {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  /** manual = explicit list; smart = auto-filtered by query string */
  type: "manual" | "smart";
  /** smart query e.g. "type:image", "tag:portrait", "starred" */
  query: string;
  /** prompt IDs for manual collections */
  promptIds: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "super_admin" | "admin" | "editor";
  createdAt: string;
  lastLoginAt: string | null;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  adminEmail: string;
  allowPublicSave: boolean;
  maxPromptsPerSession: number;
  featuredTemplatesCount: number;
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
}

export interface Database {
  categories: Category[];
  templates: Template[];
  savedPrompts: SavedPrompt[];
  collections: PromptCollection[];
  adminUsers: AdminUser[];
  settings: SiteSettings;
}

// ─── File path ────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function readDB(): Database {
  ensureDataDir();
  if (!fs.existsSync(DB_PATH)) {
    const initial = getInitialData();
    writeDB(initial);
    return initial;
  }
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  const db = JSON.parse(raw) as Database;
  // Migration: backfill missing fields
  if (!db.collections) db.collections = getInitialData().collections;
  db.savedPrompts = db.savedPrompts.map(p => ({
    ...p,
    starred: p.starred ?? false,
    archived: p.archived ?? false,
    note: p.note ?? "",
  }));
  return db;
}

export function writeDB(db: Database): void {
  ensureDataDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

// ─── Generic CRUD helpers ─────────────────────────────────────────────────────

export function genId() {
  return uuidv4();
}

export function now() {
  return new Date().toISOString();
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

function getInitialData(): Database {
  const passwordHash = bcrypt.hashSync("admin123456", 10);

  const categories: Category[] = [
    {
      id: "cat-1",
      name: "Portrait Photography",
      slug: "portrait-photography",
      description: "Stunning portrait and character images",
      type: "image",
      icon: "👤",
      color: "#7c3aed",
      sortOrder: 1,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "cat-2",
      name: "Landscape & Nature",
      slug: "landscape-nature",
      description: "Epic landscapes and nature scenes",
      type: "image",
      icon: "🏔️",
      color: "#059669",
      sortOrder: 2,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "cat-3",
      name: "Abstract & Concept",
      slug: "abstract-concept",
      description: "Abstract art and conceptual imagery",
      type: "image",
      icon: "🎨",
      color: "#dc2626",
      sortOrder: 3,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "cat-4",
      name: "Sci-Fi & Fantasy",
      slug: "sci-fi-fantasy",
      description: "Futuristic and fantastical worlds",
      type: "image",
      icon: "🚀",
      color: "#0891b2",
      sortOrder: 4,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "cat-5",
      name: "Ambient & Chill",
      slug: "ambient-chill",
      description: "Relaxing ambient and lo-fi tracks",
      type: "music",
      icon: "🎵",
      color: "#7c3aed",
      sortOrder: 5,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "cat-6",
      name: "Electronic & Synth",
      slug: "electronic-synth",
      description: "Electronic, synth-wave and EDM",
      type: "music",
      icon: "🎛️",
      color: "#db2777",
      sortOrder: 6,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "cat-7",
      name: "Cinematic & Orchestral",
      slug: "cinematic-orchestral",
      description: "Epic film scores and orchestral compositions",
      type: "music",
      icon: "🎻",
      color: "#d97706",
      sortOrder: 7,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "cat-8",
      name: "Nature Sounds",
      slug: "nature-sounds",
      description: "Rain, forest, ocean, and nature atmospheres",
      type: "music",
      icon: "🌊",
      color: "#0891b2",
      sortOrder: 8,
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const templates: Template[] = [
    // Image templates
    {
      id: "tmpl-1",
      title: "Cinematic Portrait",
      description: "Generate stunning cinematic-style portrait prompts",
      type: "image",
      categoryId: "cat-1",
      tags: ["portrait", "cinematic", "dramatic"],
      fields: [
        {
          id: "f1",
          label: "Subject",
          key: "subject",
          type: "text",
          placeholder: "e.g., young woman, elderly man, warrior",
          required: true,
          description: "Describe the main subject",
        },
        {
          id: "f2",
          label: "Mood",
          key: "mood",
          type: "select",
          options: ["mysterious", "joyful", "melancholic", "fierce", "serene", "dramatic", "ethereal"],
          required: true,
          defaultValue: "dramatic",
        },
        {
          id: "f3",
          label: "Lighting",
          key: "lighting",
          type: "select",
          options: ["golden hour", "studio lighting", "rim lighting", "chiaroscuro", "neon lights", "moonlight", "soft diffused"],
          required: true,
          defaultValue: "golden hour",
        },
        {
          id: "f4",
          label: "Style",
          key: "style",
          type: "select",
          options: ["photorealistic", "oil painting", "digital art", "concept art", "hyperrealistic", "impressionist"],
          required: true,
          defaultValue: "photorealistic",
        },
        {
          id: "f5",
          label: "Camera Details",
          key: "camera",
          type: "select",
          options: ["85mm lens, f/1.4", "50mm lens, f/2.8", "35mm lens, f/1.8", "telephoto 200mm", "wide angle 24mm"],
          required: false,
          defaultValue: "85mm lens, f/1.4",
        },
      ],
      exampleOutput:
        "A young woman with mysterious expression, dramatic chiaroscuro lighting, photorealistic style, 85mm lens f/1.4, highly detailed, 8k resolution, award-winning photography",
      status: "active",
      usageCount: 1245,
      featured: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "tmpl-2",
      title: "Epic Landscape",
      description: "Create breathtaking landscape scene prompts",
      type: "image",
      categoryId: "cat-2",
      tags: ["landscape", "nature", "epic"],
      fields: [
        {
          id: "f1",
          label: "Location/Biome",
          key: "location",
          type: "select",
          options: ["mountain range", "tropical beach", "dense forest", "desert dunes", "arctic tundra", "volcanic island", "canyon", "rolling hills"],
          required: true,
          defaultValue: "mountain range",
        },
        {
          id: "f2",
          label: "Time of Day",
          key: "timeOfDay",
          type: "select",
          options: ["golden hour sunset", "blue hour dawn", "midday", "night with stars", "stormy afternoon", "misty morning"],
          required: true,
          defaultValue: "golden hour sunset",
        },
        {
          id: "f3",
          label: "Weather",
          key: "weather",
          type: "select",
          options: ["clear sky", "dramatic clouds", "fog and mist", "stormy", "rainbow after rain", "snow", "aurora borealis"],
          required: false,
          defaultValue: "dramatic clouds",
        },
        {
          id: "f4",
          label: "Art Style",
          key: "artStyle",
          type: "select",
          options: ["photorealistic", "watercolor", "oil painting", "concept art", "digital painting", "HDR photography"],
          required: true,
          defaultValue: "photorealistic",
        },
        {
          id: "f5",
          label: "Additional Details",
          key: "details",
          type: "textarea",
          placeholder: "e.g., with a lone tree, ancient ruins, reflections in water...",
          required: false,
        },
      ],
      exampleOutput:
        "Epic mountain range at golden hour sunset, dramatic clouds, photorealistic, ultra wide angle, HDR, stunning vista, 8k resolution, national geographic style",
      status: "active",
      usageCount: 987,
      featured: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "tmpl-3",
      title: "Cyberpunk City",
      description: "Generate futuristic cyberpunk urban scenes",
      type: "image",
      categoryId: "cat-4",
      tags: ["cyberpunk", "sci-fi", "urban", "neon"],
      fields: [
        {
          id: "f1",
          label: "Scene Type",
          key: "scene",
          type: "select",
          options: ["street level", "rooftop view", "underground market", "flying cars highway", "corporate tower", "slum district"],
          required: true,
          defaultValue: "street level",
        },
        {
          id: "f2",
          label: "Dominant Color",
          key: "color",
          type: "select",
          options: ["neon blue and purple", "red and orange", "green and cyan", "pink and magenta", "multicolor chaos"],
          required: true,
          defaultValue: "neon blue and purple",
        },
        {
          id: "f3",
          label: "Time",
          key: "time",
          type: "select",
          options: ["rainy night", "foggy night", "neon-lit dusk", "stormy night"],
          required: true,
          defaultValue: "rainy night",
        },
        {
          id: "f4",
          label: "Details",
          key: "details",
          type: "multiselect",
          options: ["holographic ads", "flying vehicles", "cybernetic people", "giant screens", "crowded streets", "police drones", "robot workers"],
          required: false,
        },
      ],
      exampleOutput:
        "Cyberpunk street level scene, neon blue and purple lights, rainy night, holographic advertisements, flying vehicles in background, highly detailed, cinematic, Blade Runner aesthetic, 8k",
      status: "active",
      usageCount: 2156,
      featured: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "tmpl-4",
      title: "Abstract Art",
      description: "Create mesmerizing abstract art prompts",
      type: "image",
      categoryId: "cat-3",
      tags: ["abstract", "art", "conceptual"],
      fields: [
        {
          id: "f1",
          label: "Style",
          key: "style",
          type: "select",
          options: ["fluid dynamics", "geometric", "fractal", "surrealist", "expressionist", "minimalist", "maximalist"],
          required: true,
          defaultValue: "fluid dynamics",
        },
        {
          id: "f2",
          label: "Color Palette",
          key: "palette",
          type: "select",
          options: ["warm sunset", "cool ocean", "monochromatic", "neon brights", "earth tones", "pastel dreams", "dark void"],
          required: true,
          defaultValue: "warm sunset",
        },
        {
          id: "f3",
          label: "Emotion/Concept",
          key: "concept",
          type: "text",
          placeholder: "e.g., chaos and order, solitude, transcendence",
          required: false,
        },
        {
          id: "f4",
          label: "Medium",
          key: "medium",
          type: "select",
          options: ["digital art", "oil on canvas", "watercolor", "generative art", "photography", "3D render"],
          required: true,
          defaultValue: "digital art",
        },
      ],
      exampleOutput:
        "Abstract fluid dynamics art, warm sunset palette, concept of chaos and order, digital art, highly detailed, 4k, award-winning",
      status: "active",
      usageCount: 743,
      featured: false,
      createdAt: now(),
      updatedAt: now(),
    },
    // Music templates
    {
      id: "tmpl-5",
      title: "Lo-Fi Chill Beat",
      description: "Build the perfect lo-fi chill music prompt",
      type: "music",
      categoryId: "cat-5",
      tags: ["lo-fi", "chill", "study", "ambient"],
      fields: [
        {
          id: "f1",
          label: "Mood",
          key: "mood",
          type: "select",
          options: ["relaxing", "nostalgic", "melancholic", "cozy", "dreamy", "focused", "sleepy"],
          required: true,
          defaultValue: "relaxing",
        },
        {
          id: "f2",
          label: "BPM Range",
          key: "bpm",
          type: "select",
          options: ["slow (60-70 BPM)", "medium (70-85 BPM)", "moderate (85-95 BPM)"],
          required: true,
          defaultValue: "slow (60-70 BPM)",
        },
        {
          id: "f3",
          label: "Key Instruments",
          key: "instruments",
          type: "multiselect",
          options: ["jazz piano", "vinyl crackle", "soft drums", "bass guitar", "flute", "guitar", "synthesizer pads"],
          required: true,
        },
        {
          id: "f4",
          label: "Setting/Vibe",
          key: "setting",
          type: "select",
          options: ["rainy cafe", "late night study", "Sunday morning", "autumn walk", "city lights at night"],
          required: false,
          defaultValue: "rainy cafe",
        },
        {
          id: "f5",
          label: "Duration",
          key: "duration",
          type: "select",
          options: ["30 seconds", "1 minute", "2 minutes", "3 minutes", "5 minutes"],
          required: false,
          defaultValue: "2 minutes",
        },
      ],
      exampleOutput:
        "Lo-fi hip hop, relaxing mood, 70 BPM, jazz piano melody, soft drum beats, vinyl crackle, bass guitar, rainy cafe atmosphere, warm and cozy, 2 minutes",
      status: "active",
      usageCount: 3421,
      featured: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "tmpl-6",
      title: "Synthwave Track",
      description: "Generate 80s-inspired synthwave music prompts",
      type: "music",
      categoryId: "cat-6",
      tags: ["synthwave", "80s", "retro", "electronic"],
      fields: [
        {
          id: "f1",
          label: "Sub-genre",
          key: "subgenre",
          type: "select",
          options: ["retrowave", "darksynth", "dreamwave", "outrun", "vaporwave", "chillwave"],
          required: true,
          defaultValue: "retrowave",
        },
        {
          id: "f2",
          label: "Energy Level",
          key: "energy",
          type: "select",
          options: ["high energy", "medium energy", "chill energy", "building tension", "euphoric"],
          required: true,
          defaultValue: "high energy",
        },
        {
          id: "f3",
          label: "Key Elements",
          key: "elements",
          type: "multiselect",
          options: ["arpeggiator", "lead synth", "bass synth", "drum machine", "gated reverb drums", "vocoder", "guitar riff"],
          required: true,
        },
        {
          id: "f4",
          label: "BPM",
          key: "bpm",
          type: "number",
          placeholder: "e.g., 120",
          required: false,
          defaultValue: "120",
        },
        {
          id: "f5",
          label: "Inspiration",
          key: "inspiration",
          type: "text",
          placeholder: "e.g., driving at night, neon city, Miami 1985",
          required: false,
        },
      ],
      exampleOutput:
        "Retrowave synthwave track, high energy, 120 BPM, analog synth arpeggiator, punchy drum machine, gated reverb, deep bass synth, driving at night through neon city vibes",
      status: "active",
      usageCount: 1876,
      featured: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "tmpl-7",
      title: "Epic Film Score",
      description: "Craft cinematic orchestral music prompts",
      type: "music",
      categoryId: "cat-7",
      tags: ["cinematic", "orchestral", "epic", "film"],
      fields: [
        {
          id: "f1",
          label: "Scene Type",
          key: "scene",
          type: "select",
          options: ["battle sequence", "emotional climax", "mysterious exploration", "triumphant victory", "tragic ending", "love scene", "chase scene", "revelation"],
          required: true,
          defaultValue: "battle sequence",
        },
        {
          id: "f2",
          label: "Orchestra Section",
          key: "orchestra",
          type: "multiselect",
          options: ["full strings", "brass fanfare", "woodwinds", "choir", "percussion", "piano solo", "solo violin"],
          required: true,
        },
        {
          id: "f3",
          label: "Tempo",
          key: "tempo",
          type: "select",
          options: ["slow and building", "moderate and tense", "fast and intense", "rubato (free tempo)", "steady march"],
          required: true,
          defaultValue: "slow and building",
        },
        {
          id: "f4",
          label: "Emotional Arc",
          key: "arc",
          type: "select",
          options: ["builds to climax", "fades to silence", "constant tension", "hope emerges from darkness", "heroic resolution"],
          required: false,
          defaultValue: "builds to climax",
        },
        {
          id: "f5",
          label: "Inspired By",
          key: "inspired",
          type: "text",
          placeholder: "e.g., Hans Zimmer, John Williams, Ennio Morricone",
          required: false,
        },
      ],
      exampleOutput:
        "Epic cinematic orchestral score, battle sequence, full strings and brass fanfare, percussion, builds to climax, fast and intense, Hans Zimmer inspired, 4K audio quality",
      status: "active",
      usageCount: 956,
      featured: false,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "tmpl-8",
      title: "Nature Soundscape",
      description: "Create immersive natural soundscape prompts",
      type: "music",
      categoryId: "cat-8",
      tags: ["nature", "ambient", "meditation", "sleep"],
      fields: [
        {
          id: "f1",
          label: "Environment",
          key: "environment",
          type: "select",
          options: ["rainforest", "ocean shore", "mountain stream", "thunderstorm", "campfire", "meadow", "underwater", "arctic wind"],
          required: true,
          defaultValue: "rainforest",
        },
        {
          id: "f2",
          label: "Primary Sound",
          key: "primary",
          type: "select",
          options: ["rain", "flowing water", "wind", "thunder", "birds", "crickets", "waves", "fire crackling"],
          required: true,
          defaultValue: "rain",
        },
        {
          id: "f3",
          label: "Secondary Elements",
          key: "secondary",
          type: "multiselect",
          options: ["distant thunder", "occasional bird calls", "light breeze", "leaves rustling", "water dripping", "owl hoot", "frog chorus"],
          required: false,
        },
        {
          id: "f4",
          label: "Purpose",
          key: "purpose",
          type: "select",
          options: ["deep sleep", "meditation", "focus work", "stress relief", "background atmosphere"],
          required: false,
          defaultValue: "deep sleep",
        },
      ],
      exampleOutput:
        "Immersive rainforest soundscape, heavy rain falling, distant thunder rumbles, occasional bird calls, leaves rustling in breeze, perfect for deep sleep and meditation, loopable, high fidelity",
      status: "active",
      usageCount: 4127,
      featured: true,
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const collections: PromptCollection[] = [
    {
      id: "col-1", name: "Favorites", description: "Starred prompts", icon: "⭐", color: "#f59e0b",
      type: "smart", query: "starred", promptIds: [], sortOrder: 1, createdAt: now(), updatedAt: now(),
    },
    {
      id: "col-2", name: "Image Prompts", description: "All image generation prompts", icon: "🖼️", color: "#00d4ff",
      type: "smart", query: "type:image", promptIds: [], sortOrder: 2, createdAt: now(), updatedAt: now(),
    },
    {
      id: "col-3", name: "Music Prompts", description: "All music generation prompts", icon: "🎵", color: "#f472b6",
      type: "smart", query: "type:music", promptIds: [], sortOrder: 3, createdAt: now(), updatedAt: now(),
    },
    {
      id: "col-4", name: "My Showcase", description: "Hand-picked best prompts", icon: "✨", color: "#a855f7",
      type: "manual", query: "", promptIds: [], sortOrder: 4, createdAt: now(), updatedAt: now(),
    },
  ];

  return {
    categories,
    templates,
    savedPrompts: [],
    collections,
    adminUsers: [
      {
        id: "admin-1",
        email: "admin@futuroevolab.com",
        passwordHash,
        name: "Super Admin",
        role: "super_admin",
        createdAt: now(),
        lastLoginAt: null,
      },
    ],
    settings: {
      siteName: "FuturEvoLab Prompt Studio",
      siteDescription: "AI Image & Music Prompt Generator — Evolve Your Creativity",
      adminEmail: "admin@futuroevolab.com",
      allowPublicSave: true,
      maxPromptsPerSession: 50,
      featuredTemplatesCount: 6,
      maintenanceMode: false,
      analyticsEnabled: true,
    },
  };
}
