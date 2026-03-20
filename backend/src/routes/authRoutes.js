import express from "express";
import {register, login, logout} from "../controllers/authController.js"
import { rateLimitBy } from "../middleware/rateLimitMiddleware.js"; 
import { loginIpLimiter } from "../rateLimit/limiters.js";


const router = express.Router();

router.post("/register", register);

router.post("/login", rateLimitBy(loginIpLimiter, (req) => req.ip), login);

router.post("/logout", logout)

export default router;