import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, MapPin, Clock, Users, PlusCircle, Search, Filter, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock recruiter job data
const recruiterJobs = [
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
  },
  {
    id: 2,
    title: "Backend Engineer",
    location: "Remote",
    type: "Full-time",
    salary: "$100,000 - $130,000",
    posted: "1 week ago",
    applicants: 5,
    status: "Active",
    description: "Join our backend team to build scalable and efficient server-side applications.",
    skills: ["Node.js", "Python", "AWS"],
  },
  {
    id: 3,
    title: "UX/UI Designer",
    location: "New York, NY",
    type: "Contract",
    salary: "$70 - $90 per hour",
    posted: "3 days ago",
    applicants: 11,
    status: "Active",
    description: "Help us create beautiful and intuitive user interfaces for our products.",
    skills: ["Figma", "Adobe XD", "User Research"],
  },
  {
    id: 4,
    title: "DevOps Engineer",
    location: "Remote",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    posted: "2 weeks ago",
    applicants: 3,
    status: "Closed",
    description: "Join our team to build and maintain our cloud infrastructure and CI/CD pipelines.",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
  },
  {
    id: 5,
    title: "Product Manager",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$95,000 - $125,000",
    posted: "1 month ago",
    applicants: 15,
    status: "Filled",
    description: "Looking for a product manager to lead our new initiative and coordinate across teams.",
    skills: ["Product Strategy", "Agile", "User Research", "Roadmapping"],
  },
]

export default function RecruiterJobsPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Jobs</h1>
          <p className="text-muted-foreground mt-1">Create and manage your job listings</p>
        </div>
        <Button asChild>
          <Link href="/recruiter/jobs/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Search and filters */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search job titles, skills, locations..." className="pl-10" />
        </div>
        <div>
          <select className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="filled">Filled</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div>
          <Button variant="outline" className="w-full">
            <Filter className="mr-2 h-4 w-4" /> More Filters
          </Button>
        </div>
      </div>

      {/* Job listings */}
      <div className="grid gap-6">
        {recruiterJobs.map((job) => (
          <Card key={job.id} className={job.status !== "Active" ? "opacity-75" : ""}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <Badge variant={job.status === "Active" ? "default" : job.status === "Filled" ? "secondary" : "outline"}>
                      {job.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-base mt-1">
                    Posted {job.posted} • {job.applicants} applicants
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" asChild>
                    <Link href={`/recruiter/jobs/${job.id}/candidates`}>
                      <Users className="mr-2 h-4 w-4" />
                      View Candidates
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/recruiter/jobs/${job.id}/edit`}>Edit Job</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/recruiter/jobs/${job.id}`}>View Details</Link>
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
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <Briefcase className="mr-1 h-4 w-4" />
                  {job.type}
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  {job.applicants} applicants
                </div>
              </div>
              <p className="mb-4">{job.description}</p>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <Link href={`/recruiter/jobs/${job.id}`}>View Details</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/recruiter/jobs/${job.id}/edit`}>Edit Job</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/recruiter/jobs/${job.id}/candidates`}>View Candidates</Link>
              </Button>
              {job.status === "Active" && (
                <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                  Close Job
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
} 