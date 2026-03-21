import {prisma} from '../config/db.js'; 

async function createNote(req, res, next) {
  try {
    const {title, content} = req.body;

    // Filters
    if (!title || !content) {
      return res.status(400).json({error:"Missing fields"})
    };

    if (title.length > 100) {
      return res.status(400).json({error: "Title too long"})
    };

    if (content.length > 5000) {
      return res.status(400).json({error: "Content too long"})
    };

    if (typeof title !== "string") {
      return res.status(400).json({error: "Invalid title"})
    };

    if (typeof content !== "string") {
      return res.status(400).json({error: "Invalid content"})
    };

    // Note creation
    const note = await prisma.note.create({
      data: {
        title,
        content,
        owner: {
          connect: {
            id: req.session.userId
          }
        }
      }
    });
  
    res.status(201).json({
      status: "success",
      data: note
    })
  } catch (err) {
    next(err)
  }
}

async function listNote(req, res, next) {
  try {
    const userId = req.session.userId;

    const notes = await prisma.note.findMany({
      where: {
        ownerId: userId
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    });
    res.json(notes)
  } catch (err) {
    next(err)
  }
}

async function getNote(req, res, next) {
  try {
    const noteId = Number(req.params.id);

    if (!Number.isInteger(noteId) || noteId <= 0) {
      return res.status(400).json({error: "Invalid note id"})
    };

    const userId = req.session.userId;

    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        ownerId: userId
        }
    });

    if (!note) return res.status(404).json({error: "Not found"});

    res.json(note);

  } catch (err) {
    next(err)
  }
}

async function modifyNote(req, res, next) {
  try {
    const noteId = Number(req.params.id);

    if (!Number.isInteger(noteId) || noteId <= 0) {
      return res.status(400).json({error: "Invalid note id"})
    };

    const userId = req.session.userId;
    const {title, content} = req.body;

    if (!title || !content) {
      return res.status(400).json({error:"Missing fields"})
    };

    if (title.length > 100) {
      return res.status(400).json({error: "Title too long"})
    };

    if (content.length > 5000) {
      return res.status(400).json({error: "Content too long"})
    };

    if (typeof title !== "string") {
      return res.status(400).json({error: "Invalid title"})
    };

    if (typeof content !== "string") {
      return res.status(400).json({error: "Invalid content"})
    };
    
    const updatedNote = await prisma.note.updateMany({
      where: {
        id : noteId,
        ownerId: userId
      },
      data: {
        title: title,
        content: content
      }
    });
    console.log(updatedNote);

    if (updatedNote.count === 0) {
      return res.status(404).json({error : "Note not found"})
    }

    res.json({message: "Note updated successfully"})
    
  } catch (err) {
    next(err)
  }
}

async function deleteNote(req, res, next) {
  try {
    const noteId = Number(req.params.id);

    if (!Number.isInteger(noteId) || noteId <= 0) {
      return res.status(400).json({error: "Invalid note id"})
    }

    const userId = req.session.userId

    const deletedNote = await prisma.note.deleteMany({
      where: {
        id: noteId,
        ownerId: userId
      }
    })
    if (deletedNote.count === 0) {
      return res.status(404).json({error: "Note not found"})
    }
    res.status(204).send();
  } catch (err) {
    next(err)
  }
}

export {createNote, listNote, getNote, modifyNote, deleteNote}