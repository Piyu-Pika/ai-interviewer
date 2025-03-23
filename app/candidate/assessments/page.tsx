'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, Clock, Video, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import AIInterview from "@/components/ai-interview"
import { jobs, interviews } from "@/lib/mock-data"

export default function CandidateAssessmentsPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [isStartingInterview, setIsStartingInterview] = useState(false)
  const [isInterviewActive, setIsInterviewActive] = useState(false)
  
  // Get pending and completed interviews (mock data)
  const pendingInterviews = interviews.filter(interview => 
    interview.status === 'scheduled'
  )
  
  const completedInterviews = interviews.filter(interview => 
    interview.status === 'completed'
  )
  
  // Handle interview start
  const startInterview = (jobId: string) => {
    setSelectedJobId(jobId)
    setIsStartingInterview(true)
    // This would typically check if user is authorized, etc.
    setTimeout(() => {
      setIsStartingInterview(false)
      setIsInterviewActive(true)
    }, 1500)
  }
  
  // Handle interview completion
  const handleInterviewComplete = (data: any) => {
    console.log('Interview completed:', data)
    setIsInterviewActive(false)
    // In a real app, this would save data to backend
    alert('Interview completed successfully! Your responses have been recorded.')
    // Redirect to results page
    window.location.href = '/candidate/dashboard'
  }
  
  // Handle interview cancellation
  const handleInterviewCancel = () => {
    setIsInterviewActive(false)
    setSelectedJobId(null)
  }
  
  if (isInterviewActive && selectedJobId) {
    const job = jobs.find(job => job.id === selectedJobId)
    
    return (
      <div className="container py-8">
        <AIInterview 
          jobId={selectedJobId}
          jobTitle={job?.title}
          onComplete={handleInterviewComplete}
          onCancel={handleInterviewCancel}
        />
      </div>
    )
  }
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground mt-1">
            View and complete your pending assessments and interviews
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingInterviews.length > 0 && (
              <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {pendingInterviews.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all-jobs">Available Jobs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {pendingInterviews.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">
                  No pending interviews or assessments.
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingInterviews.map(interview => {
              const job = jobs.find(job => job.id === interview.jobId)
              
              return (
                <Card key={interview.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{job?.title || "Unknown Position"}</CardTitle>
                        <CardDescription className="mt-1">{job?.company || "Unknown Company"}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50">Scheduled</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-sm">
                        <CalendarClock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Scheduled for: {new Date(interview.date).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Duration: ~{Math.round(interview.questions.reduce((sum, q) => sum + q.expectedDuration, 0) / 60)} minutes</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">Interview Format:</h4>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="bg-blue-50">
                          <Video className="mr-1 h-3 w-3" /> Video Interview
                        </Badge>
                        <Badge variant="outline" className="bg-purple-50">
                          <FileText className="mr-1 h-3 w-3" /> {interview.questions.length} Questions
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => startInterview(interview.jobId)}
                      disabled={isStartingInterview}
                    >
                      {isStartingInterview ? "Preparing Interview..." : "Start Interview"}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {completedInterviews.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">
                  No completed interviews or assessments.
                </p>
              </CardContent>
            </Card>
          ) : (
            completedInterviews.map(interview => {
              const job = jobs.find(job => job.id === interview.jobId)
              
              return (
                <Card key={interview.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{job?.title || "Unknown Position"}</CardTitle>
                        <CardDescription className="mt-1">{job?.company || "Unknown Company"}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-green-50">Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-sm">
                        <CalendarClock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Completed on: {new Date(interview.date).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Badge variant={interview.overallScore >= 80 ? "success" : "default"} className="text-xs">
                          Score: {interview.overallScore}/100
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">Performance:</h4>
                      <div className="space-y-2">
                        {interview.answers.map((answer, index) => (
                          <div key={index} className="flex items-center text-sm">
                            {answer.feedback?.score && answer.feedback.score >= 80 ? (
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                            )}
                            <span className="truncate">
                              {interview.questions.find(q => q.id === answer.questionId)?.text || `Question ${index + 1}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" onClick={() => window.location.href = `/candidate/results/${interview.id}`}>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              )
            })
          )}
        </TabsContent>
        
        <TabsContent value="all-jobs" className="space-y-4">
          {jobs.filter(job => !job.isPrivate).map(job => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle className="text-xl">{job.title}</CardTitle>
                <CardDescription className="mt-1">{job.company} • {job.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-3 mb-4">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.slice(0, 3).map((requirement, index) => (
                    <Badge key={index} variant="outline">
                      {requirement}
                    </Badge>
                  ))}
                  {job.requirements.length > 3 && (
                    <Badge variant="outline">+{job.requirements.length - 3} more</Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => window.location.href = `/jobs/${job.id}`}>
                  View Job
                </Button>
                <Button className="ml-2" onClick={() => startInterview(job.id)}>
                  Apply with AI Interview
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
} 