/**
 * Webhook Dispatcher
 * Manages webhook subscriptions and event delivery with retry logic
 */
export interface WebhookSubscription {
  id: string
  url: string
  events: string[]
  active: boolean
  secret?: string
  retryPolicy: {
    maxAttempts: number
    backoffMs: number
    maxBackoffMs: number
  }
  headers?: Record<string, string>
  tenantId: string
}

export interface WebhookEvent {
  id: string
  event: string
  data: Record<string, any>
  timestamp: Date
  tenantId: string
}

export interface DeliveryAttempt {
  id: string
  webhookSubscriptionId: string
  webhookEventId: string
  attemptNumber: number
  status: 'pending' | 'success' | 'failed' | 'retrying'
  statusCode?: number
  error?: string
  timestamp: Date
}

export class WebhookDispatcher {
  private subscriptions: Map<string, WebhookSubscription> = new Map()
  private events: WebhookEvent[] = []
  private deliveries: DeliveryAttempt[] = []

  subscribe(subscription: WebhookSubscription): void {
    this.subscriptions.set(subscription.id, subscription)
  }

  unsubscribe(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId)
  }

  async dispatch(event: WebhookEvent): Promise<void> {
    this.events.push(event)

    // Find matching subscriptions
    const matchingSubscriptions = Array.from(this.subscriptions.values()).filter(
      (sub) =>
        sub.active &&
        sub.tenantId === event.tenantId &&
        sub.events.some((e) => e === '*' || e === event.event)
    )

    // Dispatch to each subscription
    for (const subscription of matchingSubscriptions) {
      await this.deliverWebhook(subscription, event)
    }
  }

  private async deliverWebhook(subscription: WebhookSubscription, event: WebhookEvent): Promise<void> {
    let attemptNumber = 0
    let lastError: Error | null = null

    while (attemptNumber < subscription.retryPolicy.maxAttempts) {
      attemptNumber++

      const attempt: DeliveryAttempt = {
        id: this.generateId(),
        webhookSubscriptionId: subscription.id,
        webhookEventId: event.id,
        attemptNumber,
        status: attemptNumber === 1 ? 'pending' : 'retrying',
        timestamp: new Date(),
      }

      try {
        // In production: use actual HTTP client with timeout
        const payload = JSON.stringify({
          id: event.id,
          event: event.event,
          data: event.data,
          timestamp: event.timestamp.toISOString(),
        })

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...subscription.headers,
        }

        // Simulate webhook delivery
        const success = Math.random() > 0.3 // 70% success rate for simulation
        if (!success) {
          throw new Error('Webhook delivery failed')
        }

        attempt.status = 'success'
        attempt.statusCode = 200
        this.deliveries.push(attempt)
        return
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        attempt.status = 'failed'
        attempt.error = lastError.message
        this.deliveries.push(attempt)

        // Calculate backoff
        if (attemptNumber < subscription.retryPolicy.maxAttempts) {
          const backoff = Math.min(
            subscription.retryPolicy.backoffMs * Math.pow(2, attemptNumber - 1),
            subscription.retryPolicy.maxBackoffMs
          )
          await new Promise((resolve) => setTimeout(resolve, backoff))
        }
      }
    }
  }

  getSubscriptions(tenantId: string): WebhookSubscription[] {
    return Array.from(this.subscriptions.values()).filter((s) => s.tenantId === tenantId)
  }

  getSubscription(subscriptionId: string): WebhookSubscription | undefined {
    return this.subscriptions.get(subscriptionId)
  }

  getDeliveries(subscriptionId?: string): DeliveryAttempt[] {
    if (subscriptionId) {
      return this.deliveries.filter((d) => d.webhookSubscriptionId === subscriptionId)
    }
    return [...this.deliveries]
  }

  getFailedDeliveries(): DeliveryAttempt[] {
    return this.deliveries.filter((d) => d.status === 'failed')
  }

  private generateId(): string {
    return `webhook-${Date.now()}-${Math.random().toString(36).substring(7)}`
  }
}

export const webhookDispatcher = new WebhookDispatcher()
