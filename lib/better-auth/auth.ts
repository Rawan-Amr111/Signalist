import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";
let authInstance: ReturnType<typeof betterAuth> | null = null;
export const getAuth = async () => {
  console.log(
    "ENV TEST:",
    process.env.BETTER_AUTH_SECRET,
    process.env.BETTER_AUTH_URL
  );

  if (authInstance) return authInstance;
  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) throw new Error("No database connection found");
  console.log("Database connection found");
  authInstance = betterAuth({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    database: mongodbAdapter(db as any),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 120,
      autoSignIn: true,
    },
    plugins: [nextCookies()],
  });

  return authInstance;
};

export const auth = await getAuth();
