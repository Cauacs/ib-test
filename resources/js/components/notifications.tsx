import { X, CheckCircle, XCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Notification } from "@/hooks/use-notifications"

interface NotificationsProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

export function Notifications({ notifications, onRemove }: NotificationsProps) {
  if (notifications.length === 0) return null

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBackgroundColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "info":
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg max-w-md ${getBackgroundColor(notification.type)}`}
        >
          {getIcon(notification.type)}
          <p className="flex-1 text-sm font-medium">{notification.message}</p>
          <Button variant="ghost" size="sm" onClick={() => onRemove(notification.id)} className="h-6 w-6 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
