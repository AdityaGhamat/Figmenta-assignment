import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(bodyParser.json());

interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags?: string[];
  createdAt: string;
}

let bookmarks: Bookmark[] = [
  {
    id: "1",
    url: "https://react.dev",
    title: "React Docs",
    description: "Official React documentation",
    tags: ["frontend", "react"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    url: "https://expressjs.com",
    title: "Express",
    description: "Node framework",
    tags: ["backend", "node"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    url: "https://tailwindcss.com",
    title: "Tailwind CSS",
    description: "Utility-first CSS framework",
    tags: ["css", "frontend"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    url: "https://google.com",
    title: "Google",
    description: "Search engine",
    tags: ["search"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    url: "https://github.com",
    title: "GitHub",
    description: "Code hosting",
    tags: ["git"],
    createdAt: new Date().toISOString(),
  },
];

app.get("/bookmarks", (req: Request, res: Response) => {
  const { tag, search } = req.query;
  let results = [...bookmarks];

  if (tag && typeof tag === "string") {
    results = results.filter((b) => b.tags?.includes(tag.toLowerCase()));
  }

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    results = results.filter(
      (b) =>
        b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q)
    );
  }

  res.json(results);
});

// POST
app.post("/bookmarks", (req: Request, res: Response): any => {
  const { url, title, description, tags } = req.body;

  if (!url || !title) {
    return res.status(400).json({ error: "URL and Title are required" });
  }

  const newBookmark: Bookmark = {
    id: Math.random().toString(36).substr(2, 9),
    url,
    title,
    description: description || "",
    tags: tags ? (tags as string[]).map((t) => t.toLowerCase()) : [],
    createdAt: new Date().toISOString(),
  };

  bookmarks.unshift(newBookmark);
  res.status(201).json(newBookmark);
});

// PUT
app.put("/bookmarks/:id", (req: Request, res: Response): any => {
  const { id } = req.params;
  const index = bookmarks.findIndex((b) => b.id === id);

  if (index === -1) return res.status(404).json({ error: "Not found" });

  const { url, title, description, tags } = req.body;

  if (url) bookmarks[index].url = url;
  if (title) bookmarks[index].title = title;
  if (description !== undefined) bookmarks[index].description = description;
  if (tags)
    bookmarks[index].tags = (tags as string[]).map((t) => t.toLowerCase());

  res.json(bookmarks[index]);
});

// DELETE
app.delete("/bookmarks/:id", (req: Request, res: Response): any => {
  const { id } = req.params;
  const initialLen = bookmarks.length;
  bookmarks = bookmarks.filter((b) => b.id !== id);

  if (bookmarks.length === initialLen)
    return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
