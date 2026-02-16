'use client'

import { Wallet, TrendingUp, Gift } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const mockWallets = [
  {
    userId: '1',
    userName: 'Ahmed Hassan',
    money: 2500.50,
    points: 1245,
    coupons: 3,
  },
  {
    userId: '2',
    userName: 'Fatima Ali',
    money: 750.00,
    points: 450,
    coupons: 1,
  },
]

const mockLedger = [
  {
    id: '1',
    type: 'debit',
    description: 'Service payment',
    amount: -450.00,
    balance: 2500.50,
    date: '2024-02-13',
  },
  {
    id: '2',
    type: 'credit',
    description: 'Cashback reward',
    amount: 50.00,
    balance: 2950.50,
    date: '2024-02-12',
  },
]

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet Ledger</h1>
        <p className="text-muted-foreground mt-2">View wallet balances and transactions</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ledger">Transaction Ledger</TabsTrigger>
          <TabsTrigger value="rewards">Rewards & Coupons</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {mockWallets.map((wallet) => (
              <Card key={wallet.userId}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{wallet.userName}</h3>
                    <Badge>Active</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Wallet className="h-4 w-4" />
                        <span>Money Balance</span>
                      </div>
                      <p className="font-semibold text-lg mt-1">${wallet.money.toFixed(2)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>Reward Points</span>
                      </div>
                      <p className="font-semibold text-lg mt-1">{wallet.points}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Gift className="h-4 w-4" />
                        <span>Coupons</span>
                      </div>
                      <p className="font-semibold text-lg mt-1">{wallet.coupons}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ledger" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockLedger.map((entry) => (
                  <div key={entry.id} className="p-3 border rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{entry.description}</p>
                      <p className="text-sm text-muted-foreground">{entry.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${entry.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {entry.type === 'credit' ? '+' : ''}{entry.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">Bal: ${entry.balance.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Rewards & Coupons</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Manage active promotions, cashback rules, and coupon campaigns.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
