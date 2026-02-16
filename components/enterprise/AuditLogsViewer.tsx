'use client'

import React, { useState } from 'react'
import { Search, Download, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const mockAuditLogs = [
  {
    id: '1',
    timestamp: '2024-02-14 14:32:10',
    actor: 'admin@sharoobi.local',
    action: 'refund_payment',
    resource: 'Payment PAY-001',
    status: 'success',
    details: 'Refunded $2,450.00 - Customer request',
  },
  {
    id: '2',
    timestamp: '2024-02-14 13:15:45',
    actor: 'john@example.com',
    action: 'update_user',
    resource: 'User john@example.com',
    status: 'success',
    details: 'Updated user role to admin',
  },
  {
    id: '3',
    timestamp: '2024-02-14 12:45:22',
    actor: 'jane@example.com',
    action: 'create_order',
    resource: 'Order ORD-001',
    status: 'success',
    details: 'Created new order with 5 items',
  },
  {
    id: '4',
    timestamp: '2024-02-14 11:20:33',
    actor: 'admin@sharoobi.local',
    action: 'delete_webhook',
    resource: 'Webhook hook_123',
    status: 'success',
    details: 'Deleted inactive webhook',
  },
]

export function AuditLogsViewer() {
  const [logs, setLogs] = useState(mockAuditLogs)
  const [search, setSearch] = useState('')

  const filteredLogs = logs.filter(
    (log) =>
      log.actor.includes(search) ||
      log.action.includes(search) ||
      log.resource.includes(search)
  )

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Audit Logs</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-slate-200">
              <TableHead>Timestamp</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} className="border-slate-200 hover:bg-slate-50">
                <TableCell className="text-xs font-mono text-slate-600">
                  {log.timestamp}
                </TableCell>
                <TableCell className="text-sm">{log.actor}</TableCell>
                <TableCell className="text-sm font-medium">{log.action}</TableCell>
                <TableCell className="text-sm text-slate-600">{log.resource}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {log.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-600 max-w-xs truncate">
                  {log.details}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
