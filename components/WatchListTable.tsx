"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import WatchlistButton from "@/components/WatchlistButton";
import { IWatchlistItem } from "@/database/models/watchlist.model";

import { WATCHLIST_TABLE_HEADER } from "@/lib/constants";
interface WatchListTableProps {
  initialData: MergedWatchlistItem[];
}
interface ILiveStockData {
  price: number;
  changePercent: number;
  marketCap: number;
  peRatio: number;
}
type MergedWatchlistItem = IWatchlistItem & ILiveStockData;

const WatchListTable = ({ initialData }: WatchListTableProps) => {
  const data = Array.isArray(initialData) ? initialData : [];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px]"></TableHead>
          {WATCHLIST_TABLE_HEADER.map((header) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.symbol}>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <WatchlistButton
                symbol={item.symbol}
                company={item.company}
                isInitiallyWatched={true}
              />
            </TableCell>
            <TableCell>{item.company}</TableCell>
            <TableCell className="font-medium text-yellow-500">
              {item.symbol}
            </TableCell>
            <TableCell>${item.price.toFixed(2)}</TableCell>
            <TableCell
              className={
                item.changePercent >= 0 ? "text-green-500" : "text-red-500"
              }
            >
              {item.changePercent.toFixed(2)}%
            </TableCell>
            <TableCell>{(item.marketCap / 1000).toFixed(2)}T</TableCell>
            <TableCell>{item.peRatio.toFixed(1)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default WatchListTable;
