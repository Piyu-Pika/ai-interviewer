'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useVideoRecorder } from './use-video-recorder'
import { useTranscription } from './use-transcription'
import { useLangchain } from './use-langchain'
import { Job, InterviewQuestion, InterviewFeedback } from '@/lib/mock-data'

export type InterviewState = 'idle' | 'preparing' | 'instructions' | 'recording' | 'analyzing' | 'feedback' | 'completed'

export interface AIInterviewOptions {
  maxResponseTime?: number
  questionsPerInterview?: number
  language?: string
  useRealTimeTranscription?: boolean
  useEmotionAnalysis?: boolean
  useMockData?: boolean
}

export function useAIInterview(job: Job | null, options: AIInterviewOptions = {}) {
  const {
    maxResponseTime = 120,
    questionsPerInterview = 3,
    language = 'en-US',
    useRealTimeTranscription = true,
    useEmotionAnalysis = true,
    useMockData = false
  } = options
  
  // Initialize hooks
  const videoRecorder = useVideoRecorder({
    maxDuration: maxResponseTime,
    enableFaceDetection: useEmotionAnalysis,
  })
  
  const transcription = useTranscription({
    language,
    continuous: true,
    interimResults: true,
    useWhisper: !useRealTimeTranscription
  })
  
  const langchain = useLangchain(useMockData)
  
  // State
  const [interviewState, setInterviewState] = useState<InterviewState>('idle')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [responses, setResponses] = useState<{
    questionId: string
    transcript: string
    videoBlob?: Blob
    feedback?: InterviewFeedback
  }[]>([])
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState<boolean>(false)
  const [feedbackInProgress, setFeedbackInProgress] = useState<boolean>(false)
  const [overallFeedback, setOverallFeedback] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  
  // Refs
  const jobDescriptionRef = useRef<string>('')
  const currentResponseRef = useRef<string>('')
  const interviewCompletedRef = useRef<boolean>(false)
  
  // Set job description when job changes
  useEffect(() => {
    if (job) {
      jobDescriptionRef.current = job.description
    }
  }, [job])
  
  // Generate interview questions based on job description
  const generateQuestions = useCallback(async () => {
    if (!job) {
      setError('No job description provided')
      return
    }
    
    try {
      setIsGeneratingQuestions(true)
      
      const generatedQuestions = await langchain.generateQuestions(
        job.title,
        job.description,
        questionsPerInterview
      )
      
      if (generatedQuestions.length > 0) {
        setQuestions(generatedQuestions)
        setError(null)
      } else {
        setError('Failed to generate interview questions')
      }
    } catch (err) {
      console.error('Error generating questions:', err)
      setError('Error generating interview questions')
    } finally {
      setIsGeneratingQuestions(false)
    }
  }, [job, langchain, questionsPerInterview])
  
  // Initialize interview
  const startInterview = useCallback(async () => {
    try {
      // Reset state
      setInterviewState('preparing')
      setCurrentQuestionIndex(0)
      setResponses([])
      setOverallFeedback('')
      setError(null)
      interviewCompletedRef.current = false
      
      // Initialize camera
      await videoRecorder.initializeCamera()
      
      // Generate questions if we don't have any
      if (questions.length === 0) {
        await generateQuestions()
      }
      
      // Show instructions
      setInterviewState('instructions')
    } catch (err) {
      console.error('Error starting interview:', err)
      setError('Failed to start interview')
      setInterviewState('idle')
    }
  }, [videoRecorder, generateQuestions, questions.length])
  
  // Start answering the current question
  const startAnswering = useCallback(() => {
    if (currentQuestionIndex >= questions.length) {
      setError('No more questions available')
      return
    }
    
    // Reset for new question
    videoRecorder.stopRecording()
    transcription.resetTranscript()
    currentResponseRef.current = ''
    
    // Start recording
    setInterviewState('recording')
    
    // Start video recording with countdown
    videoRecorder.startRecording()
    
    // Start transcription if real-time transcription is enabled
    if (useRealTimeTranscription) {
      transcription.startListening()
    }
  }, [
    currentQuestionIndex,
    questions.length,
    videoRecorder,
    transcription,
    useRealTimeTranscription
  ])
  
  // Stop answering the current question
  const stopAnswering = useCallback(async () => {
    // Stop recording and transcription
    videoRecorder.stopRecording()
    
    if (useRealTimeTranscription) {
      transcription.stopListening()
      currentResponseRef.current = transcription.state.transcript
    }
    
    // Get recorded video
    const videoBlob = videoRecorder.getRecording()
    
    // If using Whisper API instead of real-time transcription
    if (!useRealTimeTranscription && videoBlob) {
      setInterviewState('analyzing')
      try {
        const transcribedText = await transcription.transcribeAudio(videoBlob)
        currentResponseRef.current = transcribedText
      } catch (err) {
        console.error('Error transcribing audio:', err)
        setError('Failed to transcribe response')
      }
    }
    
    // Get current question
    const currentQuestion = questions[currentQuestionIndex]
    
    if (!currentQuestion) {
      setError('Question not found')
      return
    }
    
    // Analyze response
    setInterviewState('analyzing')
    setFeedbackInProgress(true)
    
    try {
      const feedback = await langchain.analyzeResponse(
        currentQuestion.question,
        currentResponseRef.current,
        currentQuestion.expectedAnswer || ''
      )
      
      // Save response and feedback
      setResponses(prev => [
        ...prev,
        {
          questionId: currentQuestion.id,
          transcript: currentResponseRef.current,
          videoBlob,
          feedback
        }
      ])
      
      setFeedbackInProgress(false)
      setInterviewState('feedback')
    } catch (err) {
      console.error('Error analyzing response:', err)
      setError('Failed to analyze response')
      setFeedbackInProgress(false)
      setInterviewState('feedback')
    }
  }, [
    currentQuestionIndex,
    questions,
    videoRecorder,
    transcription,
    langchain,
    useRealTimeTranscription
  ])
  
  // Move to the next question
  const nextQuestion = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1
    
    if (nextIndex >= questions.length) {
      // Interview completed
      completeInterview()
    } else {
      // Move to next question
      setCurrentQuestionIndex(nextIndex)
      setInterviewState('instructions')
    }
  }, [currentQuestionIndex, questions.length])
  
  // Complete the interview and generate overall feedback
  const completeInterview = useCallback(() => {
    setInterviewState('completed')
    interviewCompletedRef.current = true
    
    // Generate overall feedback
    const allFeedback = responses.map(r => r.feedback?.feedback || '').join(' ')
    
    // Simple algorithm to generate overall feedback
    if (allFeedback) {
      // In a real application, you'd use an LLM to generate meaningful overall feedback
      // For now, we'll just extract some patterns from individual feedback
      const strengths = allFeedback.includes('strength') 
        ? 'You demonstrated good communication skills throughout the interview.'
        : 'Your answers were generally on topic.';
        
      const weaknesses = allFeedback.includes('improve') 
        ? 'Consider providing more specific examples in your answers.'
        : 'Work on developing more detailed responses to technical questions.';
        
      const overall = allFeedback.includes('excellent') || allFeedback.includes('great')
        ? 'Overall, this was a strong interview performance.'
        : 'Overall, your interview showed potential but has room for improvement.';
        
      setOverallFeedback(`${strengths} ${weaknesses} ${overall}`)
    }
  }, [responses])
  
  // Reset the entire interview
  const resetInterview = useCallback(() => {
    setInterviewState('idle')
    setCurrentQuestionIndex(0)
    setQuestions([])
    setResponses([])
    setOverallFeedback('')
    setError(null)
    interviewCompletedRef.current = false
    currentResponseRef.current = ''
    
    videoRecorder.stopRecording()
    transcription.stopListening()
    transcription.resetTranscript()
  }, [videoRecorder, transcription])
  
  // Current question and response
  const currentQuestion = questions[currentQuestionIndex]
  const currentResponse = responses.find(r => 
    r.questionId === (currentQuestion?.id || '')
  )
  
  // Monitor real-time transcription
  useEffect(() => {
    if (interviewState === 'recording' && useRealTimeTranscription) {
      currentResponseRef.current = transcription.state.transcript
    }
  }, [interviewState, transcription.state.transcript, useRealTimeTranscription])
  
  return {
    // State
    interviewState,
    currentQuestionIndex,
    questions,
    responses,
    isGeneratingQuestions,
    feedbackInProgress,
    overallFeedback,
    error,
    
    // Current question and response
    currentQuestion,
    currentResponse,
    
    // Real-time state
    transcriptionState: transcription.state,
    videoState: videoRecorder.state,
    countdownValue: videoRecorder.countdown,
    
    // Video refs
    videoRef: videoRecorder.videoRef,
    canvasRef: videoRecorder.canvasRef,
    
    // Methods
    startInterview,
    startAnswering,
    stopAnswering,
    nextQuestion,
    resetInterview,
    
    // Helper methods
    formatTime: videoRecorder.formatTime
  }
} 