# Migration Guide: From Mock to Real API

This guide explains how to migrate from mock data to real backend API calls.

## Step 1: Update Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=https://api.sharoobi.local
NEXT_PUBLIC_API_TIMEOUT=30000
API_SECRET_KEY=your-secret-key
```

## Step 2: Replace Mock Data Imports

Before:
```typescript
import { mockUsers } from '@/lib/mock-data'
const users = mockUsers
```

After:
```typescript
import { apiClient } from '@/lib/api-client'
import { UsersSchema } from '@/lib/schemas'

const { data: users } = await apiClient.get('/users', UsersSchema)
```

## Step 3: Update API Client

The API client in `lib/api-client.ts` already supports:
- Automatic token management
- Error handling
- Retry logic
- Request tracking

No changes needed, just ensure backend is running.

## Step 4: Update Stores

Auth store automatically handles token persistence:

```typescript
import { useAuthStore } from '@/stores/auth'

export default function Page() {
  const { user, isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <redirect to="/auth/login" />
  }
  
  return <Dashboard />
}
```

## Step 5: Replace Mock Queries

Before:
```typescript
const { data: users } = await getMockData('users')
```

After:
```typescript
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

function useUsers(page = 1) {
  return useQuery({
    queryKey: ['users', page],
    queryFn: async () => {
      const { data } = await apiClient.get(`/users?page=${page}`)
      return data
    },
  })
}

// In component:
const { data: users, isLoading } = useUsers(currentPage)
```

## Step 6: Update Mutations

Before:
```typescript
await delay(500)
setUsers([...users, newUser])
```

After:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (userData) => {
      const { user } = await apiClient.post('/users', userData)
      return user
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// In component:
const { mutate: createUser, isPending } = useCreateUser()

const handleCreate = async (userData) => {
  createUser(userData, {
    onSuccess: () => {
      toast.success('User created')
    },
  })
}
```

## Step 7: Add Error Handling

```typescript
function useUsers(page = 1) {
  return useQuery({
    queryKey: ['users', page],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get(`/users?page=${page}`)
        return data
      } catch (error) {
        if (error.status === 401) {
          // Handle unauthorized
          redirectToLogin()
        }
        throw error
      }
    },
  })
}
```

## Step 8: Implement Loading States

```typescript
export function UsersList() {
  const { data: users, isLoading, error } = useUsers()
  
  if (isLoading) return <Skeleton />
  if (error) return <ErrorState error={error} />
  
  return <UserTable data={users} />
}
```

## Step 9: Add Optimistic Updates

```typescript
function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (userData) => {
      return await apiClient.patch(`/users/${userData.id}`, userData)
    },
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] })
      
      // Snapshot previous data
      const previousUsers = queryClient.getQueryData(['users'])
      
      // Optimistically update
      queryClient.setQueryData(['users'], (old) => 
        old.map(u => u.id === newData.id ? { ...u, ...newData } : u)
      )
      
      return { previousUsers }
    },
    onError: (err, newData, context) => {
      // Revert on error
      queryClient.setQueryData(['users'], context.previousUsers)
    },
  })
}
```

## Step 10: Checklist

- [ ] Backend API running at `NEXT_PUBLIC_API_URL`
- [ ] Auth token properly stored in secure cookie
- [ ] API schemas in `lib/schemas.ts` match backend
- [ ] Error responses handled gracefully
- [ ] Loading states implemented
- [ ] Optimistic updates working
- [ ] Correlation IDs tracked
- [ ] Rate limiting handled
- [ ] Logout clears auth state
- [ ] Tests passing with real API

## Common Patterns

### Paginated Lists

```typescript
const [page, setPage] = useState(1)
const { data, hasNext } = useUsers(page)

<Pagination 
  current={page}
  onNext={() => setPage(p => p + 1)}
  hasNext={hasNext}
/>
```

### Search with Debouncing

```typescript
const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 500)
const { data: results } = useUsers(1, debouncedSearch)
```

### Bulk Operations

```typescript
const { mutate: bulkUpdate } = useMutation({
  mutationFn: async (ids) => {
    return await apiClient.post('/users/bulk', { ids, action: 'block' })
  },
})
```

## Troubleshooting

### CORS Errors

Backend must allow dashboard origin in CORS config:
```
Access-Control-Allow-Origin: https://dashboard.sharoobi.local
Access-Control-Allow-Credentials: true
```

### Token Expired

Auth interceptor automatically refreshes token:
```typescript
if (response.status === 401) {
  const newToken = await refreshToken()
  return apiClient(request, { token: newToken })
}
```

### Slow Requests

Add request caching:
```typescript
const { data } = useQuery({
  queryKey: ['users', page],
  queryFn: () => apiClient.get(`/users?page=${page}`),
  staleTime: 5 * 60 * 1000, // 5 minutes
})
```

## Support

For issues:
1. Check API logs: `journalctl -u sharoobi-api`
2. Verify environment variables are set
3. Test API endpoint directly: `curl -H "Authorization: Bearer $TOKEN" https://api.sharoobi.local/users`
4. Check browser DevTools Network tab
5. Review error message in console logs
