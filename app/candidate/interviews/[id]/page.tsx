"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VideoInterview from "@/components/video-interview"
import { Video, MessageSquare, AlertCircle } from "lucide-react"

// Mock interview data
const interviewData = {
  id: 1,
  position: "Frontend Developer",
  company: "TechCorp",
  description:
    "This interview will assess your frontend development skills, focusing on React, JavaScript, and UI/UX principles.",
  questions: [
    "Tell me about your experience with React and component-based architecture.",
    "How do you handle state management in large applications?",
    "Describe a challenging UI problem you've solved and your approach.",
    "How do you ensure your code is maintainable and scalable?",
    "What's your experience with responsive design and accessibility?",
  ],
}

export default function InterviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(interviewData.questions.length).fill(""))
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [interviewMode, setInterviewMode] = useState<"text" | "video">("text")
  const [videoData, setVideoData] = useState<any[]>([])
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [fullScreenWarningShown, setFullScreenWarningShown] = useState(false)
  const fullScreenTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
    }
  }, [router])

  // Handle full screen on component mount
  useEffect(() => {
    const enterFullScreen = () => {
      const element = document.documentElement
      if (element.requestFullscreen) {
        element.requestFullscreen()
      }
      setIsFullScreen(true)
    }

    // Enter full screen when the component mounts
    enterFullScreen()

    // Set up listener for full screen change
    const handleFullScreenChange = () => {
      const isCurrentlyFullScreen = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      )
      
      setIsFullScreen(isCurrentlyFullScreen)
      
      // Handle exit from full screen
      if (!isCurrentlyFullScreen && !isCompleted) {
        // Show warning if not already shown
        if (!fullScreenWarningShown) {
          toast({
            variant: "destructive",
            title: "Warning: Full Screen Required",
            description: "Please return to full screen mode or your interview may be rejected.",
          })
          setFullScreenWarningShown(true)
          
          // Set timeout to end interview if still not in full screen
          if (fullScreenTimeoutRef.current) {
            clearTimeout(fullScreenTimeoutRef.current)
          }
          
          fullScreenTimeoutRef.current = setTimeout(() => {
            if (!document.fullscreenElement) {
              toast({
                variant: "destructive",
                title: "Interview Terminated",
                description: "Your interview has been terminated due to exiting full screen mode.",
              })
              router.push("/candidate")
            }
          }, 10000) // Give 10 seconds to return to full screen
        }
      } else if (isCurrentlyFullScreen) {
        // Reset warning state when returned to full screen
        setFullScreenWarningShown(false)
        if (fullScreenTimeoutRef.current) {
          clearTimeout(fullScreenTimeoutRef.current)
          fullScreenTimeoutRef.current = null
        }
      }
    }

    document.addEventListener("fullscreenchange", handleFullScreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange)
    document.addEventListener("mozfullscreenchange", handleFullScreenChange)
    document.addEventListener("MSFullscreenChange", handleFullScreenChange)

    // Clean up event listeners on component unmount
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange)
      
      if (fullScreenTimeoutRef.current) {
        clearTimeout(fullScreenTimeoutRef.current)
      }
    }
  }, [isCompleted, fullScreenWarningShown, router, toast])

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentAnswer(e.target.value)
  }

  const handleNextQuestion = async () => {
    if (interviewMode === "text" && currentAnswer.trim() === "") {
      toast({
        variant: "destructive",
        title: "Answer required",
        description: "Please provide an answer before continuing.",
      })
      return
    }

    setIsLoading(true)

    try {
      if (interviewMode === "text") {
        // Save current answer
        const updatedAnswers = [...answers]
        updatedAnswers[currentQuestion] = currentAnswer
        setAnswers(updatedAnswers)

        // Generate AI feedback for the answer
        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt: `You are an AI interviewer evaluating a candidate for a ${interviewData.position} position. 
                  The question was: "${interviewData.questions[currentQuestion]}"
                  The candidate's answer is: "${currentAnswer}"
                  Provide a brief, constructive feedback on this answer. Be encouraging but honest.`,
        })

        setFeedback(text)
      }

      // Move to next question or complete interview
      if (currentQuestion < interviewData.questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1)
          setCurrentAnswer("")
          setFeedback("")
          setIsLoading(false)
        }, 1000)
      } else {
        setIsCompleted(true)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error generating feedback:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your answer. Please try again.",
      })
      setIsLoading(false)
    }
  }

  const handleVideoComplete = (data: any) => {
    // Save video interview data
    const newVideoData = [...videoData]
    newVideoData[currentQuestion] = data
    setVideoData(newVideoData)

    // Generate feedback based on video data
    generateVideoFeedback(data)
  }

  const generateVideoFeedback = async (data: any) => {
    setIsLoading(true)

    try {
      // Generate AI feedback based on video data and transcribed answer
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `You are an AI interviewer evaluating a candidate for a ${interviewData.position} position.
                The question was: "${interviewData.questions[currentQuestion]}"
                The candidate's video interview data shows:
                - Confidence score: ${data.confidenceScore}%
                - Face detection rate: ${data.faceDetectionRate}%
                - Interview duration: ${data.duration} seconds
                
                The candidate's transcribed answer was: "${data.transcribedAnswer || "No transcription available."}"
                
                Provide a brief, constructive feedback on their response and presentation. Be encouraging but honest.`,
      })

      setFeedback(text)

      // Wait a moment before allowing to continue
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error generating video feedback:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze your interview. Please try again.",
      })
      setIsLoading(false)
    }
  }

  const handleComplete = () => {
    toast({
      title: "Interview completed",
      description: "Your interview has been submitted successfully.",
    })
    router.push("/candidate")
  }

  const renderInterviewContent = () => {
    if (isCompleted) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Interview Completed</CardTitle>
            <CardDescription>
              Thank you for completing the interview. Your responses have been recorded.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-primary/10 p-4 rounded-md">
              <p className="font-medium">What happens next?</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>Our team will review your interview responses</li>
                <li>You'll receive detailed feedback within 48 hours</li>
                <li>If selected, you'll be invited for the next round</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleComplete} className="w-full">
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      )
    }

    return (
      <>
        <Tabs
          value={interviewMode}
          onValueChange={(value) => setInterviewMode(value as "text" | "video")}
          className="mb-6"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Text Interview</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Video Interview</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <Card>
              <CardHeader>
                <CardTitle>Question {currentQuestion + 1}</CardTitle>
                <CardDescription className="text-base font-medium mt-2">
                  {interviewData.questions[currentQuestion]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Type your answer here..."
                  className="min-h-[200px]"
                  value={currentAnswer}
                  onChange={handleAnswerChange}
                  disabled={isLoading}
                />

                {feedback && (
                  <div className="mt-4 p-4 bg-primary/10 rounded-md">
                    <p className="font-medium mb-2">Feedback:</p>
                    <p className="text-sm">{feedback}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/candidate")} disabled={isLoading}>
                  Save & Exit
                </Button>
                <Button onClick={handleNextQuestion} disabled={isLoading}>
                  {isLoading
                    ? "Processing..."
                    : currentQuestion === interviewData.questions.length - 1
                      ? "Complete Interview"
                      : "Next Question"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="video">
            {videoData[currentQuestion] ? (
              <Card>
                <CardHeader>
                  <CardTitle>Question {currentQuestion + 1}</CardTitle>
                  <CardDescription className="text-base font-medium mt-2">
                    {interviewData.questions[currentQuestion]}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-6 rounded-md mb-4">
                    <h3 className="font-medium mb-4">Video Analysis Results</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Confidence Score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={videoData[currentQuestion].confidenceScore} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{videoData[currentQuestion].confidenceScore}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Face Detection Rate</p>
                        <div className="flex items-center gap-2">
                          <Progress value={videoData[currentQuestion].faceDetectionRate} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{videoData[currentQuestion].faceDetectionRate}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-1">Your Transcribed Answer:</p>
                      <div className="bg-white p-3 rounded-md text-sm">
                        {videoData[currentQuestion].transcribedAnswer || "No transcription available."}
                      </div>
                    </div>
                  </div>

                  {feedback && (
                    <div className="mt-4 p-4 bg-primary/10 rounded-md">
                      <p className="font-medium mb-2">Feedback:</p>
                      <p className="text-sm">{feedback}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/candidate")} disabled={isLoading}>
                    Save & Exit
                  </Button>
                  <Button onClick={handleNextQuestion} disabled={isLoading}>
                    {isLoading
                      ? "Processing..."
                      : currentQuestion === interviewData.questions.length - 1
                        ? "Complete Interview"
                        : "Next Question"}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <VideoInterview
                onComplete={handleVideoComplete}
                onCancel={() => router.push("/candidate")}
                questionNumber={currentQuestion + 1}
                totalQuestions={interviewData.questions.length}
                currentQuestion={interviewData.questions[currentQuestion]}
              />
            )}
          </TabsContent>
        </Tabs>
      </>
    )
  }

  return (
    <div className="container py-8 max-w-4xl">
      {!isFullScreen && !isCompleted && (
        <Card className="mb-4 border-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Warning: Full Screen Required</p>
                <p className="text-sm">Your interview may be rejected if you don't return to full screen mode.</p>
                <Button 
                  className="mt-2" 
                  onClick={() => document.documentElement.requestFullscreen()}
                >
                  Return to Full Screen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{interviewData.position} Interview</CardTitle>
              <CardDescription className="text-base mt-1">{interviewData.company}</CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Video className="h-4 w-4" />
              <span>AI Video Interview</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{interviewData.description}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {currentQuestion + 1} of {interviewData.questions.length}
              </span>
            </div>
            <Progress value={((currentQuestion + 1) / interviewData.questions.length) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {renderInterviewContent()}
    </div>
  )
}

