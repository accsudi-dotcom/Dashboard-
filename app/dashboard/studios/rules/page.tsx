'use client'

import { useState } from 'react'
import { GitBranch, Plus, Edit, Trash2, Play, Pause, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface Rule {
  id: string
  name: string
  description: string
  trigger: string
  action: string
  status: 'active' | 'paused' | 'draft'
  priority: number
  executionCount: number
  lastExecuted: string
}

const mockRules: Rule[] = [
  {
    id: 'rule-1',
    name: 'High Risk Purchase Rule',
    description: 'Flag purchases > 10,000 SR for manual review',
    trigger: 'amount > 10000',
    action: 'manual_review',
    status: 'active',
    priority: 1,
    executionCount: 245,
    lastExecuted: '5 mins ago',
  },
  {
    id: 'rule-2',
    name: 'Provider Eligibility Check',
    description: 'Verify provider documents before activation',
    trigger: 'provider.status == "pending"',
    action: 'require_verification',
    status: 'active',
    priority: 1,
    executionCount: 89,
    lastExecuted: '30 mins ago',
  },
  {
    id: 'rule-3',
    name: 'Discount Eligibility',
    description: 'Apply 15% discount for premium members',
    trigger: 'user.tier == "premium"',
    action: 'apply_discount(15%)',
    status: 'active',
    priority: 2,
    executionCount: 1203,
    lastExecuted: '2 mins ago',
  },
]

const priorityColors = {
  1: 'bg-red-600',
  2: 'bg-orange-600',
  3: 'bg-blue-600',
}

export default function RulesPage() {
  const [showDetails, setShowDetails] = useState<string | null>(null)

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Business Rules Engine</h1>
            <p className="text-muted-foreground mt-2">Create automated business rules for policies, workflows, and automation</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Rule
          </Button>
        </div>

        <div className="flex gap-2">
          <Input placeholder="Search rules by name or trigger..." className="flex-1" />
          <Button variant="outline">Search</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Active Rules</p>
              <p className="text-2xl font-bold mt-1">3</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Executions</p>
              <p className="text-2xl font-bold mt-1">1.5K</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold mt-1">99.8%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Avg Response</p>
              <p className="text-2xl font-bold mt-1">142ms</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rules Registry</CardTitle>
            <CardDescription>All configured business rules and automation workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockRules.map((rule) => (
              <div key={rule.id} className="border border-border/50 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <GitBranch className="h-4 w-4 text-accent flex-shrink-0" />
                      <h3 className="font-semibold">{rule.name}</h3>
                      <Badge className={rule.status === 'active' ? 'bg-green-600' : rule.status === 'paused' ? 'bg-yellow-600' : 'bg-slate-600'}>
                        {rule.status}
                      </Badge>
                      <Badge className={priorityColors[rule.priority as keyof typeof priorityColors]}>
                        P{rule.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                    <div className="space-y-2 bg-muted/50 p-3 rounded font-mono text-xs">
                      <div><span className="text-accent">IF</span> {rule.trigger}</div>
                      <div><span className="text-accent">THEN</span> {rule.action}</div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span>Executions: {rule.executionCount}</span>
                      <span>Last: {rule.lastExecuted}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="ghost">
                      {rule.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setShowDetails(showDetails === rule.id ? null : rule.id)}
                    >
                      {showDetails === rule.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {showDetails === rule.id && (
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground">Priority:</span>
                        <p className="font-mono text-xs">Level {rule.priority}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Error Rate:</span>
                        <p className="font-mono text-xs">0.2%</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
