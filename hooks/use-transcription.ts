'use client'

import { useState, useEffect, useRef } from 'react'
import { useToast } from './use-toast'

// Types for speech recognition
interface Window {
  webkitSpeechRecognition: any
  SpeechRecognition: any
}

declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

interface TranscriptionOptions {
  continuous?: boolean
  language?: string
  interimResults?: boolean
  maxAlternatives?: number
  useWhisper?: boolean
}

interface TranscriptionState {
  isListening: boolean
  transcript: string
  interimTranscript: string
  confidence: number
  isSupported: boolean
}

export function useTranscription({
  continuous = true,
  language = 'en-US',
  interimResults = true,
  maxAlternatives = 1,
  useWhisper = false
}: TranscriptionOptions = {}) {
  const { toast } = useToast()
  const [state, setState] = useState<TranscriptionState>({
    isListening: false,
    transcript: '',
    interimTranscript: '',
    confidence: 0,
    isSupported: false
  })
  
  const recognitionRef = useRef<any>(null)
  const isInitializedRef = useRef(false)
  
  // Initialize speech recognition
  useEffect(() => {
    // Check for browser support
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    setState(prevState => ({ ...prevState, isSupported }))
    
    if (!isSupported || isInitializedRef.current) return
    
    // Create recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    // Set recognition options
    recognition.continuous = continuous
    recognition.lang = language
    recognition.interimResults = interimResults
    recognition.maxAlternatives = maxAlternatives
    
    // Handle recognition events
    recognition.onstart = () => {
      setState(prevState => ({ ...prevState, isListening: true }))
    }
    
    recognition.onend = () => {
      setState(prevState => ({ ...prevState, isListening: false }))
      
      // Restart if continuous mode is on and wasn't manually stopped
      if (continuous && state.isListening) {
        recognition.start()
      }
    }
    
    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = state.transcript
      let highestConfidence = 0
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        const confidence = event.results[i][0].confidence
        
        if (confidence > highestConfidence) {
          highestConfidence = confidence
        }
        
        if (event.results[i].isFinal) {
          finalTranscript += ' ' + transcript
        } else {
          interimTranscript += ' ' + transcript
        }
      }
      
      // Clean up whitespace
      finalTranscript = finalTranscript.trim()
      interimTranscript = interimTranscript.trim()
      
      setState(prevState => ({
        ...prevState,
        transcript: finalTranscript,
        interimTranscript,
        confidence: Math.round(highestConfidence * 100)
      }))
    }
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      
      if (event.error === 'not-allowed') {
        setState(prevState => ({ ...prevState, isSupported: false }))
      }
    }
    
    recognitionRef.current = recognition
    isInitializedRef.current = true
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    }
  }, [continuous, language, interimResults, maxAlternatives, state.isListening])
  
  // Mock API for Whisper integration (would use real API in production)
  const mockWhisperTranscription = async (audioBlob: Blob): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // This would be replaced with an actual API call in production
    const mockResponses = [
      "I believe that effective communication is the foundation of any successful team.",
      "My experience with project management has taught me to prioritize clear objectives.",
      "I would approach this challenge by first analyzing the existing workflow.",
      "One of my greatest strengths is my ability to adapt to changing requirements.",
      "I've found that regular feedback sessions help keep everyone aligned on goals."
    ]
    
    // Return a random response
    return mockResponses[Math.floor(Math.random() * mockResponses.length)]
  }
  
  // Start listening
  const startListening = () => {
    if (!state.isSupported || !recognitionRef.current) return
    
    try {
      recognitionRef.current.start()
      setState(prevState => ({ ...prevState, isListening: true }))
    } catch (error) {
      console.error('Failed to start speech recognition:', error)
    }
  }
  
  // Stop listening
  const stopListening = () => {
    if (!state.isSupported || !recognitionRef.current) return
    
    try {
      recognitionRef.current.stop()
      setState(prevState => ({ ...prevState, isListening: false }))
    } catch (error) {
      console.error('Failed to stop speech recognition:', error)
    }
  }
  
  // Transcribe audio using Whisper API
  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    try {
      if (useWhisper) {
        const text = await mockWhisperTranscription(audioBlob)
        setState(prevState => ({ ...prevState, transcript: text }))
        return text
      } else {
        console.warn('Whisper API is disabled, enable it in options')
        return ''
      }
    } catch (error) {
      console.error('Transcription error:', error)
      return ''
    }
  }
  
  // Reset transcript
  const resetTranscript = () => {
    setState(prevState => ({
      ...prevState,
      transcript: '',
      interimTranscript: '',
      confidence: 0
    }))
  }
  
  return {
    state,
    startListening,
    stopListening,
    resetTranscript,
    transcribeAudio
  }
} 