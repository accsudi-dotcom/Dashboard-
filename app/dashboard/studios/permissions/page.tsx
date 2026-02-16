'use client'

import { useState } from 'react'
import { Lock, Plus, Users, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  users: number
  status: 'active' | 'archived'
}

const mockRoles: Role[] = [
  {
    id: 'role-super-admin',
    name: 'Super Admin',
    description: 'Full platform control and access',
    permissions: ['*'],
    users: 2,
    status: 'active',
  },
  {
    id: 'role-support',
    name: 'Support Agent',
    description: 'Handle customer tickets and support',
    permissions: ['view:tickets', 'update:tickets', 'view:users', 'create:responses'],
    users: 15,
    status: 'active',
  },
  {
    id: 'role-finance',
    name: 'Finance Team',
    description: 'Manage payments, refunds, and billing',
    permissions: ['view:payments', 'approve:refunds', 'view:wallet', 'generate:reports'],
    users: 8,
    status: 'active',
  },
  {
    id: 'role-ops',
    name: 'Operations',
    description: 'Order management and fulfillment',
    permissions: ['view:orders', 'update:orders', 'view:providers', 'manage:sla'],
    users: 12,
    status: 'active',
  },
]

export default function PermissionsPage() {
  const [showDetails, setShowDetails] = useState<string | null>(null)

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Permissions Manager</h1>
            <p className="text-muted-foreground mt-2">Manage RBAC roles, permissions, and access policies</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Role
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Roles</p>
              <p className="text-2xl font-bold mt-1">4</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Users Assigned</p>
              <p className="text-2xl font-bold mt-1">37</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Unique Permissions</p>
              <p className="text-2xl font-bold mt-1">24</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Policies Active</p>
              <p className="text-2xl font-bold mt-1">8</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="roles" className="space-y-4">
          <TabsList>
            <TabsTrigger value="roles">Roles (RBAC)</TabsTrigger>
            <TabsTrigger value="attributes">Attributes (ABAC)</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Input placeholder="Search roles..." className="flex-1" />
              <Button variant="outline">Search</Button>
            </div>
            
            <div className="space-y-3">
              {mockRoles.map((role) => (
                <Card key={role.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Lock className="h-4 w-4 text-accent flex-shrink-0" />
                          <h3 className="font-semibold">{role.name}</h3>
                          <Badge className={role.status === 'active' ? 'bg-green-600' : 'bg-slate-600'}>
                            {role.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {role.permissions.slice(0, 4).map((perm) => (
                            <Badge key={perm} variant="secondary" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                          {role.permissions.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{role.permissions.length - 4} more
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{role.users} users assigned</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setShowDetails(showDetails === role.id ? null : role.id)}
                        >
                          {showDetails === role.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {showDetails === role.id && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-sm font-medium mb-2">All Permissions:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {role.permissions.map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs justify-start">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="attributes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attribute-Based Access Control (ABAC)</CardTitle>
                <CardDescription>Configure fine-grained access control using contextual attributes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="font-medium mb-2">Region-Based Access</p>
                      <p className="text-sm text-muted-foreground">Restrict access by geographical region</p>
                      <Button className="mt-4 w-full" variant="outline">Configure</Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="font-medium mb-2">Amount Thresholds</p>
                      <p className="text-sm text-muted-foreground">Set approval thresholds for transactions</p>
                      <Button className="mt-4 w-full" variant="outline">Configure</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Access Policies</CardTitle>
                <CardDescription>Define what actions require approval, audit logging, or verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border border-border/50 rounded-lg p-4 space-y-2">
                  <p className="font-medium">Require Approval: Large Refunds</p>
                  <p className="text-sm text-muted-foreground">Refunds over SR 10,000 require manager approval</p>
                </div>
                <div className="border border-border/50 rounded-lg p-4 space-y-2">
                  <p className="font-medium">Audit Log: User Modifications</p>
                  <p className="text-sm text-muted-foreground">All user account changes are logged</p>
                </div>
                <Button className="w-full">Add New Policy</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
