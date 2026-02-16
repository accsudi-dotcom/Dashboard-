'use client'

import React, { useState } from 'react'
import { Users, Edit2, Trash2, Plus, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const mockRoles = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access',
    permissions: 'users:*,orders:*,payments:*,settings:*',
    users: 2,
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Administrative access',
    permissions: 'users:read/write,orders:read/write,payments:read',
    users: 5,
  },
  {
    id: '3',
    name: 'Moderator',
    description: 'Content moderation',
    permissions: 'users:read,orders:read,comments:moderate',
    users: 8,
  },
  {
    id: '4',
    name: 'User',
    description: 'Standard user access',
    permissions: 'profile:read/write,orders:read',
    users: 2543,
  },
]

export function RolesManager() {
  const [roles, setRoles] = useState(mockRoles)

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Roles & Permissions</CardTitle>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Role
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {roles.map((role) => (
            <div
              key={role.id}
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900">{role.name}</h4>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {role.users}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{role.description}</p>
                  <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200">
                    <p className="text-xs font-mono text-slate-700">
                      {role.permissions}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="ghost">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
