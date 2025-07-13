# replit.md

## Overview

This is a full-stack e-commerce application for a 10-minute delivery service called "Bellu". The application allows users to browse products across categories (wellness, skincare, electronics), add items to cart, and place orders with various payment methods. It's built with React frontend, Express backend, and uses in-memory storage for data persistence. The design features modern purple gradient buttons (#4D43FE) optimized for both desktop and mobile experiences.

## User Preferences

Preferred communication style: Simple, everyday language.
Primary color preference: #4D43FE (modern purple gradient for buttons and cards)
Cart color preference: Green (#34C759) for cart-related actions and floating cart
Design approach: Modern responsive design optimized for both desktop and mobile
Floating cart style: Horizontal tab with item count and total, not circular button

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: Zustand for cart state with persistence
- **Routing**: Wouter for client-side routing
- **Data Fetching**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Style**: REST API
- **Middleware**: Custom logging middleware for API requests
- **Session Management**: Session-based cart management (no authentication)

### Database & ORM
- **Database**: PostgreSQL (configured via Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for schema migrations
- **Storage**: In-memory storage implementation with interface for easy database switching

## Key Components

### Product Management
- Product catalog with categories (wellness, skincare, electronics)
- Product details including pricing, stock levels, delivery times
- Badge system for product status (NEW, TRENDING, BESTSELLER)
- Stock management and availability tracking

### Shopping Cart
- Session-based cart without user authentication
- Real-time cart updates with quantity management
- Persistent cart state using Zustand with localStorage
- Cart sidebar with order summary and checkout flow

### Order System
- Order placement with multiple payment methods (UPI, Card, COD)
- Delivery address collection
- Order status tracking (pending, confirmed, delivered)
- Estimated delivery time calculation

### UI/UX Components
- Responsive design with mobile-first approach
- Category filtering and product search
- Interactive product cards with stock indicators
- Modal-based checkout process
- Toast notifications for user feedback

## Data Flow

1. **Product Browsing**: Users browse products by category or search
2. **Cart Management**: Add/remove items with real-time updates
3. **Checkout Process**: Select payment method and provide delivery details
4. **Order Placement**: Create order with cart items and user preferences
5. **Order Confirmation**: Display success message and clear cart

### API Endpoints
- `GET /api/products` - Fetch all products or by category
- `GET /api/products/:id` - Fetch single product details
- `GET /api/cart/:sessionId` - Fetch cart items for session
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:sessionId/:productId` - Update cart item quantity
- `DELETE /api/cart/:sessionId/:productId` - Remove item from cart
- `POST /api/orders` - Create new order

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **zustand**: Client state management
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **@replit/vite-plugin-***: Replit-specific development plugins

### UI Components
- Complete shadcn/ui component library for consistent design
- Radix UI primitives for accessibility
- Lucide React for icons

## Deployment Strategy

### Development
- Vite dev server with HMR for frontend
- Express server with auto-reload using tsx
- Environment variables for database configuration

### Production Build
- Vite builds optimized React bundle
- ESBuild bundles Express server for Node.js
- Static assets served from Express in production
- Database migrations handled via Drizzle Kit

### Configuration
- TypeScript configuration with path aliases
- Tailwind CSS configured for client directory
- PostCSS for CSS processing
- ESLint and Prettier for code quality (implied by setup)

The application follows a traditional full-stack architecture with clear separation between frontend and backend, making it easy to scale and maintain. The use of TypeScript throughout ensures type safety, while the chosen libraries provide a solid foundation for an e-commerce platform.

## Recent Changes

### 2025-01-13: Fixed Product Loading Issue & Added Product Details
- Fixed TypeScript errors in storage.ts for proper type handling
- Corrected API query structure to use query parameters instead of path parameters
- Products now load correctly across all categories (wellness, skincare, electronics)
- Updated color scheme to use #4D43FE primary color for modern look

### 2025-01-13: Enhanced User Experience Features
- Added comprehensive product details page with image, descriptions, tabs (Description, Ingredients, Reviews)
- Implemented floating cart button with item count and total display
- Created clickable product cards that navigate to product details
- Added quantity selector and enhanced add to cart functionality on product details
- Replaced cart sidebar with floating cart for better mobile experience

### 2025-01-13: Location Management System
- Added location change modal with Google Maps integration option
- Users can select from popular locations or enter custom addresses
- Implemented current location detection using browser geolocation
- Added clickable location area in header for easy address updates
- Mobile and desktop responsive location selection interface