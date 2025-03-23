import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon, ChevronLeft } from "lucide-react"

export default function CreateJobPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href="/recruiter/jobs">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Jobs
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Job</h1>
          <p className="text-muted-foreground mt-1">Post a new job to attract qualified candidates</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" placeholder="e.g. Frontend Developer" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" placeholder="e.g. Engineering" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the responsibilities, requirements, and benefits..." 
                  className="min-h-[150px]"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g. San Francisco, CA" />
                </div>
                
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <RadioGroup defaultValue="full-time" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full-time" id="full-time" />
                      <Label htmlFor="full-time">Full-Time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="part-time" id="part-time" />
                      <Label htmlFor="part-time">Part-Time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="contract" id="contract" />
                      <Label htmlFor="contract">Contract</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Compensation & Requirements</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minSalary">Minimum Salary</Label>
                  <Input id="minSalary" placeholder="e.g. 60000" type="number" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxSalary">Maximum Salary</Label>
                  <Input id="maxSalary" placeholder="e.g. 80000" type="number" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills (comma separated)</Label>
                <Input id="skills" placeholder="e.g. React, JavaScript, TypeScript" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <RadioGroup defaultValue="mid-level" className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="entry-level" id="entry-level" />
                    <Label htmlFor="entry-level">Entry Level</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mid-level" id="mid-level" />
                    <Label htmlFor="mid-level">Mid Level</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="senior" id="senior" />
                    <Label htmlFor="senior">Senior</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lead" id="lead" />
                    <Label htmlFor="lead">Team Lead</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Interview Process</h2>
              
              <div className="space-y-2">
                <Label>Interview Steps</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="resume-screen" className="h-4 w-4 rounded border-gray-300" checked readOnly />
                    <Label htmlFor="resume-screen">Resume Screening</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="phone-screen" className="h-4 w-4 rounded border-gray-300" />
                    <Label htmlFor="phone-screen">Phone Screening</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="ai-interview" className="h-4 w-4 rounded border-gray-300" />
                    <Label htmlFor="ai-interview">AI Interview</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="technical-assessment" className="h-4 w-4 rounded border-gray-300" />
                    <Label htmlFor="technical-assessment">Technical Assessment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="interview-rounds" className="h-4 w-4 rounded border-gray-300" />
                    <Label htmlFor="interview-rounds">Interview Rounds</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes for Candidates</Label>
                <Textarea 
                  id="additionalNotes" 
                  placeholder="Any additional information you want candidates to know..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Application Settings</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <div className="relative">
                    <Input id="deadline" placeholder="Select a date" />
                    <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <RadioGroup defaultValue="public" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">Public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private">Private</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline" asChild>
                <Link href="/recruiter/jobs">Cancel</Link>
              </Button>
              <Button variant="outline">Save as Draft</Button>
              <Button>Publish Job</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 