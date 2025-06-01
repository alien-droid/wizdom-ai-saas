"use client";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";

const SearchBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("topic") || "";

  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const debounceFn = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "topic",
          value: searchQuery,
        });
        router.push(newUrl, {
          scroll: false,
        });
      } else {
        if (pathname === "/partners") {
          // If the search query is empty, reset the search params
          const newUrl = removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["topic"],
          });
          router.push(newUrl, {
            scroll: false,
          });
        }
      }
    }, 500);
    return () => clearTimeout(debounceFn);
  }, [searchQuery, router, searchParams, pathname]);

  return (
    <div className="relative border border-black rounded-lg flex items-center gap-2 px-2 py-1 h-fit">
      <Image src="/icons/search.svg" alt="search" width={16} height={16} />
      <input
        placeholder="Search Partners ..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="outline-none"
      />
    </div>
  );
};

export default SearchBar;
