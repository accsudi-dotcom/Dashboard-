"use client"

import { useEffect, useState } from 'react'
import { Users, Search, Download, Filter, Plus, Lock, Unlock, Trash2, Mail, UserCheck, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stats/StatCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const defaultUsers = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    email: 'ahmed@email.com',
    status: 'active',
    tier: 'premium',
    joined: '2024-01-15',
    lastActive: '2 mins ago',
    mfaEnabled: true,
    emailVerified: true,
    roles: ['admin'],
    lastLogin: '2024-02-14 14:23:45',
  },
  {
    id: '2',
    name: 'Fatima Ali',
    email: 'fatima@email.com',
    status: 'active',
    tier: 'standard',
    joined: '2023-08-20',
    lastActive: '1 hour ago',
    mfaEnabled: false,
    emailVerified: true,
    roles: ['user'],
    lastLogin: '2024-02-14 13:15:22',
  },
]


export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tierFilter, setTierFilter] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<(typeof defaultUsers)[0] | null>(null)
  const [users, setUsers] = useState<typeof defaultUsers>(defaultUsers)

  useEffect(() => {
    let mounted = true

    async function loadUsers() {
      try {
        const res = await fetch('/api/dev/mock?type=users')
        const json = await res.json()
        const data = json?.data || json
        if (mounted && Array.isArray(data)) setUsers(data)
      } catch (err) {
        console.warn('Failed to fetch users mock', err)
      }
    }

    loadUsers()

    return () => {
      mounted = false
    }
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesTier = tierFilter === 'all' || user.tier === tierFilter
    return matchesSearch && matchesStatus && matchesTier
  })

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    mfaEnabled: users.filter(u => u.mfaEnabled).length,
    blocked: users.filter(u => u.status === 'blocked').length,
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users Directory</h1>
            <p className="text-muted-foreground mt-2">Manage customer accounts, monitor activity, and enforce policies</p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            title="Total Users" 
            value={stats.total.toLocaleString()} 
            change={12} 
            description="vs last week" 
            icon={<Users className="h-5 w-5" />} 
          />
          <StatCard 
            title="Active Users" 
            value={stats.active.toLocaleString()} 
            change={8} 
            color="success" 
            icon={<UserCheck className="h-5 w-5" />} 
          />
          <StatCard 
            title="MFA Enabled" 
            value={stats.mfaEnabled.toLocaleString()} 
            change={15} 
            color="success" 
            icon={<Lock className="h-5 w-5" />} 
          />
          <StatCard 
            title="Blocked" 
            value={stats.blocked.toLocaleString()} 
            change={2} 
            color="destructive" 
            icon={<AlertCircle className="h-5 w-4" />} 
          />
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Search by name, email, or ID..." 
              className="flex-1" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="ml-auto">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{selectedUsers.length} selected</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">Block</Button>
              <Button size="sm" variant="outline">Suspend</Button>
              <Button size="sm" variant="destructive">Delete</Button>
            </div>
          </div>
        )}

        {/* Tabs View */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Users ({filteredUsers.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({users.filter(u => u.status === 'active').length})</TabsTrigger>
            <TabsTrigger value="mfa">MFA Enabled ({stats.mfaEnabled})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="space-y-0 divide-y divide-border">
                  {filteredUsers.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No users found</div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div key={user.id} className="p-4 hover:bg-muted/50 transition-colors group">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <input 
                              type="checkbox" 
                              checked={selectedUsers.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers([...selectedUsers, user.id])
                                } else {
                                  setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                                }
                              }}
                              className="rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{user.name}</span>
                                <Badge variant={
                                  user.status === 'active' ? 'default' : 
                                  user.status === 'blocked' ? 'destructive' : 
                                  'secondary'
                                }>
                                  {user.status}
                                </Badge>
                                <Badge variant="outline">{user.tier}</Badge>
                                {user.mfaEnabled && (
                                  <Badge variant="outline" className="bg-green-50 dark:bg-green-950">
                                    <Lock className="h-3 w-3 mr-1" />
                                    MFA
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                                <span>Joined: {user.joined}</span>
                                <span>Last: {user.lastLogin || 'Never'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="ghost">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setSelectedUser(user)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">View</Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">Active users view</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mfa" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">MFA enabled users view</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block User?</AlertDialogTitle>
            <AlertDialogDescription>
              This will prevent {selectedUser?.name} from accessing the platform. This action can be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-4">
            <label className="text-sm font-medium">Reason (optional):</label>
            <Input placeholder="Enter reason for blocking..." />
          </div>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive">Block User</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
