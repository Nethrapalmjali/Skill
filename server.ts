import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "db.json");
const JWT_SECRET = "skill-connect-secret-key";

function readDB() {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
}

function writeDB(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // User Registration
  app.post("/api/auth/register", async (req, res) => {
    const { email, password, name } = req.body;
    const db = readDB();
    
    if (db.users.find((u: any) => u.email === email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      skills: [],
      education: "",
      interests: [],
      assessments: []
    };

    db.users.push(newUser);
    writeDB(db);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET);
    res.json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name } });
  });

  // User Login
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const db = readDB();
    const user = db.users.find((u: any) => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  });

  // Get User Profile
  app.get("/api/user/profile", authenticateToken, (req: any, res) => {
    const db = readDB();
    const user = db.users.find((u: any) => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const { password, ...userProfile } = user;
    res.json(userProfile);
  });

  // Update User Profile
  app.put("/api/user/profile", authenticateToken, (req: any, res) => {
    const db = readDB();
    const userIndex = db.users.findIndex((u: any) => u.id === req.user.id);
    if (userIndex === -1) return res.status(404).json({ message: "User not found" });

    // Only allow whitelisted fields so clients cannot overwrite id, email or password.
    const allowed = ["name", "skills", "education", "interests", "assessments"];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in (req.body ?? {})) updates[key] = req.body[key];
    }

    db.users[userIndex] = { ...db.users[userIndex], ...updates };
    writeDB(db);
    res.json({ message: "Profile updated successfully" });
  });

  // Get Jobs
  app.get("/api/jobs", (req, res) => {
    const db = readDB();
    res.json(db.jobs);
  });

  // Get Courses
  app.get("/api/courses", (req, res) => {
    const db = readDB();
    res.json(db.courses);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
