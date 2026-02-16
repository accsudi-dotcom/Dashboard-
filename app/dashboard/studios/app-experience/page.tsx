'use client'

import { Zap, Plus, Settings, Copy, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const mockFlags = [
  {
    id: 'flag-checkout-v2',
    name: 'Checkout v2',
    description: 'New checkout flow with simplified form',
    status: 'published',
    rollout: 25,
    environment: 'production',
  },
  {
    id: 'flag-dark-mode',
    name: 'Dark Mode',
    description: 'Enable dark theme support',
    status: 'draft',
    rollout: 100,
    environment: 'staging',
  },
  {
    id: 'flag-ai-recommendations',
    name: 'AI Recommendations',
    description: 'ML-based product recommendations',
    status: 'published',
    rollout: 50,
    environment: 'production',
  },
]

export default function AppExperiencePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">App Experience Studio</h1>
          <p className="text-muted-foreground mt-2">Configure feature flags, layouts, and content</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Flag
        </Button>
      </div>

      <Tabs defaultValue="flags" className="space-y-4">
        <TabsList>
          <TabsTrigger value="flags">Feature Flags</TabsTrigger>
          <TabsTrigger value="layouts">Layouts</TabsTrigger>
          <TabsTrigger value="blocks">Content Blocks</TabsTrigger>
        </TabsList>

        <TabsContent value="flags" className="space-y-4">
          <div className="grid gap-4">
            {mockFlags.map((flag) => (
              <Card key={flag.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-accent" />
                        <h3 className="font-semibold">{flag.name}</h3>
                        <Badge variant={flag.status === 'published' ? 'default' : 'secondary'}>
                          {flag.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{flag.description}</p>
                      <div className="flex gap-4 mt-3 text-sm">
                        <span className="text-muted-foreground">
                          Rollout: <span className="font-medium">{flag.rollout}%</span>
                        </span>
                        <span className="text-muted-foreground">
                          Environment: <span className="font-medium">{flag.environment}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="layouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Layout Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configure home screen sections, tab ordering, and component visibility.
              </p>
              <Button className="mt-4">Configure Layouts</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Blocks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create and manage announcements, banners, and informational content blocks.
              </p>
              <Button className="mt-4">Add Content Block</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
