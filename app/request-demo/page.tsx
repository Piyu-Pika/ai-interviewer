import { Metadata } from "next"
import { Check, CalendarDays, Building, User, Mail, Phone, BriefcaseBusiness } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Request Demo | AI Interviewer Platform",
  description: "Schedule a personalized demo of our AI-powered interview platform",
}

export default function RequestDemo() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="gradient-bg px-4 py-12 md:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              Request a Personalized Demo
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl">
              See how our AI-powered interview platform can transform your hiring process, reduce time-to-hire, and help you find the best candidates.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative">
                          <Input id="firstName" placeholder="John" required />
                          <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <div className="relative">
                          <Input id="lastName" placeholder="Smith" required />
                          <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email</Label>
                      <div className="relative">
                        <Input id="email" type="email" placeholder="john.smith@company.com" required />
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <div className="relative">
                        <Input id="company" placeholder="Acme Inc." required />
                        <Building className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <div className="relative">
                        <Input id="jobTitle" placeholder="HR Director" required />
                        <BriefcaseBusiness className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company Size</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="501-1000">501-1000 employees</SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="interests">What interests you most about our platform?</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select interest" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ai-interviews">AI Video Interviews</SelectItem>
                          <SelectItem value="facial-analysis">Facial Expression Analysis</SelectItem>
                          <SelectItem value="candidate-management">Candidate Management</SelectItem>
                          <SelectItem value="bias-reduction">Bias Reduction</SelectItem>
                          <SelectItem value="complete-solution">Complete Hiring Solution</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Information</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us about your current hiring process and challenges..."
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">Schedule My Demo</Button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      By submitting this form, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Info Section */}
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Why Request a Demo?</h2>
                <p className="text-gray-600 mb-6">
                  Our personalized demos give you a hands-on look at how our platform works and how it can be tailored to your specific hiring needs.
                </p>
                
                <ul className="space-y-3">
                  {[
                    "See the AI interview process from both candidate and recruiter perspectives",
                    "Learn how facial expression analysis provides deeper candidate insights",
                    "Discover how our platform reduces hiring bias and improves decision-making",
                    "Understand how to integrate with your existing ATS and HR systems",
                    "Get pricing information customized to your organization's size and needs"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-2xl font-bold mb-4">What to Expect</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 rounded-full p-3 h-fit">
                      <CalendarDays className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">30-Minute Consultation</h3>
                      <p className="text-gray-600">
                        Our product specialist will schedule a call at your convenience to understand your needs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary/10 rounded-full p-3 h-fit">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Personalized Demo</h3>
                      <p className="text-gray-600">
                        See a tailored demonstration of features most relevant to your hiring challenges.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary/10 rounded-full p-3 h-fit">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Custom Proposal</h3>
                      <p className="text-gray-600">
                        Receive a detailed proposal with pricing and implementation plan for your organization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-auto">
                <h3 className="font-semibold text-lg mb-2">Have questions?</h3>
                <p className="text-gray-600 mb-4">
                  Our team is ready to help you determine if our platform is the right fit for your organization.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" asChild>
                    <Link href="mailto:sales@aiinterviewer.com">
                      Contact Sales
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/how-it-works">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 