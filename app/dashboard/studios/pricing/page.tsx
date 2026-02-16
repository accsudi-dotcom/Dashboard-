'use client'

import { DollarSign, Plus, Globe, Percent, Edit, Trash2, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

const mockPricingTiers = [
  {
    id: 'price-1',
    name: 'Standard Service Fee',
    basePrice: 2.5,
    type: 'percentage',
    regions: ['Egypt', 'Saudi Arabia', 'UAE'],
    status: 'active',
    revenue: 125400,
  },
  {
    id: 'price-2',
    name: 'Premium Support',
    basePrice: 9.99,
    type: 'fixed',
    regions: ['All'],
    status: 'active',
    revenue: 45320,
  },
]

const mockPromotions = [
  {
    id: 'promo-1',
    name: 'New User Discount',
    discount: 20,
    type: 'percentage',
    status: 'active',
    uses: 342,
    startDate: '2024-01-01',
  },
  {
    id: 'promo-2',
    name: 'Q1 Campaign',
    discount: 500,
    type: 'fixed',
    status: 'scheduled',
    uses: 0,
    startDate: '2024-02-15',
  },
]

export default function PricingPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pricing Management</h1>
            <p className="text-muted-foreground mt-2">Manage pricing tiers, rules, and promotional campaigns</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Pricing Rule
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">SR 170.7K</p>
              <p className="text-xs text-green-600 mt-1">+8% this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Pricing Rules</p>
              <p className="text-2xl font-bold mt-1">2</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Active Promotions</p>
              <p className="text-2xl font-bold mt-1">1</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Promo Uses</p>
              <p className="text-2xl font-bold mt-1">342</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pricing" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pricing">Pricing Rules</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="regional">Regional Overrides</TabsTrigger>
          </TabsList>

          <TabsContent value="pricing" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Input placeholder="Search pricing rules..." className="flex-1" />
              <Button variant="outline">Search</Button>
            </div>
            <div className="space-y-3">
              {mockPricingTiers.map((price) => (
                <Card key={price.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{price.name}</h3>
                          <Badge className="bg-green-600">{price.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono">{price.basePrice}{price.type === 'percentage' ? '%' : ' SR'}</span>
                          </div>
                          <Badge variant="secondary">{price.type}</Badge>
                          <span className="text-muted-foreground">Regions: {price.regions.join(', ')}</span>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Monthly Revenue: SR {price.revenue.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="promotions" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Input placeholder="Search promotions..." className="flex-1" />
              <Button variant="outline">Search</Button>
            </div>
            <div className="space-y-3">
              {mockPromotions.map((promo) => (
                <Card key={promo.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{promo.name}</h3>
                          <Badge variant={promo.status === 'active' ? 'default' : 'secondary'}>
                            {promo.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Percent className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono">{promo.discount}{promo.type === 'percentage' ? '%' : ' SR'}</span>
                          </div>
                          <span className="text-muted-foreground">Start: {promo.startDate}</span>
                          <span className="text-muted-foreground">Uses: {promo.uses}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="regional" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Regional Pricing Overrides
                </CardTitle>
                <CardDescription>Configure region-specific pricing adjustments and currency conversions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Saudi Arabia', 'Egypt', 'UAE'].map((region) => (
                    <Card key={region}>
                      <CardContent className="pt-6">
                        <p className="font-medium mb-2">{region}</p>
                        <Button className="w-full" variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
