'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { interviews, jobs, candidates } from "@/lib/mock-data"
import { ArrowLeft, Video, FileText, Download, Clock, User, Building } from "lucide-react"

export default function InterviewResultPage() {
  const params = useParams()
  const interviewId = params.id as string
  
  // Get interview data from mock data
  const interview = interviews.find(i => i.id === interviewId)
  const job = interview ? jobs.find(j => j.id === interview.jobId) : null
  const candidate = interview ? candidates.find(c => c.id === interview.candidateId) : null
  
  // Component state
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  // Simulate loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])
  
  // If interview not found
  if (!interview || !job) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Interview Not Found</h2>
            <p className="text-muted-foreground">
              The interview you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.href = "/candidate/assessments"}
            >
              Back to Assessments
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Current question and answer
  const currentQuestion = interview.questions[activeQuestionIndex]
  const currentAnswer = interview.answers.find(a => a.questionId === currentQuestion.id)
  
  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => window.location.href = "/candidate/assessments"}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Assessments
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
            <div className="flex items-center mt-1 text-muted-foreground">
              <Building className="mr-1 h-4 w-4" />
              <span>{job.company}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize bg-green-50">
              Interview Completed
            </Badge>
            <Badge variant={interview.overallScore >= 80 ? "success" : "default"}>
              Score: {interview.overallScore}/100
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Interview Summary Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Interview Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{new Date(interview.date).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Questions</div>
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{interview.questions.length} questions ({interview.answers.length} answered)</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Candidate</div>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{candidate?.name || "Unknown"}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="text-sm font-medium mb-2">Overall Performance</div>
            <Progress value={interview.overallScore} className="h-2 mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Question Navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Question Responses</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {activeQuestionIndex + 1} of {interview.questions.length}
          </span>
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))} 
              disabled={activeQuestionIndex === 0}
            >
              &lt;
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setActiveQuestionIndex(prev => Math.min(interview.questions.length - 1, prev + 1))} 
              disabled={activeQuestionIndex === interview.questions.length - 1}
            >
              &gt;
            </Button>
          </div>
        </div>
      </div>
      
      {/* Question and Answer Details */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">Question {activeQuestionIndex + 1}</CardTitle>
            <Badge variant="outline" className="capitalize">
              {currentQuestion.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-md bg-muted/50">
            <p className="font-medium mb-2">Question:</p>
            <p>{currentQuestion.text}</p>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p>Loading response data...</p>
            </div>
          ) : (
            <Tabs defaultValue="transcript">
              <TabsList>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="video">Video Recording</TabsTrigger>
                <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transcript" className="space-y-4 pt-4">
                {currentAnswer?.transcript ? (
                  <div className="p-4 border rounded-md">
                    <p className="font-medium mb-2">Your Answer:</p>
                    <p>{currentAnswer.transcript}</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No transcript available for this answer.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="video" className="space-y-4 pt-4">
                {currentAnswer?.videoUrl ? (
                  <div className="space-y-4">
                    <div className="aspect-video bg-black rounded-md overflow-hidden">
                      <video 
                        src={currentAnswer.videoUrl} 
                        controls 
                        className="w-full h-full" 
                        poster="/placeholder.svg?height=400&width=600&text=Video+Recording"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-4 w-4" /> Download Recording
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No video recording available for this answer.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="feedback" className="space-y-6 pt-4">
                {currentAnswer?.feedback ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Score</span>
                      <Badge 
                        variant={currentAnswer.feedback.score >= 80 ? "success" : "default"}
                        className="text-lg"
                      >
                        {currentAnswer.feedback.score}/100
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Feedback:</h4>
                      <p className="p-4 border rounded-md">{currentAnswer.feedback.feedback}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Strengths:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {currentAnswer.feedback.strengths.map((strength, i) => (
                            <li key={i}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Areas for Improvement:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {currentAnswer.feedback.improvements.map((improvement, i) => (
                            <li key={i}>{improvement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Keywords Mentioned:</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentAnswer.feedback.keywords.map((keyword, i) => (
                          <Badge key={i} variant="outline" className="bg-green-50">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No feedback available for this answer.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter className="justify-between">
          <Button 
            variant="outline" 
            onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={activeQuestionIndex === 0}
          >
            Previous Question
          </Button>
          <Button 
            onClick={() => setActiveQuestionIndex(prev => Math.min(interview.questions.length - 1, prev + 1))}
            disabled={activeQuestionIndex === interview.questions.length - 1}
          >
            Next Question
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 