'use client'

import React, { useState } from 'react'
import { MoreVertical, Edit2, Trash2, Lock, Unlock, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UserEditModal } from './UserEditModal'

const mockUsers = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    status: 'active',
    role: 'admin',
    lastLogin: '2024-02-14',
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    status: 'active',
    role: 'user',
    lastLogin: '2024-02-13',
    joinDate: '2023-06-20',
  },
  {
    id: '3',
    email: 'bob@example.com',
    name: 'Bob Johnson',
    status: 'inactive',
    role: 'user',
    lastLogin: '2024-01-20',
    joinDate: '2023-03-10',
  },
]

export function UsersTable() {
  const [users, setUsers] = useState(mockUsers)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setShowEditModal(true)
  }

  const handleDelete = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId))
  }

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    )
  }

  return (
    <>
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Users</CardTitle>
          <Button>Add User</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-slate-200 hover:bg-slate-50">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-slate-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === 'active' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    {user.lastLogin}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleStatusChange(
                            user.id,
                            user.status === 'active' ? 'inactive' : 'active'
                          )
                        }
                      >
                        {user.status === 'active' ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingUser && (
        <UserEditModal
          user={editingUser}
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedUser) => {
            setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
            setShowEditModal(false)
          }}
        />
      )}
    </>
  )
}
