"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Calendar,
  Clock,
  Video,
  BarChart,
  Download,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Meh,
  Frown,
  AlertTriangle,
  Briefcase,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"

// Mock interview data
const interviewData = {
  id: 1,
  candidateName: "Alex Johnson",
  candidateId: 1,
  position: "Frontend Developer",
  date: "Mar 15, 2025",
  time: "2:00 PM",
  duration: "45 minutes",
  type: "AI Video Interview",
  status: "Completed",
  overallScore: 85,
  questions: [
    {
      id: 1,
      question: "Tell me about your experience with React and component-based architecture.",
      videoAnalysis: {
        confidenceScore: 92,
        faceDetectionRate: 98,
        emotions: {
          happy: 15,
          neutral: 70,
          sad: 0,
          surprised: 10,
          angry: 5,
        },
        duration: 58,
      },
      feedback:
        "The candidate demonstrated strong knowledge of React and component architecture. They maintained good eye contact and appeared confident throughout their response. Their explanation of component reusability was particularly insightful.",
    },
    {
      id: 2,
      question: "How do you handle state management in large applications?",
      videoAnalysis: {
        confidenceScore: 88,
        faceDetectionRate: 95,
        emotions: {
          happy: 10,
          neutral: 75,
          sad: 0,
          surprised: 5,
          angry: 10,
        },
        duration: 62,
      },
      feedback:
        "The candidate showed good understanding of state management approaches including Redux and Context API. They appeared slightly less confident when discussing performance optimization, but overall maintained good composure and provided relevant examples.",
    },
    {
      id: 3,
      question: "Describe a challenging UI problem you've solved and your approach.",
      videoAnalysis: {
        confidenceScore: 95,
        faceDetectionRate: 99,
        emotions: {
          happy: 25,
          neutral: 65,
          sad: 0,
          surprised: 5,
          angry: 5,
        },
        duration: 65,
      },
      feedback:
        "Excellent response with a detailed walkthrough of a complex UI challenge. The candidate appeared enthusiastic and engaged, using appropriate hand gestures to emphasize key points. Their problem-solving approach was methodical and well-articulated.",
    },
    {
      id: 4,
      question: "How do you ensure your code is maintainable and scalable?",
      videoAnalysis: {
        confidenceScore: 85,
        faceDetectionRate: 92,
        emotions: {
          happy: 5,
          neutral: 80,
          sad: 5,
          surprised: 5,
          angry: 5,
        },
        duration: 55,
      },
      feedback:
        "The candidate provided solid principles for code maintainability including documentation, testing, and code reviews. They appeared more neutral during this response, possibly indicating this is an area they approach more methodically rather than passionately.",
    },
    {
      id: 5,
      question: "What's your experience with responsive design and accessibility?",
      videoAnalysis: {
        confidenceScore: 78,
        faceDetectionRate: 90,
        emotions: {
          happy: 10,
          neutral: 70,
          sad: 10,
          surprised: 5,
          angry: 5,
        },
        duration: 50,
      },
      feedback:
        "The candidate demonstrated adequate knowledge of responsive design principles but showed less confidence when discussing accessibility standards. Their facial expressions suggested some uncertainty in this area, which aligns with their verbal response indicating this is an area they're actively working to improve.",
    },
  ],
  summary: {
    strengths: [
      "Strong technical knowledge of React and component architecture",
      "Excellent problem-solving abilities with clear communication",
      "Confident presentation style with good engagement",
    ],
    weaknesses: [
      "Less experienced with accessibility standards",
      "Occasional moments of uncertainty when discussing optimization",
    ],
    recommendation:
      "Recommend advancing to technical interview. The candidate shows strong potential and aligns well with the position requirements.",
  },
}

export default function InterviewDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")

    if (!token || role !== "admin") {
      router.push("/auth/login")
    }
  }, [router])

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
        title: "Notes saved",
        description: "Your notes have been saved successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save notes. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    toast({
      title: "Report downloaded",
      description: "The interview report has been downloaded successfully.",
    })
  }

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return <Smile className="h-5 w-5 text-green-500" />
      case "sad":
      case "angry":
        return <Frown className="h-5 w-5 text-red-500" />
      case "surprised":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      default:
        return <Meh className="h-5 w-5 text-yellow-500" />
    }
  }

  const currentQuestion = interviewData.questions[currentQuestionIndex]

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Interview Details</h1>
          <p className="text-muted-foreground mt-1">Review AI video interview results and analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/interviews">Back to Interviews</Link>
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interview Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Link href={`/admin/candidates/${interviewData.candidateId}`} className="text-primary hover:underline">
                  {interviewData.candidateName}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{interviewData.position}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{interviewData.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {interviewData.time} ({interviewData.duration})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline">{interviewData.type}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <BarChart className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2 flex-1">
                  <span>Overall Score:</span>
                  <Progress value={interviewData.overallScore} className="h-2 flex-1" />
                  <span className="font-medium">{interviewData.overallScore}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {interviewData.questions.map((q, index) => (
                  <Button
                    key={q.id}
                    variant={currentQuestionIndex === index ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Question {index + 1}</span>
                        <Progress value={q.videoAnalysis.confidenceScore} className="h-1.5 w-16" />
                      </div>
                      <p className="text-xs mt-1 truncate max-w-[220px]">{q.question}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp className="h-5 w-5 text-green-500" />
                <span className="font-medium">Strengths</span>
              </div>
              <ul className="list-disc pl-5 mb-4 space-y-1 text-sm">
                {interviewData.summary.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>

              <div className="flex items-center gap-2 mb-4">
                <ThumbsDown className="h-5 w-5 text-red-500" />
                <span className="font-medium">Areas for Improvement</span>
              </div>
              <ul className="list-disc pl-5 mb-4 space-y-1 text-sm">
                {interviewData.summary.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>

              <div className="bg-muted p-3 rounded-md text-sm">{interviewData.summary.recommendation}</div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
              <CardDescription className="text-base">{currentQuestion.question}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-6 rounded-md mb-6">
                <h3 className="font-medium mb-6">Video Analysis</h3>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Confidence Score</p>
                    <div className="flex items-center gap-2">
                      <Progress value={currentQuestion.videoAnalysis.confidenceScore} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{currentQuestion.videoAnalysis.confidenceScore}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Face Detection Rate</p>
                    <div className="flex items-center gap-2">
                      <Progress value={currentQuestion.videoAnalysis.faceDetectionRate} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{currentQuestion.videoAnalysis.faceDetectionRate}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-3">Emotion Analysis</p>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(currentQuestion.videoAnalysis.emotions).map(([emotion, count]) => (
                      <div key={emotion} className="text-center">
                        <div className="h-24 bg-gray-200 rounded-md relative overflow-hidden">
                          <div
                            className="absolute bottom-0 w-full bg-primary"
                            style={{
                              height: `${((count as number) / Math.max(...(Object.values(currentQuestion.videoAnalysis.emotions) as number[]))) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          {getEmotionIcon(emotion)}
                          <p className="text-xs capitalize">{emotion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">AI Feedback</h3>
                  <div className="p-4 border rounded-md">
                    <p>{currentQuestion.feedback}</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Your Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add your notes about this response..."
                    className="min-h-[100px] mt-2"
                    value={notes}
                    onChange={handleNotesChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentQuestionIndex(Math.min(interviewData.questions.length - 1, currentQuestionIndex + 1))
                  }
                  disabled={currentQuestionIndex === interviewData.questions.length - 1}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Notes"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video Playback</CardTitle>
              <CardDescription>Review the candidate's video response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-900 rounded-md flex items-center justify-center">
                <div className="text-white text-center">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Video playback would be available here in a production environment</p>
                  <p className="text-sm text-gray-400 mt-2">
                    For privacy and demo purposes, actual video is not displayed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

