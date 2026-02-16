# Styling & Design System Guide

## Color System

### Light Mode (Default)

**Primary Colors:**
- Primary Blue: `hsl(217 91% 45%)` - Authority & action
- Success Green: `hsl(142 76% 36%)` - Confirmations
- Warning Amber: `hsl(38 92% 50%)` - Alerts
- Danger Red: `hsl(0 84% 60%)` - Destructive actions
- Info Sky: `hsl(199 89% 48%)` - Information

**Neutral Colors:**
- White: `hsl(0 0% 100%)`
- Light Gray: `hsl(220 13% 91%)`
- Medium Gray: `hsl(220 8% 45%)`
- Dark Gray: `hsl(220 13% 13%)`

### Dark Mode

All colors automatically adapt using CSS custom properties. Never hardcode colors.

## Typography

**Fonts:**
- Headings: Inter (400, 500, 600, 700)
- Body: Inter (400, 500)
- Monospace: JetBrains Mono (for code)

**Scale:**
```
h1: text-3xl font-bold
h2: text-2xl font-semibold
h3: text-xl font-semibold
h4: text-lg font-semibold
body: text-base font-normal
small: text-sm font-normal
micro: text-xs font-normal
```

**Line Height:**
- Headings: leading-tight
- Body: leading-relaxed
- Small: leading-snug

## Spacing Scale

Use Tailwind's 4px base scale:
```
px-1 = 4px
px-2 = 8px
px-3 = 12px
px-4 = 16px
px-6 = 24px
px-8 = 32px
```

Never use arbitrary values like `p-[16px]`. Always use the predefined scale.

## Components

### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Button
```tsx
// Primary action
<Button>Action</Button>

// Secondary
<Button variant="outline">Cancel</Button>

// Danger
<Button variant="destructive">Delete</Button>

// Subtle
<Button variant="ghost">Link</Button>
```

### Badge
```tsx
// Default
<Badge>Active</Badge>

// Secondary
<Badge variant="secondary">Pending</Badge>

// Destructive
<Badge variant="destructive">Error</Badge>
```

### Input
```tsx
<Input 
  placeholder="Search..."
  className="flex-1"
/>
```

### Textarea
```tsx
<Textarea 
  placeholder="Enter reason..."
  rows={4}
/>
```

### Select
```tsx
<Select value={selected} onValueChange={setSelected}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

## Common Patterns

### Page Header
```tsx
<div>
  <h1 className="text-3xl font-bold">Page Title</h1>
  <p className="text-muted-foreground mt-1">
    Subtitle or description
  </p>
</div>
```

### Stat Card
```tsx
<Card>
  <CardContent className="pt-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Label</p>
        <p className="text-2xl font-bold">Value</p>
      </div>
      <Icon className="h-5 w-5 text-accent" />
    </div>
  </CardContent>
</Card>
```

### List Item
```tsx
<div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
  <p className="font-medium">Title</p>
  <p className="text-sm text-muted-foreground">Subtitle</p>
</div>
```

### Form Group
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">Field Label</label>
  <Input placeholder="..." />
  <p className="text-xs text-muted-foreground">Helper text</p>
</div>
```

### Modal
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Responsive Design

### Breakpoints
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Mobile-First
Always design for mobile first, then enhance:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Each child spans 1 col on mobile, 2 on md, 4 on lg */}
</div>
```

### Responsive Text
```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Title
</h1>
```

## Accessibility

### Color Contrast
- Text on white bg: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- Use system color names (not hex) for better contrast

### Keyboard Navigation
```tsx
<button 
  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
  aria-label="Close"
>
  ×
</button>
```

### Screen Readers
```tsx
<span className="sr-only">Hidden from display, visible to screen readers</span>
```

### ARIA Labels
```tsx
<button aria-label="Delete item" aria-pressed="false">
  Delete
</button>

<div role="alert">Error message</div>
```

## Dark Mode

Never detect system preference at runtime. Use stored preference:

```tsx
// In layout.tsx
const [theme, setTheme] = useState('dark')

useEffect(() => {
  const stored = localStorage.getItem('theme') || 'dark'
  setTheme(stored)
  document.documentElement.classList.toggle('dark', stored === 'dark')
}, [])
```

All CSS variables automatically switch with `.dark` class.

## Animation

Keep animations subtle and purposeful:

```tsx
// Fade in
<div className="animate-in fade-in duration-300">Content</div>

// Slide in
<div className="animate-in slide-in-from-bottom-4 duration-300">Content</div>

// Pulse
<div className="animate-pulse">Loading</div>
```

## Loading States

### Skeleton
```tsx
<div className="space-y-2">
  <div className="h-4 bg-muted rounded animate-pulse" />
  <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
</div>
```

### Spinner Button
```tsx
<Button disabled={isLoading}>
  {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

## Icons

All icons from lucide-react:

```tsx
import { 
  Users,
  Settings,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

<Users className="h-4 w-4" />
<Settings className="h-5 w-5" />
```

Icon sizes:
- `h-3 w-3`: Badges, labels
- `h-4 w-4`: Small actions
- `h-5 w-5`: Regular icons
- `h-6 w-6`: Large buttons

## Best Practices

1. **Use Semantic HTML**: Use `<button>`, `<input>`, etc., not `<div>`
2. **Avoid Inline Styles**: Never use `style={}` attributes
3. **Consistent Spacing**: Use gap/p/m from the scale
4. **DRY Colors**: Always use CSS variables, never hardcode
5. **Meaningful Classes**: Use Tailwind semantically (`flex items-center` not `flex`)
6. **Dark Mode Ready**: Test all components in dark mode
7. **Responsive First**: Always include mobile and desktop
8. **Performance**: Minimize animations on low-end devices

## Common Mistakes

❌ Wrong:
```tsx
<div style={{ padding: '16px', color: '#000' }}>
  Content
</div>
```

✅ Right:
```tsx
<div className="p-4 text-foreground">
  Content
</div>
```

---

❌ Wrong:
```tsx
<div className="grid grid-cols-[200px_1fr_200px]">
  Columns
</div>
```

✅ Right:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  Columns
</div>
```

---

❌ Wrong:
```tsx
<button className="w-full h-full p-[24px]">
  Click
</button>
```

✅ Right:
```tsx
<Button className="w-full h-full p-6">
  Click
</Button>
```

## Resources

- **Tailwind Docs**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Lucide Icons**: https://lucide.dev
- **Color Contrast**: https://contrast-ratio.com
