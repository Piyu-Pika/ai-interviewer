"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Mock data
const applications = [
  {
    id: 1,
    position: "Frontend Developer",
    company: "TechCorp",
    status: "Interview Scheduled",
    date: "Mar 15, 2025",
    progress: 60,
  },
  {
    id: 2,
    position: "UX Designer",
    company: "CreativeMinds",
    status: "Application Submitted",
    date: "Mar 10, 2025",
    progress: 20,
  },
  {
    id: 3,
    position: "Full Stack Developer",
    company: "WebSolutions",
    status: "AI Interview Completed",
    date: "Mar 5, 2025",
    progress: 40,
  },
]

const interviews = [
  {
    id: 1,
    position: "Frontend Developer",
    company: "TechCorp",
    type: "AI Screening",
    date: "Mar 18, 2025",
    time: "2:00 PM",
    status: "Upcoming",
  },
  {
    id: 2,
    position: "Full Stack Developer",
    company: "WebSolutions",
    type: "Technical Interview",
    date: "Mar 20, 2025",
    time: "11:00 AM",
    status: "Upcoming",
  },
  {
    id: 3,
    position: "UX Designer",
    company: "CreativeMinds",
    type: "AI Screening",
    date: "Mar 5, 2025",
    time: "10:00 AM",
    status: "Completed",
  },
]

const recommendedJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "InnovateX",
    location: "Remote",
    match: 95,
  },
  {
    id: 2,
    title: "React Developer",
    company: "TechGrowth",
    location: "San Francisco, CA",
    match: 88,
  },
  {
    id: 3,
    title: "UI/UX Developer",
    company: "DesignHub",
    location: "New York, NY",
    match: 82,
  },
]

export default function CandidateDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")

    if (!token || role !== "candidate") {
      router.push("/auth/login")
    } else {
      setIsAuthenticated(true)
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Candidate Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your job applications and interviews</p>
        </div>
        <Button asChild>
          <Link href="/jobs">Browse Jobs</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">+2 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Next: Mar 18, 2025</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <Progress value={75} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="recommended">Recommended Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{application.position}</h3>
                    <p className="text-muted-foreground">{application.company}</p>
                    <div className="flex items-center mt-2">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Applied on {application.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <Badge variant={application.status.includes("Interview") ? "default" : "secondary"}>
                      {application.status}
                    </Badge>
                    <div className="w-full md:w-48">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{application.progress}%</span>
                      </div>
                      <Progress value={application.progress} className="h-2" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/candidate/applications/${application.id}`}>View Details</Link>
                  </Button>
                  {application.status === "AI Interview Completed" && <Button size="sm">View Feedback</Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
          {interviews.map((interview) => (
            <Card key={interview.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{interview.position}</h3>
                    <p className="text-muted-foreground">{interview.company}</p>
                    <div className="flex items-center mt-2">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{interview.date}</span>
                      <Clock className="h-4 w-4 ml-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{interview.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <Badge variant={interview.status === "Upcoming" ? "default" : "secondary"}>
                      {interview.status}
                    </Badge>
                    <Badge variant="outline">{interview.type}</Badge>
                  </div>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  {interview.status === "Upcoming" ? (
                    <>
                      {interview.type === "AI Screening" ? (
                        <Button asChild>
                          <Link href={`/candidate/interviews/${interview.id}`}>Start Interview</Link>
                        </Button>
                      ) : (
                        <Button variant="outline">Join Meeting</Button>
                      )}
                    </>
                  ) : (
                    <Button variant="outline" asChild>
                      <Link href={`/candidate/interviews/${interview.id}/feedback`}>View Feedback</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommended" className="space-y-4">
          {recommendedJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-muted-foreground">{job.company}</p>
                    <div className="flex items-center mt-2">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{job.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {job.match}% Match
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/jobs/${job.id}`}>View Job</Link>
                  </Button>
                  <Button>Apply Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

