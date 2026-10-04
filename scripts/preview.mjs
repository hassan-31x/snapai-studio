// Isolated local preview. Never connects to DATABASE_URL from .env.
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { spawn, execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
const replica = await MongoMemoryReplSet.create({
  replSet: { count: 1, storageEngine: "wiredTiger" },
});
const env = {
  ...process.env,
  DATABASE_URL: replica.getUri("stillframe_preview"),
  NODE_ENV: "development",
  AUTH_SECRET: randomBytes(32).toString("hex"),
  BASE_URL: "http://localhost:3000",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  GOOGLE_CLIENT_ID: "",
  GOOGLE_CLIENT_SECRET: "",
  RESEND_API_KEY: "",
  OPENROUTER_API_KEY: "",
  CLOUDINARY_CLOUD_NAME: "",
  CLOUDINARY_API_KEY: "",
  CLOUDINARY_API_SECRET: "",
};
execFileSync("node", ["node_modules/prisma/build/index.js", "db", "push"], {
  env,
  stdio: "pipe",
});
const db = new PrismaClient({ datasources: { db: { url: env.DATABASE_URL } } });
const user = await db.user.create({
  data: {
    email: "preview@example.test",
    name: "Alex",
    emailVerified: new Date(),
    password: await bcrypt.hash("PreviewPass123!", 12),
    tokens: 10,
  },
});
const project = await db.generation.create({
  data: {
    userId: user.id,
    type: "PRODUCT_SHOT",
    status: "COMPLETED",
    prompt: "Soft daylight on a stone surface",
    scene: "studio",
    aspectRatio: "1024x1024",
    numberOfImages: 1,
  },
});
await db.productImage.create({
  data: {
    userId: user.id,
    generationId: project.id,
    prompt: project.prompt,
    scene: "studio",
    aspectRatio: "1024x1024",
    imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    imagePublicId: "",
    type: "Original",
  },
});
await db.$disconnect();
console.log("Isolated preview account: preview@example.test / PreviewPass123!");
console.log(
  "All data is temporary. External generation and email delivery are disabled.",
);
const server = spawn(
  "node",
  ["node_modules/next/dist/bin/next", "dev", "--port", "3000"],
  { env, stdio: "inherit" },
);
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  server.kill("SIGTERM");
  await replica.stop();
  process.exit(0);
}
process.on("SIGINT", close);
process.on("SIGTERM", close);
server.on("exit", close);
