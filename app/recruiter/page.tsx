import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Users, Briefcase, BarChart4 } from "lucide-react"

export default function RecruiterDashboardPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your job postings and candidates</p>
        </div>
        <Button asChild>
          <Link href="/recruiter/jobs/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Active Jobs</CardTitle>
            <CardDescription>Your current job listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              <Briefcase className="mr-2 h-6 w-6 text-primary" />
              5
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/recruiter/jobs">View All Jobs</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Candidates</CardTitle>
            <CardDescription>Applicants across all positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              <Users className="mr-2 h-6 w-6 text-primary" />
              24
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/recruiter/candidates">View All Candidates</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Interviews</CardTitle>
            <CardDescription>Scheduled and completed interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              <BarChart4 className="mr-2 h-6 w-6 text-primary" />
              12
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/recruiter/interviews">View Interviews</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Job Postings</CardTitle>
            <CardDescription>Your most recently created job listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, title: "Frontend Developer", company: "Your Company", applicants: 8, posted: "2 days ago" },
                { id: 2, title: "Backend Engineer", company: "Your Company", applicants: 5, posted: "1 week ago" },
                { id: 3, title: "UX/UI Designer", company: "Your Company", applicants: 11, posted: "3 days ago" },
              ].map((job) => (
                <div key={job.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {job.applicants} applicants · Posted {job.posted}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/recruiter/jobs/${job.id}`}>Manage</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/recruiter/jobs">View All Jobs</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 