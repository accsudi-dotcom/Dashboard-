'use client'

import { useQuery } from '@tanstack/react-query'
import { Store, Plus, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stats/StatCard'

export default function ProvidersPage() {
  const { data: providersResponse, isLoading } = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const res = await fetch('/api/dev/providers')
      if (!res.ok) throw new Error('Failed to fetch providers')
      return res.json()
    },
  })

  const mockProviders = providersResponse?.data || []
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Providers</h1>
          <p className="text-muted-foreground mt-2">Manage digital and physical providers</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Invite Provider
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Providers" value="847" change={15} description="vs last month" icon={<Store className="h-5 w-5" />} />
        <StatCard title="Verified" value="756" color="success" icon={<Store className="h-5 w-5" />} />
        <StatCard title="Pending Review" value="34" color="warning" icon={<Store className="h-5 w-5" />} />
      </div>

      <div className="flex gap-2">
        <Input placeholder="Search providers..." className="flex-1" />
        <Button variant="outline">Filter</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Provider Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockProviders.map((provider) => (
              <div key={provider.id} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{provider.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {provider.type === 'digital' ? '🎨 Digital Services' : '🏪 Physical Shop'}
                    </p>
                  </div>
                  <Badge variant={provider.status === 'verified' ? 'default' : 'secondary'}>
                    {provider.status}
                  </Badge>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {provider.rating > 0 && <span>⭐ {provider.rating}</span>}
                  <span>{provider.staff} staff</span>
                  {'branches' in provider && <span>{provider.branches} branches</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
