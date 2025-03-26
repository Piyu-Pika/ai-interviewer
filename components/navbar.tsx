"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Video, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function Navbar() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Interview Scheduled",
      message: "Your interview with Google has been scheduled for tomorrow at 2 PM.",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      title: "Profile Update Required",
      message: "Please update your profile information to complete your application.",
      timestamp: "1 day ago",
      read: true,
    },
  ])

  // Check if user is authenticated (client-side)
  useEffect(() => {
    // This is a placeholder. In a real app, you'd check your auth state
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      const role = localStorage.getItem("userRole")
      const name = localStorage.getItem("userName") || "User"
      setIsAuthenticated(!!token)
      setUserRole(role)
      setUserName(name)
    }

    checkAuth()
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
  ]

  const authLinks = isAuthenticated
    ? []
    : [
        { name: "Login", href: "/auth/login" },
        { name: "Sign Up", href: "/auth/signup" },
      ]

  // Helper function to get the dashboard URL based on user role
  const getDashboardUrl = () => {
    if (userRole === "admin") return "/admin";
    if (userRole === "recruiter") return "/recruiter";
    return "/candidate";
  }

  const NavContent = () => (
    <>
      <div className="flex items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Video className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">AI Interviewer</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="hidden md:flex gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications.some(n => !n.read) && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                    >
                      {notifications.filter(n => !n.read).length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{notification.title}</span>
                        <span className="text-xs text-gray-500">{notification.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/notifications" className="w-full text-center">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={userName} />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardUrl()}>Dashboard</Link>
                </DropdownMenuItem>
                {userRole === "recruiter" && (
                  <DropdownMenuItem asChild>
                    <Link href="/recruiter/jobs">Manage Jobs</Link>
                  </DropdownMenuItem>
                )}
                {/* <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/auth/logout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <>
            <Button asChild variant="outline" className="bg-orange-500 hover:bg-orange-600 text-white border-none dark:text-white">
              <Link href="/request-demo">Request Demo</Link>
            </Button>
            {authLinks.map((link, index) => (
              <Button key={link.href} asChild variant={index === authLinks.length - 1 ? "default" : "outline"}>
                <Link href={link.href}>{link.name}</Link>
              </Button>
            ))}
          </>
        )}
      </div>
    </>
  )

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
          : "bg-background",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {isMobile ? (
          <>
            <Link href="/" className="flex items-center space-x-2">
              <Video className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">AI Interviewer</span>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-base font-medium transition-colors hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/request-demo"
                    className="text-base font-medium text-orange-500 hover:text-orange-600"
                  >
                    Request Demo
                  </Link>
                  <div className="h-px bg-border my-4" />
                  {isAuthenticated ? (
                    <>
                      <Link
                        href={getDashboardUrl()}
                        className="text-base font-medium transition-colors hover:text-primary"
                      >
                        Dashboard
                      </Link>
                      {userRole === "recruiter" && (
                        <Link 
                          href="/recruiter/jobs" 
                          className="text-base font-medium transition-colors hover:text-primary"
                        >
                          Manage Jobs
                        </Link>
                      )}
                      <Link href="/profile" className="text-base font-medium transition-colors hover:text-primary">
                        Profile
                      </Link>
                      <Link href="/auth/logout" className="text-base font-medium transition-colors hover:text-primary">
                        Logout
                      </Link>
                    </>
                  ) : (
                    authLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-base font-medium transition-colors hover:text-primary"
                      >
                        {link.name}
                      </Link>
                    ))
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <NavContent />
        )}
      </div>
    </header>
  )
}

