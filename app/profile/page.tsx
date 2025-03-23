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
import { MapPin, FileText, Github, Linkedin, Globe, Trash2 } from "lucide-react"

// Mock user data
const userData = {
  id: 1,
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "(555) 123-4567",
  location: "San Francisco, CA",
  role: "candidate", // or "admin"
  avatar: "/placeholder.svg?height=128&width=128",
  about:
    "Experienced frontend developer with 5 years of experience building responsive web applications. Passionate about user experience and clean code.",
  skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Node.js", "Git"],
  experience: [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      startDate: "Jan 2022",
      endDate: "Present",
      description:
        "Lead frontend development for multiple projects. Implemented new features and improved performance.",
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "WebSolutions",
      location: "San Francisco, CA",
      startDate: "Mar 2019",
      endDate: "Dec 2021",
      description:
        "Developed and maintained client websites. Collaborated with design team to implement UI/UX improvements.",
    },
  ],
  education: [
    {
      id: 1,
      degree: "B.S. Computer Science",
      institution: "Stanford University",
      location: "Stanford, CA",
      startDate: "Sep 2015",
      endDate: "Jun 2019",
      description: "Focused on web development and user interface design.",
    },
  ],
  links: {
    github: "https://github.com/alexjohnson",
    linkedin: "https://linkedin.com/in/alexjohnson",
    website: "https://alexjohnson.dev",
  },
  resume: "/resume.pdf",
  preferences: {
    notifications: {
      email: true,
      application: true,
      interview: true,
      messages: true,
    },
    privacy: {
      profileVisibility: "public", // public, private, connections
      showEmail: false,
      showPhone: false,
    },
  },
}

export default function ProfilePage() {
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
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showPhone: false,
    },
  })

  // Check authentication and load user data
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
    } else {
      setIsAuthenticated(true)

      // In a real app, you would fetch user data from an API
      // For demo purposes, we'll use mock data
      setUserData(userData)
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
        location: userData.location || "",
        about: userData.about || "",
        github: userData.links?.github || "",
        linkedin: userData.links?.linkedin || "",
        website: userData.links?.website || "",
      })
      setSkills(userData.skills || [])
      setExperiences(userData.experience || [])
      setEducation(userData.education || [])
      setPreferences(
        userData.preferences || {
          notifications: {
            email: true,
            application: true,
            interview: true,
            messages: true,
          },
          privacy: {
            profileVisibility: "public",
            showEmail: false,
            showPhone: false,
          },
        },
      )
    }
  }, [router])

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
      // In a real app, you would save the profile data to an API
      // For demo purposes, we'll just simulate a successful save
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local userData
      const updatedUserData = {
        ...userData,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        about: formData.about,
        skills,
        experience: experiences,
        education,
        links: {
          github: formData.github,
          linkedin: formData.linkedin,
          website: formData.website,
        },
        preferences,
      }

      setUserData(updatedUserData)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated || !userData) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information and preferences</p>
        </div>
        <Button onClick={handleSaveProfile} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <p className="text-muted-foreground">{userData.role === "admin" ? "Employer" : "Job Seeker"}</p>
                <div className="mt-4 w-full">
                  <Button variant="outline" className="w-full">
                    Change Photo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" name="location" value={formData.location} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about">About</Label>
                    <Textarea
                      id="about"
                      name="about"
                      rows={5}
                      value={formData.about}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>External Links</CardTitle>
                  <CardDescription>Add your social media and website links</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="github" className="flex items-center gap-2">
                      <Github className="h-4 w-4" /> GitHub
                    </Label>
                    <Input
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Personal Website
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>Add your work history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="border rounded-md p-4 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveExperience(exp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{exp.title}</h3>
                          <p className="text-muted-foreground">{exp.company}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {exp.startDate} - {exp.endDate || "Present"}
                        </div>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                      {exp.description && <p className="mt-2 text-sm">{exp.description}</p>}
                    </div>
                  ))}

                  <div className="border rounded-md p-4 border-dashed">
                    <h3 className="font-semibold mb-4">Add New Experience</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          name="title"
                          value={newExperience.title}
                          onChange={handleExperienceChange}
                          placeholder="e.g. Frontend Developer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          name="company"
                          value={newExperience.company}
                          onChange={handleExperienceChange}
                          placeholder="e.g. Acme Inc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exp-location">Location</Label>
                        <Input
                          id="exp-location"
                          name="location"
                          value={newExperience.location}
                          onChange={handleExperienceChange}
                          placeholder="e.g. San Francisco, CA"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input
                            id="startDate"
                            name="startDate"
                            value={newExperience.startDate}
                            onChange={handleExperienceChange}
                            placeholder="e.g. Jan 2020"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">End Date</Label>
                          <Input
                            id="endDate"
                            name="endDate"
                            value={newExperience.endDate}
                            onChange={handleExperienceChange}
                            placeholder="e.g. Present"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={newExperience.description}
                        onChange={handleExperienceChange}
                        placeholder="Describe your responsibilities and achievements"
                      />
                    </div>
                    <Button onClick={handleAddExperience}>Add Experience</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Add your educational background</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id} className="border rounded-md p-4 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <p className="text-muted-foreground">{edu.institution}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {edu.startDate} - {edu.endDate || "Present"}
                        </div>
                      </div>
                      {edu.location && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{edu.location}</span>
                        </div>
                      )}
                      {edu.description && <p className="mt-2 text-sm">{edu.description}</p>}
                    </div>
                  ))}

                  <div className="border rounded-md p-4 border-dashed">
                    <h3 className="font-semibold mb-4">Add New Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="degree">Degree</Label>
                        <Input
                          id="degree"
                          name="degree"
                          value={newEducation.degree}
                          onChange={handleEducationChange}
                          placeholder="e.g. B.S. Computer Science"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="institution">Institution</Label>
                        <Input
                          id="institution"
                          name="institution"
                          value={newEducation.institution}
                          onChange={handleEducationChange}
                          placeholder="e.g. Stanford University"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edu-location">Location</Label>
                        <Input
                          id="edu-location"
                          name="location"
                          value={newEducation.location}
                          onChange={handleEducationChange}
                          placeholder="e.g. Stanford, CA"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="edu-startDate">Start Date</Label>
                          <Input
                            id="edu-startDate"
                            name="startDate"
                            value={newEducation.startDate}
                            onChange={handleEducationChange}
                            placeholder="e.g. Sep 2016"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edu-endDate">End Date</Label>
                          <Input
                            id="edu-endDate"
                            name="endDate"
                            value={newEducation.endDate}
                            onChange={handleEducationChange}
                            placeholder="e.g. Jun 2020"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="edu-description">Description</Label>
                      <Textarea
                        id="edu-description"
                        name="description"
                        rows={3}
                        value={newEducation.description}
                        onChange={handleEducationChange}
                        placeholder="Describe your studies, achievements, etc."
                      />
                    </div>
                    <Button onClick={handleAddEducation}>Add Education</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Add your technical and professional skills</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1 py-1.5">
                        {skill}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 hover:bg-transparent"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    {skills.length === 0 && <p className="text-sm text-muted-foreground">No skills added yet.</p>}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddSkill()
                        }
                      }}
                    />
                    <Button onClick={handleAddSkill}>Add</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resume</CardTitle>
                  <CardDescription>Upload your resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span>resume.pdf</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Replace
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="font-medium">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={preferences.notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="application-notifications" className="font-medium">
                        Application Updates
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive updates about your job applications</p>
                    </div>
                    <Switch
                      id="application-notifications"
                      checked={preferences.notifications.application}
                      onCheckedChange={(checked) => handleNotificationChange("application", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="interview-notifications" className="font-medium">
                        Interview Reminders
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive reminders about upcoming interviews</p>
                    </div>
                    <Switch
                      id="interview-notifications"
                      checked={preferences.notifications.interview}
                      onCheckedChange={(checked) => handleNotificationChange("interview", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="message-notifications" className="font-medium">
                        Messages
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive notifications about new messages</p>
                    </div>
                    <Switch
                      id="message-notifications"
                      checked={preferences.notifications.messages}
                      onCheckedChange={(checked) => handleNotificationChange("messages", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control who can see your information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-visibility" className="font-medium">
                      Profile Visibility
                    </Label>
                    <select
                      id="profile-visibility"
                      className="w-full p-2 border rounded-md"
                      value={preferences.privacy.profileVisibility}
                      onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                    >
                      <option value="public">Public - Anyone can view your profile</option>
                      <option value="connections">
                        Connections Only - Only your connections can view your profile
                      </option>
                      <option value="private">Private - Only you can view your profile</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-email" className="font-medium">
                        Show Email Address
                      </Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your email address</p>
                    </div>
                    <Switch
                      id="show-email"
                      checked={preferences.privacy.showEmail}
                      onCheckedChange={(checked) => handlePrivacyChange("showEmail", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-phone" className="font-medium">
                        Show Phone Number
                      </Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your phone number</p>
                    </div>
                    <Switch
                      id="show-phone"
                      checked={preferences.privacy.showPhone}
                      onCheckedChange={(checked) => handlePrivacyChange("showPhone", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

