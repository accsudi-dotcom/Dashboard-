'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Bell, Lock, Database, Zap, RefreshCw, Save } from 'lucide-react'

export default function SettingsPage() {
  const [featureFlags, setFeatureFlags] = useState([
    { id: 'feature_new_dashboard', name: 'New Dashboard UI', enabled: true },
    { id: 'feature_advanced_analytics', name: 'Advanced Analytics', enabled: false },
    { id: 'feature_api_v2', name: 'API v2', enabled: true },
    { id: 'feature_webhooks', name: 'Webhooks System', enabled: true },
    { id: 'feature_workflow_automation', name: 'Workflow Automation', enabled: false },
    { id: 'feature_ai_recommendations', name: 'AI Recommendations', enabled: false },
  ])

  const [settings, setSettings] = useState({
    companyName: 'Sharoobi Inc.',
    adminEmail: 'admin@sharoobi.com',
    supportEmail: 'support@sharoobi.com',
    webhookUrl: 'https://webhooks.sharoobi.com',
  })

  const toggleFeature = (id: string) => {
    setFeatureFlags(featureFlags.map(f =>
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ))
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage platform configuration and features</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Admin Email</label>
                <Input
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                  className="mt-1"
                  type="email"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Support Email</label>
                <Input
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="mt-1"
                  type="email"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Webhook URL</label>
                <Input
                  value={settings.webhookUrl}
                  onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                  className="mt-1"
                  type="url"
                />
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Critical Alerts</p>
                  <p className="text-sm text-muted-foreground">Receive critical security & system alerts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Summary</p>
                  <p className="text-sm text-muted-foreground">Get daily activity summary</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">Receive detailed weekly reports</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>Enable/disable features for your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {featureFlags.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{feature.name}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{feature.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={feature.enabled ? 'default' : 'secondary'}>
                      {feature.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={() => toggleFeature(feature.id)}
                    />
                  </div>
                </div>
              ))}
              <Button>Save Feature Flags</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security policies and configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Require MFA for all users</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">IP Whitelist</p>
                  <p className="text-sm text-muted-foreground">Restrict access to approved IPs</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">API Rate Limiting</p>
                  <p className="text-sm text-muted-foreground">Limit API requests per user</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div>
                <label className="text-sm font-medium">Session Timeout (minutes)</label>
                <Input
                  type="number"
                  defaultValue="30"
                  className="mt-1 max-w-xs"
                />
              </div>
              <Button>Update Security Policies</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API authentication keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">Production Key</p>
                    <p className="font-mono text-xs text-muted-foreground mt-1">sk_live_51234567890abcdef</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Created: 2024-01-15</p>
              </div>
              <Button variant="outline">Rotate Keys</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>Perform system maintenance tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-medium">Database Backup</p>
                    <p className="text-sm text-muted-foreground">Last backup: 2 hours ago</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Run Backup Now
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-medium">Cache Flush</p>
                    <p className="text-sm text-muted-foreground">Clear all cached data</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Flush Cache
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-medium">Database Optimization</p>
                    <p className="text-sm text-muted-foreground">Optimize database tables</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Database className="h-4 w-4 mr-2" />
                  Optimize
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
