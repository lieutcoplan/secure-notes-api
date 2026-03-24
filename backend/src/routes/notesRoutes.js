import express from "express";
import { createNote,listNote, getNote, modifyNote, deleteNote} from "../controllers/notesController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { noteSchema } from "../validators/notesValidator.js";

const router = express.Router();

router.post("", validateRequest(noteSchema), createNote);

router.get("", listNote)

router.get("/:id", getNote)

router.put("/:id", validateRequest(noteSchema), modifyNote)

router.delete("/:id", deleteNote)

export default router;
