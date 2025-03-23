import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, MapPin, Clock, DollarSign, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Mock job data
const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$90,000 - $120,000",
    posted: "2 days ago",
    description:
      "We're looking for a skilled Frontend Developer to join our team and help build amazing user experiences.",
    skills: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "DataSystems",
    location: "Remote",
    type: "Full-time",
    salary: "$100,000 - $130,000",
    posted: "1 week ago",
    description: "Join our backend team to build scalable and efficient server-side applications.",
    skills: ["Node.js", "Python", "AWS"],
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "CreativeMinds",
    location: "New York, NY",
    type: "Contract",
    salary: "$70 - $90 per hour",
    posted: "3 days ago",
    description: "Help us create beautiful and intuitive user interfaces for our products.",
    skills: ["Figma", "Adobe XD", "User Research"],
  },
  {
    id: 4,
    title: "Full Stack Developer",
    company: "WebSolutions",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$95,000 - $125,000",
    posted: "Just now",
    description: "Looking for a versatile developer who can work on both frontend and backend technologies.",
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Remote",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    posted: "5 days ago",
    description: "Join our team to build and maintain our cloud infrastructure and CI/CD pipelines.",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
  },
]

export default function JobsPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Browse Jobs</h1>
          <p className="text-muted-foreground mt-1">Find your next opportunity from our curated job listings</p>
        </div>
        <Button asChild>
          <Link href="/auth/login">Apply for Jobs</Link>
        </Button>
      </div>

      {/* Search and filters */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search jobs, keywords, companies..." className="pl-10" />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Location" className="pl-10" />
        </div>
        <div>
          <Button variant="outline" className="w-full">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      {/* Job listings */}
      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription className="text-base mt-1">{job.company}</CardDescription>
                </div>
                <Button asChild>
                  <Link href={`/auth/login?redirect=/jobs/${job.id}`}>Apply Now</Link>
                </Button>
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
                  <DollarSign className="mr-1 h-4 w-4" />
                  {job.salary}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {job.posted}
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
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/jobs/${job.id}`}>View Details</Link>
              </Button>
              <Button variant="ghost" className="text-primary">
                Save Job
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

