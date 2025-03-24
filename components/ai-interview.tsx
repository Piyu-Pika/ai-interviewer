'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { useToast } from '@/hooks/use-toast'
import { Job } from '@/lib/mock-data'
import { useAIInterview } from '@/hooks/use-ai-interview'
import { ArrowRight, Loader2, Mic, PauseCircle, PlayCircle, Video, VideoOff, AlertCircle } from 'lucide-react'
import { Badge } from './ui/badge'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ScrollArea } from './ui/scroll-area'
import { Avatar, AvatarFallback } from './ui/avatar'
import { useRouter } from 'next/navigation'

interface AIInterviewProps {
  job: Job | null
  onComplete?: (results: any) => void
}

export function AIInterview({ job, onComplete }: AIInterviewProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('video')
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [fullScreenWarningShown, setFullScreenWarningShown] = useState(false)
  const fullScreenTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Initialize the AI interview hook
  const interview = useAIInterview(job, {
    maxResponseTime: 120,
    questionsPerInterview: 3,
    useRealTimeTranscription: true,
    useEmotionAnalysis: true,
    useMockData: typeof process !== 'undefined' && !process.env.NEXT_PUBLIC_OPENAI_API_KEY
  })
  
  // Call onComplete callback when interview is completed
  useEffect(() => {
    if (interview.interviewState === 'completed' && onComplete) {
      onComplete({
        questions: interview.questions,
        responses: interview.responses,
        overallFeedback: interview.overallFeedback
      })
    }
  }, [interview.interviewState, interview.questions, interview.responses, interview.overallFeedback, onComplete])
  
  // Display error messages as toasts
  useEffect(() => {
    if (interview.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: interview.error
      })
    }
  }, [interview.error, toast])
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }
  
  // Handle full screen on interview start
  useEffect(() => {
    if (interview.interviewState === 'recording' || interview.interviewState === 'instructions') {
      const enterFullScreen = () => {
        const element = document.documentElement
        if (element.requestFullscreen) {
          element.requestFullscreen()
        }
        setIsFullScreen(true)
      }
      
      // Enter full screen when recording starts
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
        if (!isCurrentlyFullScreen && 
            (interview.interviewState === 'recording' || interview.interviewState === 'instructions')) {
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
                // Force the interview to end (navigate away or reset state)
                if (interview.interviewState === 'recording' || interview.interviewState === 'instructions') {
                  // Reset to idle state or navigate away
                  router.push('/candidate')
                }
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
    }
  }, [interview.interviewState, fullScreenWarningShown, toast, router])
  
  // Render the current interview state
  const renderInterviewState = () => {
    // Full screen warning alert
    const renderFullScreenWarning = () => {
      if (!isFullScreen && 
          (interview.interviewState === 'recording' || interview.interviewState === 'instructions')) {
        return (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Full Screen Required</AlertTitle>
            <AlertDescription>
              <p>Your interview may be rejected if you don't return to full screen mode.</p>
              <Button 
                className="mt-2" 
                size="sm"
                onClick={() => document.documentElement.requestFullscreen()}
              >
                Return to Full Screen
              </Button>
            </AlertDescription>
          </Alert>
        )
      }
      return null
    }

    switch (interview.interviewState) {
      case 'idle':
        return (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>AI Interview Simulator</CardTitle>
              <CardDescription>
                Practice your interview skills with our AI-powered interview simulator
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {job ? (
                <>
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-semibold text-lg">Interview for: {job.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {job.company} • {job.location}
                    </p>
                  </div>
                  <Button onClick={() => interview.startInterview()} className="mt-4">
                    Start Interview
                  </Button>
                </>
              ) : (
                <Alert>
                  <AlertTitle>No job selected</AlertTitle>
                  <AlertDescription>
                    Please select a job posting to begin the interview process.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )
      
      case 'preparing':
        return (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Preparing Your Interview</CardTitle>
              <CardDescription>
                Setting up your interview questions and environment
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-center text-muted-foreground">
                {interview.isGeneratingQuestions ? (
                  "Generating questions based on the job description..."
                ) : (
                  "Setting up your camera and microphone..."
                )}
              </p>
              <Progress value={40} className="w-full max-w-md mt-4" />
            </CardContent>
          </Card>
        )
      
      case 'instructions':
        return (
          <>
            {renderFullScreenWarning()}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Question {interview.currentQuestionIndex + 1} of {interview.questions.length}</CardTitle>
                <CardDescription>
                  Read the question and prepare your answer
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="bg-muted rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    {interview.currentQuestion?.text}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Take a moment to think about your answer. When you're ready, click "Start Recording" to begin.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Camera Preview</h4>
                    <div className="relative bg-black rounded-lg aspect-video overflow-hidden">
                      <video
                        ref={interview.videoRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        autoPlay
                        playsInline
                        muted
                      />
                      <canvas
                        ref={interview.canvasRef}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {!interview.videoState.isVideoOn && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black">
                          <VideoOff className="h-10 w-10 text-muted" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Toggle video directly through videoState if available
                          const videoTracks = interview.videoRef.current?.srcObject instanceof MediaStream 
                            ? (interview.videoRef.current.srcObject as MediaStream).getVideoTracks() 
                            : [];
                          
                          if (videoTracks.length > 0) {
                            videoTracks.forEach(track => {
                              track.enabled = !interview.videoState.isVideoOn;
                            });
                          }
                        }}
                      >
                        {interview.videoState.isVideoOn ? (
                          <Video className="h-4 w-4 mr-2" />
                        ) : (
                          <VideoOff className="h-4 w-4 mr-2" />
                        )}
                        {interview.videoState.isVideoOn ? "Disable Camera" : "Enable Camera"}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Toggle microphone directly through videoState if available
                          const audioTracks = interview.videoRef.current?.srcObject instanceof MediaStream 
                            ? (interview.videoRef.current.srcObject as MediaStream).getAudioTracks() 
                            : [];
                          
                          if (audioTracks.length > 0) {
                            audioTracks.forEach(track => {
                              track.enabled = interview.videoState.isMuted;
                            });
                          }
                        }}
                      >
                        {!interview.videoState.isMuted ? (
                          <Mic className="h-4 w-4 mr-2" />
                        ) : (
                          <Mic className="h-4 w-4 mr-2 text-muted" />
                        )}
                        {!interview.videoState.isMuted ? "Mute Mic" : "Unmute Mic"}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-card border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Tips for this Question</h4>
                      <ul className="text-sm space-y-2">
                        <li>• Speak clearly and at a moderate pace</li>
                        <li>• Include specific examples from your experience</li>
                        <li>• Structure your answer with a beginning, middle, and end</li>
                        <li>• Keep your response under 2 minutes</li>
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => interview.startAnswering()}
                    >
                      Start Recording
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )
      
      case 'recording':
        return (
          <>
            {renderFullScreenWarning()}
            <Card className="col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recording Your Answer</CardTitle>
                    <CardDescription>
                      Question {interview.currentQuestionIndex + 1} of {interview.questions.length}
                    </CardDescription>
                  </div>
                  {interview.countdownValue !== null && (
                    <Badge variant="outline" className="text-xl py-1 px-3">
                      {interview.countdownValue}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    {interview.currentQuestion?.text}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-3">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="video">Video</TabsTrigger>
                        <TabsTrigger value="transcript">Transcript</TabsTrigger>
                      </TabsList>
                      <TabsContent value="video" className="mt-0">
                        <div className="relative bg-black rounded-lg aspect-video overflow-hidden">
                          <video
                            ref={interview.videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            autoPlay
                            playsInline
                            muted
                          />
                          <canvas
                            ref={interview.canvasRef}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          
                          {!interview.videoState.isVideoOn && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black">
                              <VideoOff className="h-10 w-10 text-muted" />
                            </div>
                          )}
                          
                          {/* Recording indicator */}
                          {interview.videoState.isRecording && !interview.countdownValue && (
                            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 rounded-full px-3 py-1">
                              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                              <span className="text-xs text-white">
                                {interview.formatTime(interview.videoState.duration || 0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      <TabsContent value="transcript" className="mt-0">
                        <div className="bg-muted rounded-lg p-4 h-[300px] overflow-auto">
                          <ScrollArea className="h-full w-full pr-4">
                            <p className="whitespace-pre-wrap">
                              {interview.transcriptionState.transcript}
                              {interview.transcriptionState.interimTranscript && (
                                <span className="text-muted-foreground">
                                  {" "}{interview.transcriptionState.interimTranscript}
                                </span>
                              )}
                              {!interview.transcriptionState.transcript && 
                                !interview.transcriptionState.interimTranscript && (
                                <span className="text-muted-foreground italic">
                                  Your speech will appear here as you speak...
                                </span>
                              )}
                            </p>
                          </ScrollArea>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div className="lg:col-span-2 flex flex-col">
                    <div className="bg-card border rounded-lg p-4 mb-4">
                      <h4 className="font-medium mb-2">Time Remaining</h4>
                      <div className="flex justify-between mb-2">
                        <span>{interview.formatTime(interview.videoState.timeRemaining || 0)}</span>
                        <span className="text-muted-foreground">
                          {interview.formatTime(interview.videoState.duration || 0)} / {interview.formatTime(120)}
                        </span>
                      </div>
                      <Progress 
                        value={interview.videoState.duration ? (interview.videoState.duration / 120) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                    
                    {interview.videoState.faceDetected ? (
                      <div className="bg-card border rounded-lg p-4 mb-4">
                        <h4 className="font-medium mb-2">Emotion Analysis</h4>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {interview.videoState.currentEmotion ? 
                                interview.videoState.currentEmotion.charAt(0).toUpperCase() : 
                                '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium capitalize">
                              {interview.videoState.currentEmotion || 'Neutral'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Confidence: {Math.round(interview.videoState.confidenceScore)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-card border rounded-lg p-4 mb-4">
                        <h4 className="font-medium mb-2">Face Detection</h4>
                        <p className="text-sm text-muted-foreground">
                          No face detected. Please position yourself in front of the camera.
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-auto flex gap-2">
                      {interview.videoState.isRecording && !interview.videoState.isPaused ? (
                        <>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => interview.videoRecorder.pauseRecording()}
                          >
                            <PauseCircle className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                          <Button 
                            className="flex-1"
                            onClick={() => interview.stopAnswering()}
                          >
                            Stop & Submit
                          </Button>
                        </>
                      ) : interview.videoState.isPaused ? (
                        <>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => interview.videoRecorder.resumeRecording()}
                          >
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Resume
                          </Button>
                          <Button 
                            className="flex-1"
                            onClick={() => interview.stopAnswering()}
                          >
                            Stop & Submit
                          </Button>
                        </>
                      ) : (
                        <Button 
                          className="w-full"
                          onClick={() => interview.stopAnswering()}
                        >
                          Stop & Submit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )
      
      case 'analyzing':
        return (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Analyzing Your Response</CardTitle>
              <CardDescription>
                Our AI is analyzing your answer to provide feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-center text-muted-foreground">
                Please wait while we analyze your response...
              </p>
              <Progress value={65} className="w-full max-w-md mt-4" />
            </CardContent>
          </Card>
        )
      
      case 'feedback':
        return (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Feedback on Your Answer</CardTitle>
              <CardDescription>
                Question {interview.currentQuestionIndex + 1} of {interview.questions.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">
                  {interview.currentQuestion?.text}
                </h3>
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="font-medium mb-2">Your Answer:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {interview.currentResponse?.transcript || "No response recorded."}
                  </p>
                </div>
              </div>
              
              {interview.currentResponse?.feedback ? (
                <div className="space-y-4">
                  <div className="bg-card border rounded-lg p-6">
                    <h4 className="font-semibold mb-3">AI Feedback</h4>
                    <p className="whitespace-pre-wrap">
                      {interview.currentResponse.feedback.feedback}
                    </p>
                    
                    <div className="mt-6 pt-4 border-t border-border">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Score</span>
                        <span className="font-medium">
                          {interview.currentResponse.feedback.score}/10
                        </span>
                      </div>
                      <Progress 
                        value={interview.currentResponse.feedback.score * 10} 
                        className="h-2"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-card border rounded-lg p-6">
                    <h4 className="font-semibold mb-3">Strengths</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {interview.currentResponse.feedback.strengths.map((strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                    
                    <h4 className="font-semibold mt-4 mb-3">Areas for Improvement</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {interview.currentResponse.feedback.improvements.map((improvement: string, index: number) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => interview.nextQuestion()}
                  >
                    {interview.currentQuestionIndex < interview.questions.length - 1 ? (
                      <>Next Question <ArrowRight className="ml-2 h-4 w-4" /></>
                    ) : (
                      "Complete Interview"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-center text-muted-foreground mt-4">
                    Generating feedback...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      
      case 'completed':
        return (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Interview Completed</CardTitle>
              <CardDescription>
                Review your overall performance and feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Overall Feedback</h3>
                <p className="whitespace-pre-wrap">
                  {interview.overallFeedback || "No overall feedback available."}
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Question Summaries</h3>
                {interview.responses.map((response, index) => {
                  const question = interview.questions.find(q => q.id === response.questionId)
                  return (
                    <div key={index} className="bg-card border rounded-lg p-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <Badge variant="outline">
                          Score: {response.feedback?.score || "N/A"}/10
                        </Badge>
                      </div>
                      <p className="mt-2">{question?.text}</p>
                      
                      <div className="flex mt-3 text-sm">
                        <div className="text-muted-foreground w-20">Your answer:</div>
                        <p className="flex-1 truncate">
                          {response.transcript.substring(0, 60)}...
                        </p>
                      </div>
                    </div>
                  )
                })}
                
                <Button 
                  className="w-full mt-4"
                  onClick={() => interview.resetInterview()}
                >
                  Start New Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      
      default:
        return null
    }
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {renderInterviewState()}
    </div>
  )
} 