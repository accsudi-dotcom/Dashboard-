'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface SearchAndFilterProps {
  placeholder?: string
  onSearch: (query: string) => void
  onFilterChange?: (filters: string[]) => void
  filters?: FilterOption[]
  showAdvanced?: boolean
}

export function SearchAndFilter({
  placeholder = 'Search...',
  onSearch,
  onFilterChange,
  filters = [],
  showAdvanced = false,
}: SearchAndFilterProps) {
  const [query, setQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  const toggleFilter = (filterId: string) => {
    const updated = selectedFilters.includes(filterId)
      ? selectedFilters.filter((f) => f !== filterId)
      : [...selectedFilters, filterId]
    setSelectedFilters(updated)
    onFilterChange?.(updated)
  }

  const clearFilters = () => {
    setSelectedFilters([])
    onFilterChange?.([])
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
          {query && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => handleSearch('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {filters.length > 0 && (
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            Filter
          </Button>
        )}
      </div>

      {showFilters && filters.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/50">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              size="sm"
              variant={selectedFilters.includes(filter.id) ? 'default' : 'outline'}
              onClick={() => toggleFilter(filter.id)}
            >
              {filter.label}
              {filter.count && <span className="ml-2 text-xs">({filter.count})</span>}
            </Button>
          ))}
          {selectedFilters.length > 0 && (
            <Button size="sm" variant="ghost" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
