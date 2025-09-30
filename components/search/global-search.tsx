"use client";

import { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { setSearchQuery, addRecentSearch } from "@/lib/store/slices/uiSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Clock, FileText, MapPin, User, Hash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SearchResult {
  id: string;
  type: "claim" | "document" | "user" | "location";
  title: string;
  subtitle: string;
  url: string;
  metadata?: Record<string, unknown>;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const dispatch = useAppDispatch();
  const { searchQuery, recentSearches } = useAppSelector((state) => state.ui);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search function - replace with actual API call
  const performSearch = async (
    searchQuery: string
  ): Promise<SearchResult[]> => {
    if (!searchQuery.trim()) return [];

    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock results
    const mockResults: SearchResult[] = [
      {
        id: "1",
        type: "claim" as const,
        title: `Claim #FRA-2024-001`,
        subtitle: "Rajesh Kumar - Kanha Village, Mandla",
        url: "/claims/1",
        metadata: { status: "APPROVED", area: "2.5 hectares" },
      },
      {
        id: "2",
        type: "document" as const,
        title: "Identity Proof - Aadhaar Card",
        subtitle: "Uploaded 2 days ago",
        url: "/documents/2",
        metadata: { type: "PDF", size: "1.2 MB" },
      },
      {
        id: "3",
        type: "user" as const,
        title: "Priya Devi",
        subtitle: "Forest Official - Bandhavgarh Division",
        url: "/users/3",
        metadata: { role: "OFFICIAL", lastActive: "1 hour ago" },
      },
      {
        id: "4",
        type: "location" as const,
        title: "Pench National Park",
        subtitle: "Protected Area - Madhya Pradesh",
        url: "/map?location=pench",
        metadata: { type: "Protected Area", area: "758 km²" },
      },
    ].filter(
      (result) =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setIsLoading(false);
    return mockResults;
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query) {
        performSearch(query).then(setResults);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      dispatch(addRecentSearch(searchQuery));
      dispatch(setSearchQuery(searchQuery));
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    dispatch(addRecentSearch(result.title));
    setIsOpen(false);
    router.push(result.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleResultClick(results[selectedIndex]);
      } else if (query) {
        handleSearch(query);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "claim":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "document":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "user":
        return <User className="h-4 w-4 text-purple-500" />;
      case "location":
        return <MapPin className="h-4 w-4 text-red-500" />;
      default:
        return <Hash className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (result: SearchResult) => {
    if (result.type === "claim" && result.metadata?.status) {
      const status = result.metadata.status as string;
      const colors = {
        APPROVED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
        UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
        SUBMITTED: "bg-blue-100 text-blue-800",
      };
      return (
        <Badge
          className={`text-xs ${
            colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
          }`}
        >
          {status.replace("_", " ")}
        </Badge>
      );
    }
    return null;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            placeholder="Search claims, documents, users..."
            className="pl-10 w-64 bg-gray-50 border-gray-200 focus:bg-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => {
                setQuery("");
                setResults([]);
                setSelectedIndex(-1);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <div className="max-h-96">
          {query ? (
            <div>
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Search Results</span>
                  {isLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  )}
                </div>
              </div>
              <ScrollArea className="max-h-80">
                {results.length > 0 ? (
                  <div className="py-2">
                    {results.map((result, index) => (
                      <div
                        key={result.id}
                        className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                          index === selectedIndex ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="flex items-center space-x-3">
                          {getResultIcon(result.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm text-gray-900 truncate">
                                {result.title}
                              </p>
                              {getStatusBadge(result)}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {result.subtitle}
                            </p>
                            {result.metadata && (
                              <div className="flex items-center space-x-2 mt-1">
                                {typeof result.metadata.area === "string" && (
                                  <span className="text-xs text-gray-500">
                                    {result.metadata.area}
                                  </span>
                                )}
                                {typeof result.metadata.type === "string" && (
                                  <span className="text-xs text-gray-500">
                                    {result.metadata.type}
                                  </span>
                                )}
                                {typeof result.metadata.size === "string" && (
                                  <span className="text-xs text-gray-500">
                                    {result.metadata.size}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !isLoading ? (
                  <div className="p-8 text-center text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No results found</p>
                    <p className="text-sm">Try different keywords</p>
                  </div>
                ) : null}
              </ScrollArea>
              {query && (
                <>
                  <Separator />
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-600"
                      onClick={() => handleSearch(query)}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search for &quot;{query}&quot;
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div>
              <div className="p-3 border-b">
                <span className="text-sm font-medium">Recent Searches</span>
              </div>
              <ScrollArea className="max-h-60">
                {recentSearches.length > 0 ? (
                  <div className="py-2">
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center space-x-3"
                        onClick={() => {
                          setQuery(search);
                          handleSearch(search);
                        }}
                      >
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{search}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent searches</p>
                    <p className="text-sm">Start typing to search</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
