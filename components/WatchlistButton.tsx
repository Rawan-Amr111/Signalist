"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { toggleWatchListStock } from "@/lib/actions/watchlist.actions";
import { useRouter } from "next/navigation";
interface WatchlistButtonProps {
  symbol: string;
  isInitiallyWatched: boolean;
  company: string;
}

export default function WatchlistButton({
  symbol,
  isInitiallyWatched,
  company,
}: WatchlistButtonProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(isInitiallyWatched);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleToggleWatchlist = () => {
    const newState = !isInWatchlist;
    setIsInWatchlist(newState);

    startTransition(async () => {
      try {
        await toggleWatchListStock(symbol, company);
        router.refresh();
      } catch (e) {
        console.log(e);
        setIsInWatchlist(!newState);
      }
    });
  };

  return (
    <Button
      onClick={handleToggleWatchlist}
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      disabled={isPending}
    >
      <Star
        size={18}
        className={
          isInWatchlist
            ? "fill-yellow-400 text-yellow-500"
            : "text-muted-foreground"
        }
      />
      <span>
        {isPending
          ? "Loading..."
          : isInWatchlist
          ? "Remove from Watchlist"
          : "Add to Watchlist"}
      </span>
    </Button>
  );
}
