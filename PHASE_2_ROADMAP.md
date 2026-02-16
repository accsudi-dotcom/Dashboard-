# Phase 2: Command Center & Workspaces - Roadmap

## Objectives

Implement fully functional workspace pages with real-time data, server-side pagination, and the inspector panel showing actual entity details.

## Implementation Plan

### 1. Data Fetching Hooks (TanStack Query)

**File**: `hooks/use-api.ts`

```typescript
// Core hooks to create:
- useUsers(filters) → List users with pagination
- useOrders(filters) → List orders with SLA
- usePayments(filters) → List payments
- useTickets(filters) → List support tickets
- useProviders(filters) → List providers

// Detail hooks:
- useUserDetail(id) → Single user with full context
- useOrderDetail(id) → Single order with items
- usePaymentDetail(id) → Single payment with refund history

// Action hooks:
- useRefundPayment() → POST to refund
- useFreezeUser() → POST to freeze
- useApproveOrder() → POST to approve
```

**Key Patterns**:
- Server-side pagination with page/limit
- Stale-while-revalidate caching strategy
- Request deduplication (TanStack Query handles this)
- Correlation ID tracking
- Error handling with retry

### 2. TanStack Table Component

**File**: `components/patterns/DataTable.tsx`

Features to implement:
- Server-side sorting (click column header)
- Server-side filtering (pre-built filters + custom)
- Column visibility toggle
- Row selection (bulk actions)
- Pagination controls (prev/next, jump to page)
- Virtualized rendering for 1000+ rows
- Loading skeleton while fetching
- Empty state when no data
- Row click → opens inspector panel

**Usage Example**:
```typescript
<DataTable
  columns={userColumns}
  data={users}
  onRowClick={(user) => openInspector('user', user.id)}
  isLoading={isLoading}
  pagination={{ page, total, limit }}
  onPageChange={setPage}
/>
```

### 3. Support Workspace

**File**: `app/dashboard/support/page.tsx`

Implement:
- Ticket queue table (status, priority, SLA)
- Filters: status, priority, assignee, date range
- Bulk actions: Assign, Resolve, Close
- Pairing sessions list (QR code, status)
- Inspector: Shows ticket details, messages, timeline
- SLA indicator bars
- Badge counts for each status

**Mock Data**: 25+ sample tickets with varying statuses

### 4. Operations Workspace

**File**: `app/dashboard/ops/page.tsx`

Implement:
- Order queue table (status, total, customer, SLA)
- Filters: status, date range, provider, region
- Bulk actions: Approve, Reject, Assign, Escalate
- Provider onboarding queue
- Fulfillment tracking section
- Inspector: Shows order items, payments, timeline
- Real-time SLA countdown

**Mock Data**: 50+ sample orders

### 5. Finance Workspace

**File**: `app/dashboard/finance/page.tsx`

Implement:
- Payment intents table (amount, status, method)
- Refunds queue (pending, approved, disputed)
- Filters: status, date, amount range, method
- Bulk actions: Approve refund, Reject, Escalate
- Wallet ledger browser
- Settlement report section
- Inspector: Shows transaction details, proof, timeline

**Mock Data**: 30+ payments, 15+ refunds

### 6. Inspector Panel Enhancement

**File**: `components/layout/InspectorPanel.tsx` → Update

Implement real content for each entity type:

**Details Tab**:
- Dynamic fields based on entity type
- Read-only display of all attributes
- Related entity links

**Actions Tab**:
- Dynamic buttons based on role + permissions
- Reason input for sensitive actions
- Confirmation dialogs

**Timeline Tab**:
- Event history with icons and timestamps
- Filter by event type
- Event details on hover

**Relationships Tab**:
- Related orders for user
- Related payments for order
- Related devices for user
- Clickable links to inspect related entities

**Audit Tab**:
- All admin actions on this entity
- Actor, action, timestamp, reason, diff (before/after)
- Filter by actor or action

### 7. Bulk Actions Pattern

**File**: `components/patterns/BulkActionsDialog.tsx`

Create reusable component:
- Checkbox selection in table
- Floating action bar when rows selected
- Action dropdown menu
- Confirmation dialog (if reasonRequired)
- Reason text area for sensitive actions
- Loading state + success toast

**Example**:
```typescript
<BulkActionsDialog
  selectedIds={selectedIds}
  actions={[
    { label: 'Approve', action: 'approve', reasonRequired: true },
    { label: 'Reject', action: 'reject', reasonRequired: true },
    { label: 'Assign', action: 'assign', requiresInput: true },
  ]}
  onAction={(action, reason, input) => handleBulkAction(...)}
/>
```

### 8. Saved Views System

**File**: `stores/workspaces.ts`

Implement:
```typescript
interface SavedView {
  id: string
  name: string
  workspaceId: string
  filters: FilterState
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

// Store methods:
- saveView(view) → Save filters as named view
- loadView(id) → Load filters from view
- deleteView(id) → Delete saved view
- listViews() → All views for current workspace
```

**UI**:
- Dropdown in workspace showing saved views
- "Save Current View" button
- "Clear Filters" button
- Quick filter presets (e.g., "SLA Breached")

### 9. Mock Data Generator

**File**: `lib/mock-data.ts`

Generate realistic data:
- 50+ users with risk scores, devices, sessions
- 30+ orders with full item details
- 25+ tickets with messages and history
- 20+ providers with branches and staff
- 40+ payments with transactions

Use libraries:
- `faker` for realistic names, emails, addresses
- `dayjs` for realistic timestamps

### 10. Settings & Preferences (Phase 2 scope)

**File**: `app/dashboard/settings/page.tsx`

Implement:
- User profile settings (name, email, MFA)
- Notification preferences
- Dashboard preferences (default workspace, theme)
- API keys for providers (if applicable)

## Implementation Priority

### Week 1
1. Create `hooks/use-api.ts` with TanStack Query wrappers
2. Implement `DataTable.tsx` component
3. Create mock data generator in `lib/mock-data.ts`
4. Implement Support workspace with real table

### Week 2
5. Implement Ops workspace
6. Implement Finance workspace
7. Implement Moderation & Security workspaces
8. Enhance Inspector panel with real data

### Week 3
9. Implement Bulk Actions pattern
10. Implement Saved Views system
11. Add confirmation dialogs for sensitive actions
12. Polish UI and animations

## Code Templates to Use

### useQuery Hook Pattern
```typescript
export const useUsers = (filters: UserFilters) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => apiClient.get('/users', UserListResponseSchema),
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  })
}
```

### Bulk Action Pattern
```typescript
const useBulkApproveOrders = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, reason }) =>
      apiClient.post('/orders/bulk-approve', OrderListResponseSchema, { ids, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['audit-log'] })
    }
  })
}
```

### Table Column Definition
```typescript
const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => <Badge>{info.getValue()}</Badge>,
  },
  // ...
]
```

## Testing Checklist

- [ ] All tables load with mock data
- [ ] Pagination works (prev/next, jump to page)
- [ ] Sorting works (click column headers)
- [ ] Row click opens inspector panel
- [ ] Inspector shows correct entity data
- [ ] Bulk actions are disabled without rows selected
- [ ] Reason fields appear for sensitive actions
- [ ] Toast notifications appear on success
- [ ] Error states display correctly
- [ ] Saved views persist (check localStorage)
- [ ] Mobile responsive (sidebar collapses)
- [ ] Keyboard navigation works

## Acceptance Criteria

Phase 2 is complete when:
1. ✅ All 5 workspaces have functioning data tables
2. ✅ Inspector panel shows real entity details for all types
3. ✅ Bulk actions work with reason-required confirmation
4. ✅ Saved views can be created and loaded
5. ✅ SLA indicators show on orders and tickets
6. ✅ Mobile responsive (test on phone)
7. ✅ Performance: 1000+ rows render smoothly
8. ✅ No console errors
9. ✅ All keyboard shortcuts work
10. ✅ Integration with mock API client complete

## Breaking Changes from Phase 1

None! Phase 2 builds on top of Phase 1 without breaking existing functionality.

## Dependencies to Add

```json
{
  "@tanstack/react-query": "^5.x",
  "@tanstack/react-table": "^8.x",
  "faker": "^6.x"
}
```

These may already be in package.json from starter template.

---

**Estimated Duration**: 3 weeks  
**Complexity**: Medium  
**Priority**: High (core feature delivery)
