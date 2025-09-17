import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, FileText, MapPin } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding and Features */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-2xl">🌲</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FRA Atlas
                </h1>
                <p className="text-lg text-gray-600">
                  Forest Rights Act Management System
                </p>
              </div>
            </div>

            <p className="text-xl text-gray-700 leading-relaxed">
              Comprehensive digital platform for managing forest rights claims,
              document verification, and spatial data analysis across India.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 border-0 bg-white/60 backdrop-blur-sm shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Claims Management
                    </h3>
                    <p className="text-sm text-gray-600">
                      Digital claim processing
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4 border-0 bg-white/60 backdrop-blur-sm shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Spatial Data
                    </h3>
                    <p className="text-sm text-gray-600">Interactive mapping</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4 border-0 bg-white/60 backdrop-blur-sm shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Secure Platform
                    </h3>
                    <p className="text-sm text-gray-600">
                      Government-grade security
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4 border-0 bg-white/60 backdrop-blur-sm shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Multi-User</h3>
                    <p className="text-sm text-gray-600">Role-based access</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-8 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-600">Claims Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">25+</div>
              <div className="text-sm text-gray-600">States Covered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Officials</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <LoginForm />

          {/* Demo credentials info */}
          <Card className="mt-6 border-0 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Demo Credentials</h3>
                <Badge variant="secondary" className="bg-green-500 text-white">
                  Demo
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-green-300">
                      Official Account
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs border-green-300 text-green-300"
                    >
                      OFFICIAL
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300">official@fra.gov.in</p>
                  <p className="text-xs text-gray-400">Password: password123</p>
                </div>
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-blue-300">
                      Claimant Account
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs border-blue-300 text-blue-300"
                    >
                      CLAIMANT
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300">claimant@example.com</p>
                  <p className="text-xs text-gray-400">Password: password123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
