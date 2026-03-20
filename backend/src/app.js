import express from "express"
import authRoutes from "./routes/authRoutes.js"
import notesRoutes from "./routes/notesRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import session from "express-session"
import {requireAuth, redirectIfAuthenticated} from "./middleware/authMiddleware.js";
import {errorMiddleware} from "./middleware/errorMiddleware.js";
import {requireRole} from "./middleware/roleMiddleware.js";
import path from "path";
import { ensureCsrfToken, verifyCsrfToken, verifyOrigin } from "./middleware/csrfMiddleware.js";
import { RedisStore } from "connect-redis";
import { redisClient } from "./config/redis.js"
import { rateLimitBy } from "./middleware/rateLimitMiddleware.js"
import { globalLimiter } from "./rateLimit/limiters.js"

const app = express();

// Include frontend
const __dirname = import.meta.dirname
app.use("/styles", express.static(path.join(__dirname, 
  "../../frontend/src/styles"))
);
app.use("/assets", express.static(path.join(__dirname,
  "../../frontend/src/assets"))
);
app.use("/scripts", express.static(path.join(__dirname, 
  "../../frontend/src/scripts"))
);


if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
};

// Redis store setup
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "notesapp:"
});

// Session cookie
app.use(
  session({
    store: redisStore,
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// Body parsing middlewares
app.use(express.json());
app.use(ensureCsrfToken);
app.use("/api",verifyOrigin, verifyCsrfToken);
app.use(rateLimitBy(globalLimiter, (req) => req.ip))

// API Routes
app.get("/api/csrf-token", (req, res) => {
  res.json({csrfToken: req.session.csrfToken})
});

app.get("/api/me", requireAuth, async (req, res) => {
  // req.session.userId available
  res.json({ userId: req.session.userId, role: req.session.role });
});

app.use("/api/auth", authRoutes);

app.use("/api/notes", requireAuth, notesRoutes);

app.use("/api/admin", requireAuth, requireRole("ADMIN"), adminRoutes);

// Frontend Routes
app.get("/login", redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/src/pages/auth/login.html"))
});

app.get("/", (req, res) => {
  res.redirect("/login")
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/src/pages/auth/register.html"))
});

app.get("/notes", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/src/pages/notes/notes.html"))
});

// Error middleware
app.use(errorMiddleware);

export default app;