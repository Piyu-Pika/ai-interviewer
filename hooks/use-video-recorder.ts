'use client'

import { useState, useRef, useEffect } from 'react'
import { useToast } from './use-toast'
import * as faceapi from 'face-api.js'

interface VideoRecorderOptions {
  maxDuration?: number // in seconds
  countdownTime?: number
  enableFaceDetection?: boolean
}

interface VideoRecorderState {
  isRecording: boolean
  isPaused: boolean
  isVideoOn: boolean
  isMuted: boolean
  duration: number
  timeRemaining: number | null
  faceDetected: boolean
  currentEmotion: string | null
  confidenceScore: number
}

export function useVideoRecorder({
  maxDuration = 120,
  countdownTime = 3,
  enableFaceDetection = true
}: VideoRecorderOptions = {}) {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const faceDetectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const emotionDetectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  
  // State
  const [state, setState] = useState<VideoRecorderState>({
    isRecording: false,
    isPaused: false,
    isVideoOn: true,
    isMuted: false,
    duration: 0,
    timeRemaining: maxDuration,
    faceDetected: false,
    currentEmotion: null,
    confidenceScore: 0
  })
  const [countdown, setCountdown] = useState<number | null>(null)
  
  const { toast } = useToast()
  
  // Load face detection models
  useEffect(() => {
    if (enableFaceDetection) {
      const loadModels = async () => {
        try {
          // In a real app, you'd want to host these models on your server
          // This is loading them from the public directory
          const MODEL_URL = '/models'
          
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
          ]).catch(error => {
            console.error('Failed to load face detection models:', error)
            toast({
              title: "Face detection disabled",
              description: "Could not load face detection models. Continuing without face analysis.",
              variant: "destructive"
            })
            // Proceed without face detection
            setState(prevState => ({ ...prevState, faceDetected: true }))
          })
          
          console.log('Face detection models loaded')
        } catch (error) {
          console.error('Error loading face detection models:', error)
          toast({
            title: "Face detection disabled",
            description: "Could not load face detection models. Continuing without face analysis.",
            variant: "destructive"
          })
          // Proceed without face detection
          setState(prevState => ({ ...prevState, faceDetected: true }))
        }
      }
      
      loadModels()
    } else {
      // If face detection is disabled, set faceDetected to true to not block recording
      setState(prevState => ({ ...prevState, faceDetected: true }))
    }
    
    // Cleanup when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop())
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current)
      }
      
      if (emotionDetectionIntervalRef.current) {
        clearInterval(emotionDetectionIntervalRef.current)
      }
    }
  }, [enableFaceDetection])
  
  // Initialize camera
  const initializeCamera = async () => {
    try {
      if (streamRef.current) {
        // Camera already initialized
        return
      }
      
      const constraints = {
        audio: true,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true // Mute to prevent feedback
        
        // Wait for video metadata to load
        await new Promise(resolve => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve
          }
        })
        
        // Start face detection
        if (enableFaceDetection) {
          startFaceDetection()
        } else {
          setState(prevState => ({ ...prevState, faceDetected: true }))
        }
      }
      
      setState(prevState => ({ ...prevState, isVideoOn: true }))
    } catch (error) {
      console.error('Error initializing camera:', error)
    }
  }
  
  // Start face detection loop
  const startFaceDetection = () => {
    if (!enableFaceDetection || !videoRef.current || !canvasRef.current) {
      // If face detection is disabled or refs are not available, set faceDetected to true to not block recording
      setState(prevState => ({ ...prevState, faceDetected: true }))
      return
    }
    
    // Set up canvas
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Start detection loop
    faceDetectionIntervalRef.current = setInterval(async () => {
      try {
        if (!videoRef.current || !canvasRef.current) return
        
        // Try to detect faces, but handle errors gracefully
        let detections: faceapi.WithFaceExpressions<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>>[] = [];
        try {
          detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();
        } catch (err: unknown) {
          console.error('Face detection failed:', err)
          // Continue with empty detections array
        }
        
        // Draw results on canvas
        const ctx = canvasRef.current.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          
          // Update face detected state
          const faceDetected = detections.length > 0
          setState(prevState => ({ ...prevState, faceDetected }))
          
          if (faceDetected) {
            // Draw face detection results
            faceapi.draw.drawDetections(canvas, detections)
            faceapi.draw.drawFaceLandmarks(canvas, detections)
            
            // Update emotion state
            const detection = detections[0]
            if (detection && detection.expressions) {
              const expressions = detection.expressions
              const emotionScores = [
                { emotion: 'happy', score: expressions.happy },
                { emotion: 'sad', score: expressions.sad },
                { emotion: 'angry', score: expressions.angry },
                { emotion: 'surprised', score: expressions.surprised },
                { emotion: 'neutral', score: expressions.neutral }
              ]
              
              // Get the emotion with highest score
              const topEmotion = emotionScores.reduce((prev, current) => 
                (prev.score > current.score) ? prev : current
              )
              
              setState(prevState => ({
                ...prevState,
                currentEmotion: topEmotion.emotion,
                confidenceScore: topEmotion.score * 100
              }))
            }
          } else {
            setState(prevState => ({
              ...prevState,
              currentEmotion: null,
              confidenceScore: 0
            }))
          }
        }
      } catch (error) {
        console.error('Error in face detection:', error)
        // Ensure recording is not blocked due to face detection errors
        setState(prevState => ({ ...prevState, faceDetected: true }))
      }
    }, 100) // Run detection every 100ms
  }
  
  // Start recording with countdown
  const startRecording = () => {
    if (state.isRecording || !streamRef.current) return
    
    // Start countdown
    let count = countdownTime
    setCountdown(count)
    
    const countdownInterval = setInterval(() => {
      count--
      setCountdown(count)
      
      if (count <= 0) {
        clearInterval(countdownInterval)
        setCountdown(null)
        beginRecording()
      }
    }, 1000)
  }
  
  // Actually start the recording after countdown
  const beginRecording = () => {
    if (!streamRef.current || !videoRef.current) return
    
    try {
      // Create media recorder
      const options = { mimeType: 'video/webm;codecs=vp9,opus' }
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, options)
      
      // Set up data handlers
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }
      
      // Start recording
      recordedChunksRef.current = []
      mediaRecorderRef.current.start(1000) // Get data every second
      
      // Start timer
      let elapsedTime = 0
      timerRef.current = setInterval(() => {
        elapsedTime++
        const remaining = maxDuration - elapsedTime
        
        setState(prevState => ({
          ...prevState,
          duration: elapsedTime,
          timeRemaining: remaining
        }))
        
        // Stop recording if max duration reached
        if (remaining <= 0) {
          stopRecording()
        }
      }, 1000)
      
      setState(prevState => ({
        ...prevState,
        isRecording: true,
        isPaused: false,
        timeRemaining: maxDuration
      }))
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }
  
  // Pause recording
  const pauseRecording = () => {
    if (!state.isRecording || state.isPaused || !mediaRecorderRef.current) return
    
    mediaRecorderRef.current.pause()
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    setState(prevState => ({ ...prevState, isPaused: true }))
  }
  
  // Resume recording
  const resumeRecording = () => {
    if (!state.isRecording || !state.isPaused || !mediaRecorderRef.current) return
    
    mediaRecorderRef.current.resume()
    
    // Resume timer
    let elapsedTime = state.duration
    timerRef.current = setInterval(() => {
      elapsedTime++
      const remaining = maxDuration - elapsedTime
      
      setState(prevState => ({
        ...prevState,
        duration: elapsedTime,
        timeRemaining: remaining
      }))
      
      // Stop recording if max duration reached
      if (remaining <= 0) {
        stopRecording()
      }
    }, 1000)
    
    setState(prevState => ({ ...prevState, isPaused: false }))
  }
  
  // Stop recording
  const stopRecording = () => {
    if (!state.isRecording || !mediaRecorderRef.current) return
    
    mediaRecorderRef.current.stop()
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    setState(prevState => ({
      ...prevState,
      isRecording: false,
      isPaused: false,
      timeRemaining: 0
    }))
  }
  
  // Get the recorded video as a blob
  const getRecording = (): Blob | undefined => {
    if (recordedChunksRef.current.length === 0) return undefined
    
    return new Blob(recordedChunksRef.current, {
      type: 'video/webm'
    })
  }
  
  // Toggle video on/off
  const toggleVideo = () => {
    if (!streamRef.current) return
    
    const videoTracks = streamRef.current.getVideoTracks()
    const isVideoOn = !state.isVideoOn
    
    videoTracks.forEach(track => {
      track.enabled = isVideoOn
    })
    
    setState(prevState => ({ ...prevState, isVideoOn }))
  }
  
  // Toggle microphone on/off
  const toggleMicrophone = () => {
    if (!streamRef.current) return
    
    const audioTracks = streamRef.current.getAudioTracks()
    const isMuted = !state.isMuted
    
    audioTracks.forEach(track => {
      track.enabled = !isMuted
    })
    
    setState(prevState => ({ ...prevState, isMuted }))
  }
  
  // Format time for display (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return {
    // Refs
    videoRef,
    canvasRef,
    
    // State
    state,
    countdown,
    
    // Methods
    initializeCamera,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    getRecording,
    toggleVideo,
    toggleMicrophone,
    formatTime
  }
} 