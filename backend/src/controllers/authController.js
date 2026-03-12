import {prisma} from '../config/db.js'; 
import bcrypt from "bcryptjs";

// Register
const register = async (req, res) => {
  const {name, email, password} = req.body;
  
  // Check if user already exists
  const userExists = await prisma.user.findUnique({
    where: {email:email}
  });

  if (userExists) {
    return res.status(400).json({error: "Email is already used"})
  };
  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create User
  const user = await prisma.user.create({
    data: {
      name, 
      email, 
      passwordHash,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
      },
    },
  });
};

// Login
const login = async (req, res) => {
  const {email, password} = req.body;

  // Check if user email exists in the table
  const user = await prisma.user.findUnique({
    where: {email: email},
  })

  if (!user) {
    return res.status(401).json({error: "Invalid email or password"});
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({error: "Invalid email or password"});
  }

  req.session.userId = user.id;
  req.session.role = user.role;

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        email: email,
      },
    },
  });
};

// Logout
const destroySession = (req) => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const logout = async (req, res, next) => {
  try {
    await destroySession(req);

    res.clearCookie("sid", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });

  } catch (err) {
    next(err);
  }
};

export {register, login, logout};