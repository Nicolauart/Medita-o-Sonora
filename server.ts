import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Inform Express it is behind a proxy
  app.set("trust proxy", 1);

  // ─── Middlewares ───────────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allow CDN for icons/fonts in dev
    })
  );
  app.use(cors({ origin: "*" }));
  app.use(express.json());

  // Rate limiter
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
    message: { error: "Muitas requisições. Tente novamente em 15 minutos." },
  });
  app.use("/api/", apiLimiter);

  // ─── In-Memory Data ────────────────────────────────
  const playlists = [
    {
      id: 1,
      title: "Vácuo Profundo",
      description: "Uma imersão completa no vácuo sonoro para silenciar a mente.",
      category: "sono",
      duration: "8h",
      tracks: 12,
      cover: "https://picsum.photos/seed/deepspace/600/800",
      featured: true,
    },
    {
      id: 2,
      title: "Éter Interior",
      description: "Frequências transcendentais para elevar a consciência antes do sono.",
      category: "meditacao",
      duration: "3h",
      tracks: 8,
      cover: "https://picsum.photos/seed/nebula/600/800",
      featured: true,
    },
    {
      id: 3,
      title: "Nebulosa do Descanso",
      description: "Sons etéreos de nebulosas distantes focados no relaxamento profundo.",
      category: "sonoro",
      duration: "6h",
      tracks: 15,
      cover: "https://picsum.photos/seed/galaxy/600/800",
      featured: false,
    },
    {
      id: 4,
      title: "Ressonância Lunar",
      description: "Melodias lunares captadas em pureza absoluta para paz mental.",
      category: "sono",
      duration: "4h",
      tracks: 10,
      cover: "https://picsum.photos/seed/moonlight/600/800",
      featured: true,
    },
    {
      id: 5,
      title: "Sussurros de Orion",
      description: "Ambientes sonoros inspirados na constelação de Oríon.",
      category: "sonoro",
      duration: "5h",
      tracks: 14,
      cover: "https://picsum.photos/seed/stars/600/800",
      featured: false,
    },
    {
      id: 6,
      title: "Frequência 432Hz",
      description: "A frequência da Terra para cura e equilíbrio energético.",
      category: "sonoro",
      duration: "7h",
      tracks: 20,
      cover: "https://picsum.photos/seed/frequency/600/800",
      featured: false,
    },
  ];

  // ─── API Routes ────────────────────────────────────
  app.get("/api/playlists", (req, res) => {
    const { category, featured, limit } = req.query;
    let result = [...playlists];

    if (category && category !== "all") result = result.filter((p) => p.category === category);
    if (featured === "true") result = result.filter((p) => p.featured);
    if (limit) result = result.slice(0, parseInt(limit as string));

    res.json({ success: true, total: result.length, data: result });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ─── Vite Middleware ──────────────────────────────
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
