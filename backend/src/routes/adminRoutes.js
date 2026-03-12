import express from "express";
import { getUsers, changeUserRole } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", getUsers)

router.patch("/users/:id/role", changeUserRole)

export default router