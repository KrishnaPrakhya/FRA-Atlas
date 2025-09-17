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
  Plus,
  Search,
  Filter,
  Download,
  FileText,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

async function ClaimsList() {
  const claims = await prisma.forestRightsClaim.findMany({
    orderBy: { submissionDate: "desc" },
    take: 20,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500 text-white";
      case "REJECTED":
        return "bg-red-500 text-white";
      case "UNDER_REVIEW":
        return "bg-amber-500 text-white";
      case "PENDING_DOCUMENTS":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (claims.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No claims found
          </h3>
          <p className="text-gray-600 mb-4">
            Start by submitting your first forest rights claim.
          </p>
          <Button asChild>
            <Link href="/claims/new">
              <Plus className="h-4 w-4 mr-2" />
              Submit New Claim
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {claims.map((claim, index) => (
        <Card key={claim.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                    index % 4 === 0
                      ? "bg-gradient-to-br from-blue-500 to-purple-600"
                      : index % 4 === 1
                      ? "bg-gradient-to-br from-green-500 to-teal-600"
                      : index % 4 === 2
                      ? "bg-gradient-to-br from-orange-500 to-red-600"
                      : "bg-gradient-to-br from-purple-500 to-pink-600"
                  }`}
                >
                  <span className="text-white font-bold text-lg">
                    {claim.claimantName.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {claim.claimantName}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {claim.villageName}, {claim.district}, {claim.state}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDistanceToNow(new Date(claim.submissionDate), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {claim.claimNumber}
                    </span>
                    <span>{claim.forestAreaHectares} hectares</span>
                    <span className="capitalize">
                      {claim.claimType.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Badge className={`${getStatusColor(claim.status)} px-3 py-1`}>
                  {formatStatus(claim.status)}
                </Badge>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/claims/${claim.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ClaimsListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="space-x-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ClaimsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Forest Rights Claims
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track all forest rights claims
            </p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
          >
            <Link href="/claims/new">
              <Plus className="h-4 w-4 mr-2" />
              Submit New Claim
            </Link>
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by claimant name, claim number, or location..."
                  className="bg-white"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Claims List */}
        <Suspense fallback={<ClaimsListSkeleton />}>
          <ClaimsList />
        </Suspense>
      </main>
    </div>
  );
}
