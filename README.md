# Map of Events - Medical Dashboard

A production-ready Next.js 15 medical dashboard application demonstrating modern React development patterns, Feature Slice Design architecture, and comprehensive UI/UX implementation.

## 🌟 Key Features

- **Medical Dashboard Interface** with professional healthcare design
- **4 Different Next.js Rendering Methods** (SSR, SSG, CSR, ISR)
- **Intelligent Patient Search** with autocomplete and keyboard navigation
- **Advanced Pagination System** with filtering and responsive controls
- **Comprehensive Animation Library** with smooth micro-interactions
- **Multi-level Error Boundaries** for robust error handling
- **Custom Hooks Library** for reusable functionality
- **Complete TypeScript Type System** with medical entities
- **Loading Skeleton System** for enhanced UX
- **Dark/Light Theme Support** across all components

## 🚀 Quick Start

**IMPORTANT: This project uses `pnpm` as the package manager. Always use `pnpm` instead of `npm` or `yarn`.**

```bash
# Install dependencies
pnpm install

# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

Open [http://localhost:3000](http://localhost:3000) to view the medical dashboard.

## 📊 Demo Pages

- **Dashboard (/)** - Server Side Rendering (SSR) with real-time data
- **Appointments (/appointments)** - Static Site Generation (SSG)
- **Patients (/patients)** - Client Side Rendering (CSR)
- **Lab Results (/lab-results)** - Incremental Static Regeneration (ISR)

## 🏗️ Project Architecture

This is a Next.js 15 application using the App Router with TypeScript. The project follows Feature Slice Design (FSD) architecture and implements a medical dashboard theme with different Next.js rendering methods demonstration.

### Directory Structure (FSD)

- `src/app/` - Next.js App Router pages, layouts, and app-level providers
  - `src/app/page.tsx` - Dashboard page with Server Side Rendering (SSR)
  - `src/app/appointments/page.tsx` - Appointments page with Static Site Generation (SSG)
  - `src/app/patients/page.tsx` - Patients page with Client Side Rendering (CSR)
  - `src/app/lab-results/page.tsx` - Lab Results page with Incremental Static Regeneration (ISR)
  - `src/app/actions/` - Server actions for form processing with React 19 useActionState
  - `src/app/api/` - API routes for REST endpoints and data processing
- `src/pages/` - Page-level components and compositions (FSD pages layer)
- `src/widgets/` - Large UI blocks and sections (FSD widgets layer)
- `src/features/` - User interaction features and business logic (FSD features layer)
- `src/entities/` - Business entities (user, patient, appointment, lab-result) (FSD entities layer)
- `src/shared/` - Reusable utilities, UI components, and configuration (FSD shared layer)
  - `src/shared/ui/` - Shared UI components (shadcn/ui style)
    - `src/shared/ui/header/` - Professional medical header with intelligent patient search, notifications, and profile
    - `src/shared/ui/sidebar/` - Responsive navigation sidebar with medical sections and summary
    - `src/shared/ui/appointment-card/` - Appointment cards with status indicators (active, scheduled, progress)
    - `src/shared/ui/stats-card/` - Statistics cards with trend indicators for medical metrics
    - `src/shared/ui/lab-results-table/` - Comprehensive lab results table with search, filtering, and pagination
    - `src/shared/ui/tasks-sidebar/` - Tasks management sidebar with quick stats
    - `src/shared/ui/navigation/` - Legacy navigation component (replaced by header/sidebar)
    - `src/shared/ui/mode-toggle/` - Theme toggle component
    - `src/shared/ui/modal/` - Reusable modal component with form integration
    - `src/shared/ui/skeletons/` - Loading skeleton components for all dashboard sections
    - `src/shared/ui/animations/` - Animation library with fade-in, slide-in, scale, and micro-interactions
    - `src/shared/ui/error-boundary/` - Error boundary components for comprehensive error handling
  - `src/shared/hooks/` - Custom React hooks for common functionality
    - `src/shared/hooks/useApi.ts` - Hook for API calls with loading, error, and data states
    - `src/shared/hooks/usePagination.ts` - Hook for pagination logic and state management
    - `src/shared/hooks/useSearch.ts` - Hook for search functionality with filtering
    - `src/shared/hooks/useLocalStorage.ts` - Hook for localStorage integration
    - `src/shared/hooks/useDebounce.ts` - Hook for debouncing values
    - `src/shared/hooks/useUsers.ts` - Hook for user/patient data fetching
  - `src/shared/types/` - Comprehensive TypeScript type definitions
    - `src/shared/types/api.ts` - API response and request types
    - `src/shared/types/medical.ts` - Medical entities (Patient, Doctor, Appointment, LabResult)
    - `src/shared/types/forms.ts` - Form state, validation, and server action types
    - `src/shared/types/ui.ts` - UI component prop types and configurations
    - `src/shared/types/utils.ts` - Utility types and branded types for type safety
  - `src/shared/lib/` - Utility functions and shared logic
    - `src/shared/lib/validations/` - Zod validation schemas for forms
  - `src/shared/api/` - API clients and configurations
  - `src/shared/config/` - Application configuration
- `src/components/ui/` - Low-level UI primitives (shadcn/ui components)

## 🛠️ Key Technologies

- **Next.js 15.5.0** with App Router and Turbopack
- **React 19.1.0** with latest features
- **TypeScript 5** with strict mode enabled
- **Tailwind CSS v4** for styling with PostCSS integration
- **Radix UI** primitives for accessible components (dropdown-menu, slot, sheet, avatar)
- **next-themes 0.4.6** for dark/light mode switching
- **class-variance-authority** for component variants
- **tailwind-merge + clsx** via `cn()` utility for conditional classes
- **Lucide React** for icons (Search, Bell, MessageCircle, Menu, Calendar, Users, etc.)
- **tw-animate-css** for animations
- **Zod 4.1.11** for schema validation and type safety

## 🎨 Component Patterns

- UI components use the shadcn/ui pattern with `cva` for variants
- All components use TypeScript with proper prop interfaces
- The `cn()` utility function (in `src/lib/utils.ts`) combines `clsx` and `tailwind-merge`
- Theme provider is configured at the app level with system theme detection
- FSD architecture promotes clear separation of concerns and scalability
- Medical-themed UI with professional healthcare design language
- Comprehensive responsive design supporting mobile, tablet, and desktop
- Mobile-first approach with progressive enhancement
- Modal components use React 19 useActionState for progressive enhancement
- Server actions provide form handling with proper validation and error states
- Centralized API architecture with HttpClient for consistent error handling

## 🎯 UI/UX Design Patterns

- **Header**: Professional medical branding with MediCare logo, patient search, notifications, and doctor profile
- **Sidebar Navigation**: Responsive medical suite navigation with sections for Dashboard, Appointments, Patients, Prescriptions, Lab Results, and Settings
- **Dashboard Layout**: Three-column layout with main content, left sidebar navigation, and right tasks sidebar
- **Appointment Cards**: Status-based design with active (primary), scheduled (secondary), and in-progress states
- **Statistics Cards**: Medical metrics with trend indicators and comparative data
- **Lab Results Table**: Professional data table with search, filtering, and responsive overflow
- **Tasks Management**: Organized task list with completion states and quick statistics
- **Mobile Navigation**: Hamburger menu with sheet overlay for mobile devices
- **Theme Support**: Consistent dark/light mode across all medical components

## 🧩 Adding shadcn/ui Components

When adding new UI components, use shadcn CLI with pnpm:

```bash
pnpm dlx shadcn@latest add [component-name]
```

Examples:
- `pnpm dlx shadcn@latest add dialog` - Add dialog component
- `pnpm dlx shadcn@latest add input` - Add input component
- `pnpm dlx shadcn@latest add form` - Add form component
- `pnpm dlx shadcn@latest add label` - Add label component
- `pnpm dlx shadcn@latest add avatar` - Add avatar component (already installed)
- `pnpm dlx shadcn@latest add badge` - Add badge component (already installed)
- `pnpm dlx shadcn@latest add sheet` - Add sheet component for mobile overlays (already installed)
- `pnpm dlx shadcn@latest add table` - Add table component for data display (already installed)

This ensures components are properly installed and configured for the project's design system.

**Currently Installed shadcn/ui Components:**
- `button`, `dropdown-menu`, `slot` - Core interactive components
- `dialog`, `input`, `label` - Form and modal components
- `avatar`, `badge` - User interface and status components
- `sheet` - Mobile navigation overlay component
- `table` - Data display component for lab results and medical data
- `select` - Dropdown select component for pagination and filters
- `skeleton` - Loading skeleton component for content placeholders

## 📝 TypeScript Standards

- **STRICT PROHIBITION**: The use of `any` type is strictly forbidden
- Always use proper TypeScript typing with interfaces, types, or generic constraints
- Prefer explicit typing over implicit `any` inference

## 📋 Form Development Guidelines

**Form State Management:**
- Use React's native `useActionState` hook for form state management and server actions
- Avoid external form libraries (react-hook-form, formik) - prefer React 19 native solutions
- Implement progressive enhancement with server actions as fallback

**Form Validation:**
- Use Zod schemas for all form validation
- Define validation schemas in dedicated files (e.g., `src/shared/lib/validations/`)
- Apply validation both client-side and server-side for security
- Example structure:
  ```typescript
  // src/shared/lib/validations/patient.ts
  import { z } from 'zod'

  export const patientSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone format')
  })

  export type PatientFormData = z.infer<typeof patientSchema>
  ```

**Server Actions:**
- Create server actions for form submissions in `src/app/actions/` or co-located with pages
- Use `useActionState` to connect forms with server actions
- Handle both success and error states appropriately
- Example:
  ```typescript
  // In component
  const [state, action, isPending] = useActionState(submitPatient, null)

  // In server action
  export async function submitPatient(prevState: any, formData: FormData) {
    const result = patientSchema.safeParse(Object.fromEntries(formData))
    if (!result.success) {
      return { errors: result.error.flatten() }
    }
    // Handle valid data...
  }
  ```

## ✨ Current Application Features

- **Medical Dashboard (/)**: Professional healthcare dashboard with Server Side Rendering (SSR)
  - Today's appointments with status indicators (active, scheduled, in-progress)
  - Medical statistics cards (active patients, critical alerts, admissions)
  - Comprehensive lab results table with search, filtering, and pagination
  - Tasks management sidebar with completion tracking
  - Patient data from JSONPlaceholder API integration
  - Loading skeletons for better UX during data fetching
- **Appointments (/appointments)**: Appointment management with Static Site Generation (SSG)
- **Patients (/patients)**: Patient management with Client Side Rendering (CSR)
- **Lab Results (/lab-results)**: Lab results display with Incremental Static Regeneration (ISR)
- **Professional UI System**: Complete medical dashboard interface
  - MediCare branded header with intelligent patient search, notifications, and doctor profile
  - Responsive medical navigation with section counts and summary
  - Mobile-first responsive design with hamburger menu
  - Three-column layout optimized for medical workflows
- **Enhanced Search System**: Intelligent patient search with autocomplete
  - Real-time search results with patient matching
  - Keyboard navigation support (arrow keys, enter, escape)
  - Debounced search for optimal performance
  - Mobile-responsive search interface
- **Advanced Pagination**: Comprehensive pagination system for data tables
  - Configurable items per page (5, 10, 25, 50)
  - Smart page navigation with ellipsis for large datasets
  - Search and filter integration with pagination reset
  - Responsive pagination controls
- **Custom Hooks Library**: Reusable hooks for common functionality
  - `useApi` - API calls with loading, error, and data states
  - `usePagination` - Pagination logic and state management
  - `useSearch` - Search functionality with filtering
  - `useLocalStorage` - localStorage integration with SSR safety
  - `useDebounce` - Value debouncing for performance
  - `useUsers` - User/patient data fetching abstractions
- **Comprehensive Type System**: Production-ready TypeScript definitions
  - Medical entities (Patient, Doctor, Appointment, LabResult, etc.)
  - API response and request types with proper error handling
  - Form state, validation, and server action types
  - UI component prop types and configurations
  - Utility types and branded types for enhanced type safety
- **Error Boundary System**: Multi-level error handling
  - Page-level error boundaries for critical failures
  - Widget-level boundaries for component isolation
  - Component-level boundaries for granular error handling
  - Error reporting and recovery mechanisms
- **Animation Library**: Smooth animations and micro-interactions
  - Fade-in, slide-in, and scale animations with intersection observers
  - Staggered animations for list items and cards
  - Micro-interactions (hover effects, click animations, ripple effects)
  - Floating elements and loading animations
  - Performance-optimized animations with proper cleanup
- **Loading States**: Comprehensive skeleton loading system
  - Dashboard component skeletons (cards, tables, sidebars)
  - Individual component loading states
  - Shimmer effects for dynamic content
  - Responsive skeleton layouts
- **Theme Support**: Light/dark mode toggle integrated across all medical components
- **Form System**: React 19 useActionState-based forms with server actions and Zod validation
- **File Upload**: Support for document uploads with validation and processing
- **API Integration**: Centralized HTTP client with JSONPlaceholder API and custom endpoints
- **Modal System**: Reusable modal component integrated with form system and server actions

## 🔧 Path Aliases

- `@/` maps to `./src/`

## 🎨 Theme System

The app uses `next-themes` with class-based theming:

- Light/dark mode toggle via `ModeToggle` component in `src/shared/ui/mode-toggle/`
- Theme provider wraps the entire app in `src/app/layout.tsx`
- Tailwind classes support dark mode variants
- All medical UI components are optimized for both light and dark themes
- Professional medical color palette with proper contrast ratios
- Header, sidebar, cards, and tables all support theme switching

## 📱 Responsive Design Guidelines

The application follows a mobile-first responsive approach with specific breakpoints:

- **Mobile (< 640px)**: Single column layout, hamburger menu, condensed components
- **Tablet (640px - 1024px)**: Two-column layout, visible sidebar, collapsed tasks sidebar
- **Desktop (1024px - 1280px)**: Three-column layout with navigation sidebar visible
- **Large Desktop (1280px+)**: Full three-column layout with all sidebars visible

**Responsive Components:**
- Header: Responsive search bar, conditional notification icons, profile info
- Sidebar: Hidden on mobile (sheet overlay), always visible on desktop
- Tasks Sidebar: Hidden on mobile/tablet, visible on large screens (xl:block)
- Lab Results Table: Horizontal scrolling on mobile, full table on desktop
- Appointment Cards: Single column on mobile, grid layout on larger screens
- Statistics Cards: Responsive grid from 1 to 3 columns based on screen size

## 🪝 Custom Hooks Usage Guidelines

**API Data Fetching:**
```typescript
import { useUsers, useApi } from '@/shared/hooks';

// For user/patient data
const { data: users, loading, error, refetch } = useUsers();

// For custom API calls
const { data, loading, error, refetch } = useApi(() => apiCall(), {
  immediate: true, // Auto-fetch on mount
  dependencies: [userId] // Re-fetch when dependencies change
});
```

**Pagination Implementation:**
```typescript
import { usePagination } from '@/shared/hooks';

const { state, actions, paginatedData } = usePagination(data, {
  initialPage: 1,
  initialItemsPerPage: 10
});

// Use state.currentPage, state.totalPages, etc.
// Use actions.setCurrentPage, actions.nextPage, etc.
```

**Search Functionality:**
```typescript
import { useSearch } from '@/shared/hooks';

const { state, actions, filteredData } = useSearch(data, {
  searchFields: ['name', 'email', 'phone'],
  caseSensitive: false
});

// Use state.query, state.isSearching
// Use actions.setQuery, actions.clearQuery
```

## 🎬 Animation System Usage

**Basic Animations:**
```typescript
import { FadeIn, SlideIn, ScaleIn } from '@/shared/ui/animations';

// Fade in from bottom with delay
<FadeIn delay={200} direction="up">
  <Component />
</FadeIn>

// Slide in on scroll
<SlideIn direction="left" triggerOnce>
  <Component />
</SlideIn>

// Scale in with bounce
<ScaleIn duration={400}>
  <Component />
</ScaleIn>
```

**Micro-interactions:**
```typescript
import { HoverLift, ClickAnimation, RippleEffect } from '@/shared/ui/animations';

// Hover effects
<HoverLift lift={8}>
  <Card />
</HoverLift>

// Click animations
<ClickAnimation scale={0.95}>
  <Button />
</ClickAnimation>

// Ripple effect on click
<RippleEffect color="rgba(255,255,255,0.6)">
  <InteractiveElement />
</RippleEffect>
```

## 🛡️ Error Boundary Implementation

**Component-level Protection:**
```typescript
import { ComponentErrorBoundary } from '@/shared/ui/error-boundary';

<ComponentErrorBoundary
  onError={(error) => console.error('Component error:', error)}
>
  <SomeComponent />
</ComponentErrorBoundary>
```

**Page-level Protection:**
```typescript
import { PageErrorBoundary } from '@/shared/ui/error-boundary';

<PageErrorBoundary>
  <PageContent />
</PageErrorBoundary>
```

**Async Error Handling:**
```typescript
import { useErrorHandler } from '@/shared/ui/error-boundary';

const { handleAsyncError, wrapAsyncFunction } = useErrorHandler();

// Wrap async functions
const safeApiCall = wrapAsyncFunction(apiCall, { context: 'user-fetch' });
```

## 🔷 TypeScript Type System

**Using Medical Types:**
```typescript
import type {
  Patient,
  Appointment,
  LabResult,
  ApiResponse,
  PaginatedResponse
} from '@/shared/types';

// Type-safe medical entities
const patient: Patient = {
  id: 'P-2024-001',
  firstName: 'John',
  lastName: 'Doe',
  // ... other required fields
};

// API responses with proper typing
const response: ApiResponse<Patient[]> = await fetchPatients();
```

**Form Type Safety:**
```typescript
import type { PatientFormData, ActionState } from '@/shared/types';

// Server action with typed response
export async function createPatient(
  prevState: ActionState<Patient> | null,
  formData: FormData
): Promise<ActionState<Patient>> {
  // Implementation with proper typing
}
```

## ⏳ Loading States and Skeletons

**Using Skeleton Components:**
```typescript
import {
  DashboardSkeleton,
  AppointmentCardSkeleton,
  LabResultsTableSkeleton
} from '@/shared/ui/skeletons';

// While loading dashboard
{isLoading ? <DashboardSkeleton /> : <DashboardContent />}

// Individual component skeletons
{appointments ? (
  appointments.map(apt => <AppointmentCard key={apt.id} {...apt} />)
) : (
  Array.from({length: 3}).map((_, i) => <AppointmentCardSkeleton key={i} />)
)}
```

## ⚡ Performance Optimization Guidelines

**Lazy Loading and Code Splitting:**
- All animations use intersection observers for performance
- Components are optimized for minimal re-renders
- Custom hooks use proper dependency arrays
- Debounced search to prevent excessive API calls

**Memory Management:**
- Animation cleanup on component unmount
- Event listener cleanup in custom hooks
- Proper dependency arrays in useEffect hooks
- Intersection observer disconnection

**Bundle Optimization:**
- Tree-shakeable imports from shared modules
- Optimized animation library with selective imports
- Lightweight skeleton components
- Minimal external dependencies

## 🏆 Best Practices Implemented

**Component Architecture:**
- Single Responsibility Principle for all components
- Proper prop interfaces with TypeScript
- Consistent error boundary implementation
- Reusable hooks for common functionality

**State Management:**
- Local state for component-specific data
- Custom hooks for shared logic
- Proper state initialization and cleanup
- Optimistic updates where appropriate

**Accessibility:**
- Keyboard navigation in search components
- Proper ARIA labels and roles
- Focus management in modals and dropdowns
- Screen reader friendly animations

**Code Quality:**
- 100% TypeScript coverage with no `any` types
- ESLint rules enforced throughout codebase
- Consistent naming conventions
- Comprehensive error handling

## 🔍 ESLint Configuration

- Uses Next.js core-web-vitals and TypeScript presets
- Modern flat config format (eslint.config.mjs)
- Ignores build artifacts and generated files
- Enforces no-explicit-any and proper TypeScript usage
- All lint warnings resolved in codebase

## 🏗️ Feature Slice Design Architecture

This project implements Feature Slice Design (FSD) architecture for maintainable and scalable code:

- **Each layer has strict import rules** - higher layers can import from lower layers only
- **Entities** - represent business domain models (Patient, Doctor, Appointment)
- **Features** - contain user interactions and business logic
- **Widgets** - compose features and entities into UI blocks
- **Pages** - compose widgets into full page layouts
- **Shared** - provides reusable utilities across all layers

This architecture ensures clear separation of concerns, easy testing, and team scalability.

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).