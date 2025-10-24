"use client";
import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandMenu } from "./Search";

const NavItems = ({
  initialStocks,
}: {
  initialStocks: StockWithWatchlistStatus[];
}) => {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };
  return (
    <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap10 font-medium">
      {NAV_ITEMS.map((item) => {
        if (item.href === "/search")
          return (
            <li key="search-trigger">
              <CommandMenu
                renderAs="text"
                label="Search"
                initialStocks={initialStocks}
              />
            </li>
          );

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`hover:text-yellow-500 transition-colors ${
                isActive(item.href) ? "text-gray-100" : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
