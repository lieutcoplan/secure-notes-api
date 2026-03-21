import {prisma} from '../config/db.js'; 
import bcrypt from "bcryptjs";
import {loginFailByIp, loginFailByEmailAndIp} from '../rateLimit/limiters.js'

// Register
async function register(req, res) {
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
async function login(req, res, next) {
  const email = String(req.body.email || '').toLowerCase().trim();
  const ip = req.ip;
  const emailIpKey = `${email}_${ip}`;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json({error: "Missing email or password"})
  }

  // Rate Limiting
  const [ipState, emailIpState] = await Promise.all([
    loginFailByIp.get(ip),
    loginFailByEmailAndIp.get(emailIpKey),
  ]);

  const isBlocked = 
    (ipState && ipState.consumedPoints > 10) || 
    (emailIpState && emailIpState.consumedPoints > 5);

  if (isBlocked) {
    const msBeforeNext = Math.max(
      ipState?.msBeforeNext ?? 0,
      emailIpState?.msBeforeNext ?? 0
    );
    const retryAfter = Math.max(1, Math.ceil(msBeforeNext / 1000));
    res.set("Retry-After", String(retryAfter));
    return res.status(429).json({error : "Too many login attemps"})
  };

  // Check if user email exists in the table
  const user = await prisma.user.findUnique({
    where: {email: email},
  })

  if (!user) {
    await Promise.all([
        loginFailByIp.consume(ip),
        loginFailByEmailAndIp.consume(emailIpKey),
    ]);
    return res.status(401).json({error: "Invalid email or password"});
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    await Promise.all([
        loginFailByIp.consume(ip),
        loginFailByEmailAndIp.consume(emailIpKey),
    ]);
    return res.status(401).json({error: "Invalid email or password"});
  }

  // Success

  await Promise.all([
    loginFailByIp.delete(ip),
    loginFailByEmailAndIp.delete(emailIpKey),
  ])
  
  req.session.regenerate((err) => {
    if (err) {
      return next(err)
    }
  
    req.session.userId = user.id;
    req.session.role = user.role;

    res.status(200).json({
      status: "success",
      message: "Login successful"
    });
  })
};

// Logout
function destroySession(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

async function logout(req, res, next) {
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
      message: "Logout successful",
    });

  } catch (err) {
    next(err);
  }
};

export {register, login, logout};