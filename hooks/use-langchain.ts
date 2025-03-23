'use client'

import { useState } from 'react'
import langchainService, { 
  InterviewQuestion, 
  InterviewFeedback, 
  ResumeAnalysis 
} from '@/lib/langchain'
import { useToast } from './use-toast'
import { mockGenerateInterviewQuestions, mockAnalyzeInterviewResponse } from '@/lib/langchain'

export function useLangchain() {
  const { toast } = useToast()
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const [isAnalyzingResponse, setIsAnalyzingResponse] = useState(false)
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate interview questions
  const generateQuestions = async (
    jobDescription: string,
    resumeText?: string,
    count: number = 5
  ): Promise<InterviewQuestion[]> => {
    setIsGeneratingQuestions(true)
    setError(null)
    
    try {
      // For development without API keys, use the mock function
      if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        const questions = mockGenerateInterviewQuestions(jobDescription, count)
        setIsGeneratingQuestions(false)
        return questions
      }
      
      // Use the real LangChain service if API key is available
      const questions = await langchainService.generateQuestions(
        jobDescription,
        resumeText,
        count
      )
      
      return questions
    } catch (err) {
      console.error('Error generating questions:', err)
      setError('Failed to generate questions. Please try again.')
      // Fallback to mock data
      return mockGenerateInterviewQuestions(jobDescription, count)
    } finally {
      setIsGeneratingQuestions(false)
    }
  }

  // Analyze interview response
  const analyzeResponse = async (
    question: string,
    responseTranscript: string
  ): Promise<InterviewFeedback | null> => {
    if (!responseTranscript || responseTranscript.trim().length < 10) {
      return null // Don't analyze very short responses
    }
    
    setIsAnalyzingResponse(true)
    setError(null)
    
    try {
      // For development without API keys, use the mock function
      if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        const feedback = mockAnalyzeInterviewResponse(question, responseTranscript)
        setIsAnalyzingResponse(false)
        return feedback
      }
      
      // Use the real LangChain service if API key is available
      const feedback = await langchainService.analyzeResponse(
        question,
        responseTranscript
      )
      
      return feedback
    } catch (err) {
      console.error('Error analyzing response:', err)
      setError('Failed to analyze your response. Please try again.')
      // Fallback to mock data
      return mockAnalyzeInterviewResponse(question, responseTranscript)
    } finally {
      setIsAnalyzingResponse(false)
    }
  }

  // Analyze resume
  const analyzeResume = async (
    resumeText: string,
    jobDescription: string
  ): Promise<ResumeAnalysis | null> => {
    setIsAnalyzingResume(true)
    
    try {
      const analysis = await langchainService.analyzeResume(
        resumeText,
        jobDescription
      )
      
      return analysis
    } catch (error) {
      toast({
        title: "Resume analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive"
      })
      
      return null
    } finally {
      setIsAnalyzingResume(false)
    }
  }

  return {
    generateQuestions,
    analyzeResponse,
    analyzeResume,
    isGeneratingQuestions,
    isAnalyzingResponse,
    isAnalyzingResume,
    error,
  }
} 