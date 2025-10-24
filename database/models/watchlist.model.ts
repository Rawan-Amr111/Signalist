import { Document, Schema, model, models } from "mongoose";

/**
 * Interface representing a single item in a user's watchlist.
 */
export interface IWatchlistItem extends Document {
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
}

const WatchlistSchema = new Schema<IWatchlistItem>(
  {
    userId: {
      type: String,
      required: true,
      index: true, // Index for faster queries by user
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true, // Automatically convert symbol to uppercase
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    addedAt: {
      type: Date,
      default: Date.now, // Set the date when the item is added
    },
  },
  { timestamps: false }
);

// Compound index to ensure a user cannot add the same symbol more than once.
// This enforces data integrity at the database level.
WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

/**
 * Mongoose model for the Watchlist collection.
 *
 * This pattern prevents Mongoose from recompiling the model on every hot-reload
 * in a development environment, which would otherwise cause errors.
 */
const Watchlist =
  models?.Watchlist || model<IWatchlistItem>("Watchlist", WatchlistSchema);

export default Watchlist;
