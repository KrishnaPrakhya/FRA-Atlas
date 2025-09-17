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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Search,
  FileText,
  Map,
  Users,
  Phone,
  Mail,
  MessageCircle,
  Book,
  Video,
  Download,
} from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I submit a new forest rights claim?",
      answer:
        "To submit a new claim, navigate to the Claims section and click 'Submit New Claim'. Fill out the multi-step form with your personal information, land details, and upload required documents. Make sure all information is accurate before submission.",
    },
    {
      question: "What documents are required for a forest rights claim?",
      answer:
        "Required documents include: Identity proof (Aadhaar Card, Voter ID), Residence proof, Traditional use evidence (photos, community certificate), Land survey documents (if available), and Family tree/genealogy proof.",
    },
    {
      question: "How can I track the status of my claim?",
      answer:
        "You can track your claim status in the Claims section of your dashboard. Each claim shows its current status, processing stage, and any required actions. You'll also receive notifications for status updates.",
    },
    {
      question: "What are the different claim statuses?",
      answer:
        "Claim statuses include: Submitted (initial submission), Under Review (being processed by officials), Pending Documents (additional documents needed), Approved (claim accepted), and Rejected (claim denied with reasons).",
    },
    {
      question: "How do I use the spatial mapping feature?",
      answer:
        "The Map section allows you to view forest boundaries, claim areas, and spatial data. You can search for locations, view different map layers, and see claims in specific geographical areas.",
    },
    {
      question: "Who can I contact for technical support?",
      answer:
        "For technical support, you can contact the help desk at support@fra.gov.in or call the helpline at 1800-XXX-XXXX. You can also use the chat support feature available in the application.",
    },
  ];

  const quickLinks = [
    {
      title: "User Guide",
      description: "Complete guide to using FRA Atlas",
      icon: Book,
      href: "#",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video instructions",
      icon: Video,
      href: "#",
    },
    {
      title: "Download Forms",
      description: "Printable forms and documents",
      icon: Download,
      href: "#",
    },
    {
      title: "Contact Support",
      description: "Get help from our support team",
      icon: MessageCircle,
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Help & Support
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and get the help you need to use
            FRA Atlas effectively
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for help topics, guides, or FAQs..."
                className="pl-11 h-12 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Popular help resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={index}
                      href={link.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {link.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {link.description}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-green-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
                <CardDescription className="text-green-100">
                  Contact our support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-200" />
                  <div>
                    <p className="font-medium">Helpline</p>
                    <p className="text-sm text-green-100">1800-XXX-XXXX</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-green-200" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-green-100">support@fra.gov.in</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5 text-green-200" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-green-100">
                      Available 9 AM - 6 PM
                    </p>
                  </div>
                </div>
                <Button variant="secondary" className="w-full mt-4">
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Find answers to the most common questions about FRA Atlas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Feature Guides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Claims Guide</CardTitle>
                  <CardDescription>
                    Learn how to submit and manage forest rights claims
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Guide
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                    <Map className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Mapping Guide</CardTitle>
                  <CardDescription>
                    Understand how to use spatial data and mapping features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Guide
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">User Roles</CardTitle>
                  <CardDescription>
                    Understanding different user roles and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Guide
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                    <Download className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Downloads</CardTitle>
                  <CardDescription>
                    Forms, templates, and documentation downloads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Downloads
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* System Status */}
        <Card className="mt-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current status of FRA Atlas services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Application</span>
                <Badge className="bg-green-500 text-white">Operational</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Database</span>
                <Badge className="bg-green-500 text-white">Operational</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium">File Storage</span>
                <Badge className="bg-green-500 text-white">Operational</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
