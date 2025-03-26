import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | AI Interviewer",
  description: "Terms of service and conditions for using AI Interviewer platform.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using AI Interviewer, you agree to be bound by these Terms of Service.
              If you do not agree with any part of these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily access AI Interviewer for personal, non-commercial
              transitory viewing only. This license shall automatically terminate if you violate any
              of these restrictions and may be terminated by AI Interviewer at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
            <p>
              Users are responsible for maintaining the confidentiality of their account information
              and for all activities that occur under their account. Users must not use the service
              for any illegal or unauthorized purpose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Service Modifications</h2>
            <p>
              AI Interviewer reserves the right to modify or discontinue, temporarily or permanently,
              the service with or without notice. We shall not be liable to you or any third party
              for any modification, suspension, or discontinuance of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p>
              AI Interviewer shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
} 