"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, MapPin, FileText } from "lucide-react"

interface Interview {
  id: number
  type: string
  date: string
  time: string
  status: "Upcoming" | "Scheduled" | "Completed"
  duration: string
}

interface Document {
  name: string
  type: string
  size: string
  uploaded: string
}

interface Application {
  id: number
  position: string
  company: string
  status: string
  date: string
  progress: number
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
  interviews: Interview[]
  documents: Document[]
}

// Mock data - in a real app, this would come from an API
const mockApplications: Application[] = [
  {
    id: 1,
    position: "Frontend Developer",
    company: "TechCorp",
    status: "Interview Scheduled",
    date: "Mar 15, 2025",
    progress: 60,
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    description: "We are looking for an experienced Frontend Developer to join our team. The ideal candidate will have strong experience with React, TypeScript, and modern web development practices.",
    requirements: [
      "5+ years of experience with React",
      "Strong TypeScript skills",
      "Experience with modern build tools",
      "Understanding of web accessibility",
      "Experience with testing frameworks"
    ],
    interviews: [
      {
        id: 1,
        type: "AI Screening",
        date: "Mar 18, 2025",
        time: "2:00 PM",
        status: "Upcoming",
        duration: "45 minutes"
      },
      {
        id: 2,
        type: "Technical Interview",
        date: "Mar 20, 2025",
        time: "11:00 AM",
        status: "Scheduled",
        duration: "1 hour"
      }
    ],
    documents: [
      {
        name: "Resume",
        type: "PDF",
        size: "2.4 MB",
        uploaded: "Mar 15, 2025"
      },
      {
        name: "Cover Letter",
        type: "PDF",
        size: "1.2 MB",
        uploaded: "Mar 15, 2025"
      }
    ]
  },
  {
    id: 2,
    position: "UX Designer",
    company: "CreativeMinds",
    status: "Application Submitted",
    date: "Mar 10, 2025",
    progress: 20,
    location: "Remote",
    type: "Full-time",
    salary: "$100,000 - $130,000",
    description: "Join our creative team as a UX Designer. We're looking for someone who can create beautiful, intuitive user experiences.",
    requirements: [
      "3+ years of UX design experience",
      "Proficiency in Figma and Adobe XD",
      "Strong portfolio",
      "Experience with user research",
      "Understanding of accessibility standards"
    ],
    interviews: [],
    documents: [
      {
        name: "Portfolio",
        type: "PDF",
        size: "5.2 MB",
        uploaded: "Mar 10, 2025"
      }
    ]
  }
]

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchApplication = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        const foundApplication = mockApplications.find(app => app.id === parseInt(params.id))
        if (foundApplication) {
          setApplication(foundApplication)
        } else {
          router.push('/candidate/applications')
        }
      } catch (error) {
        console.error('Error fetching application:', error)
        router.push('/candidate/applications')
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (!application) {
    return null
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{application.position}</h1>
          <p className="text-muted-foreground mt-1">{application.company}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/candidate/applications">Back to Applications</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Track your application progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Current Stage</p>
                    <Badge variant={application.status.includes("Interview") ? "default" : "secondary"}>
                      {application.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Progress</p>
                    <p className="text-sm text-muted-foreground">{application.progress}%</p>
                  </div>
                </div>
                <Progress value={application.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Location</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {application.location}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-muted-foreground">{application.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Salary Range</p>
                  <p className="text-sm text-muted-foreground">{application.salary}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Applied Date</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {application.date}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{application.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {application.requirements.map((req, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{req}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {application.interviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.interviews.map((interview) => (
                  <div key={interview.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={interview.status === "Upcoming" ? "default" : "secondary"}>
                        {interview.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{interview.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {interview.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      {interview.time}
                    </div>
                    {interview.type === "AI Screening" ? (
                      <Button className="w-full" asChild>
                        <Link href={`/candidate/interviews/${interview.id}`}>Start Interview</Link>
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full">Join Meeting</Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.documents.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.type} • {doc.size} • Uploaded {doc.uploaded}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 