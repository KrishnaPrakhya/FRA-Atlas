"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TreePine,
  Sparkles,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MapPin,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Leaf,
  Mountain,
  Globe,
  Users,
  Activity,
  Plus,
  RefreshCw,
  SortAsc,
  SortDesc,
} from "lucide-react";
import Link from "next/link";

// Mock data for claims
const mockClaims = [
  {
    id: "FRA-2024-001",
    claimantName: "राम कुमार शर्मा",
    villageName: "Ramgarh",
    district: "Ranchi",
    state: "Jharkhand",
    areaRequested: 2.5,
    landType: "Agricultural",
    status: "approved",
    submissionDate: "2024-01-15",
    lastUpdated: "2024-02-20",
    processingTime: 36,
    confidence: 0.94,
    riskLevel: "low",
    priority: "normal",
  },
  {
    id: "FRA-2024-002",
    claimantName: "सुनीता देवी",
    villageName: "Birsa Nagar",
    district: "Gumla",
    state: "Jharkhand",
    areaRequested: 1.8,
    landType: "Habitation",
    status: "under_review",
    submissionDate: "2024-02-10",
    lastUpdated: "2024-03-05",
    processingTime: 23,
    confidence: 0.87,
    riskLevel: "medium",
    priority: "high",
  },
  {
    id: "FRA-2024-003",
    claimantName: "अजय सिंह",
    villageName: "Khunti",
    district: "Khunti",
    state: "Jharkhand",
    areaRequested: 3.2,
    landType: "Grazing",
    status: "pending",
    submissionDate: "2024-03-01",
    lastUpdated: "2024-03-10",
    processingTime: 9,
    confidence: 0.91,
    riskLevel: "low",
    priority: "normal",
  },
  {
    id: "FRA-2024-004",
    claimantName: "मीरा बाई",
    villageName: "Simdega",
    district: "Simdega",
    state: "Jharkhand",
    areaRequested: 2.1,
    landType: "Agricultural",
    status: "rejected",
    submissionDate: "2024-01-20",
    lastUpdated: "2024-02-15",
    processingTime: 26,
    confidence: 0.76,
    riskLevel: "high",
    priority: "low",
  },
  {
    id: "FRA-2024-005",
    claimantName: "रवि प्रसाद",
    villageName: "Lohardaga",
    district: "Lohardaga",
    state: "Jharkhand",
    areaRequested: 4.5,
    landType: "Community Resource",
    status: "requires_info",
    submissionDate: "2024-02-25",
    lastUpdated: "2024-03-12",
    processingTime: 15,
    confidence: 0.82,
    riskLevel: "medium",
    priority: "high",
  },
];

const statusConfig = {
  approved: {
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    icon: CheckCircle,
  },
  under_review: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    icon: Clock,
  },
  pending: {
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    icon: Clock,
  },
  rejected: {
    color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    icon: XCircle,
  },
  requires_info: {
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
    icon: AlertTriangle,
  },
};

const riskConfig = {
  low: { color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20" },
  medium: {
    color: "text-yellow-600",
    bg: "bg-yellow-100 dark:bg-yellow-900/20",
  },
  high: { color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20" },
};

export default function ClaimsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [sortBy, setSortBy] = useState("submissionDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState("all");

  // Filter and sort claims
  const filteredClaims = useMemo(() => {
    const filtered = mockClaims.filter((claim) => {
      const matchesSearch =
        claim.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.villageName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || claim.status === statusFilter;
      const matchesDistrict =
        districtFilter === "all" || claim.district === districtFilter;

      return matchesSearch && matchesStatus && matchesDistrict;
    });

    // Sort claims
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "submissionDate":
          aValue = new Date(a.submissionDate).getTime();
          bValue = new Date(b.submissionDate).getTime();
          break;
        case "claimantName":
          aValue = a.claimantName;
          bValue = b.claimantName;
          break;
        case "areaRequested":
          aValue = a.areaRequested;
          bValue = b.areaRequested;
          break;
        case "processingTime":
          aValue = a.processingTime;
          bValue = b.processingTime;
          break;
        default:
          aValue = a.submissionDate;
          bValue = b.submissionDate;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, districtFilter, sortBy, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = mockClaims.length;
    const approved = mockClaims.filter((c) => c.status === "approved").length;
    const pending = mockClaims.filter(
      (c) => c.status === "pending" || c.status === "under_review"
    ).length;
    const rejected = mockClaims.filter((c) => c.status === "rejected").length;
    const avgProcessingTime =
      mockClaims.reduce((sum, c) => sum + c.processingTime, 0) / total;

    return { total, approved, pending, rejected, avgProcessingTime };
  }, []);

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Clock;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-br from-teal-400/15 to-cyan-400/15 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Enhanced Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-emerald-200/50 dark:border-emerald-700/50">
              <FileText className="h-6 w-6 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Claims Management System
              </span>
              <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
              Forest Rights Claims
            </h1>

            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive management of
              <span className="text-emerald-600 font-semibold">
                {" "}
                forest rights applications
              </span>{" "}
              with
              <span className="text-teal-600 font-semibold">
                {" "}
                intelligent tracking
              </span>
            </p>

            <div className="flex items-center justify-center space-x-8 pt-4">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Activity className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">Real-time Updates</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <BarChart3 className="h-5 w-5 text-teal-500" />
                <span className="text-sm">Advanced Analytics</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Globe className="h-5 w-5 text-cyan-500" />
                <span className="text-sm">Multi-region Support</span>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-3xl blur-xl"></div>
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Claims */}
              <Card className="bg-gradient-to-br from-emerald-500 to-green-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <TreePine className="h-5 w-5 text-emerald-200 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.total}</div>
                  <div className="text-emerald-100 text-sm">Total Claims</div>
                </CardContent>
              </Card>

              {/* Approved Claims */}
              <Card className="bg-gradient-to-br from-teal-500 to-cyan-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <Leaf className="h-5 w-5 text-teal-200 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {stats.approved}
                  </div>
                  <div className="text-teal-100 text-sm">Approved</div>
                </CardContent>
              </Card>

              {/* Pending Claims */}
              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <Activity className="h-5 w-5 text-blue-200 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.pending}</div>
                  <div className="text-blue-100 text-sm">Pending Review</div>
                </CardContent>
              </Card>

              {/* Avg Processing Time */}
              <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <Mountain className="h-5 w-5 text-purple-200 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {stats.avgProcessingTime.toFixed(1)}
                  </div>
                  <div className="text-purple-100 text-sm">Avg Days</div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Enhanced Filters and Controls */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-2xl"></div>
            <Card className="relative bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-2xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5"></div>

              <CardHeader className="relative z-10 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                      <Filter className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                        Claims Management
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
                        Filter, search, and manage forest rights claims
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                    >
                      <RefreshCw className="h-4 w-4 mr-2 text-emerald-600" />
                      <span className="text-emerald-700">Refresh</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/80 backdrop-blur-sm border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition-all duration-300"
                    >
                      <Download className="h-4 w-4 mr-2 text-teal-600" />
                      <span className="text-teal-700">Export</span>
                    </Button>
                    <Link href="/claims/new">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Claim
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6">
                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Search */}
                  <div className="lg:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search claims, names, or IDs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/80 backdrop-blur-sm border-emerald-200/50 focus:border-emerald-400 transition-all duration-300"
                    />
                  </div>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border-emerald-200/50 focus:border-emerald-400 transition-all duration-300">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="requires_info">
                        Requires Info
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* District Filter */}
                  <Select
                    value={districtFilter}
                    onValueChange={setDistrictFilter}
                  >
                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border-emerald-200/50 focus:border-emerald-400 transition-all duration-300">
                      <SelectValue placeholder="All Districts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      <SelectItem value="Ranchi">Ranchi</SelectItem>
                      <SelectItem value="Gumla">Gumla</SelectItem>
                      <SelectItem value="Khunti">Khunti</SelectItem>
                      <SelectItem value="Simdega">Simdega</SelectItem>
                      <SelectItem value="Lohardaga">Lohardaga</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort Options */}
                  <div className="flex items-center space-x-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="bg-white/80 backdrop-blur-sm border-emerald-200/50 focus:border-emerald-400 transition-all duration-300">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submissionDate">
                          Submission Date
                        </SelectItem>
                        <SelectItem value="claimantName">
                          Claimant Name
                        </SelectItem>
                        <SelectItem value="areaRequested">
                          Area Requested
                        </SelectItem>
                        <SelectItem value="processingTime">
                          Processing Time
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                      className="bg-white/80 backdrop-blur-sm border-emerald-200/50 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                    >
                      {sortOrder === "asc" ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Results Summary */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        Showing {filteredClaims.length} of {mockClaims.length}{" "}
                        claims
                      </span>
                    </div>
                    {searchTerm && (
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                        Search: "{searchTerm}"
                      </Badge>
                    )}
                    {statusFilter !== "all" && (
                      <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300">
                        Status: {statusFilter.replace("_", " ")}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>

                {/* Claims Table */}
                <div className="space-y-4">
                  {filteredClaims.length === 0 ? (
                    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                      <CardContent className="p-12 text-center">
                        <div className="space-y-4">
                          <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700/20 dark:to-gray-800/20 rounded-3xl inline-block">
                            <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                              No Claims Found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                              No claims match your current filters. Try
                              adjusting your search criteria or create a new
                              claim.
                            </p>
                          </div>
                          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Claim
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredClaims.map((claim) => (
                      <Card
                        key={claim.id}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] rounded-2xl overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <CardContent className="relative z-10 p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-4">
                              {/* Header Row */}
                              <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-3">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                      {claim.claimantName}
                                    </h3>
                                    <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 dark:from-emerald-900/20 dark:to-teal-900/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700">
                                      {claim.id}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="h-4 w-4 text-emerald-500" />
                                      <span>
                                        {claim.villageName}, {claim.district}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="h-4 w-4 text-teal-500" />
                                      <span>
                                        {new Date(
                                          claim.submissionDate
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    className={
                                      statusConfig[
                                        claim.status as keyof typeof statusConfig
                                      ]?.color
                                    }
                                  >
                                    <div className="flex items-center space-x-1">
                                      {getStatusIcon(claim.status)}
                                      <span className="capitalize">
                                        {claim.status.replace("_", " ")}
                                      </span>
                                    </div>
                                  </Badge>
                                </div>
                              </div>

                              {/* Details Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Area Requested
                                  </div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {claim.areaRequested} hectares
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Land Type
                                  </div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {claim.landType}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Processing Time
                                  </div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {claim.processingTime} days
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Risk Level
                                  </div>
                                  <div
                                    className={`text-sm font-medium ${
                                      riskConfig[
                                        claim.riskLevel as keyof typeof riskConfig
                                      ]?.color
                                    }`}
                                  >
                                    {claim.riskLevel.charAt(0).toUpperCase() +
                                      claim.riskLevel.slice(1)}
                                  </div>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Confidence Score
                                  </span>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {(claim.confidence * 100).toFixed(1)}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                                    style={{
                                      width: `${claim.confidence * 100}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2 ml-6">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                              >
                                <Eye className="h-4 w-4 mr-2 text-emerald-600" />
                                <span className="text-emerald-700">View</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/80 backdrop-blur-sm border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition-all duration-300"
                              >
                                <Edit className="h-4 w-4 mr-2 text-teal-600" />
                                <span className="text-teal-700">Edit</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Section */}
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <FileText className="h-5 w-5 text-emerald-500" />
              <span className="text-sm">
                Empowering communities through transparent forest rights
                management
              </span>
              <TreePine className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
