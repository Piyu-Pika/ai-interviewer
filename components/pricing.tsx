import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PricingFeature = ({ feature }: { feature: string }) => (
  <div className="flex items-start gap-2 mb-2">
    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
    <span className="text-gray-600">{feature}</span>
  </div>
)

const RecruiterPlans = () => (
  <div className="grid md:grid-cols-2 gap-6 mt-8">
    <Card className="border-2 border-gray-200 hover:border-primary/50 transition-all">
      <CardHeader>
        <CardTitle>Basic</CardTitle>
        <CardDescription>Perfect for startups and small businesses</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">$99</span>
          <span className="text-gray-500"> /month</span>
        </div>
      </CardHeader>
      <CardContent>
        <PricingFeature feature="Up to 10 active job postings" />
        <PricingFeature feature="50 AI interviews per month" />
        <PricingFeature feature="Basic candidate analytics" />
        <PricingFeature feature="Email support" />
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/auth/signup?plan=basic">Get Started</Link>
        </Button>
      </CardFooter>
    </Card>

    <Card className="border-2 border-gray-200 hover:border-primary/50 transition-all">
      <CardHeader>
        <CardTitle>Intermediate</CardTitle>
        <CardDescription>For growing teams and businesses</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">$199</span>
          <span className="text-gray-500"> /month</span>
        </div>
      </CardHeader>
      <CardContent>
        <PricingFeature feature="Up to 25 active job postings" />
        <PricingFeature feature="200 AI interviews per month" />
        <PricingFeature feature="Advanced candidate analytics" />
        <PricingFeature feature="Custom interview questions" />
        <PricingFeature feature="Priority email support" />
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/auth/signup?plan=intermediate">Get Started</Link>
        </Button>
      </CardFooter>
    </Card>

    <Card className="border-2 border-primary/20 bg-primary/5 hover:border-primary/70 transition-all">
      <CardHeader>
        <Badge className="w-fit mb-2">Most Popular</Badge>
        <CardTitle>Advanced</CardTitle>
        <CardDescription>For medium to large companies</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">$399</span>
          <span className="text-gray-500"> /month</span>
        </div>
      </CardHeader>
      <CardContent>
        <PricingFeature feature="Up to 100 active job postings" />
        <PricingFeature feature="500 AI interviews per month" />
        <PricingFeature feature="Full candidate analytics suite" />
        <PricingFeature feature="Custom interview templates" />
        <PricingFeature feature="Branded interviews" />
        <PricingFeature feature="Team collaboration tools" />
        <PricingFeature feature="Priority phone & email support" />
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/auth/signup?plan=advanced">Get Started</Link>
        </Button>
      </CardFooter>
    </Card>

    <Card className="border-2 border-gray-200 hover:border-primary/50 transition-all">
      <CardHeader>
        <CardTitle>Enterprise</CardTitle>
        <CardDescription>Custom solutions for large organizations</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">Custom</span>
        </div>
      </CardHeader>
      <CardContent>
        <PricingFeature feature="Unlimited job postings" />
        <PricingFeature feature="Unlimited AI interviews" />
        <PricingFeature feature="Enterprise-grade security" />
        <PricingFeature feature="API access" />
        <PricingFeature feature="Custom integrations" />
        <PricingFeature feature="Dedicated account manager" />
        <PricingFeature feature="24/7 premium support" />
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link href="/contact-sales">Contact Sales</Link>
        </Button>
      </CardFooter>
    </Card>
  </div>
)

const CandidatePlans = () => (
  <div className="mt-8">
    <Card className="border-2 border-primary/20 bg-primary/5 hover:border-primary/70 transition-all max-w-xl mx-auto">
      <CardHeader>
        <Badge className="w-fit mb-2" variant="secondary">Special Benefits</Badge>
        <CardTitle>Candidate Premium</CardTitle>
        <CardDescription>Stand out to employers and get more opportunities</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">$19</span>
          <span className="text-gray-500"> /month</span>
        </div>
      </CardHeader>
      <CardContent>
        <PricingFeature feature="Featured profile for recruiters" />
        <PricingFeature feature="AI interview practice sessions" />
        <PricingFeature feature="Personalized feedback on interviews" />
        <PricingFeature feature="Priority application status" />
        <PricingFeature feature="Skills assessment certificates" />
        <PricingFeature feature="Resume and profile optimization" />
        <PricingFeature feature="Direct messaging with recruiters" />
        <PricingFeature feature="Job match alerts" />
        <PricingFeature feature="Premium learning resources" />
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/auth/signup?plan=candidate-premium">Upgrade Now</Link>
        </Button>
      </CardFooter>
    </Card>
  </div>
)

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 bg-slate-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            PRICING
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose the Right Plan for You</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Flexible pricing options for recruiters and candidates to meet your hiring needs
          </p>
        </div>

        <Tabs defaultValue="recruiter" className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="recruiter">For Recruiters</TabsTrigger>
              <TabsTrigger value="candidate">For Candidates</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="recruiter" className="animate-fade-in">
            <RecruiterPlans />
          </TabsContent>
          
          <TabsContent value="candidate" className="animate-fade-in">
            <CandidatePlans />
          </TabsContent>
        </Tabs>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto mt-16">
          <h3 className="text-xl font-bold mb-4 text-center">Need a custom solution?</h3>
          <p className="text-center text-gray-600 mb-6">
            Contact our sales team to discuss your specific requirements and get a tailored quote.
          </p>
          <div className="flex justify-center">
            <Button asChild variant="outline">
              <Link href="/contact-sales">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 