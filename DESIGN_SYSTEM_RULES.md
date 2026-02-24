# Design System Rules & Best Practices

This document contains rules and learnings to ensure consistent, high-quality component usage and avoid repeating mistakes.

## 🎨 Design Token Usage

### ⚠️ CRITICAL: Token Naming Convention

**WE ARE NOT USING SHADCN NAMING CONVENTIONS.**

This project uses **Tailwind Catalyst design system** with custom design tokens from Figma (Wisy 2.0 DS). All color names, spacing, and other tokens come directly from the actual design system specification.

### ⚠️ CRITICAL: Typography — Inter Only

**ALL text in the UI MUST use Inter.** The font is loaded via Google Fonts in `/src/styles/fonts.css` and applied globally in the `body` rule of `theme.css`. Do NOT use `font-mono`, `font-serif`, `font-sans`, or any other font-family override — Inter is the sole typeface for the Wisy 2.0 design system. Inter supports `tabular-nums` for numeric alignment, so `font-mono` is never needed for numbers.

### ⚠️ CRITICAL: `--accent` token — inherited from shadcn, adopted into Wisy 2.0

The `--accent` token NAME originates from shadcn, where it means "subtle hover highlight" (typically a neutral gray). **Wisy 2.0 has intentionally redefined `--accent` as Indigo 600 (#4F46E5) — the brand/logo color.** This means 13+ components (dropdown-menu, context-menu, menubar, select, command, navigation-menu, calendar, toggle, skeleton, badge, dialog, etc.) use bright indigo for `hover:bg-accent` and `focus:bg-accent` states.

**If the Figma team decides `--accent` should be a subtle neutral (like shadcn's original intent):**
1. Rename current `--accent` → `--brand` (Indigo 600)
2. Redefine `--accent` as a subtle neutral for hover/focus
3. Update all components that need the brand color to use `--brand`

**Current decision:** `--accent` stays as Indigo 600 — the bright hover/focus states are intentional for the Wisy brand.

**Actual Design Tokens from Figma (Wisy 2.0 DS):**
- Primary/Secondary: `--primary`, `--secondary`, `--muted` 
- Accent: `--accent` (Indigo 600, #4F46E5) - logo color, used for highlights, active states, hover states in menus
- Border tokens: `--border`, `--border-info` (blue), `--border-error` (red, #EF4444), `--border-warning` (amber, #F59E0B), `--border-success` (green, #22C55E)
- Foreground tokens for borders: `--border-info-foreground`, `--border-error-foreground`, `--border-warning-foreground`, `--border-success-foreground` (all white)
- Error: `--border-error` (#EF4444) - the canonical Figma token for error states, validation errors, delete/error actions
- Background tokens: `--background`, `--card`, `--popover`
- Focus tokens: `--focus` (canonical Figma token — the shadcn `--ring` alias has been fully removed)
- Sidebar tokens: `--sidebar-*` for navigation and sidebar elements
- Typography: `--text-2xl`, `--text-xl`, `--text-lg`, `--text-base`, `--text-sm`, `--text-xs`

**Correct token usage:**
- ✅ `--accent` (Indigo 600) for highlights, active states, hover states in menus/dropdowns
- ✅ `--border-error` (#EF4444) for error states, error buttons, validation errors
- ✅ `--border-warning` (#F59E0B) for warning states, caution alerts
- ✅ `--border-success` (#22C55E) for success states, confirmation messages
- ✅ `--border-info` for info states, focus states
- ✅ `--focus` for focus rings (same color as `--border-info`)
- ✅ `--primary`, `--secondary`, `--muted` for backgrounds and text
- ✅ `text-border-error-foreground` instead of `text-white` on `bg-border-error` backgrounds
- ✅ `text-border-info-foreground` instead of `text-white` on `bg-border-info` backgrounds
- ✅ `text-border-warning-foreground` instead of `text-white` on `bg-border-warning` backgrounds
- ✅ `text-border-success-foreground` instead of `text-white` on `bg-border-success` backgrounds

### ✅ DO:
- **Always use CSS variables** from `theme.css` for colors
  ```tsx
  // Good - Using actual design tokens
  <Button variant="error">Delete</Button>
  <div className="bg-primary text-primary-foreground" />
  <div className="border-border focus:border-border-info" />
  ```

- **Use semantic color names** from our actual design system
  ```tsx
  // Good: Our design system tokens
  bg-accent, text-accent-foreground, bg-border-error, text-border-error-foreground, border-border-info, border-border-error
  ```

- **Reference typography variables** for custom font sizes
  ```tsx
  // Good
  <h1 style={{ fontSize: 'var(--text-2xl)' }}>Title</h1>
  ```

### ❌ DON'T:
- **Never hardcode Tailwind color classes** (bg-blue-500, text-red-600, etc.)
- **Never override the font family** - Inter is set globally
- **Never use inline RGB values** - always use design tokens

---

## 📦 Component Import Rules

### ✅ DO:
- **Import from the ui directory**
  ```tsx
  import { Button } from "../components/ui/button";
  import { Input } from "../components/ui/input";
  ```

- **Use the cn() utility** for className merging
  ```tsx
  import { cn } from "../components/ui/utils";
  
  <div className={cn("base-classes", conditional && "extra-classes", className)} />
  ```

- **Import multiple related components** together
  ```tsx
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "../components/ui/dialog";
  ```

### ❌ DON'T:
- **Don't import from node_modules directly** if a ui component exists
- **Don't create duplicate utilities** - reuse what exists

---

## 🔧 Component Usage Patterns

### Buttons

✅ **DO:**
```tsx
// Use semantic variants
<Button variant="error">Delete</Button>
<Button variant="outline">Cancel</Button>

// Include icons with proper spacing
<Button>
  <Save />
  Save Changes
</Button>

// Disable properly
<Button disabled={isLoading}>Submit</Button>
```

❌ **DON'T:**
```tsx
// Don't use wrong semantic variants
<Button variant="default">Delete</Button> // Should be error

// Don't forget loading states
<Button onClick={async () => await saveData()}>Save</Button> // No feedback
```

---

### Forms

✅ **DO:**
```tsx
// Always pair inputs with labels
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>

// Use proper form submission
<form onSubmit={handleSubmit}>
  {/* inputs */}
</form>

// Show validation states
<Input aria-invalid={hasError} />
```

❌ **DON'T:**
```tsx
// Don't skip accessibility
<Input /> // Missing label

// Don't forget form semantics
<div onClick={handleSubmit}> // Should be form/button
```

---

### Dialogs & Overlays

✅ **DO:**
```tsx
// Control dialog state properly
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* content */}
  </DialogContent>
</Dialog>

// Use AlertDialog for error/dangerous actions
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="error">Delete</Button>
  </AlertDialogTrigger>
  {/* confirmation content */}
</AlertDialog>
```

❌ **DON'T:**
```tsx
// Don't use Dialog for confirmations
<Dialog> // Should be AlertDialog
  <Button variant="error">Delete All</Button>
</Dialog>

// Don't forget to close dialogs
<Button onClick={() => saveData()}> // Missing setOpen(false)
```

---

### Cards

✅ **DO:**
```tsx
// Use proper card structure
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* main content */}
  </CardContent>
  <CardFooter>
    {/* actions */}
  </CardFooter>
</Card>

// Use cards for grouping related content
<div className="grid gap-6 md:grid-cols-2">
  <Card>{/* item 1 */}</Card>
  <Card>{/* item 2 */}</Card>
</div>
```

❌ **DON'T:**
```tsx
// Don't nest cards unnecessarily
<Card>
  <Card> // Rarely needed
    {/* content */}
  </Card>
</Card>
```

---

## 🎭 State Management

### ✅ DO:
- **Show loading states** for async actions
  ```tsx
  const [loading, setLoading] = useState(false);
  
  <Button disabled={loading}>
    {loading ? "Loading..." : "Submit"}
  </Button>
  ```

- **Provide feedback** with toast notifications
  ```tsx
  import { toast } from "sonner";
  
  const handleSubmit = () => {
    toast.success("Changes saved!");
  };
  ```

- **Handle empty states**
  ```tsx
  {items.length === 0 ? (
    <p className="text-muted-foreground">No items found</p>
  ) : (
    <ItemList items={items} />
  )}
  ```

### ❌ DON'T:
- **Don't leave actions without feedback**
- **Don't forget error states**
- **Don't ignore loading states**

---

## 🌓 Dark Mode

### ✅ DO:
- **Use design tokens** - they automatically adapt
  ```tsx
  <div className="bg-background text-foreground" />
  ```

- **Test both modes** during development
  ```tsx
  // Toggle dark mode
  document.documentElement.classList.toggle("dark");
  ```

- **Use conditional variants** when needed
  ```tsx
  <div className="dark:bg-accent/50" />
  ```

### ❌ DON'T:
- **Don't hardcode colors** that don't adapt
- **Don't forget to test dark mode**

---

## ♿ Accessibility

### ✅ DO:
- **Use semantic HTML**
  ```tsx
  <button>, <form>, <label>, <nav>, etc.
  ```

- **Provide ARIA labels** for icon-only buttons
  ```tsx
  <Button aria-label="Close dialog">
    <X />
  </Button>
  ```

- **Use proper heading hierarchy**
  ```tsx
  <h1>Page Title</h1>
  <h2>Section</h2>
  <h3>Subsection</h3>
  ```

- **Connect labels to inputs**
  ```tsx
  <Label htmlFor="email">Email</Label>
  <Input id="email" />
  ```

### ❌ DON'T:
- **Don't use divs for interactive elements**
- **Don't skip heading levels** (h1 → h3)
- **Don't forget keyboard navigation**

---

## 📱 Responsive Design

### ✅ DO:
- **Use responsive grid layouts**
  ```tsx
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  ```

- **Provide mobile navigation** alternatives
  ```tsx
  <nav className="hidden lg:flex" />
  <button className="lg:hidden">Menu</button>
  ```

- **Use responsive text sizes**
  ```tsx
  <h1 className="text-2xl md:text-4xl" />
  ```

### ❌ DON'T:
- **Don't assume desktop-only usage**
- **Don't forget touch targets** (min 44x44px)
- **Don't hide critical features** on mobile

---

## 🎯 Performance

### ✅ DO:
- **Use React.memo** for expensive components
- **Debounce search inputs**
- **Lazy load heavy components**
  ```tsx
  const HeavyComponent = lazy(() => import('./HeavyComponent'));
  ```

### ❌ DON'T:
- **Don't render large lists** without virtualization
- **Don't put expensive calculations** in render
- **Don't forget to cleanup effects**

---

## 📝 Code Organization

### ✅ DO:
- **Group related state** together
  ```tsx
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  ```

- **Extract complex logic** to custom hooks
- **Use consistent naming** conventions
  - Handlers: `handleClick`, `handleSubmit`
  - State: `isLoading`, `hasError`
  - Boolean props: `isActive`, `disabled`

### ❌ DON'T:
- **Don't create mega components** (split into smaller ones)
- **Don't duplicate code** (create reusable components)

---

## 🧪 Testing Checklist

Before considering a component "done":

- [ ] Works in light and dark mode
- [ ] Responsive on mobile, tablet, desktop
- [ ] Keyboard accessible
- [ ] Screen reader friendly
- [ ] Loading states shown
- [ ] Error states handled
- [ ] Empty states considered
- [ ] Uses design tokens (no hardcoded colors)
- [ ] Proper TypeScript types
- [ ] No console errors/warnings

---

## 🚫 Common Mistakes to Avoid

1. **Using appearance-based names instead of semantic**
   - ❌ `className="bg-red-600"`
   - ✅ `className="bg-error"`

2. **Forgetting to import Toaster**
   - ❌ Using `toast()` without `<Toaster />` in tree
   - ✅ Add `<Toaster />` to layout/page

3. **Not controlling Dialog state**
   - ❌ `<Dialog><DialogTrigger>Open</DialogTrigger></Dialog>`
   - ✅ `<Dialog open={open} onOpenChange={setOpen}>`

4. **Mixing Button with onClick div**
   - ❌ `<div onClick={...}>Click me</div>`
   - ✅ `<Button onClick={...}>Click me</Button>`

5. **Forgetting asChild prop**
   - ❌ `<DialogTrigger><Button>Open</Button></DialogTrigger>` (nested buttons)
   - ✅ `<DialogTrigger asChild><Button>Open</Button></DialogTrigger>`

6. **Not using proper form submission**
   - ❌ `<Button onClick={submit}>Submit</Button>`
   - ✅ `<form onSubmit={handleSubmit}><Button type="submit">Submit</Button></form>`

7. **Importing Toaster in multiple places**
   - ❌ Adding `<Toaster />` to every page that uses toast
   - ✅ Import `<Toaster />` once in RootLayout or App root only
   - Why: Multiple Toaster instances cause duplicate notifications

---

## 🎓 Learning from Mistakes

### Rule: Always test dark mode before declaring complete
**Why:** Components may look perfect in light mode but break in dark mode.

### Rule: Use semantic variants, not custom colors
**Why:** Maintains consistency and respects user's theme preferences.

### Rule: Provide user feedback for every action
**Why:** Users need to know their action was registered and processed.

### Rule: Control overlay components (Dialog, Sheet, etc.) explicitly
**Why:** Uncontrolled components can lead to state management issues.

### Rule: Import Toaster once at the app root or layout level
**Why:** Toast notifications won't work without the Toaster component in the tree.

---

## 🔥 Audit Findings & Hard Rules (from design system audits)

### Rule: NEVER use hardcoded Tailwind color classes in showcase or app pages
**Mistake made:** FeedbackPage used `border-orange-500 text-orange-600 dark:text-orange-400` for a warning alert.
**Fix:** Replaced with `border-border-warning text-border-warning` using the proper design token.
**Rule:** Every color in the UI must trace back to a CSS variable in `theme.css`. If a color doesn't exist as a token, ADD the token first, then use it.

### Rule: NEVER use `text-white` — always use foreground tokens
**Mistake made:** HomePage used `text-white` on `bg-border-error` and `bg-border-info` color swatches.
**Fix:** Added `--border-error-foreground`, `--border-info-foreground`, `--border-warning-foreground`, `--border-success-foreground` tokens and use those instead.
**Rule:** Every background color token must have a corresponding `-foreground` token for accessible text contrast.

### Rule: Use semantic status tokens for Sonner toasts, NOT chart tokens
**Mistake made:** Sonner success toast used `--chart-2` (green) instead of a semantic token.
**Fix:** Added `--border-success` token and updated Sonner CSS to use `--border-success`, `--border-error`, `--border-info` with their foreground tokens.
**Rule:** Chart tokens (`--chart-1` through `--chart-5`) are for data visualizations ONLY. Status states (success, error, warning, info) must use semantic `--border-*` tokens.

### Rule: Every status color needs a complete set: border + foreground
**Learned:** The Figma DS has 4 semantic status colors. Each MUST have both tokens:
- `--border-info` + `--border-info-foreground`
- `--border-error` + `--border-error-foreground`
- `--border-warning` + `--border-warning-foreground`
- `--border-success` + `--border-success-foreground`

### Rule: Every token in theme.css MUST be registered in @theme inline
**Why:** Without `--color-<name>: var(--<name>)` in `@theme inline`, Tailwind classes like `bg-<name>` won't work.
**Checklist:** When adding a new token: (1) Add to `:root`, (2) Add to `.dark`, (3) Register in `@theme inline`.

### Rule: The `--accent` token is used by 13+ components for hover/focus states
**Context:** `--accent` (Indigo 600) is NOT just a brand color — it powers `focus:bg-accent` and `hover:bg-accent` in dropdown-menu, context-menu, menubar, select, command, navigation-menu, calendar, toggle, skeleton, badge, and dialog. Changing this value affects ALL interactive highlight states across the entire system.

### Rule: Every new showcase page MUST be added to routes.tsx AND RootLayout navigation
**Checklist:** (1) Create the page component in `/src/app/pages/`, (2) Import in `routes.tsx`, (3) Add route entry, (4) Add nav item in `RootLayout.tsx` navigation array.

### Rule: `--destructive` has been REMOVED — use `--border-error` directly
**Context:** The shadcn `--destructive` alias previously pointed to `var(--border-error)`. It has been fully removed. All components now use `--border-error` directly via Tailwind classes like `bg-border-error`, `text-border-error`, `ring-border-error/20`. The component variant API uses `variant="error"` (not `variant="destructive"`).

### Rule: `ring-ring` / `border-ring` have been REMOVED — use `ring-focus` / `border-focus` directly
**Context:** The shadcn `--ring` alias previously pointed to `var(--focus)`. All 16 components have been migrated from `ring-ring` → `ring-focus`, `border-ring` → `border-focus`, `outline-ring` → `outline-focus`. The base layer `outline-ring/50` is now `outline-focus/50`. The `--ring` CSS variable has been fully deleted from `theme.css` and `--color-ring` removed from `@theme inline`. The canonical Figma token is `--focus`. Zero references to `ring-ring`, `border-ring`, or `outline-ring` remain in source code.
**Tailwind class mapping:**
- ❌ `ring-ring`, `border-ring`, `outline-ring` — shadcn legacy, do NOT use
- ✅ `ring-focus`, `border-focus`, `outline-focus` — canonical Wisy 2.0 DS

### Rule: Components used inside FormControl MUST support ref forwarding
**Mistake made:** `Input` and `Textarea` were plain function components that didn't accept refs. `FormControl` uses Radix `Slot` which passes a ref to its child — causing "Function components cannot be given refs" warnings.
**Fix:** Wrap components with `React.forwardRef` and add `displayName`.
**Rule:** Any component that can be a direct child of `<FormControl>` (which uses Radix `<Slot>`) must use `React.forwardRef`. This includes `Input`, `Textarea`, `Select` triggers, and any custom form inputs.

### Rule: Do NOT import from `next-themes` in a Vite+React app
**Mistake made:** `sonner.tsx` imported `useTheme` from `next-themes`, which requires a `ThemeProvider` wrapper. In a plain Vite+React app without that provider, this causes a cryptic "r is not a function" runtime crash caught by React Router's error boundary.
**Fix:** Removed the `next-themes` import from `sonner.tsx`. The Toaster now uses CSS variables directly from `theme.css` without needing a theme context provider.
**Rule:** Never import from `next-themes` unless the app is wrapped in `<ThemeProvider>`. For dark mode, use `document.documentElement.classList.toggle("dark")` and let CSS variables handle theming.

---

## 📚 Quick Reference

### Most Common Components
```tsx
// Buttons & Actions
<Button variant="default|secondary|error|outline|ghost|link" />

// Forms
<Input />, <Textarea />, <Select />, <Checkbox />, <Switch />, <RadioGroup />
<InputOTP />, <Slider />, <Calendar />

// Overlays
<Dialog />, <AlertDialog />, <Sheet />, <Popover />, <Tooltip />
<HoverCard />, <Drawer />

// Menus & Commands
<DropdownMenu />, <ContextMenu />, <Menubar />, <Command />

// Navigation
<Tabs />, <Accordion />, <Breadcrumb />, <Pagination />, <NavigationMenu />

// Display
<Card />, <Badge />, <Avatar />, <Table />, <Separator />
<ScrollArea />, <AspectRatio />, <Carousel />

// Feedback
<Alert />, <Progress />, <Skeleton />, <Toaster />

// Layout & Interaction
<Collapsible />, <ResizablePanelGroup />, <Toggle />, <ToggleGroup />

// Sidebar
<Sidebar />, <SidebarProvider />
```

### Design Token Reference
```css
/* Colors - FROM OUR FIGMA DESIGN SYSTEM */
--primary, --secondary, --muted
--accent (Indigo 600, #4F46E5), --accent-foreground
--border-error (#EF4444) - canonical error token
--border-warning (#F59E0B) - canonical warning token
--border-success (#22C55E) - canonical success token
--background, --foreground, --card, --popover
--border, --border-info, --border-error, --border-warning, --border-success
--input, --input-background
--focus (canonical Figma token — the shadcn --ring alias has been fully removed)

/* Foreground colors for borders */
--border-info-foreground, --border-error-foreground, --border-warning-foreground, --border-success-foreground

/* Sidebar */
--sidebar, --sidebar-foreground, --sidebar-primary, --sidebar-accent, --sidebar-border, --sidebar-ring

/* Typography */
--text-2xl (36px), --text-xl (30px), --text-lg (24px)
--text-base (16px), --text-sm (14px), --text-xs (12px)

/* Spacing & Borders */
--radius (8px), --radius-card (12px), --radius-badge (6px)

/* Charts */
--chart-1 (blue), --chart-2 (green), --chart-3 (amber), --chart-4 (purple), --chart-5 (pink)
```

---

**Remember:** When in doubt, check existing components for patterns. Consistency is key! 🔑

---

## 📂 Portable Design System Files

To replicate this design system in a new project, you need the files listed below. Each Figma Make project is an **isolated sandbox** — there is no shared filesystem between projects. You must copy the file contents manually or paste them into your prompt context.

### Tier 1 — Core CSS (required)

These 4 files define the entire visual language. Copy them into the same paths in any new project.

| Priority | File Path | Purpose |
|----------|-----------|---------|
| 1 | `/src/styles/theme.css` | **All design tokens** — `:root` light values, `.dark` overrides, `@theme inline` Tailwind registration, `@layer base` typography, Sonner toast styling, Radix z-index fixes |
| 2 | `/src/styles/fonts.css` | Google Fonts import for Inter (the only permitted typeface) |
| 3 | `/src/styles/tailwind.css` | Tailwind v4 config with `source(none)`, source glob, and `tw-animate-css` import |
| 4 | `/src/styles/index.css` | Import orchestrator that wires `fonts.css`, `tailwind.css`, and `theme.css` together |

### Tier 2 — Rules & Documentation (strongly recommended)

| Priority | File Path | Purpose |
|----------|-----------|---------|
| 5 | `/DESIGN_SYSTEM_RULES.md` | This file — all token naming rules, audit learnings, do/don't patterns, variant naming (`error` not `destructive`), focus token (`--focus` not `--ring`), Inter-only typography, and component usage guidance |

### Tier 3 — UI Component Library (optional, copy as needed)

| Priority | File Path | Purpose |
|----------|-----------|---------|
| 6 | `/src/app/components/ui/utils.ts` | `cn()` utility — required by every UI component |
| 7 | `/src/app/components/ui/button.tsx` | Button with `variant="error"` (not `destructive`) |
| 8 | `/src/app/components/ui/input.tsx` | Input with `forwardRef` for FormControl compatibility |
| 9 | `/src/app/components/ui/textarea.tsx` | Textarea with `forwardRef` |
| 10 | `/src/app/components/ui/label.tsx` | Label component |
| 11 | `/src/app/components/ui/card.tsx` | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| 12 | `/src/app/components/ui/dialog.tsx` | Dialog built on Radix |
| 13 | `/src/app/components/ui/alert-dialog.tsx` | AlertDialog for confirmations |
| 14 | `/src/app/components/ui/alert.tsx` | Alert with info/error/warning/success variants |
| 15 | `/src/app/components/ui/badge.tsx` | Badge component |
| 16 | `/src/app/components/ui/select.tsx` | Select dropdown |
| 17 | `/src/app/components/ui/checkbox.tsx` | Checkbox |
| 18 | `/src/app/components/ui/switch.tsx` | Switch toggle |
| 19 | `/src/app/components/ui/radio-group.tsx` | Radio group |
| 20 | `/src/app/components/ui/tabs.tsx` | Tabs navigation |
| 21 | `/src/app/components/ui/accordion.tsx` | Accordion |
| 22 | `/src/app/components/ui/dropdown-menu.tsx` | Dropdown menu |
| 23 | `/src/app/components/ui/context-menu.tsx` | Context (right-click) menu |
| 24 | `/src/app/components/ui/menubar.tsx` | Menubar |
| 25 | `/src/app/components/ui/command.tsx` | Command palette (cmdk) |
| 26 | `/src/app/components/ui/popover.tsx` | Popover |
| 27 | `/src/app/components/ui/tooltip.tsx` | Tooltip |
| 28 | `/src/app/components/ui/hover-card.tsx` | Hover card |
| 29 | `/src/app/components/ui/sheet.tsx` | Sheet (slide-out panel) |
| 30 | `/src/app/components/ui/drawer.tsx` | Drawer (vaul) |
| 31 | `/src/app/components/ui/table.tsx` | Table components |
| 32 | `/src/app/components/ui/avatar.tsx` | Avatar |
| 33 | `/src/app/components/ui/separator.tsx` | Separator |
| 34 | `/src/app/components/ui/scroll-area.tsx` | Scroll area |
| 35 | `/src/app/components/ui/progress.tsx` | Progress bar |
| 36 | `/src/app/components/ui/skeleton.tsx` | Loading skeleton |
| 37 | `/src/app/components/ui/slider.tsx` | Slider |
| 38 | `/src/app/components/ui/calendar.tsx` | Calendar (react-day-picker) |
| 39 | `/src/app/components/ui/carousel.tsx` | Carousel (embla) |
| 40 | `/src/app/components/ui/form.tsx` | Form with react-hook-form integration |
| 41 | `/src/app/components/ui/input-otp.tsx` | OTP input |
| 42 | `/src/app/components/ui/breadcrumb.tsx` | Breadcrumb navigation |
| 43 | `/src/app/components/ui/pagination.tsx` | Pagination |
| 44 | `/src/app/components/ui/toggle.tsx` | Toggle button |
| 45 | `/src/app/components/ui/toggle-group.tsx` | Toggle group |
| 46 | `/src/app/components/ui/collapsible.tsx` | Collapsible section |
| 47 | `/src/app/components/ui/aspect-ratio.tsx` | Aspect ratio container |
| 48 | `/src/app/components/ui/resizable.tsx` | Resizable panels |
| 49 | `/src/app/components/ui/sonner.tsx` | Sonner toast wrapper (no `next-themes` import) |
| 50 | `/src/app/components/ui/chart.tsx` | Recharts wrapper |
| 51 | `/src/app/components/ui/navigation-menu.tsx` | Navigation menu |
| 52 | `/src/app/components/ui/sidebar.tsx` | Sidebar layout |
| 53 | `/src/app/components/ui/use-mobile.ts` | Mobile detection hook |

### Required npm Dependencies for UI Components

When copying Tier 3 components, these packages must be installed in the new project:

```
# Core utilities (required by all components)
clsx, tailwind-merge, class-variance-authority, tw-animate-css

# Radix UI primitives (install only what you copy)
@radix-ui/react-slot, @radix-ui/react-accordion, @radix-ui/react-alert-dialog,
@radix-ui/react-aspect-ratio, @radix-ui/react-avatar, @radix-ui/react-checkbox,
@radix-ui/react-collapsible, @radix-ui/react-context-menu, @radix-ui/react-dialog,
@radix-ui/react-dropdown-menu, @radix-ui/react-hover-card, @radix-ui/react-label,
@radix-ui/react-menubar, @radix-ui/react-navigation-menu, @radix-ui/react-popover,
@radix-ui/react-progress, @radix-ui/react-radio-group, @radix-ui/react-scroll-area,
@radix-ui/react-select, @radix-ui/react-separator, @radix-ui/react-slider,
@radix-ui/react-switch, @radix-ui/react-tabs, @radix-ui/react-toggle,
@radix-ui/react-toggle-group, @radix-ui/react-tooltip

# Non-Radix component dependencies
cmdk, vaul, sonner, embla-carousel-react, react-day-picker, date-fns,
input-otp, react-resizable-panels, recharts, react-hook-form, lucide-react
```

### How to Use in a New Figma Make Project

1. Start a new Figma Make project
2. Copy the contents of the 4 Tier 1 CSS files into the same paths
3. Paste this `DESIGN_SYSTEM_RULES.md` (or its key sections) into your prompt context so AI generation follows your token rules
4. Copy any Tier 3 UI components you need, along with `utils.ts`
5. Install the corresponding npm dependencies for the components you copied