import app from './app.js'
import {config} from "dotenv"
import {connectDB, disconnectDB} from "./config/db.js"
import { disconnect } from 'node:cluster';

config();
connectDB();

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`)
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err)
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle caught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});