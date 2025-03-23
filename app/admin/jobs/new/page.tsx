"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export default function NewJobPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: "",
    responsibilities: "",
    aiQuestions: "",
  })

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")

    if (!token || role !== "admin") {
      router.push("/auth/login")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const generateJobDescription = async () => {
    if (!formData.title) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter a job title to generate content.",
      })
      return
    }

    setIsGenerating(true)

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Generate a professional job description for a ${formData.title} position.
                Include the following sections:
                1. A brief overview of the role (2-3 sentences)
                2. Key responsibilities (5-7 bullet points)
                3. Requirements and qualifications (5-7 bullet points)
                
                Format the response with clear section headers and proper spacing.`,
      })

      // Parse the generated text to extract sections
      const sections = text.split(/(?=##|#)/)

      let description = ""
      let responsibilities = ""
      let requirements = ""

      sections.forEach((section) => {
        const cleanSection = section.trim()
        if (cleanSection.toLowerCase().includes("overview") || cleanSection.toLowerCase().includes("description")) {
          description = cleanSection.replace(/^#+ .*\n/, "").trim()
        } else if (cleanSection.toLowerCase().includes("responsibilities")) {
          responsibilities = cleanSection.replace(/^#+ .*\n/, "").trim()
        } else if (
          cleanSection.toLowerCase().includes("requirements") ||
          cleanSection.toLowerCase().includes("qualifications")
        ) {
          requirements = cleanSection.replace(/^#+ .*\n/, "").trim()
        }
      })

      setFormData((prev) => ({
        ...prev,
        description: description || prev.description,
        responsibilities: responsibilities || prev.responsibilities,
        requirements: requirements || prev.requirements,
      }))

      toast({
        title: "Content generated",
        description: "Job description has been generated successfully.",
      })
    } catch (error) {
      console.error("Error generating job description:", error)
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Failed to generate job description. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateAIQuestions = async () => {
    if (!formData.title) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter a job title to generate interview questions.",
      })
      return
    }

    setIsGenerating(true)

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Generate 5 professional interview questions for a ${formData.title} position.
                The questions should assess the candidate's technical skills, experience, and cultural fit.
                Format the response as a numbered list.`,
      })

      setFormData((prev) => ({
        ...prev,
        aiQuestions: text,
      }))

      toast({
        title: "Questions generated",
        description: "AI interview questions have been generated successfully.",
      })
    } catch (error) {
      console.error("Error generating interview questions:", error)
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Failed to generate interview questions. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, you would save the job posting to a database
      // For demo purposes, we'll just simulate a successful save

      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: isDraft ? "Draft saved" : "Job posted",
        description: isDraft
          ? "Your job posting has been saved as a draft."
          : "Your job posting has been published successfully.",
      })

      router.push("/admin")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save job posting. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Job Posting</h1>
        <p className="text-muted-foreground mt-1">Fill in the details below to create a new job posting</p>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Job Details</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="ai-interview">AI Interview</TabsTrigger>
        </TabsList>

        <form onSubmit={(e) => handleSubmit(e, false)}>
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details for this job posting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Frontend Developer"
                    required
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    placeholder="e.g. Engineering"
                    required
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g. San Francisco, CA or Remote"
                    required
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type</Label>
                    <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input
                      id="salary"
                      name="salary"
                      placeholder="e.g. $80,000 - $100,000"
                      value={formData.salary}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => document.querySelector('[data-value="description"]')?.click()}>
                  Next
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="description">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
                <CardDescription>Provide details about the role, responsibilities, and requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-end">
                  <Button type="button" variant="outline" onClick={generateJobDescription} disabled={isGenerating}>
                    {isGenerating ? "Generating..." : "Generate with AI"}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Overview</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide a brief overview of the role"
                    className="min-h-[100px]"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Responsibilities</Label>
                  <Textarea
                    id="responsibilities"
                    name="responsibilities"
                    placeholder="List the key responsibilities for this role"
                    className="min-h-[150px]"
                    value={formData.responsibilities}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    placeholder="List the required skills and qualifications"
                    className="min-h-[150px]"
                    value={formData.requirements}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.querySelector('[data-value="details"]')?.click()}
                >
                  Back
                </Button>
                <Button type="button" onClick={() => document.querySelector('[data-value="ai-interview"]')?.click()}>
                  Next
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="ai-interview">
            <Card>
              <CardHeader>
                <CardTitle>AI Interview Setup</CardTitle>
                <CardDescription>Configure the AI interview questions for candidates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-end">
                  <Button type="button" variant="outline" onClick={generateAIQuestions} disabled={isGenerating}>
                    {isGenerating ? "Generating..." : "Generate Questions with AI"}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aiQuestions">Interview Questions</Label>
                  <Textarea
                    id="aiQuestions"
                    name="aiQuestions"
                    placeholder="Enter questions for the AI interview (one per line)"
                    className="min-h-[200px]"
                    value={formData.aiQuestions}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.querySelector('[data-value="description"]')?.click()}
                  >
                    Back
                  </Button>
                  <Button type="button" variant="secondary" onClick={(e) => handleSubmit(e, true)} disabled={isLoading}>
                    Save as Draft
                  </Button>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Publishing..." : "Publish Job"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  )
}

