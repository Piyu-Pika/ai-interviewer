import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CalendarIcon } from "lucide-react"

// Mock function to fetch job details - replace with actual API call
async function getJobDetails(id: string) {
  // This would be replaced with an actual API call
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$90,000 - $120,000",
      posted: "2 days ago",
      applicants: 8,
      status: "Active",
      description:
        "We're looking for a skilled Frontend Developer to join our team and help build amazing user experiences.",
      skills: ["React", "TypeScript", "Tailwind CSS"],
      company: "Tech Corp",
      requirements: [
        "3+ years of experience with React and TypeScript",
        "Strong understanding of modern web development practices",
        "Experience with responsive design and cross-browser compatibility",
        "Excellent problem-solving skills and attention to detail",
      ],
      responsibilities: [
        "Develop and maintain high-quality user interfaces",
        "Collaborate with design team to implement pixel-perfect designs",
        "Write clean, maintainable, and well-documented code",
        "Participate in code reviews and team discussions",
      ],
      benefits: [
        "Competitive salary and equity package",
        "Health, dental, and vision insurance",
        "401(k) matching",
        "Flexible work hours and remote work options",
      ],
    },
  ]
  
  return jobs.find(job => job.id === parseInt(id)) || null
}

export default async function EditJobPage({ params }: { params: { id: string } }) {
  const job = await getJobDetails(params.id)

  if (!job) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <Button asChild>
            <Link href="/recruiter/jobs">Back to Jobs</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/recruiter/jobs/${job.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job Details
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Job</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" defaultValue={job.title} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue={job.company} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea 
                  id="description" 
                  defaultValue={job.description}
                  className="min-h-[150px]"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue={job.location} />
                </div>
                
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <RadioGroup defaultValue={job.type.toLowerCase()} className="flex gap-4">
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
              <h2 className="text-xl font-semibold">Requirements & Responsibilities</h2>
              
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea 
                  id="requirements" 
                  defaultValue={job.requirements.join('\n')}
                  className="min-h-[150px]"
                  placeholder="Enter each requirement on a new line"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
                <Textarea 
                  id="responsibilities" 
                  defaultValue={job.responsibilities.join('\n')}
                  className="min-h-[150px]"
                  placeholder="Enter each responsibility on a new line"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Benefits & Compensation</h2>
              
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (one per line)</Label>
                <Textarea 
                  id="benefits" 
                  defaultValue={job.benefits.join('\n')}
                  className="min-h-[150px]"
                  placeholder="Enter each benefit on a new line"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input id="salary" defaultValue={job.salary} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills (comma separated)</Label>
                  <Input id="skills" defaultValue={job.skills.join(', ')} />
                </div>
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
                  <Label>Status</Label>
                  <RadioGroup defaultValue={job.status.toLowerCase()} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="active" id="active" />
                      <Label htmlFor="active">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="closed" id="closed" />
                      <Label htmlFor="closed">Closed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="filled" id="filled" />
                      <Label htmlFor="filled">Filled</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline" asChild>
                <Link href={`/recruiter/jobs/${job.id}`}>Cancel</Link>
              </Button>
              <Button variant="outline">Save as Draft</Button>
              <Button>Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 