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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Upload,
  MapPin,
  FileText,
  User,
  Home,
  CheckCircle,
} from "lucide-react";

export default function NewClaimPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Plus className="h-8 w-8 text-green-600" />
            Submit New Forest Rights Claim
          </h1>
          <p className="text-gray-600 mt-1">
            Complete the form below to submit your forest rights claim
            application
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Application Progress
              </span>
              <span className="text-sm text-gray-500">Step 1 of 4</span>
            </div>
            <Progress value={25} className="mb-4" />
            <div className="flex justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                Personal Info
              </span>
              <span className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Land Details
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Documents
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Review
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Provide your personal details as the claimant
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fatherName">
                      Father&apos;s/Husband&apos;s Name *
                    </Label>
                    <Input
                      id="fatherName"
                      placeholder="Enter father's/husband's name"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Residential Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter complete residential address"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Land and Forest Details */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Land & Forest Details
                </CardTitle>
                <CardDescription className="text-green-100">
                  Provide details about the forest land you are claiming
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp">Madhya Pradesh</SelectItem>
                        <SelectItem value="cg">Chhattisgarh</SelectItem>
                        <SelectItem value="od">Odisha</SelectItem>
                        <SelectItem value="jh">Jharkhand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="district">District *</Label>
                    <Input
                      id="district"
                      placeholder="Enter district"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="village">Village *</Label>
                    <Input
                      id="village"
                      placeholder="Enter village name"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="forestArea">Forest Area (Hectares) *</Label>
                    <Input
                      id="forestArea"
                      type="number"
                      step="0.01"
                      placeholder="Enter area in hectares"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="claimType">Claim Type *</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select claim type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                        <SelectItem value="traditional">Traditional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="landDescription">Land Description *</Label>
                  <Textarea
                    id="landDescription"
                    placeholder="Describe the forest land, its boundaries, and traditional use"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="traditionalUse">
                    Traditional Use Details *
                  </Label>
                  <Textarea
                    id="traditionalUse"
                    placeholder="Describe how you and your family have traditionally used this forest land"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Required Documents
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Upload supporting documents for your claim
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {[
                  "Identity Proof (Aadhaar Card, Voter ID, etc.)",
                  "Residence Proof",
                  "Traditional Use Evidence (Photos, Community Certificate)",
                  "Land Survey Documents (if available)",
                  "Family Tree/Genealogy Proof",
                ].map((doc, index) => (
                  <div
                    key={index}
                    className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{doc}</p>
                        <p className="text-sm text-gray-500">
                          PDF, JPG, PNG (Max 5MB)
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Help & Guidelines */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Ensure all personal information is accurate and matches
                      your identity documents
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Provide detailed description of traditional forest use
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Upload clear, readable copies of all documents</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Double-check all information before submission</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Contact our support team for assistance with your application.
                </p>
                <Button variant="secondary" size="sm" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between mt-8">
          <Button variant="outline">Save as Draft</Button>
          <div className="space-x-4">
            <Button variant="outline">Previous</Button>
            <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
              Next Step
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
