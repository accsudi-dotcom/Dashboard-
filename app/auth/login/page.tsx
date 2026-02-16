'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import type { AdminUser } from '@/types/domain'

/**
 * Login Page
 * Entry point for Sharoobi Console - Super Admin authentication
 */
export default function LoginPage() {
  const router = useRouter()
  const { setUser, setError, setLoading, error, isLoading } = useAuthStore()
  const { addNotification } = useUIStore()

  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL || 'admin@sharoobi.local')
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD || 'Admin@sharoobi')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    setLoading(true)

    try {
      // Mock authentication - In production, call actual API
      if (email === 'admin@sharoobi.local' && password === 'Admin@sharoobi') {
        const mockUser: AdminUser = {
          id: 'admin-001',
          email,
          displayName: 'Super Admin',
          role: 'super_admin',
          permissions: [
            {
              resource: 'order',
              actions: ['view', 'create', 'update', 'delete', 'approve', 'refund'],
            },
            {
              resource: 'payment',
              actions: ['view', 'update', 'approve', 'refund', 'override'],
            },
            {
              resource: 'user',
              actions: ['view', 'update', 'freeze'],
            },
            {
              resource: 'provider',
              actions: ['view', 'update', 'approve', 'suspend'],
            },
            {
              resource: 'audit',
              actions: ['view', 'export'],
            },
            {
              resource: 'settings',
              actions: ['view', 'update'],
            },
          ],
          mfaEnabled: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        const token = 'mock-jwt-token-' + Math.random().toString(36).slice(2)
        // Set user in store (this also persists to localStorage)
        setUser(mockUser, token)
        addNotification('success', `Welcome back, ${mockUser.displayName}!`)

        // Small delay to ensure state is persisted before navigation
        setTimeout(() => {
          router.push('/dashboard/command-center')
        }, 100)
      } else {
        throw new Error('Invalid email or password')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setLocalError(message)
      setError(message)
      addNotification('error', message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 mb-4">
            <span className="text-2xl font-bold text-white">SC</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Sharoobi Console</h1>
          <p className="text-slate-400 mt-2">Enterprise Backoffice Operating System</p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access the console</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-200">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sharoobi.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-200">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              {/* Error */}
              {localError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-400">{localError}</p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white font-medium"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Demo Credentials */}
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-blue-300 font-medium mb-1">Demo Credentials:</p>
                <p className="text-xs text-blue-300">Email: {process.env.NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL || 'admin@sharoobi.local'}</p>
                <p className="text-xs text-blue-300">Password: {process.env.NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD || 'Admin@sharoobi'}</p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-slate-400 text-sm">
          <p>© 2025 Sharoobi. Enterprise Platform.</p>
        </div>
      </div>
    </div>
  )
}
