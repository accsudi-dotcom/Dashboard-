'use client'

import { useState, useCallback } from 'react'

type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
}

/**
 * Hook for managing toast notifications
 */
export function useToastNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback(
    (type: NotificationType, title: string, message?: string) => {
      const id = Math.random().toString(36).substr(2, 9)
      const notification = { id, type, title, message }

      setNotifications((prev) => [...prev, notification])

      // Auto-remove after 5 seconds
      setTimeout(() => {
        removeNotification(id)
      }, 5000)

      return id
    },
    []
  )

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const success = useCallback(
    (title: string, message?: string) => showNotification('success', title, message),
    [showNotification]
  )

  const error = useCallback(
    (title: string, message?: string) => showNotification('error', title, message),
    [showNotification]
  )

  const info = useCallback(
    (title: string, message?: string) => showNotification('info', title, message),
    [showNotification]
  )

  const warning = useCallback(
    (title: string, message?: string) => showNotification('warning', title, message),
    [showNotification]
  )

  return {
    notifications,
    showNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
  }
}
