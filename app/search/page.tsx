import { Suspense } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  FileText,
  MapPin,
  User,
  Hash,
  Clock,
  ExternalLink,
} from "lucide-react";

interface SearchResult {
  id: string;
  type: "claim" | "document" | "user" | "location";
  title: string;
  subtitle: string;
  url: string;
  metadata?: Record<string, unknown>;
  relevance: number;
}

async function SearchResults({ query }: { query: string }) {
  // Mock search results - replace with actual search API
  const mockResults: SearchResult[] = [
    {
      id: "1",
      type: "claim",
      title: "Forest Rights Claim #FRA-2024-001",
      subtitle: "Rajesh Kumar - Kanha Village, Mandla District",
      url: "/claims/1",
      metadata: {
        status: "APPROVED",
        area: "2.5 hectares",
        date: "2024-01-15",
      },
      relevance: 95,
    },
    {
      id: "2",
      type: "document",
      title: "Identity Proof - Aadhaar Card",
      subtitle: "Document uploaded for claim FRA-2024-001",
      url: "/documents/2",
      metadata: { type: "PDF", size: "1.2 MB", verified: true },
      relevance: 87,
    },
    {
      id: "3",
      type: "user",
      title: "Priya Devi",
      subtitle: "Forest Official - Bandhavgarh Division",
      url: "/users/3",
      metadata: {
        role: "OFFICIAL",
        department: "Forest Department",
        experience: "8 years",
      },
      relevance: 78,
    },
    {
      id: "4",
      type: "location",
      title: "Pench National Park",
      subtitle: "Protected Area - Madhya Pradesh",
      url: "/map?location=pench",
      metadata: {
        type: "Protected Area",
        area: "758 km²",
        established: "1975",
      },
      relevance: 72,
    },
  ].filter(
    (result) =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {mockResults.length > 0 ? (
        mockResults.map((result) => (
          <Card
            key={result.id}
            className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {result.type === "claim" && (
                      <FileText className="h-5 w-5 text-blue-500" />
                    )}
                    {result.type === "document" && (
                      <FileText className="h-5 w-5 text-green-500" />
                    )}
                    {result.type === "user" && (
                      <User className="h-5 w-5 text-purple-500" />
                    )}
                    {result.type === "location" && (
                      <MapPin className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">
                        {result.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {result.type.toUpperCase()}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <span>{result.relevance}% match</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{result.subtitle}</p>
                    {result.metadata && (
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {result.metadata.status && (
                          <Badge
                            className={`text-xs ${
                              result.metadata.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : result.metadata.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {result.metadata.status as string}
                          </Badge>
                        )}
                        {result.metadata.area && (
                          <span>{result.metadata.area}</span>
                        )}
                        {result.metadata.size && (
                          <span>{result.metadata.size}</span>
                        )}
                        {result.metadata.type && (
                          <span>{result.metadata.type}</span>
                        )}
                        {result.metadata.date && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{result.metadata.date}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={result.url}>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600 mb-4">
              We couldn&apos;t find anything matching &quot;{query}&quot;
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Try:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Checking your spelling</li>
                <li>Using different keywords</li>
                <li>Using more general terms</li>
                <li>Searching for claim numbers or names</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Skeleton className="h-5 w-5 mt-1" />
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-64" />
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Search className="h-8 w-8 text-blue-600" />
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600 mt-1">
              Showing results for &quot;{query}&quot;
            </p>
          )}
        </div>

        {/* Search Bar */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search claims, documents, users, locations..."
                  defaultValue={query}
                  className="pl-11 h-12 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
              <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                Search
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {query ? (
          <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResults query={query} />
          </Suspense>
        ) : (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Start Your Search
              </h3>
              <p className="text-gray-600 mb-6">
                Enter keywords to search across claims, documents, users, and
                locations
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Claims</p>
                  <p className="text-xs text-gray-600">
                    Search by claim number or claimant name
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Documents</p>
                  <p className="text-xs text-gray-600">
                    Find uploaded documents and files
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <User className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Users</p>
                  <p className="text-xs text-gray-600">
                    Search for officials and claimants
                  </p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Locations</p>
                  <p className="text-xs text-gray-600">
                    Find villages, districts, and areas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
