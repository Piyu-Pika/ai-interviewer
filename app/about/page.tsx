"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAboutUsContent } from "@/lib/models/about-us"

export default function AboutUs() {
  const [content, setContent] = useState(getAboutUsContent())
  
  // If we were using a real API, we would fetch the data here
  useEffect(() => {
    // This is for demonstration purposes - in a real app, you would fetch from an API
    const aboutUsContent = getAboutUsContent()
    setContent(aboutUsContent)
  }, [])

  return (
    <div className="container py-12 space-y-12">
      {/* Hero section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{content.title}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{content.mission}</p>
      </section>

      {/* Vision section */}
      <section className="grid gap-8 md:grid-cols-2 items-center py-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Our Vision</h2>
          <p className="text-lg text-muted-foreground">{content.vision}</p>
        </div>
        <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Vision Image Placeholder</p>
        </div>
      </section>

      {/* Story section */}
      <section className="grid gap-8 md:grid-cols-2 items-center py-8">
        <div className="bg-muted rounded-lg h-64 flex items-center justify-center order-1 md:order-none">
          <p className="text-muted-foreground">Story Image Placeholder</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="text-lg text-muted-foreground">{content.story}</p>
        </div>
      </section>

      {/* Values section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {content.values.map((value: {id: number, title: string, description: string}) => (
            <Card key={value.id} className="text-center">
              <CardHeader>
                <CardTitle>{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.team.map((member: {id: number, name: string, position: string, bio: string, image: string}) => (
            <Card key={member.id}>
              <div className="aspect-square w-full relative bg-muted">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Image Placeholder</p>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{member.name}</CardTitle>
                <CardDescription>{member.position}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="text-center text-sm text-muted-foreground">
        <p>Last updated: {new Date(content.lastUpdated).toLocaleDateString()}</p>
      </footer>
    </div>
  )
} 