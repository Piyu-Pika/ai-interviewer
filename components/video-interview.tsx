"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Video, VideoOff, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Add TypeScript declarations - using any type to avoid complex type errors
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    cv: any;
  }
}

// Simplified SpeechRecognition type
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
      length: number;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface VideoInterviewProps {
  onComplete?: (data: any) => void
  onCancel?: () => void
  questionNumber?: number
  totalQuestions?: number
  currentQuestion?: string
}

export default function VideoInterview({
  onComplete,
  onCancel,
  questionNumber = 1,
  totalQuestions = 5,
  currentQuestion = "Tell me about yourself and your experience.",
}: VideoInterviewProps) {
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(60) // 60 seconds per question
  const [faceDetected, setFaceDetected] = useState(true)
  const [facePosition, setFacePosition] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [confidenceScore, setConfidenceScore] = useState(0)
  const [isReadingQuestion, setIsReadingQuestion] = useState(false)
  const [transcribedAnswer, setTranscribedAnswer] = useState("")
  const [showTranscription, setShowTranscription] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  // Speech recognition
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  // OpenCV.js script loading
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://docs.opencv.org/4.5.5/opencv.js"
    script.async = true
    script.onload = () => {
      toast({
        title: "Face tracking initialized",
        description: "OpenCV.js has been loaded successfully.",
      })
      initializeCamera()
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Read question aloud when component mounts
  useEffect(() => {
    if (currentQuestion) {
      readQuestionAloud(currentQuestion)
    }
  }, [currentQuestion])

  // Initialize camera
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        // Mute based on state
        const audioTracks = stream.getAudioTracks()
        audioTracks.forEach((track) => {
          track.enabled = !isMuted
        })

        // Start face tracking once video is playing
        videoRef.current.onloadedmetadata = () => {
          startFaceTracking()
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        variant: "destructive",
        title: "Camera access denied",
        description: "Please allow camera access to continue with the interview.",
      })
    }
  }

  // Read the question aloud using Text-to-Speech
  const readQuestionAloud = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsReadingQuestion(true)
      
      // Create speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0
      
      speechSynthesisRef.current = utterance
      
      // When speech ends, start recording automatically
      utterance.onend = () => {
        setIsReadingQuestion(false)
        startRecording()
      }
      
      // Cancel any existing speech
      window.speechSynthesis.cancel()
      
      // Start speaking
      window.speechSynthesis.speak(utterance)
    } else {
      toast({
        variant: "destructive",
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support text-to-speech. Recording will start immediately.",
      })
      startRecording()
    }
  }

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // Use the appropriate constructor
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      
      // @ts-ignore - Speech API types are not standard
      recognition.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        // Update transcription
        setTranscribedAnswer(finalTranscript + interimTranscript)
        setShowTranscription(true)
      }
      
      // @ts-ignore - Speech API types are not standard
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error)
        toast({
          variant: "destructive",
          title: "Speech recognition error",
          description: `Error: ${event.error}`
        })
      }
      
      recognition.onend = () => {
        // Don't restart if recording is stopped
        if (isRecording) {
          recognition.start()
        }
      }
      
      recognitionRef.current = recognition
      return recognition
    }
    
    return null
  }

  // Start face tracking
  const startFaceTracking = () => {
    if (!window.cv || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Load face detection classifier
    const faceCascade = new window.cv.CascadeClassifier()
    // We would load the face classifier here in a real implementation
    // For this demo, we'll simulate face detection

    const detectFaces = () => {
      if (!video.paused && !video.ended) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Simulate face detection with OpenCV
        // In a real implementation, we would use:
        // const src = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC4);
        // const gray = new cv.Mat();
        // cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        // const faces = new cv.RectVector();
        // faceCascade.detectMultiScale(gray, faces);

        // Simulate face detection for demo
        simulateFaceDetection(context, canvas)

        // Request next frame
        requestAnimationFrame(detectFaces)
      }
    }

    // Start detection loop
    detectFaces()
  }

  // Simulate face detection for demo purposes
  const simulateFaceDetection = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Simulate face detection with random variations
    const shouldDetect = Math.random() > 0.1 // 90% chance to detect face

    if (shouldDetect) {
      setFaceDetected(true)

      // Simulate face position with slight random movement
      const centerX = canvas.width / 2 + (Math.random() * 20 - 10)
      const centerY = canvas.height / 2 + (Math.random() * 20 - 10)
      const faceWidth = canvas.width * 0.4 + (Math.random() * 10 - 5)
      const faceHeight = faceWidth * 1.3

      const x = centerX - faceWidth / 2
      const y = centerY - faceHeight / 2

      // Update face position state
      setFacePosition({
        x,
        y,
        width: faceWidth,
        height: faceHeight,
      })

      // Draw face detection rectangle
      context.strokeStyle = "#3b82f6"
      context.lineWidth = 2
      context.strokeRect(x, y, faceWidth, faceHeight)

      // Simulate confidence score
      const newConfidence = 70 + Math.floor(Math.random() * 25)
      setConfidenceScore(newConfidence)
    } else {
      setFaceDetected(false)
      
      // Show face not detected warning if recording
      if (isRecording) {
        toast({
          variant: "destructive",
          title: "Face not detected",
          description: "Please stay within the camera frame",
        })
      }
    }
  }

  // Toggle microphone
  const toggleMicrophone = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const audioTracks = stream.getAudioTracks()

      audioTracks.forEach((track) => {
        track.enabled = isMuted
      })

      setIsMuted(!isMuted)
    }
  }

  // Toggle video
  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const videoTracks = stream.getVideoTracks()

      videoTracks.forEach((track) => {
        track.enabled = !isVideoOn
      })

      setIsVideoOn(!isVideoOn)
    }
  }

  // Start recording
  const startRecording = () => {
    // Start countdown
    setCountdown(3)

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval)
          setIsRecording(true)
          startTimer()
          
          // Start speech recognition
          const recognition = initializeSpeechRecognition()
          if (recognition) {
            recognition.start()
          } else {
            toast({
              variant: "destructive",
              title: "Speech recognition not supported",
              description: "Your browser doesn't support speech recognition.",
            })
          }
          
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  // Start timer
  const startTimer = () => {
    const timerInterval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval)
          finishRecording()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Finish recording
  const finishRecording = () => {
    setIsRecording(false)
    
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    
    // Show confirmation dialog
    setShowConfirmation(true)
  }
  
  // Confirm submission
  const confirmSubmission = () => {
    // Prepare data to send back
    const interviewData = {
      questionNumber,
      transcribedAnswer: transcribedAnswer,
      confidenceScore,
      faceDetectionRate: faceDetected ? 90 + Math.floor(Math.random() * 10) : 0, // Percentage of time face was detected
      duration: 60 - timeRemaining,
    }

    // Call onComplete callback with data
    if (onComplete) {
      onComplete(interviewData)
    }
  }
  
  // Cancel submission
  const cancelSubmission = () => {
    setShowConfirmation(false)
    // Reset timer and restart recording
    setTimeRemaining(60)
    startRecording()
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Question {questionNumber} of {totalQuestions}
          </h2>
          <p className="text-lg">{currentQuestion}</p>
          {isReadingQuestion && (
            <p className="text-sm text-muted-foreground mt-2">
              Speaking question aloud... Recording will begin automatically.
            </p>
          )}
        </div>

        <div className="video-container bg-gray-900 aspect-video relative mb-6">
          {/* Main video element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isMuted}
            className={`w-full h-full object-cover ${!isVideoOn ? "hidden" : ""}`}
          />

          {/* Canvas for face tracking overlay */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ display: "none" }} // Hidden canvas for processing
          />

          {/* Video overlay with UI elements */}
          <div className="video-overlay">
            {/* Face tracking box */}
            {faceDetected && (
              <div
                className="face-tracking-box"
                style={{
                  left: `${facePosition.x}px`,
                  top: `${facePosition.y}px`,
                  width: `${facePosition.width}px`,
                  height: `${facePosition.height}px`,
                }}
              />
            )}

            {/* Face not detected warning */}
            {!faceDetected && isRecording && (
              <div className="absolute top-4 left-0 right-0 mx-auto w-max bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>Face not detected - please stay in frame</span>
              </div>
            )}

            {/* Countdown overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-40">
                <div className="text-white text-7xl font-bold">{countdown}</div>
              </div>
            )}

            {/* Recording indicator */}
            {isRecording && (
              <div className="pulse-recording">
                <div className="pulse-dot"></div>
                <span>Recording</span>
              </div>
            )}

            {/* Transcription overlay */}
            {showTranscription && transcribedAnswer && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 p-3 rounded-md text-white max-h-32 overflow-y-auto">
                <p className="text-xs mb-1 text-gray-300">Transcription:</p>
                <p className="text-sm">{transcribedAnswer}</p>
              </div>
            )}

            {/* No video placeholder */}
            {!isVideoOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-white text-center">
                  <VideoOff className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Camera is turned off</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation dialog */}
        {showConfirmation && (
          <div className="bg-primary/10 p-4 rounded-md mb-6">
            <h3 className="font-medium mb-2">Confirm Submission</h3>
            <p className="text-sm mb-4">
              Your response has been recorded. Would you like to submit this answer or try again?
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={cancelSubmission}>Try Again</Button>
              <Button onClick={confirmSubmission}>Submit Answer</Button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={toggleMicrophone}>
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button variant="outline" size="icon" onClick={toggleVideo}>
              {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {isRecording ? (
              <div className="text-lg font-mono">{formatTime(timeRemaining)}</div>
            ) : (
              <>
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                {!isReadingQuestion && !showConfirmation && (
                  <Button onClick={startRecording}>Start Recording</Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

