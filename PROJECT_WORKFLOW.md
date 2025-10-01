# Insurance Portal Project Workflow

## 📋 Project Overview
A comprehensive insurance management system built with Angular frontend and Node.js/Express backend, featuring role-based access control for customers, agents, and administrators.

## 🏗️ Architecture

### Frontend (Angular)
- **Framework**: Angular 17+ with standalone components
- **Styling**: Tailwind CSS with custom glassmorphism design
- **State Management**: Angular Services with HTTP interceptors
- **Authentication**: JWT-based with role guards
- **Routing**: Angular Router with lazy loading

### Backend (Node.js/Express)
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Middleware**: CORS, authentication, role-based authorization
- **API**: RESTful API with comprehensive error handling

## 🔄 User Workflows

### 1. Customer Workflow

#### Registration & Authentication
```
1. User visits homepage
2. Clicks "Sign Up" → Register Component
3. Fills form: Name, Email, Password, Role (Customer)
4. Submits → Backend creates user account
5. Redirects to Login page
6. User logs in → JWT token stored
7. Redirects to Customer Dashboard
```

#### Policy Management
```
1. Customer Dashboard → "Browse Policies"
2. Views available insurance products
3. Selects policy → Opens purchase modal
4. Fills nominee details and term
5. Submits purchase → Policy created with PENDING_AGENT status
6. Admin assigns agent to policy
7. Policy status changes to ACTIVE
8. Customer can view policy in "My Policies"
```

#### Payment Management
```
1. Customer Dashboard → "Payments"
2. Views payment history
3. Clicks "Make a Payment" → Payment form
4. Selects policy and payment method
5. Enters transaction reference
6. Submits payment → Payment recorded
7. Payment status updated in policy
```

#### Claims Management
```
1. Customer Dashboard → "Claims"
2. Clicks "Submit New Claim" → Claim form
3. Selects policy, incident date, description, amount
4. Submits claim → Claim created with PENDING status
5. Agent reviews and approves/rejects
6. Customer can track claim status
```

### 2. Agent Workflow

#### Authentication & Dashboard
```
1. Agent logs in with credentials
2. Redirects to Agent Dashboard
3. Views performance metrics:
   - Policies sold
   - Active policies
   - Pending claims
   - Total commission
```

#### Customer Management
```
1. Agent Dashboard → "My Customers"
2. Views assigned customers
3. Sees customer policy details
4. Tracks customer activity
```

#### Policy Management
```
1. Agent Dashboard → "My Assigned Policies"
2. Views policies assigned by admin
3. Tracks policy status and customer details
4. Monitors policy performance
```

#### Claims Review
```
1. Agent Dashboard → "Recent Claims to Review"
2. Views pending claims from customers
3. Clicks "Review" → Opens claim review modal
4. Reviews claim details and documentation
5. Makes decision: APPROVE or REJECT
6. Adds review notes
7. Submits decision → Claim status updated
```

### 3. Admin Workflow

#### Authentication & Overview
```
1. Admin logs in with credentials
2. Redirects to Admin Dashboard
3. Views platform overview:
   - Total users
   - Policies sold
   - Active policies
   - Total revenue
```

#### User Management
```
1. Admin Dashboard → "User Management" tab
2. Views all registered users
3. Can delete users (with safety checks)
4. Monitors user activity and roles
```

#### Policy Management
```
1. Admin Dashboard → "Policy Management" tab
2. Views all policy products
3. Can create, edit, delete policy products
4. Manages policy availability and pricing
```

#### Agent Management
```
1. Admin Dashboard → "Agent Management" tab
2. Views all agents
3. Can create new agents
4. Manages agent assignments
```

#### Policy Assignment
```
1. Admin Dashboard → "Policy Management" tab
2. Views unassigned policies (PENDING_AGENT)
3. Selects policy → Assignment modal
4. Chooses available agent
5. Assigns policy → Status changes to ACTIVE
6. Agent receives notification
```

#### Claims Management
```
1. Admin Dashboard → "Claims Management" tab
2. Views all claims across the platform
3. Monitors claim processing
4. Can override agent decisions if needed
```

#### Audit & Monitoring
```
1. Admin Dashboard → "Audit Logs" tab
2. Views system activity logs
3. Monitors user actions
4. Tracks security events
```

## 🔧 Technical Workflows

### Authentication Flow
```
1. User submits credentials
2. Backend validates credentials
3. JWT token generated with user role
4. Token stored in localStorage
5. AuthInterceptor adds token to requests
6. AuthGuard protects routes based on role
7. Token expiry handled gracefully
```

### API Request Flow
```
1. Frontend makes HTTP request
2. AuthInterceptor adds JWT token
3. Request sent to Express backend
4. Auth middleware validates token
5. Role middleware checks permissions
6. Controller processes request
7. Database operations via Mongoose
8. Response sent back to frontend
9. Frontend updates UI based on response
```

### Error Handling Flow
```
1. Error occurs in backend
2. Error middleware catches it
3. Appropriate HTTP status code set
4. Error message formatted
5. Response sent to frontend
6. Frontend displays user-friendly message
7. User can retry or take corrective action
```

## 📊 Data Flow

### Policy Purchase Flow
```
1. Customer selects policy product
2. Frontend sends purchase request
3. Backend creates UserPolicy with PENDING_AGENT
4. Admin assigns agent
5. Status changes to ACTIVE
6. Customer can make payments
7. Customer can file claims
```

### Payment Processing Flow
```
1. Customer initiates payment
2. Frontend sends payment details
3. Backend validates policy ownership
4. Payment record created
5. Payment linked to policy
6. Payment status updated
7. Customer sees updated status
```

### Claim Processing Flow
```
1. Customer submits claim
2. Claim created with PENDING status
3. Agent reviews claim details
4. Agent makes decision (APPROVE/REJECT)
5. Claim status updated
6. Customer notified of decision
7. If approved, claim amount processed
```

## 🔐 Security Workflows

### Role-Based Access Control
```
1. User logs in → Role determined
2. JWT token includes role information
3. Frontend routes protected by role guards
4. Backend endpoints protected by role middleware
5. UI elements shown/hidden based on role
6. API responses filtered by role permissions
```

### Data Validation
```
1. Frontend form validation
2. Backend schema validation
3. Input sanitization
4. SQL injection prevention
5. XSS protection
6. CSRF protection
```

## 🚀 Deployment Workflow

### Development
```
1. Code changes made
2. Frontend: ng build --configuration development
3. Backend: npm start
4. MongoDB running locally
5. Testing on localhost
```

### Production
```
1. Frontend: ng build --configuration production
2. Backend: npm start with production config
3. MongoDB Atlas or production database
4. Environment variables configured
5. SSL certificates installed
6. Domain configured
```

## 📈 Monitoring & Analytics

### User Activity Tracking
```
1. User actions logged
2. Audit trail maintained
3. Performance metrics collected
4. Error rates monitored
5. Usage patterns analyzed
```

### System Health
```
1. Database connection monitoring
2. API response time tracking
3. Error rate monitoring
4. User session management
5. System resource usage
```

## 🔄 Maintenance Workflows

### Regular Maintenance
```
1. Database cleanup
2. Log rotation
3. Security updates
4. Performance optimization
5. Backup verification
```

### Issue Resolution
```
1. Error reported
2. Logs analyzed
3. Issue identified
4. Fix implemented
5. Testing performed
6. Deployment to production
7. Monitoring for resolution
```

## 📱 Responsive Design Workflow

### Mobile-First Approach
```
1. Design for mobile screens first
2. Progressive enhancement for larger screens
3. Touch-friendly interface elements
4. Optimized navigation for mobile
5. Responsive tables and forms
6. Mobile-specific interactions
```

## 🎨 UI/UX Workflow

### Design System
```
1. Consistent color palette
2. Typography hierarchy
3. Component library
4. Icon system
5. Animation guidelines
6. Accessibility standards
```

### User Experience
```
1. Intuitive navigation
2. Clear information hierarchy
3. Consistent interactions
4. Loading states
5. Error handling
6. Success feedback
```

This workflow document provides a comprehensive overview of how the insurance portal operates across all user roles and technical components, ensuring smooth operation and clear understanding of the system's functionality.

