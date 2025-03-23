"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Phone, MapPin, FileText, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react"

// Mock candidate data
const candidateData = {
  id: 1,
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "(555) 123-4567",
  location: "San Francisco, CA",
  position: "Frontend Developer",
  appliedDate: "Mar 10, 2025",
  stage: "AI Interview",
  status: "Active",
  resume: "/resume.pdf",
  aiScore: 85,
  skills: ["React", "TypeScript", "CSS", "HTML", "JavaScript"],
  experience: "5 years",
  education: "B.S. Computer Science, Stanford University",
  interviews: [
    {
      id: 1,
      type: "AI Screening",
      date: "Mar 15, 2025",
      status: "Completed",
      score: 85,
      feedback:
        "Strong technical skills demonstrated in React and TypeScript. Good problem-solving approach. Could improve on system design explanations.",
    },
  ],
  notes:
    "Candidate has a strong background in frontend development. Previous experience at tech startups. Looking for a role with growth opportunities.",
}

export default function CandidateDetailPailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [stage, setStage] = useState(candidateData.stage)
  const [status, setStatus] = useState(candidateData.status)
  const [notes, setNotes] = useState(candidateData.notes)
  const [isLoading, setIsLoading] = useState(false)

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")

    if (!token || role !== "admin") {
      router.push("/auth/login")
    }
  }, [router])

  const handleStageChange = (value: string) => {
    setStage(value)
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would save the changes to a database
      // For demo purposes, we'll just simulate a successful save

      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Changes saved",
        description: "Candidate information has been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const scheduleInterview = () => {
    router.push(`/admin/interviews/schedule?candidate=${params.id}`)
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{candidateData.name}</h1>
          <p className="text-muted-foreground mt-1">
            {candidateData.position} • Applied on {candidateData.appliedDate}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/candidates">Back to Candidates</Link>
          </Button>
          <Button onClick={scheduleInterview}>Schedule Interview</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{candidateData.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{candidateData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{candidateData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{candidateData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link href={candidateData.resume}>View Resume</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Stage</Label>
                <Select value={stage} onValueChange={handleStageChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Application Review">Application Review</SelectItem>
                    <SelectItem value="AI Interview">AI Interview</SelectItem>
                    <SelectItem value="Technical Interview">Technical Interview</SelectItem>
                    <SelectItem value="Final Interview">Final Interview</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Hired">Hired</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Hired">Hired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} disabled={isLoading} className="w-full">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Overall Score</span>
                  <span className="font-bold">{candidateData.aiScore}/100</span>
                </div>
                <Progress value={candidateData.aiScore} className="h-2" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {candidateData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Experience</p>
                <p className="text-sm">{candidateData.experience}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Education</p>
                <p className="text-sm">{candidateData.education}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="interviews" className="space-y-4">
            <TabsList>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="interviews">
              <Card>
                <CardHeader>
                  <CardTitle>Interview History</CardTitle>
                  <CardDescription>View past and upcoming interviews for this candidate</CardDescription>
                </CardHeader>
                <CardContent>
                  {candidateData.interviews.length > 0 ? (
                    <div className="space-y-6">
                      {candidateData.interviews.map((interview) => (
                        <div key={interview.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{interview.type}</h3>
                              <div className="flex items-center mt-2">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{interview.date}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-2">
                              <Badge variant={interview.status === "Completed" ? "default" : "secondary"}>
                                {interview.status}
                              </Badge>
                              {interview.score && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">Score: {interview.score}/100</span>
                                  <Progress value={interview.score} className="h-2 w-16" />
                                </div>
                              )}
                            </div>
                          </div>
                          {interview.feedback && (
                            <div className="bg-muted p-3 rounded-md">
                              <p className="text-sm font-medium mb-1">Feedback:</p>
                              <p className="text-sm">{interview.feedback}</p>
                            </div>
                          )}
                          <div className="flex justify-end mt-4">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/interviews/${interview.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No interviews scheduled yet</p>
                      <Button onClick={scheduleInterview} className="mt-4">
                        Schedule Interview
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Candidate Notes</CardTitle>
                  <CardDescription>Add notes and observations about this candidate</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add your notes here..."
                    className="min-h-[200px]"
                    value={notes}
                    onChange={handleNotesChange}
                  />
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Notes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Evaluation Summary</CardTitle>
              <CardDescription>Overall assessment based on interviews and AI screening</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <h3 className="font-medium">Strengths</h3>
                    </div>
                    <ul className="text-sm space-y-1">
                      <li>Strong React and TypeScript skills</li>
                      <li>Good problem-solving approach</li>
                      <li>Relevant industry experience</li>
                    </ul>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <h3 className="font-medium">Areas for Improvement</h3>
                    </div>
                    <ul className="text-sm space-y-1">
                      <li>System design knowledge</li>
                      <li>Backend integration experience</li>
                    </ul>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      <h3 className="font-medium">Considerations</h3>
                    </div>
                    <ul className="text-sm space-y-1">
                      <li>Salary expectations on higher end</li>
                      <li>Looking for remote-first position</li>
                    </ul>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" asChild>
                    <Link href={`/admin/candidates/${params.id}/report`}>Generate Report</Link>
                  </Button>
                  <Button>Move to Next Stage</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

