import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Users, Zap, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TestimonialCard from "@/components/testimonial-card"
import FeatureCard from "@/components/feature-card"
import Pricing from "@/components/pricing"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="gradient-bg px-4 py-20 md:py-28">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-white animate-fade-in">
              <Badge variant="secondary" className="mb-4 text-xs font-semibold">
                NEW: AI VIDEO INTERVIEWS
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                AI-Powered Interview Platform
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-xl">
                Transform your hiring process with our advanced AI interviewer. Analyze facial expressions, assess
                responses, and find the best candidates faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="secondary" className="font-medium">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  <Link href="/request-demo">Request Demo</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="default"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Link href="/candidate/interview-demo">Try AI Interview Demo</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 animate-slide-up">
              <div className="bg-white p-1 rounded-lg shadow-2xl">
                <div className="relative">
                  <img
                    src="/assets/hero-image.png"
                    alt="AI Interview Platform"
                    className="w-full h-auto rounded"
                  />
                  <div className="absolute -bottom-5 -right-5 bg-white p-3 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">AI Analysis Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trusted By Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-lg font-medium text-gray-600">TRUSTED BY LEADING COMPANIES</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {["Company 1", "Company 2", "Company 3", "Company 4", "Company 5"].map((company, index) => (
              <div key={index} className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <img
                  src={`/placeholder.svg?height=40&width=120&text=${company}`}
                  alt={company}
                  className="h-8 md:h-10"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              POWERFUL FEATURES
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Revolutionize Your Hiring Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines AI video analysis, facial expression tracking, and response assessment to provide
              comprehensive candidate insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-primary" />}
              title="AI Video Interviews"
              description="Conduct automated video interviews with real-time facial expression analysis and engagement tracking."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-primary" />}
              title="Bias Reduction"
              description="Our AI focuses on skills and qualifications, helping create a fair and objective hiring process."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6 text-primary" />}
              title="Candidate Management"
              description="Organize applicants, track progress, and collaborate with your team in one central platform."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              SIMPLE PROCESS
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes hiring efficient and effective with a streamlined process for both employers and
              candidates.
            </p>
          </div>

          <Tabs defaultValue="employers" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="employers">For Employers</TabsTrigger>
                <TabsTrigger value="candidates">For Candidates</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="employers" className="animate-fade-in">
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Create Job Postings</h3>
                    <p className="text-gray-600">
                      Post job openings with detailed descriptions and requirements. Our AI can help generate content.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Set Up AI Interviews</h3>
                    <p className="text-gray-600">
                      Configure interview questions and assessment criteria for the AI to evaluate candidates.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Review Results</h3>
                    <p className="text-gray-600">
                      Get comprehensive reports with AI insights, facial expression analysis, and response quality.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="candidates" className="animate-fade-in">
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Create Profile</h3>
                    <p className="text-gray-600">
                      Sign up and build your profile with skills, experience, and qualifications to match with jobs.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Apply for Jobs</h3>
                    <p className="text-gray-600">
                      Browse and apply to positions that match your skills and career goals.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Complete AI Interview</h3>
                    <p className="text-gray-600">
                      Participate in video interviews at your convenience and receive instant feedback.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              TESTIMONIALS
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from employers and candidates who have transformed their hiring experience with our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="The AI video analysis has been a game-changer for our hiring process. We've reduced time-to-hire by 40% while finding better candidates."
              author="Sarah Johnson"
              role="HR Director, TechCorp"
              rating={5}
            />

            <TestimonialCard
              quote="As a candidate, I loved the flexibility of completing the interview on my own time. The instant feedback helped me improve my interview skills."
              author="Michael Chen"
              role="Software Engineer"
              rating={4}
            />

            <TestimonialCard
              quote="The facial expression analysis provided insights we would have missed in traditional interviews. It's like having an expert psychologist on the team."
              author="David Wilson"
              role="Talent Acquisition, FinanceHub"
              rating={5}
            />

            <TestimonialCard
              quote="This platform made our remote hiring process seamless. The AI assessments are remarkably accurate and save our team countless hours."
              author="Emily Rodriguez"
              role="COO, StartupX"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <Pricing />

      {/* CTA Section */}
      <section className="gradient-bg py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Hiring Process?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of companies and candidates who are already using our AI-powered interview platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="font-medium">
              <Link href="/auth/signup">Get Started for Free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              <Link href="/request-demo">Request Demo</Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-white" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-white" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-white" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

