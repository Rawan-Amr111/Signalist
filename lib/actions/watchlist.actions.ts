"use server";

import { connectToDatabase } from "@/database/mongoose";
import Watchlist from "@/database/models/watchlist.model";
import { User } from "better-auth";
import { auth } from "../better-auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const getWatchlistSymbolsByEmail = async (
  email: string
): Promise<string[]> => {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not found.");
    }

    // Find the user by their email address in the collection used by Better Auth
    const user = await db.collection<User>("user").findOne({ email });

    if (!user) {
      return [];
    }

    const userId = (user.id as string) || user._id.toString() || "";

    // Find all watchlist items for the user's ID and select only the 'symbol' field.
    // Using .lean() for performance as we only need plain JavaScript objects.
    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();

    // Map the results to an array of strings
    return items.map((item) => String(item.symbol));
  } catch (error) {
    console.error("Failed to get watchlist symbols:", error);
    // Fail gracefully by returning an empty array
    return [];
  }
};

export const toggleWatchListStock = async (symbol: string, company: string) => {
  await connectToDatabase();
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  if (!userId) throw new Error("User not found");
  try {
    const watchlistItem = await Watchlist.findOne({ userId, symbol });
    if (watchlistItem) {
      await Watchlist.deleteOne({ _id: watchlistItem._id });
    } else {
      await Watchlist.create({ userId, symbol, company });
    }
    revalidatePath("/watchlist");
    revalidatePath(`/stocks/${symbol}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to toggle watchlist:", error);
    return { success: false, error: "Something went wrong" };
  }
};
