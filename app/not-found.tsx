import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, FileText } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-white font-bold text-2xl">🌲</span>
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              FRA Atlas
            </h1>
            <p className="text-sm text-gray-600">Forest Rights Management</p>
          </div>
        </div>

        {/* 404 Content */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12">
            <div className="space-y-6">
              {/* 404 Number */}
              <div className="text-8xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                404
              </div>

              {/* Error Message */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  Page Not Found
                </h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  The page you&apos;re looking for doesn&apos;t exist or has
                  been moved to a different location.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <Button
                  asChild
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/claims">
                    <FileText className="mr-2 h-4 w-4" />
                    View Claims
                  </Link>
                </Button>
              </div>

              {/* Helpful Links */}
              <div className="pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  You might be looking for:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link
                    href="/claims"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Claims Management
                  </Link>
                  <span className="text-gray-400">•</span>
                  <Link
                    href="/map"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Spatial Data
                  </Link>
                  <span className="text-gray-400">•</span>
                  <Link
                    href="/analytics"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Analytics
                  </Link>
                  <span className="text-gray-400">•</span>
                  <Link
                    href="/help"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Help Center
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact your system
            administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
