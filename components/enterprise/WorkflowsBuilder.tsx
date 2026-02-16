'use client'

import React, { useState } from 'react'
import { Play, Edit2, Trash2, Plus, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

const mockWorkflows = [
  {
    id: '1',
    name: 'Payment Confirmation',
    trigger: 'payment.completed',
    actions: 3,
    status: 'active',
    runs: 2543,
    lastRun: '2024-02-14 14:32',
  },
  {
    id: '2',
    name: 'Welcome Email',
    trigger: 'user.created',
    actions: 2,
    status: 'active',
    runs: 456,
    lastRun: '2024-02-14 13:15',
  },
  {
    id: '3',
    name: 'Refund Notification',
    trigger: 'payment.refunded',
    actions: 4,
    status: 'active',
    runs: 12,
    lastRun: '2024-02-14 14:30',
  },
  {
    id: '4',
    name: 'Inactive User Cleanup',
    trigger: 'schedule.daily',
    actions: 2,
    status: 'inactive',
    runs: 28,
    lastRun: '2024-02-13 00:00',
  },
]

export function WorkflowsBuilder() {
  const [workflows, setWorkflows] = useState(mockWorkflows)

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Workflows</CardTitle>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900">{workflow.name}</h4>
                    <Badge
                      variant="outline"
                      className={
                        workflow.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {workflow.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                    <div>
                      <p className="text-slate-600">Trigger</p>
                      <p className="font-mono text-xs text-slate-900 mt-1">
                        {workflow.trigger}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Actions</p>
                      <p className="font-semibold text-slate-900 mt-1">
                        {workflow.actions}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Executions</p>
                      <p className="font-semibold text-slate-900 mt-1">
                        {workflow.runs.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Last run: {workflow.lastRun}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="ghost">
                    <Play className="w-4 h-4 text-green-600" />
                  </Button>
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
