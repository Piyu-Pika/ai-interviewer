'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AIInterview } from '@/components/ai-interview'
import { ChevronLeft, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { jobs } from '@/lib/mock-data'
import Link from 'next/link'

export default function InterviewDemoPage() {
  const router = useRouter()
  const [selectedJob, setSelectedJob] = useState(jobs[0])
  const [interviewCompleted, setInterviewCompleted] = useState(false)
  const [interviewResults, setInterviewResults] = useState<any>(null)
  
  // Handle interview completion
  const handleInterviewComplete = (results: any) => {
    setInterviewCompleted(true)
    setInterviewResults(results)
    
    // In a real app, you would save these results to your backend
    console.log('Interview completed with results:', results)
  }
  
  // Save interview results
  const saveResults = () => {
    // In a real app, you would save the results to your backend
    // For demo purposes, we'll just redirect to the results page
    router.push('/candidate/results')
  }
  
  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/candidate/assessments">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">AI Interview Practice</h1>
        </div>
        
        {interviewCompleted && (
          <Button onClick={saveResults} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Results
          </Button>
        )}
      </div>
      
      <AIInterview 
        job={selectedJob}
        onComplete={handleInterviewComplete}
      />
    </div>
  )
} 