# Expense Tracker UI

A modern, production-ready expense tracking application built with Next.js 16, React 19, and TypeScript. Features a beautiful dark theme with glassmorphism effects and comprehensive expense management capabilities.

## 🚀 Features

### Authentication

- ✅ User registration with validation
- ✅ Secure login with JWT tokens
- ✅ Protected routes with middleware
- ✅ Automatic logout functionality

### Profile Management

- ✅ View and edit user profile
- ✅ Avatar upload with preview (max 5MB)
- ✅ Currency preferences
- ✅ Monthly budget settings
- ✅ Profile dialog with form validation

### Expense Management

- ✅ Create, read, update, and delete expenses
- ✅ Category-based organization (8 categories)
- ✅ Date tracking
- ✅ Description/notes for each expense
- ✅ Pagination for large expense lists
- ✅ Beautiful card-based UI with hover effects

### Analytics & Insights

- ✅ Real-time expense summary (total, count, average)
- ✅ Category breakdown with progress bars and percentages
- ✅ Monthly trend visualization with bar charts
- ✅ Responsive dashboard layout
- ✅ Interactive hover tooltips

## 🎨 Design Features

- **Dark Theme**: Sleek black background with subtle gradients
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Micro-animations**: Smooth transitions and hover effects
- **Gradient Accents**: Blue to purple gradients throughout
- **Custom Scrollbars**: Minimalist scrollbar design
- **Responsive Layout**: Mobile-first design approach
- **Loading States**: Beautiful loading spinners
- **Error Handling**: User-friendly error pages

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **React**: 19.2.3
- **TypeScript**: Latest
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI (shadcn/ui)
- **Form Validation**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: Sonner

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
# Create a .env file in the root directory
NEXT_PUBLIC_BASE_URL=https://expense-tracker-backend-ml9h.onrender.com

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```


### Pages

- `/` - Login/Signup page (AuthWrapper)
- `/dashboard` - Main dashboard with analytics and expense list

### Components

- **DashboardHeader** - Top navigation with user profile dropdown
- **ProfileDialog** - Modal for editing user profile
- **ExpenseSummary** - Summary cards showing total, count, and average
- **CategoryBreakdown** - Visual breakdown of expenses by category
- **MonthlyTrend** - Bar chart showing monthly expense trends
- **ExpenseList** - Paginated list of all expenses
- **ExpenseDialog** - Modal for creating/editing expenses

## 🔒 Security Features

- HTTP-only cookies for JWT tokens
- Protected routes via middleware
- Form validation with Zod schemas
- CSRF protection
- Secure file upload validation

## 🎯 Production Checklist

- ✅ Environment variables configured
- ✅ Error boundaries implemented
- ✅ Loading states added
- ✅ Form validation
- ✅ API error handling
- ✅ Responsive design
- ✅ Route protection
- ✅ SEO optimization ready
- ✅ Accessibility features
- ✅ Performance optimization

## 📊 Project Structure

```
expense-tracker-ui/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx          # Main dashboard
│   │   ├── loading.tsx       # Loading state
│   │   └── error.tsx         # Error boundary
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Login/Signup page
│   └── globals.css           # Global styles
├── components/
│   ├── auth/                 # Authentication components
│   └── dashboard/            # Dashboard components
├── lib/
│   ├── actions/
│   │   └── auth.action.ts    # All API actions
│   └── utils.ts              # Utility functions
├── ui/                       # shadcn UI components
├── utils/
│   └── schemas/              # Zod validation schemas
├── middleware.ts             # Route protection
└── package.json
```

---
### 🚧 Project Status

> **Note:** This project is currently **in progress**. Several core modules such as authentication, profile management, and expense tracking are completed, while additional features and improvements are still under active development.

