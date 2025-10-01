"use client";

import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Claim {
  id: string;
  claimantName: string;
  villageName: string;
  district: string;
  submissionDate: string;
  status: string;
  claimNumber: string;
  user: {
    profile?: {
      avatar?: string;
    };
  };
}

export function RecentClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data - replace with actual API call
        setClaims([
          {
            id: "1",
            claimantName: "Rajesh Kumar",
            villageName: "Kanha Village",
            district: "Mandla",
            submissionDate: new Date(
              Date.now() - 2 * 60 * 60 * 1000
            ).toISOString(),
            status: "UNDER_REVIEW",
            claimNumber: "FRA-2024-001",
            user: { profile: { avatar: "" } },
          },
          {
            id: "2",
            claimantName: "Priya Devi",
            villageName: "Bandhavgarh",
            district: "Umaria",
            submissionDate: new Date(
              Date.now() - 5 * 60 * 60 * 1000
            ).toISOString(),
            status: "APPROVED",
            claimNumber: "FRA-2024-002",
            user: { profile: { avatar: "" } },
          },
          {
            id: "3",
            claimantName: "Suresh Singh",
            villageName: "Pench",
            district: "Seoni",
            submissionDate: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "SUBMITTED",
            claimNumber: "FRA-2024-003",
            user: { profile: { avatar: "" } },
          },
          {
            id: "4",
            claimantName: "Meera Sharma",
            villageName: "Satpura",
            district: "Hoshangabad",
            submissionDate: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "REJECTED",
            claimNumber: "FRA-2024-004",
            user: { profile: { avatar: "" } },
          },
          {
            id: "5",
            claimantName: "Amit Patel",
            villageName: "Pachmarhi",
            district: "Hoshangabad",
            submissionDate: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "APPROVED",
            claimNumber: "FRA-2024-005",
            user: { profile: { avatar: "" } },
          },
        ]);
      } catch (error) {
        console.error("Error fetching claims:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const getStatusVariant = (
    status: string
  ): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case "APPROVED":
        return "default";
      case "REJECTED":
        return "destructive";
      case "UNDER_REVIEW":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm"
          >
            <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32 bg-white/10" />
              <Skeleton className="h-3 w-48 bg-white/10" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  if (claims.length === 0) {
    return (
      <div className="text-center py-12 text-white/60">
        <p className="text-lg font-medium">No recent claims found.</p>
        <p className="text-sm mt-2">
          New claims will appear here as they are submitted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {claims.map((claim) => (
        <div
          key={claim.id}
          className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
              <AvatarImage
                src={claim.user.profile?.avatar || ""}
                alt={claim.claimantName}
              />
              <AvatarFallback className="bg-emerald-500/20 text-emerald-300 font-bold text-lg">
                {claim.claimantName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-base font-bold text-white group-hover:text-emerald-200 transition-colors">
                {claim.claimantName}
              </p>
              <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                {claim.villageName}, {claim.district} •{" "}
                {formatDistanceToNow(new Date(claim.submissionDate), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant={getStatusVariant(claim.status)}
              className="capitalize font-bold px-3 py-1 text-xs"
            >
              {formatStatus(claim.status)}
            </Badge>
            <span className="text-xs text-white/40 font-mono hidden sm:block bg-white/5 px-2 py-1 rounded">
              {claim.claimNumber}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
