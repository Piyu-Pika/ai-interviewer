import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ChevronLeft, 
  Check, 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

// Mock job data
const job = {
  id: 1,
  title: "Frontend Developer",
  location: "San Francisco, CA",
  type: "Full-time",
  salary: "$90,000 - $120,000",
  posted: "2 days ago",
  applicants: 8,
  status: "Active",
}

// Mock candidates data
const candidates = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    status: "Shortlisted",
    resume: "https://example.com/resume1.pdf",
    appliedDate: "2 days ago",
    score: 92,
    match: "High",
    experience: "3 years",
    skills: ["React", "TypeScript", "CSS"],
    interviewStage: "AI Interview Completed",
  },
  {
    id: 2,
    name: "Sam Rivera",
    email: "sam.rivera@example.com",
    status: "In Review",
    resume: "https://example.com/resume2.pdf",
    appliedDate: "1 day ago",
    score: 87,
    match: "High",
    experience: "4 years",
    skills: ["React", "JavaScript", "Node.js"],
    interviewStage: "Technical Assessment",
  },
  {
    id: 3,
    name: "Taylor Kim",
    email: "taylor.kim@example.com",
    status: "New",
    resume: "https://example.com/resume3.pdf",
    appliedDate: "3 hours ago",
    score: 76,
    match: "Medium",
    experience: "2 years",
    skills: ["React", "CSS", "HTML"],
    interviewStage: "Application Received",
  },
  {
    id: 4,
    name: "Morgan Patel",
    email: "morgan.patel@example.com",
    status: "Rejected",
    resume: "https://example.com/resume4.pdf",
    appliedDate: "5 days ago",
    score: 65,
    match: "Low",
    experience: "1 year",
    skills: ["jQuery", "CSS", "HTML"],
    interviewStage: "Resume Screening",
  },
  {
    id: 5,
    name: "Jamie Wilson",
    email: "jamie.wilson@example.com",
    status: "Interview",
    resume: "https://example.com/resume5.pdf",
    appliedDate: "3 days ago",
    score: 88,
    match: "High",
    experience: "5 years",
    skills: ["React", "TypeScript", "GraphQL"],
    interviewStage: "Final Interview",
  },
  {
    id: 6,
    name: "Casey Lopez",
    email: "casey.lopez@example.com",
    status: "Offer",
    resume: "https://example.com/resume6.pdf",
    appliedDate: "1 week ago",
    score: 95,
    match: "High",
    experience: "6 years",
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    interviewStage: "Offer Extended",
  },
  {
    id: 7,
    name: "Jordan Smith",
    email: "jordan.smith@example.com",
    status: "New",
    resume: "https://example.com/resume7.pdf",
    appliedDate: "Just now",
    score: 82,
    match: "Medium",
    experience: "3 years",
    skills: ["Angular", "TypeScript", "CSS"],
    interviewStage: "Application Received",
  },
  {
    id: 8,
    name: "Quinn Davis",
    email: "quinn.davis@example.com",
    status: "In Review",
    resume: "https://example.com/resume8.pdf",
    appliedDate: "4 days ago",
    score: 79,
    match: "Medium",
    experience: "2 years",
    skills: ["React", "JavaScript", "CSS"],
    interviewStage: "AI Interview Scheduled",
  }
]

// Helper function to get the initials from a name
function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

// Helper function to get badge variant based on status
function getStatusVariant(status: string) {
  switch (status) {
    case "New": return "secondary";
    case "In Review": return "default";
    case "Shortlisted": return "default";
    case "Interview": return "default";
    case "Offer": return "default"; 
    case "Rejected": return "destructive";
    default: return "secondary";
  }
}

export default function CandidatesPage({ params }: { params: { id: string } }) {
  const jobId = params.id;
  
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

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Candidates for {job.title}</h1>
          <p className="text-muted-foreground mt-1">
            {job.applicants} applicants • Posted {job.posted} • {job.location}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/recruiter/jobs/${jobId}/edit`}>Edit Job</Link>
          </Button>
          <Button asChild>
            <Link href={`/recruiter/jobs/${jobId}`}>View Job Details</Link>
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Filter Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search candidates by name, skills, or experience..." className="pl-10" />
            </div>
            <div>
              <select className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background">
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="in-review">In Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" /> Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <div className="flex items-center gap-1">
                    Candidate <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Applied</TableHead>
                <TableHead className="hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    Match <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell">Current Stage</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{candidate.name}</div>
                        <div className="text-sm text-muted-foreground">{candidate.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={getStatusVariant(candidate.status)}>
                      {candidate.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{candidate.appliedDate}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${
                        candidate.match === "High" 
                          ? "bg-green-500" 
                          : candidate.match === "Medium" 
                          ? "bg-yellow-500" 
                          : "bg-red-500"
                      }`}></span>
                      <span>{candidate.score}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{candidate.interviewStage}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/recruiter/jobs/${jobId}/candidates/${candidate.id}`}>
                          <FileText className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/recruiter/jobs/${jobId}/candidates/${candidate.id}`}>
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                          <DropdownMenuItem>Send AI Interview</DropdownMenuItem>
                          <DropdownMenuItem>Change Status</DropdownMenuItem>
                          <DropdownMenuItem>Download Resume</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 