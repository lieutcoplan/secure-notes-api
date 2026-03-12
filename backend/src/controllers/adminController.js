import {prisma} from '../config/db.js';
import { Role } from "@prisma/client";

const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, name: true },
      orderBy: { email: "asc" },
      take: 50,
    })

    res.status(200).json(users)
  } catch (err) {
    next(err);
  }
}

const changeUserRole = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const {role} = req.body;

    if (!role || !Object.values(Role).includes(role)) {
      return res.status(400).json({error: "Invalid role"});
    }

    if (req.session.userId === userId && role !== "ADMIN") {
      return res.status(400).json({
        error: "You cannot remove your own admin role"
      });
    }

    const updatedUser = await prisma.user.update({
      where : {id: userId},
      data: {role},
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    res.json({
      message: "User role updated",
      user: updatedUser
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        error: "User not found"
      });
    }

    next(err)
  }
}

export {getUsers, changeUserRole}