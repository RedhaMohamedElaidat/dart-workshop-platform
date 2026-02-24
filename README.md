# 🎯 Dart Workshop Activity Platform

A full-stack web application for managing Dart programming workshop activities. Students can submit code solutions, and instructors can view and track submissions.

## ✨ Features

- **User Authentication**: Simple login system with whitelisted users
- **Activity Submission**: Students submit Dart code for 3 different activities
- **Code Persistence**: SQLite database stores all submissions
- **Admin Panel**: View all submissions, filter by student/activity, export to CSV
- **Dark Theme UI**: Modern, responsive, and visually appealing interface
- **Session Management**: Persistent login using sessionStorage
- **Input Validation**: Prevent empty submissions and enforce code size limits
- **Production Ready**: Proper error handling, security headers, and input sanitization

## 📋 Technical Stack

- **Backend**: Node.js + Express.js
- **Database**: SQLite3 (file-based, no external DB needed)
- **Frontend**: HTML + CSS + Vanilla JavaScript
- **Deployment**: Compatible with Render, Railway, Heroku, or any Node.js host

## 📁 Project Structure

```
dart-workshop/
├── server.js                 # Main Express server
├── package.json              # Dependencies
├── database.db              # SQLite database (created on first run)
├── public/
│   ├── index.html           # Main dashboard & login page
│   ├── admin.html           # Admin panel
│   ├── app.js              # Frontend logic (dashboard)
│   ├── admin.js            # Admin panel logic
│   └── styles.css          # Global styles (dark theme)
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 14.x
- npm or yarn
- Git (for deployment)

### Local Installation

1. **Clone or download the project**
```bash
git clone <your-repo-url>
cd dart-workshop
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

The application will be available at:
- **Dashboard**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

4. **Login with one of the test users**
   - Bekouch Ikram
   - Djaoud Sara
   - Rahali Hanane

## 📚 Usage Guide

### For Students

1. **Login**: Enter your full name from the allowed list
2. **View Activities**: See 3 Dart programming challenges
3. **Write Code**: Use the provided textarea to write your Dart solution
4. **Submit**: Click "Submit Activity X" to save your code
5. **Update**: Resubmit anytime to update your previous submission

### For Instructors

1. **Access Admin Panel**: Go to http://localhost:3000/admin
2. **View Submissions**: See all student submissions in a table
3. **Filter**: Filter by student name or activity number
4. **View Code**: Click "View" button to see full code submission
5. **Export**: Click "📥 Export to CSV" to download all submissions

## 🗄️ Database Schema

### submissions table
```sql
CREATE TABLE submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  activity_number INTEGER NOT NULL,
  code_text TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(full_name, activity_number)
);
```

### users table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Key Features**:
- `UNIQUE(full_name, activity_number)` prevents duplicate submissions
- Resubmitting same activity updates the previous record
- Timestamps track when code was submitted

## 🔐 Security

The application implements:
- ✅ Input validation and sanitization
- ✅ Empty submission prevention
- ✅ Code size limits (max 50KB)
- ✅ Basic admin token validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS enabled for development
- ✅ No password storage (whitelist-based access)

**Note**: For production, consider:
- Implementing JWT tokens
- Adding proper authentication middleware
- Using environment variables for secrets
- Adding HTTPS enforcement
- Implementing rate limiting

## 🌐 Deployment

### Deploy to Render

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Connect to Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Fill in the following settings:
     - **Name**: `dart-workshop`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Region**: Choose closest to you

3. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete (~2 minutes)
   - Your app will be live at: `https://dart-workshop-XXXXX.onrender.com`

### Deploy to Railway

1. **Push to GitHub** (same as above)

2. **Connect to Railway**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js

3. **Configure**
   - Add PORT environment variable (auto-configured)
   - Watch the deployment logs

4. **Access**
   - Dashboard: `https://your-project.up.railway.app`
   - Admin: `https://your-project.up.railway.app/admin`

### Deploy to Heroku

1. **Push to GitHub** (same as above)

2. **Connect to Heroku**
```bash
npm install -g heroku
heroku login
heroku create dart-workshop
git push heroku main
```

3. **Access**
   - Dashboard: `https://dart-workshop.herokuapp.com`
   - Admin: `https://dart-workshop.herokuapp.com/admin`

## 📝 Activities Description

### Activity 1: Student Average
- **Goal**: Calculate average marks from multiple students
- **Concepts**: Input handling, loops, arithmetic operations
- **Expected Output Format**: "The average mark is: 85.5"

### Activity 2: Student Class with Map
- **Goal**: Create a Student class and manage multiple instances with a Map
- **Concepts**: OOP, Classes, Maps/Dictionaries, Methods
- **Expected Output Format**: "Student: Ahmed (ID: 001, Grade: 15) - Passed"

### Activity 3: Print Even Numbers
- **Goal**: Print even numbers without using modulo operator
- **Concepts**: Loops, Bitwise operations or division tricks
- **Expected Output Format**: "2 4 6 8 10" (for n=10)

## 🔧 Environment Variables

Create a `.env` file (optional):
```
PORT=3000
NODE_ENV=development
```

## 📊 API Endpoints

### Public Routes
- `POST /api/login` - User login
- `POST /api/submit` - Submit activity code
- `GET /api/submissions/:fullName` - Get user's submissions
- `GET /api/health` - Health check

### Admin Routes
- `GET /api/admin/submissions` - Get all submissions (requires admin token)

### Web Routes
- `GET /` - Main dashboard
- `GET /admin` - Admin panel

## 🐛 Troubleshooting

### Port already in use
```bash
# Change port in server.js or use environment variable
PORT=3001 npm start
```

### Database locked error
- Close all other instances of the app
- Delete `database.db` to reset (submissions will be lost)

### Students can't login
- Check spelling of names matches exactly: "Bekouch Ikram", "Djaoud Sara", "Rahali Hanane"
- Names are case-sensitive

### Admin panel shows no submissions
- Ensure you're accessing `/admin`
- Check browser console for API errors
- Verify database.db file exists in root directory

## 📈 Monitoring

Check server logs to monitor:
- Login attempts
- Submission events
- Errors and warnings
- Health status

```bash
# View real-time logs (in production)
npm start
```

## 📝 License

This project is provided as-is for educational purposes.

## 👥 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review server.js console logs
3. Check browser developer console (F12)
4. Verify all files are in correct directories

---

**Created for Dart Workshop** 🎯
