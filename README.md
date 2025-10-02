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

#### Frontend Environment
Create a \`.env\` file in the \`frontend\` directory based on \`frontend/env.example\`:

\`\`\`env
REACT_APP_API_URL=http://localhost:5000
\`\`\`

### 4. Start MongoDB
Make sure MongoDB is running on your system:
\`\`\`bash
# For local MongoDB
mongod

# Or if using MongoDB Atlas, make sure your connection string is correct
\`\`\`

### 5. Run the Application

#### Development Mode
\`\`\`bash
# Start backend server
npm run dev

# In a new terminal, start frontend
npm run dev:frontend
\`\`\`

#### Production Mode
\`\`\`bash
# Build frontend
npm run build

# Start production server
npm start
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Usage

### 1. Registration/Login
- Visit the application and create a new account
- Or login with existing credentials
- You'll receive a welcome email upon registration

### 2. Adding Books
- Navigate to "Add Book" from the navigation
- Fill in book details (title, author, genre, year, status)
- Optionally add rating and notes
- You'll receive an email notification when a book is added

### 3. Managing Books
- View all books in the "Books" section
- Use search and filters to find specific books
- Edit book details by clicking the edit button
- Delete books you no longer want in your library

### 4. Dashboard
- View reading statistics and analytics
- See your reading progress and completion rates
- Check recent books and top genres

### 5. Profile
- View your account information
- See account statistics and membership details

## 🗄️ Database Schema

### Users Collection
\`\`\`javascript
{
  name: String,
  email: String (unique),
  passwordHash: String,
  isEmailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Books Collection
\`\`\`javascript
{
  title: String,
  author: String,
  genre: String,
  year: Number,
  status: String (Reading|Completed|Wishlist),
  userId: ObjectId (ref: User),
  rating: Number (1-5, optional),
  notes: String (optional),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## 🔧 API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - Login user
- \`GET /api/auth/me\` - Get current user

### Books
- \`GET /api/books\` - Get user's books (with search/filter/pagination)
- \`GET /api/books/:id\` - Get single book
- \`POST /api/books\` - Add new book
- \`PUT /api/books/:id\` - Update book
- \`DELETE /api/books/:id\` - Delete book

### Dashboard
- \`GET /api/dashboard/stats\` - Get dashboard statistics
- \`GET /api/dashboard/analytics\` - Get detailed analytics

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

For production, consider using services like:
- SendGrid
- Mailgun
- AWS SES

## 🚀 Deployment

### Heroku Deployment
1. Create a Heroku app
2. Add MongoDB Atlas as add-on
3. Set environment variables
4. Deploy using Git

\`\`\`bash
heroku create your-app-name
heroku addons:create mongolab:sandbox
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_uri
git push heroku main
\`\`\`

### Vercel/Netlify (Frontend)
1. Build the React app
2. Deploy to Vercel or Netlify
3. Update API endpoints to production URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in \`.env\`
   - Verify network connectivity

2. **Email Not Working**
   - Check email credentials in \`.env\`
   - Ensure app-specific password is used for Gmail
   - Verify SMTP settings

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Ensure all environment variables are set

## 📞 Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Happy Reading! 📚**
