// Seed script: write a comprehensive seed.json for local development
// Usage: npm run seed

const fs = require('fs')
const path = require('path')

const outDir = path.join(__dirname, '..', 'data')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const data = {
  users: [
    { id: 'user-1', name: 'Ahmed Hassan', email: 'ahmed@sharoobi.local', status: 'active', tier: 'premium', createdAt: new Date().toISOString() },
    { id: 'user-2', name: 'Fatima Ali', email: 'fatima@sharoobi.local', status: 'active', tier: 'basic', createdAt: new Date().toISOString() },
    { id: 'user-3', name: 'Mohammed Saeed', email: 'mohammed@sharoobi.local', status: 'blocked', tier: 'basic', createdAt: new Date().toISOString() },
  ],
  providers: [
    { id: 'provider-1', name: 'Best Electronics', email: 'contact@bestelectronics.local', region: 'Saudi Arabia', status: 'active', verificationStatus: 'verified', createdAt: new Date().toISOString() }
  ],
  orders: [
    { id: 'order-1', userId: 'user-1', providerId: 'provider-1', status: 'delivered', totalAmount: 599.99, currency: 'SAR', createdAt: new Date().toISOString() }
  ],
  payments: [
    { id: 'payment-1', orderId: 'order-1', userId: 'user-1', amount: 599.99, currency: 'SAR', method: 'card', status: 'completed', createdAt: new Date().toISOString() }
  ],
  tickets: [],
  auditLogs: [],
}

const outPath = path.join(outDir, 'seed.json')
fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8')
console.log('Seed data written to', outPath)
