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

### 2025-01-13: Pincode Delivery Checker
- Added functional pincode checker component on homepage
- Users can verify delivery availability by entering 6-digit pincode
- Shows service areas, delivery times, and availability status
- Includes mock data for Bangalore areas with expansion plans
- Real-time validation and user-friendly error handling

### 2025-01-13: Enhanced Multi-Image Gallery & Design
- Upgraded product image gallery with fullscreen zoom capability
- Added keyboard navigation (arrow keys, escape) for better UX
- Enhanced thumbnail gallery with improved hover effects and transitions
- Added gradient background overlay to main section with fade effect
- Fixed storage data structure for proper multi-image support
- Improved error handling for broken images in gallery

### 2025-01-13: Moved Pincode Checker to Navbar
- Created compact navbar pincode checker component with popover interface
- Moved pincode functionality from homepage to navbar next to cart button
- Responsive design - hidden on mobile to save space
- Maintains all original functionality in a cleaner, more accessible location

### 2025-01-13: Enhanced Hero Banner Design
- Converted plain text hero section into attractive card banner
- Added gradient background with primary color theme
- Included lightning bolt icon and trust signals (Free Delivery, 100% Authentic, 10 Min Delivery)
- Enhanced visual hierarchy with proper spacing and typography
- Maintained responsive design for mobile and desktop

### 2025-01-13: Enhanced Product Card Interactions
- Added quantity controls with + and - buttons using orange color scheme
- Implemented smart button behavior: single + button transforms to quantity controls after adding
- Used darker orange colors (orange-600/700/800) for unified design
- Added deeper orange background for quantity control container
- Real-time cart integration with persistent state management

### 2025-01-13: Admin Dashboard Implementation
- Created comprehensive admin system with product and order management
- Admin Products page: view, create, edit, delete products with modal forms
- Admin Orders page: view all orders, update status, detailed order information
- Added admin access button (shield icon) in header navigation
- Implemented backend API endpoints for CRUD operations
- Added sample orders with realistic data for testing
- Navigation between admin pages with tab-style interface
- Form validation using Zod schemas and react-hook-form

### 2025-01-13: MongoDB Integration
- Successfully integrated MongoDB Atlas database for persistent data storage
- Replaced in-memory storage with MongoDB collections for products and orders
- Created MongoStorage class implementing IStorage interface for seamless transition
- Connected to MongoDB cluster using provided connection string
- Auto-initialized database with sample products (10 items) and orders (4 orders)
- Maintained session-based cart storage for optimal user experience
- All admin operations (CRUD) now persist data to cloud database
- Enhanced data reliability and scalability for production deployment

### 2025-01-13: Enhanced Multi-Image Support & Project Migration
- Successfully migrated project from Replit Agent to standard Replit environment
- Enhanced ProductImageGallery with advanced multi-image functionality:
  - Clickable zoom to fullscreen view with keyboard navigation
  - Improved thumbnail navigation with visual feedback
  - Better hover effects and transition animations
  - Error handling for broken image links
  - Image counter display and enhanced navigation controls
- Fixed storage data to properly support multiple product images
- Maintained security best practices and client/server separation

### 2025-01-13: Enhanced Category System & Admin Order Filtering
- Added comprehensive date and status filtering to admin orders page:
  - Filter by order status (pending, confirmed, preparing, delivered, cancelled)
  - Filter by specific date or date range (from/to dates)
  - Real-time order count display with filtered results
  - Collapsible filter interface with clear filters functionality
  - Smart filter logic preventing conflicts between date filter types
- Expanded product category options from 3 to 12 categories:
  - Added Health & Medicine, Beauty & Personal Care, Fitness & Sports
  - Added Nutrition & Supplements, Home & Garden, Baby & Kids
  - Added Pet Care, Books & Stationery, Grocery & Food
  - Updated both admin product form and frontend category filters
- Enhanced admin product management with more flexible category selection
- Improved order management workflow for administrators

### 2025-01-13: Google Maps Integration for Location Selection
- Successfully migrated project from Replit Agent to standard Replit environment
- Integrated Google Maps API for enhanced location selection experience:
  - Added interactive map interface with clickable location selection
  - Implemented draggable markers for precise location adjustment
  - Added reverse geocoding to convert coordinates to readable addresses
  - Created dual-view interface: Search mode and Map mode toggle
  - Built fallback system for when Google Maps API key is not available
  - Added proper error handling and graceful degradation
- Enhanced location modal with modern UI/UX improvements
- Created .env.example file with configuration documentation
- Removed Ingredients and Reviews tabs from product details as requested
- Fixed all syntax errors and ensured clean application startup