"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Video, VideoOff, Smile, Frown, Meh } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  const [faceDetected, setFaceDetected] = useState(false)
  const [facePosition, setFacePosition] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [currentEmotion, setCurrentEmotion] = useState<string>("neutral")
  const [confidenceScore, setConfidenceScore] = useState(0)
  const [emotionData, setEmotionData] = useState({
    happy: 0,
    neutral: 0,
    sad: 0,
    surprised: 0,
    angry: 0,
  })

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

      // Simulate emotion detection
      simulateEmotionDetection()

      // Simulate confidence score
      const newConfidence = 70 + Math.floor(Math.random() * 25)
      setConfidenceScore(newConfidence)
    } else {
      setFaceDetected(false)
    }
  }

  // Simulate emotion detection
  const simulateEmotionDetection = () => {
    // Randomly change emotion occasionally
    if (Math.random() > 0.95) {
      const emotions = ["happy", "neutral", "sad", "surprised", "angry"]
      const weights = [0.2, 0.5, 0.1, 0.1, 0.1] // More likely to be neutral

      const random = Math.random()
      let emotionIndex = 0
      let sum = 0

      for (let i = 0; i < weights.length; i++) {
        sum += weights[i]
        if (random <= sum) {
          emotionIndex = i
          break
        }
      }

      setCurrentEmotion(emotions[emotionIndex])

      // Update emotion data
      setEmotionData((prev) => {
        const newData = { ...prev }
        newData[emotions[emotionIndex] as keyof typeof prev] += 1
        return newData
      })
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

    // Prepare data to send back
    const interviewData = {
      questionNumber,
      emotions: emotionData,
      confidenceScore,
      faceDetectionRate: faceDetected ? 90 + Math.floor(Math.random() * 10) : 0, // Percentage of time face was detected
      duration: 60 - timeRemaining,
    }

    // Call onComplete callback with data
    if (onComplete) {
      onComplete(interviewData)
    }
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Get emotion icon
  const getEmotionIcon = () => {
    switch (currentEmotion) {
      case "happy":
        return <Smile className="h-5 w-5 text-green-500" />
      case "sad":
      case "angry":
        return <Frown className="h-5 w-5 text-red-500" />
      default:
        return <Meh className="h-5 w-5 text-yellow-500" />
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Question {questionNumber} of {totalQuestions}
          </h2>
          <p className="text-lg">{currentQuestion}</p>
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

            {/* Emotion indicator */}
            {faceDetected && isRecording && (
              <div className="emotion-indicator flex items-center gap-2">
                {getEmotionIcon()}
                <span className="capitalize">{currentEmotion}</span>
              </div>
            )}

            {/* Confidence meter */}
            {faceDetected && isRecording && (
              <div className="confidence-meter">
                <div className="flex justify-between text-xs mb-1">
                  <span>Confidence</span>
                  <span>{confidenceScore}%</span>
                </div>
                <div className="confidence-bar">
                  <div className="confidence-value" style={{ width: `${confidenceScore}%` }}></div>
                </div>
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
                <Button onClick={startRecording}>Start Recording</Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

