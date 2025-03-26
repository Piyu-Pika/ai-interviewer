"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { MapPin, FileText, Github, Linkedin, Globe, Trash2, Building2 } from "lucide-react"

export default function ProfilePage({ params }: { params: { role: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    about: "",
    github: "",
    linkedin: "",
    website: "",
    company: "",
    position: "",
  })
  const [newSkill, setNewSkill] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [experiences, setExperiences] = useState<any[]>([])
  const [education, setEducation] = useState<any[]>([])
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  })
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  })
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      application: true,
      interview: true,
      messages: true,
      candidate: true,
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showPhone: false,
    },
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    // Check if user role matches the route
    const userRole = localStorage.getItem("userRole")
    if (userRole !== params.role) {
      router.push(`/${userRole}/profile`)
      return
    }

    setIsAuthenticated(true)
    // TODO: Fetch actual user data from API
    // For now using mock data
    const mockUserData = {
      id: 1,
      name: params.role === "candidate" ? "Alex Johnson" : "Sarah Chen",
      email: params.role === "candidate" ? "alex.johnson@example.com" : "sarah.chen@techcorp.com",
      phone: params.role === "candidate" ? "(555) 123-4567" : "(555) 987-6543",
      location: "San Francisco, CA",
      role: params.role,
      avatar: "/placeholder.svg?height=128&width=128",
      about: params.role === "candidate" 
        ? "Experienced frontend developer with 5 years of experience building responsive web applications."
        : "Senior Technical Recruiter with 8 years of experience in tech recruitment.",
      skills: params.role === "candidate" ? ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Node.js", "Git"] : [],
      experience: params.role === "candidate" ? [
        {
          id: 1,
          title: "Senior Frontend Developer",
          company: "TechCorp",
          location: "San Francisco, CA",
          startDate: "Jan 2022",
          endDate: "Present",
          description: "Lead frontend development for multiple projects.",
        },
      ] : [],
      education: params.role === "candidate" ? [
        {
          id: 1,
          degree: "B.S. Computer Science",
          institution: "Stanford University",
          location: "Stanford, CA",
          startDate: "Sep 2015",
          endDate: "Jun 2019",
          description: "Focused on web development and user interface design.",
        },
      ] : [],
      links: params.role === "candidate" ? {
        github: "https://github.com/alexjohnson",
        linkedin: "https://linkedin.com/in/alexjohnson",
        website: "https://alexjohnson.dev",
      } : {},
      company: params.role === "recruiter" ? "TechCorp" : "",
      position: params.role === "recruiter" ? "Senior Technical Recruiter" : "",
      website: params.role === "recruiter" ? "https://techcorp.com" : "",
      resume: params.role === "candidate" ? "/resume.pdf" : "",
      preferences: {
        notifications: {
          email: true,
          application: true,
          interview: true,
          messages: true,
          candidate: true,
        },
        privacy: {
          profileVisibility: "public",
          showEmail: false,
          showPhone: false,
        },
      },
    }

    setUserData(mockUserData)
    setFormData({
      name: mockUserData.name,
      email: mockUserData.email,
      phone: mockUserData.phone || "",
      location: mockUserData.location || "",
      about: mockUserData.about || "",
      github: mockUserData.links?.github || "",
      linkedin: mockUserData.links?.linkedin || "",
      website: mockUserData.website || "",
      company: mockUserData.company || "",
      position: mockUserData.position || "",
    })
    setSkills(mockUserData.skills || [])
    setExperiences(mockUserData.experience || [])
    setEducation(mockUserData.education || [])
    setPreferences(mockUserData.preferences)
  }, [router, params.role])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev) => [...prev, newSkill.trim()])
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewExperience((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddExperience = () => {
    if (newExperience.title && newExperience.company) {
      setExperiences((prev) => [...prev, { ...newExperience, id: Date.now() }])
      setNewExperience({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      })
    }
  }

  const handleRemoveExperience = (id: number) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id))
  }

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewEducation((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setEducation((prev) => [...prev, { ...newEducation, id: Date.now() }])
      setNewEducation({
        degree: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      })
    }
  }

  const handleRemoveEducation = (id: number) => {
    setEducation((prev) => prev.filter((edu) => edu.id !== id))
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
  }

  const handlePrivacyChange = (key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }))
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement API call to save profile
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulated API call
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userData?.avatar} />
                <AvatarFallback>{userData?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{userData?.name}</CardTitle>
                <CardDescription>{userData?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                {params.role === "candidate" && (
                  <>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                  </>
                )}
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                  {params.role === "recruiter" && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="about">About</Label>
                    <Textarea
                      id="about"
                      name="about"
                      value={formData.about}
                      onChange={handleInputChange}
                    />
                  </div>
                  {params.role === "candidate" && (
                    <div className="grid gap-2">
                      <Label>Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                            <button
                              className="ml-1"
                              onClick={() => handleRemoveSkill(skill)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill"
                        />
                        <Button onClick={handleAddSkill}>Add</Button>
                      </div>
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label>Social Links</Label>
                    <div className="flex gap-2">
                      {params.role === "candidate" ? (
                        <>
                          <Input
                            name="github"
                            value={formData.github}
                            onChange={handleInputChange}
                            placeholder="GitHub URL"
                          />
                          <Input
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleInputChange}
                            placeholder="LinkedIn URL"
                          />
                          <Input
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="Personal Website"
                          />
                        </>
                      ) : (
                        <Input
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="Company Website"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {params.role === "candidate" && (
                <>
                  <TabsContent value="experience">
                    <div className="grid gap-4">
                      {experiences.map((exp) => (
                        <Card key={exp.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-semibold">{exp.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {exp.company} • {exp.location}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {exp.startDate} - {exp.endDate}
                                </p>
                                <p className="mt-2">{exp.description}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveExperience(exp.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <Card>
                        <CardContent className="pt-6">
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="exp-title">Title</Label>
                              <Input
                                id="exp-title"
                                name="title"
                                value={newExperience.title}
                                onChange={handleExperienceChange}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="exp-company">Company</Label>
                              <Input
                                id="exp-company"
                                name="company"
                                value={newExperience.company}
                                onChange={handleExperienceChange}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="exp-location">Location</Label>
                              <Input
                                id="exp-location"
                                name="location"
                                value={newExperience.location}
                                onChange={handleExperienceChange}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="exp-start">Start Date</Label>
                                <Input
                                  id="exp-start"
                                  name="startDate"
                                  value={newExperience.startDate}
                                  onChange={handleExperienceChange}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="exp-end">End Date</Label>
                                <Input
                                  id="exp-end"
                                  name="endDate"
                                  value={newExperience.endDate}
                                  onChange={handleExperienceChange}
                                />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="exp-description">Description</Label>
                              <Textarea
                                id="exp-description"
                                name="description"
                                value={newExperience.description}
                                onChange={handleExperienceChange}
                              />
                            </div>
                            <Button onClick={handleAddExperience}>Add Experience</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="education">
                    <div className="grid gap-4">
                      {education.map((edu) => (
                        <Card key={edu.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-semibold">{edu.degree}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {edu.institution} • {edu.location}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {edu.startDate} - {edu.endDate}
                                </p>
                                <p className="mt-2">{edu.description}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveEducation(edu.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <Card>
                        <CardContent className="pt-6">
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edu-degree">Degree</Label>
                              <Input
                                id="edu-degree"
                                name="degree"
                                value={newEducation.degree}
                                onChange={handleEducationChange}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edu-institution">Institution</Label>
                              <Input
                                id="edu-institution"
                                name="institution"
                                value={newEducation.institution}
                                onChange={handleEducationChange}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edu-location">Location</Label>
                              <Input
                                id="edu-location"
                                name="location"
                                value={newEducation.location}
                                onChange={handleEducationChange}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edu-start">Start Date</Label>
                                <Input
                                  id="edu-start"
                                  name="startDate"
                                  value={newEducation.startDate}
                                  onChange={handleEducationChange}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edu-end">End Date</Label>
                                <Input
                                  id="edu-end"
                                  name="endDate"
                                  value={newEducation.endDate}
                                  onChange={handleEducationChange}
                                />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edu-description">Description</Label>
                              <Textarea
                                id="edu-description"
                                name="description"
                                value={newEducation.description}
                                onChange={handleEducationChange}
                              />
                            </div>
                            <Button onClick={handleAddEducation}>Add Education</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </>
              )}

              <TabsContent value="preferences">
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <Switch
                          id="email-notifications"
                          checked={preferences.notifications.email}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("email", checked)
                          }
                        />
                      </div>
                      {params.role === "candidate" ? (
                        <div className="flex items-center justify-between">
                          <Label htmlFor="application-notifications">
                            Application Updates
                          </Label>
                          <Switch
                            id="application-notifications"
                            checked={preferences.notifications.application}
                            onCheckedChange={(checked) =>
                              handleNotificationChange("application", checked)
                            }
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <Label htmlFor="candidate-notifications">
                            Candidate Updates
                          </Label>
                          <Switch
                            id="candidate-notifications"
                            checked={preferences.notifications.candidate}
                            onCheckedChange={(checked) =>
                              handleNotificationChange("candidate", checked)
                            }
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <Label htmlFor="interview-notifications">
                          Interview Reminders
                        </Label>
                        <Switch
                          id="interview-notifications"
                          checked={preferences.notifications.interview}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("interview", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="message-notifications">Messages</Label>
                        <Switch
                          id="message-notifications"
                          checked={preferences.notifications.messages}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("messages", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <h3 className="text-lg font-semibold">Privacy</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="profile-visibility">Profile Visibility</Label>
                        <select
                          id="profile-visibility"
                          value={preferences.privacy.profileVisibility}
                          onChange={(e) =>
                            handlePrivacyChange("profileVisibility", e.target.value)
                          }
                          className="rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="connections">Connections Only</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-email">Show Email</Label>
                        <Switch
                          id="show-email"
                          checked={preferences.privacy.showEmail}
                          onCheckedChange={(checked) =>
                            handlePrivacyChange("showEmail", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-phone">Show Phone</Label>
                        <Switch
                          id="show-phone"
                          checked={preferences.privacy.showPhone}
                          onCheckedChange={(checked) =>
                            handlePrivacyChange("showPhone", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveProfile} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
} 