import { useState } from "react"

export interface Notification {
  id: string
  type: "success" | "error" | "info"
  message: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (type: Notification["type"], message: string) => {
    const id = Date.now().toString()
    const notification: Notification = { id, type, message }

    setNotifications((prev) => [...prev, notification])

    // Remove a notificação após 5 segundos
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return {
    notifications,
    addNotification,
    removeNotification,
  }
}
