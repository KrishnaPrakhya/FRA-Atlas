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
  TreePine,
  Sparkles,
  Leaf,
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
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-b border-emerald-200/30 dark:border-emerald-700/30 shadow-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-110">
                  <TreePine className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
              </div>
              <div>
                <span className="font-bold text-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  FRA Atlas
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-400 -mt-1 flex items-center space-x-1">
                  <Leaf className="h-3 w-3 text-emerald-500" />
                  <span>Forest Rights Management</span>
                </p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 group ${
                      isActive
                        ? "text-emerald-700 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg border border-emerald-200/50"
                        : "text-gray-600 dark:text-gray-300 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 hover:shadow-md"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl"></div>
                    )}
                    <Icon
                      className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                        isActive ? "text-emerald-600" : ""
                      }`}
                    />
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></div>
                    )}
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
                  className="relative h-12 w-12 rounded-2xl ring-2 ring-emerald-200/50 hover:ring-emerald-300 transition-all duration-300 hover:scale-105"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold text-lg shadow-lg">
                      {currentUser?.name ? (
                        currentUser.name.charAt(0).toUpperCase()
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
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
