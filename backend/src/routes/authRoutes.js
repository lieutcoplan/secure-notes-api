import express from "express";
import {register, login, logout} from "../controllers/authController.js"
import { validateRequest } from "../middleware/validateRequest.js";
import { loginSchema , registerSchema} from "../validators/authValidator.js";


const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);

router.post("/login", validateRequest(loginSchema), login);

router.post("/logout", logout)

export default router;