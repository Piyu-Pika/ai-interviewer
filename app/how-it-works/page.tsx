"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Users, Zap, Shield, Building, BookOpen, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-primary px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-white animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Our AI-powered interview platform streamlines the hiring process for both employers and job seekers.
              Discover how our technology works to match the right talent with the right opportunities.
            </p>
          </div>
        </div>
      </header>

      {/* Process Overview Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              THE PROCESS
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple and Effective</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform connects employers and candidates through a streamlined process powered by AI technology.
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
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">1. Create Your Account</h3>
                    <p className="text-gray-600">
                      Sign up as an employer and create your company profile with details about your organization and hiring needs.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">2. Post Job Openings</h3>
                    <p className="text-gray-600">
                      Create detailed job listings with requirements, responsibilities, and custom interview questions.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">3. Review AI Insights</h3>
                    <p className="text-gray-600">
                      Receive AI-analyzed candidate interviews with insights on skills, qualifications, and cultural fit.
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
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">1. Create Your Profile</h3>
                    <p className="text-gray-600">
                      Sign up and build your professional profile showcasing your skills, experience, and career goals.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">2. Complete AI Interviews</h3>
                    <p className="text-gray-600">
                      Participate in AI-powered video interviews at your convenience, from anywhere in the world.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">3. Get Matched to Jobs</h3>
                    <p className="text-gray-600">
                      Our AI matches your profile and interview performance with suitable job opportunities.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              OUR TECHNOLOGY
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Advanced AI</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how our cutting-edge AI technology transforms the interview process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">AI-Powered Video Analysis</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Facial Expression Analysis</p>
                    <p className="text-gray-600">Our AI analyzes candidate expressions and engagement during interviews.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Response Assessment</p>
                    <p className="text-gray-600">Evaluate answer quality, relevance, and alignment with job requirements.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Skill Verification</p>
                    <p className="text-gray-600">Objective assessment of technical and soft skills through targeted questions.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Fair and Efficient Matching</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Bias Reduction</p>
                    <p className="text-gray-600">Our algorithms are designed to minimize unconscious bias in the hiring process.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Smart Matching</p>
                    <p className="text-gray-600">AI matches candidates to jobs based on skills, experience, and cultural alignment.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Data-Driven Insights</p>
                    <p className="text-gray-600">Detailed analytics help employers make informed hiring decisions.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              FREQUENTLY ASKED QUESTIONS
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Common Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to frequently asked questions about our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Is my data secure?</h3>
                <p className="text-gray-600">
                  Yes, we use enterprise-grade encryption and strict data protection protocols to ensure all your information remains secure and private.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">How accurate is the AI analysis?</h3>
                <p className="text-gray-600">
                  Our AI has been trained on millions of interview samples and consistently achieves high accuracy rates in assessing candidate responses and qualifications.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Can I integrate with other HR systems?</h3>
                <p className="text-gray-600">
                  Yes, our platform offers API integration with popular ATS and HR management systems to streamline your workflow.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">What technical requirements are needed?</h3>
                <p className="text-gray-600">
                  Candidates only need a device with a camera, microphone, and stable internet connection to participate in interviews.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Hiring Process?</h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
              Join thousands of companies and candidates who are already using our platform to connect talent with opportunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="font-medium">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <Link href="/candidate/interview-demo">Try Demo Interview</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 