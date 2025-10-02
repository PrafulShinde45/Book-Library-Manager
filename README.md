# Book Library Manager

A comprehensive Book Library Management System built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to manage their personal book collection with full CRUD operations, authentication, search functionality, and analytics.

## 🚀 Features

### User Authentication & Authorization
- JWT-based authentication
- Secure password hashing with bcrypt
- User registration and login
- Protected routes

### Book Management (CRUD Operations)
- Add new books with detailed information
- View all books in your library
- Update book details (title, author, genre, year, status, rating, notes)
- Delete books from your library
- Book status tracking (Reading, Completed, Wishlist)

### Search & Filter
- Search books by title, author, or genre
- Filter books by genre and status
- Pagination for large libraries

### Dashboard & Analytics
- Total books count
- Books by status breakdown
- Top genres visualization
- Reading progress tracking
- Recent books list
- Monthly reading activity

### Email Notifications
- Welcome email on signup
- Notification email when adding new books
- Beautiful HTML email templates

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Express Validator** - Input validation

### Frontend
- **React** - UI framework
- **React Router** - Routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Tailwind CSS** - Styling
- **Heroicons** - Icons
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js for security headers
- Protected routes on frontend

## 📧 Email Configuration

To enable email notifications:

1. Set up an email service (Gmail recommended for development)
2. Enable 2-factor authentication on your Gmail account
3. Generate an app-specific password
4. Update the \`.env\` file with your email credentials

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd book-library-manager
\`\`\`

### 2. Install All Dependencies
\`\`\`bash
npm run install-all
\`\`\`

Or install separately:
\`\`\`bash
# Backend dependencies
npm run install-backend

# Frontend dependencies
npm run install-frontend
\`\`\`

### 3. Environment Configuration

#### Backend Environment
Create a \`.env\` file in the \`backend\` directory based on \`backend/env.example\`:

\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/book-library-manager
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@booklibrary.com
\`\`\`







