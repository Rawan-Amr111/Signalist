import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import Watchlist, { IWatchlistItem } from "@/database/models/watchlist.model";
import { connectToDatabase } from "@/database/mongoose";
import { getStockDetails } from "@/lib/actions/finnhub.actions";
import WatchListTable from "@/components/WatchListTable";

interface ILiveStockData {
  price: number;
  changePercent: number;
  marketCap: number;
  peRatio: number;
}
type MergedWatchlistItem = IWatchlistItem & ILiveStockData;

export default async function WatchlistPage() {
  await connectToDatabase();
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  let mergedData: MergedWatchlistItem[] = [];

  if (userId) {
    const dbItems: IWatchlistItem[] = await Watchlist.find({ userId });

    if (dbItems && dbItems.length > 0) {
      const liveDataPromises = dbItems.map(async (item) => {
        const liveData = await getStockDetails(item.symbol);
        const plainItem = JSON.parse(JSON.stringify(item));
        return {
          ...plainItem,
          price: liveData.price,
          changePercent: liveData.changePercent,
          marketCap: liveData.marketCap,
          peRatio: liveData.peRatio,
        };
      });
      mergedData = await Promise.all(liveDataPromises);
    }
  }
  return <WatchListTable initialData={mergedData} />;
}
