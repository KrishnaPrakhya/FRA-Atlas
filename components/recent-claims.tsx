import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function RecentClaims() {
  const claims = await prisma.forestRightsClaim.findMany({
    orderBy: { submissionDate: "desc" },
    take: 5,
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

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

  if (claims.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p className="text-lg">No recent claims found.</p>
        <p className="text-sm">
          New claims will appear here as they are submitted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {claims.map((claim) => (
        <div
          key={claim.id}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={claim.user.profile?.avatar || ""}
                alt={claim.claimantName}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {claim.claimantName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none text-foreground">
                {claim.claimantName}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {claim.villageName}, {claim.district} &middot;{" "}
                {formatDistanceToNow(new Date(claim.submissionDate), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant={getStatusVariant(claim.status)}
              className="capitalize font-medium"
            >
              {formatStatus(claim.status)}
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono hidden sm:block">
              {claim.claimNumber}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
