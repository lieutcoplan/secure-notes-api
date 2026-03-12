import express from "express";
import { createNote,listNote, getNote, modifyNote, deleteNote} from "../controllers/notesController.js";

const router = express.Router();

router.post("", createNote);

router.get("", listNote)

router.get("/:id", getNote)

router.put("/:id", modifyNote)

router.delete("/:id", deleteNote)

export default router;
