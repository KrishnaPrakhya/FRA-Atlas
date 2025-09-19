"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  User,
  LogOut,
  Settings,
  HelpCircle,
  Home,
  FileText,
  Map,
  BarChart3,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "@/lib/store/api/authApi";
import { logout } from "@/lib/store/slices/authSlice";
import { GlobalSearch } from "@/components/search/global-search";
import { NotificationCenter } from "@/components/notifications/notification-center";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export function DashboardHeader() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: userData } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [logoutMutation] = useLogoutMutation();

  const currentUser = user || userData?.user;

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout");
    }
  };

  const isActivePath = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/claims", label: "Claims", icon: FileText },
    { href: "/map", label: "Map", icon: Map },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm mb-10 rounded-lg">
      <div className="container mx-auto px-4 py-3 ">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🌲</span>
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  FRA Atlas
                </span>
                <p className="text-xs text-gray-500 -mt-1">
                  Forest Rights Management
                </p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            {/* Global Search */}
            <div className="hidden md:flex">
              <GlobalSearch />
            </div>

            {/* Notifications */}
            <NotificationCenter />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full ring-2 ring-gray-200 hover:ring-blue-300"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {currentUser?.name ? (
                        currentUser.name.charAt(0).toUpperCase()
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                {currentUser && (
                  <div className="px-4 py-3 border-b">
                    <p className="font-semibold text-gray-900">
                      {currentUser.name || "User"}
                    </p>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {currentUser.role?.toLowerCase().replace("_", " ")}
                    </Badge>
                  </div>
                )}
                <DropdownMenuItem
                  className="flex items-center space-x-2 py-3"
                  asChild
                >
                  <Link href="/profile">
                    <Settings className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center space-x-2 py-3"
                  asChild
                >
                  <Link href="/help">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help & Support</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center space-x-2 py-3 text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
