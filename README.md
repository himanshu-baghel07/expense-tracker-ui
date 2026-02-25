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

## 🌐 API Endpoints

The application integrates with the following backend APIs:

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User Profile

- `GET /api/user/get-profile` - Get user profile
- `PUT /api/user/update-profile` - Update profile (supports FormData for avatar)

### Expenses

- `GET /api/expenses` - Get all expenses (with pagination & filters)
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get single expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Analytics

- `GET /api/expenses/summary` - Get expense summary
- `GET /api/expenses/chart/category` - Get category breakdown
- `GET /api/expenses/chart/monthly` - Get monthly trends

## 📱 Pages & Components

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

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Make sure to set the following environment variables in your deployment platform:

- `NEXT_PUBLIC_BASE_URL` - Backend API URL

## 📝 API Categories

The application supports 8 expense categories:

1. Food
2. Transport
3. Entertainment
4. Shopping
5. Healthcare
6. Utilities
7. Education
8. Other

## 🎨 Color Palette

- **Background**: Pure Black (#000000)
- **Foreground**: Off-white (#EDEDED)
- **Primary**: Blue (#2563EB) to Purple (#9333EA)
- **Accent Colors**: Category-specific (Orange, Blue, Purple, Pink, Red, Green, Indigo, Gray)
- **Borders**: Dark Gray (#1F2937)

## 📄 License

This project is private and proprietary.

## 👤 Author

Developed with ❤️ using Google Deepmind's Antigravity AI Assistant

---

**Note**: This is a production-ready application with comprehensive error handling, loading states, and user-friendly interfaces. All API calls include proper error handling and user feedback via toast notifications.
