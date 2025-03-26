import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, Clock, Users, ArrowLeft, Building2, DollarSign, Calendar } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    // Add more mock jobs as needed
  ]
  
  return jobs.find(job => job.id === parseInt(id)) || null
}

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
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
          <Link href="/recruiter/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <p className="text-muted-foreground mt-1">{job.company}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={job.status === "Active" ? "default" : job.status === "Filled" ? "secondary" : "outline"}>
              {job.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Actions</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/recruiter/jobs/${job.id}/edit`}>Edit Job</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/recruiter/jobs/${job.id}/candidates`}>View Candidates</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>
                  {job.status === "Active" ? "Close Job" : "Reopen Job"}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete Job</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <Briefcase className="mr-1 h-4 w-4" />
                  {job.type}
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-1 h-4 w-4" />
                  {job.salary}
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  {job.applicants} applicants
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Posted {job.posted}
                </div>
              </div>
              <p className="text-base">{job.description}</p>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {job.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/recruiter/jobs/${job.id}/candidates`}>
                  <Users className="mr-2 h-4 w-4" />
                  View Candidates ({job.applicants})
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/recruiter/jobs/${job.id}/edit`}>Edit Job</Link>
              </Button>
              {job.status === "Active" && (
                <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                  Close Job
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 