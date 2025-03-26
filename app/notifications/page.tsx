"use client"

import { useState } from "react"
import { Bell, CheckCircle, XCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  title: string
  message: string
  type: "success" | "error" | "info"
  timestamp: string
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Interview Scheduled",
      message: "Your interview with Google has been scheduled for tomorrow at 2 PM.",
      type: "success",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      title: "Profile Update Required",
      message: "Please update your profile information to complete your application.",
      type: "info",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: "3",
      title: "Application Status",
      message: "Your application for the Software Engineer position has been reviewed.",
      type: "success",
      timestamp: "2 days ago",
      read: true,
    },
  ])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button
          variant="outline"
          onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
        >
          Mark all as read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${
              notification.read ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div className="flex items-start gap-4">
              {getNotificationIcon(notification.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <span className="text-sm text-gray-500">{notification.timestamp}</span>
                </div>
                <p className="text-gray-600 mt-1">{notification.message}</p>
              </div>
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 