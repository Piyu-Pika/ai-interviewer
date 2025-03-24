"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Trash, Plus, Save, UserPlus, FileText } from "lucide-react"
import { 
  getAboutUsContent, 
  updateAboutUsContent,
  updateTeamMember,
  addTeamMember,
  removeTeamMember,
  updateValue,
  addValue,
  removeValue
} from "@/lib/models/about-us"

export default function AdminAboutUs() {
  const router = useRouter()
  const [content, setContent] = useState(getAboutUsContent())
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [savedMessage, setSavedMessage] = useState("")

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")

    if (!token || role !== "admin") {
      router.push("/auth/login")
    } else {
      setIsAuthenticated(true)
    }

    setIsLoading(false)
    
    // Get the latest content
    const aboutUsContent = getAboutUsContent()
    setContent(aboutUsContent)
  }, [router])

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContent(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveGeneral = () => {
    const { title, mission, vision, story } = content
    const updated = updateAboutUsContent({ title, mission, vision, story })
    setContent(updated)
    showSavedMessage()
  }

  const handleTeamMemberChange = (id: number, field: string, value: string) => {
    const updatedMember = updateTeamMember(id, { [field]: value })
    if (updatedMember) {
      setContent(getAboutUsContent())
    }
  }

  const handleAddTeamMember = () => {
    const newMember = addTeamMember({
      name: "New Team Member",
      position: "Position",
      bio: "Bio information",
      image: ""
    })
    
    setContent(getAboutUsContent())
  }

  const handleRemoveTeamMember = (id: number) => {
    const removed = removeTeamMember(id)
    if (removed) {
      setContent(getAboutUsContent())
    }
  }

  const handleValueChange = (id: number, field: string, value: string) => {
    const updatedValue = updateValue(id, { [field]: value })
    if (updatedValue) {
      setContent(getAboutUsContent())
    }
  }

  const handleAddValue = () => {
    const newValue = addValue({
      title: "New Value",
      description: "Description of this value"
    })
    
    setContent(getAboutUsContent())
  }

  const handleRemoveValue = (id: number) => {
    const removed = removeValue(id)
    if (removed) {
      setContent(getAboutUsContent())
    }
  }

  const showSavedMessage = () => {
    setSavedMessage("Changes saved successfully!")
    setTimeout(() => setSavedMessage(""), 3000)
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit About Us Page</h1>
          <p className="text-muted-foreground">Customize your About Us page content</p>
        </div>
        <Button onClick={() => router.push("/about")}>View Live Page</Button>
      </div>

      {savedMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {savedMessage}
        </div>
      )}

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">
            <FileText className="w-4 h-4 mr-2" />
            General Content
          </TabsTrigger>
          <TabsTrigger value="team">
            <UserPlus className="w-4 h-4 mr-2" />
            Team Members
          </TabsTrigger>
          <TabsTrigger value="values">
            <Plus className="w-4 h-4 mr-2" />
            Our Values
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Edit the main content sections of your About Us page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={content.title} 
                  onChange={handleGeneralChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mission">Mission Statement</Label>
                <Textarea 
                  id="mission" 
                  name="mission" 
                  value={content.mission}
                  onChange={handleGeneralChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vision">Our Vision</Label>
                <Textarea 
                  id="vision" 
                  name="vision" 
                  value={content.vision}
                  onChange={handleGeneralChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="story">Our Story</Label>
                <Textarea 
                  id="story" 
                  name="story" 
                  value={content.story}
                  onChange={handleGeneralChange}
                  rows={5}
                />
              </div>
              
              <Button onClick={handleSaveGeneral}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Team Members</h3>
            <Button onClick={handleAddTeamMember}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {content.team.map((member: {id: number, name: string, position: string, bio: string, image: string}) => (
              <Card key={member.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    Team Member #{member.id}
                  </CardTitle>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleRemoveTeamMember(member.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor={`name-${member.id}`}>Name</Label>
                    <Input 
                      id={`name-${member.id}`}
                      value={member.name}
                      onChange={(e) => handleTeamMemberChange(member.id, "name", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`position-${member.id}`}>Position</Label>
                    <Input 
                      id={`position-${member.id}`}
                      value={member.position}
                      onChange={(e) => handleTeamMemberChange(member.id, "position", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`bio-${member.id}`}>Bio</Label>
                    <Textarea 
                      id={`bio-${member.id}`}
                      value={member.bio}
                      onChange={(e) => handleTeamMemberChange(member.id, "bio", e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`image-${member.id}`}>Image URL</Label>
                    <Input 
                      id={`image-${member.id}`}
                      value={member.image}
                      onChange={(e) => handleTeamMemberChange(member.id, "image", e.target.value)}
                      placeholder="/team/member.jpg"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="values">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Our Values</h3>
            <Button onClick={handleAddValue}>
              <Plus className="w-4 h-4 mr-2" />
              Add Value
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {content.values.map((value: {id: number, title: string, description: string}) => (
              <Card key={value.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    Value #{value.id}
                  </CardTitle>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleRemoveValue(value.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor={`title-${value.id}`}>Title</Label>
                    <Input 
                      id={`title-${value.id}`}
                      value={value.title}
                      onChange={(e) => handleValueChange(value.id, "title", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`description-${value.id}`}>Description</Label>
                    <Textarea 
                      id={`description-${value.id}`}
                      value={value.description}
                      onChange={(e) => handleValueChange(value.id, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 