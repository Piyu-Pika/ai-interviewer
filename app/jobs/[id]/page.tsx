"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Calendar,
  Share2,
  Bookmark,
  CheckCircle,
  Users,
  Star,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  CalendarClock,
  Sparkles,
  User,
} from "lucide-react"
import AIInterview from "@/components/ai-interview"
import { jobs } from "@/lib/mock-data"
import { useLangchain } from "@/hooks/use-langchain"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock job data
const jobData = {
  id: 1,
  title: "Senior Frontend Developer",
  company: "TechCorp",
  companyLogo: "/placeholder.svg?height=40&width=40",
  location: "San Francisco, CA (Remote Option)",
  type: "Full-time",
  salary: "$120,000 - $150,000",
  posted: "2 days ago",
  deadline: "Apr 15, 2025",
  description:
    "We're looking for a Senior Frontend Developer to join our growing team. You'll be responsible for building and maintaining high-quality web applications using React and TypeScript.",
  responsibilities: [
    "Develop and maintain responsive web applications using React, TypeScript, and modern frontend technologies",
    "Collaborate with designers, product managers, and backend developers to implement new features",
    "Write clean, maintainable, and well-documented code",
    "Participate in code reviews and mentor junior developers",
    "Optimize applications for maximum speed and scalability",
    "Stay up-to-date with emerging trends and technologies in frontend development",
  ],
  requirements: [
    "5+ years of experience in frontend development",
    "Strong proficiency in React, TypeScript, and modern JavaScript",
    "Experience with state management libraries (Redux, Context API, etc.)",
    "Knowledge of responsive design and cross-browser compatibility",
    "Familiarity with RESTful APIs and GraphQL",
    "Experience with testing frameworks (Jest, React Testing Library, etc.)",
    "Strong problem-solving skills and attention to detail",
    "Excellent communication and teamwork skills",
  ],
  benefits: [
    "Competitive salary and equity package",
    "Comprehensive health, dental, and vision insurance",
    "Flexible work hours and remote work options",
    "Professional development budget",
    "401(k) matching",
    "Generous paid time off",
    "Regular team events and activities",
  ],
  skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Redux", "GraphQL", "Jest"],
  companyInfo: {
    name: "TechCorp",
    description:
      "TechCorp is a leading technology company specializing in innovative software solutions for businesses of all sizes. With a focus on user experience and cutting-edge technology, we help our clients transform their digital presence.",
    size: "201-500 employees",
    industry: "Software Development",
    founded: 2010,
    website: "https://techcorp.example.com",
    headquarters: "San Francisco, CA",
  },
  similarJobs: [
    {
      id: 2,
      title: "Frontend Developer",
      company: "WebSolutions",
      location: "Remote",
      match: 92,
    },
    {
      id: 3,
      title: "React Developer",
      company: "AppWorks",
      location: "New York, NY",
      match: 88,
    },
    {
      id: 4,
      title: "UI Engineer",
      company: "DesignTech",
      location: "San Francisco, CA",
      match: 85,
    },
  ],
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [isApplied, setIsApplied] = useState(false)
  const [isStartingInterview, setIsStartingInterview] = useState(false)
  const [jobStats, setJobStats] = useState({
    applicants: Math.floor(Math.random() * 100) + 10,
    views: Math.floor(Math.random() * 1000) + 100,
    daysPosted: Math.floor(Math.random() * 30) + 1
  })

  // Get job data
  const job = jobs.find(j => j.id === params.id)
  
  // LangChain hook for AI features
  const { generateQuestions, isGeneratingQuestions } = useLangchain()
  const [aiQuestions, setAiQuestions] = useState<any[]>([])

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")

    setIsAuthenticated(!!token)
    setUserRole(role)
  }, [])

  // Generate AI questions on load
  useEffect(() => {
    if (job) {
      const fetchQuestions = async () => {
        try {
          const questions = await generateQuestions(job.description)
          setAiQuestions(questions)
        } catch (error) {
          console.error('Failed to generate questions:', error)
        }
      }
      
      fetchQuestions()
    }
  }, [job])

  const handleApply = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/jobs/${params.id}`)
      return
    }

    setIsLoading(true)

    try {
      // In a real app, you would call an API to submit the application
      // For demo purposes, we'll just simulate a successful application
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsApplied(true)

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Application failed",
        description: "Failed to submit application. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveJob = () => {
    setIsSaved(!isSaved)

    toast({
      title: isSaved ? "Job removed" : "Job saved",
      description: isSaved ? "Job has been removed from your saved jobs." : "Job has been saved to your profile.",
    })
  }

  const handleShare = () => {
    // In a real app, you would implement sharing functionality
    // For demo purposes, we'll just show a toast
    navigator.clipboard.writeText(window.location.href)

    toast({
      title: "Link copied",
      description: "Job link has been copied to clipboard.",
    })
  }

  // Start AI interview
  const startAIInterview = () => {
    setIsStartingInterview(true)
    
    // Simulate loading
    setTimeout(() => {
      setIsStartingInterview(false)
      setIsApplied(true)
    }, 1500)
  }

  // Handle interview completion
  const handleInterviewComplete = (data: any) => {
    console.log('Interview completed:', data)
    setIsApplied(false)
    // In a real app, this would save data to backend
    alert('Your application has been submitted successfully!')
  }

  // Handle interview cancellation
  const handleInterviewCancel = () => {
    setIsApplied(false)
  }

  // If job not found
  if (!job) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
            <p className="text-muted-foreground">
              The job listing you're looking for doesn't exist or has been removed.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.href = "/jobs"}
            >
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Show AI interview if applying
  if (isApplied) {
    return (
      <div className="container py-8">
        <AIInterview 
          jobId={params.id}
          jobTitle={job.title}
          initialQuestions={aiQuestions}
          onComplete={handleInterviewComplete}
          onCancel={handleInterviewCancel}
        />
      </div>
    )
  }

  // Format salary range
  const formatSalary = (min: number, max: number, currency: string) => {
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`
  }

  return (
    <div className="container py-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 rounded-md">
                    <AvatarImage src={jobData.companyLogo} alt={jobData.company} />
                    <AvatarFallback className="rounded-md">{jobData.company.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">{jobData.title}</h1>
                    <Link href="#company-info" className="text-lg text-muted-foreground hover:text-primary">
                      {jobData.company}
                    </Link>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        {jobData.location}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="mr-1 h-4 w-4" />
                        {jobData.type}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="mr-1 h-4 w-4" />
                        {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        Posted {jobData.posted}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {isApplied ? (
                    <Button disabled className="w-full md:w-auto">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Applied
                    </Button>
                  ) : (
                    <Button onClick={startAIInterview} disabled={isStartingInterview} className="w-full md:w-auto">
                      {isStartingInterview ? "Preparing Interview..." : "Apply with AI Interview"}
                    </Button>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSaveJob}
                      className={isSaved ? "text-primary" : ""}
                    >
                      <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="description" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="similar">Similar Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{jobData.description}</p>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {jobData.responsibilities.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {jobData.requirements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {jobData.benefits.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {jobData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    Application Deadline: {jobData.deadline}
                  </div>
                  {isApplied ? (
                    <Button disabled>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Applied
                    </Button>
                  ) : (
                    <Button onClick={startAIInterview} disabled={isStartingInterview}>
                      {isStartingInterview ? "Preparing Interview..." : "Apply with AI Interview"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="company" className="space-y-4">
              <Card id="company-info">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 rounded-md">
                      <AvatarImage src={jobData.companyLogo} alt={jobData.company} />
                      <AvatarFallback className="rounded-md">{jobData.company.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{jobData.companyInfo.name}</CardTitle>
                      <CardDescription>
                        <a
                          href={jobData.companyInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {jobData.companyInfo.website}
                        </a>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{jobData.companyInfo.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Industry:</span> {jobData.companyInfo.industry}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Company Size:</span> {jobData.companyInfo.size}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Founded:</span> {jobData.companyInfo.founded}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Headquarters:</span> {jobData.companyInfo.headquarters}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <a href={`/companies/${jobData.company.toLowerCase().replace(/\s+/g, "-")}`}>
                      View All Jobs at {jobData.company}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="similar" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Similar Jobs</CardTitle>
                  <CardDescription>Jobs that match your profile and interests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {jobData.similarJobs.map((job) => (
                    <div key={job.id} className="border rounded-md p-4 hover:border-primary transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{job.title}</h3>
                          <p className="text-muted-foreground">{job.company}</p>
                          <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            {job.location}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {job.match}% Match
                          </Badge>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/jobs/${job.id}`}>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/jobs">
                      View More Jobs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Job Type:</span> {jobData.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Location:</span> {jobData.location}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Salary:</span> {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Posted:</span> {jobData.posted}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Deadline:</span> {jobData.deadline}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              {isApplied ? (
                <Button disabled className="w-full">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Applied
                </Button>
              ) : (
                <Button onClick={startAIInterview} disabled={isStartingInterview} className="w-full">
                  {isStartingInterview ? "Preparing Interview..." : "Apply with AI Interview"}
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Apply Online</h3>
                    <p className="text-sm text-muted-foreground">Submit your application through our platform</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">AI Interview</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete an initial video interview with our AI system
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Technical Assessment</h3>
                    <p className="text-sm text-muted-foreground">
                      Demonstrate your skills through a technical challenge
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Final Interview</h3>
                    <p className="text-sm text-muted-foreground">Meet with the team for a final interview</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl font-bold">4.5</div>
                <div className="flex">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" strokeWidth={0} fill="url(#half-star)" />
                  <svg width="0" height="0">
                    <defs>
                      <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
                        <stop offset="50%" stopColor="#facc15" />
                        <stop offset="50%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="text-sm text-muted-foreground">(128 reviews)</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm w-24">Work/Life Balance</span>
                  <div className="h-2 flex-1 bg-gray-200 rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <span className="text-sm font-medium">4.3</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm w-24">Compensation</span>
                  <div className="h-2 flex-1 bg-gray-200 rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: "90%" }}></div>
                  </div>
                  <span className="text-sm font-medium">4.5</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm w-24">Culture</span>
                  <div className="h-2 flex-1 bg-gray-200 rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: "95%" }}></div>
                  </div>
                  <span className="text-sm font-medium">4.8</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm w-24">Management</span>
                  <div className="h-2 flex-1 bg-gray-200 rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: "80%" }}></div>
                  </div>
                  <span className="text-sm font-medium">4.0</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <a href={`/companies/${jobData.company.toLowerCase().replace(/\s+/g, "-")}/reviews`}>Read Reviews</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

