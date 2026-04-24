# 🎓 Student Management System

A production-ready Node.js + Express.js REST API with a vanilla HTML/CSS/JS frontend for managing student records.

![Student Management UI](image.png)

## 📋 Project Overview

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: MongoDB via Mongoose 7.x
- **Frontend**: Vanilla HTML + CSS + JavaScript

## 🚀 Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ RESTful API with proper HTTP status codes
- ✅ MongoDB integration with Mongoose ODM
- ✅ Global error handling middleware
- ✅ Input validation (ObjectId, email format, required fields)
- ✅ Modern, responsive UI with vanilla JavaScript
- ✅ Real-time form feedback with toast notifications

## 📁 Project Structure

```
experiment10/
├── server.js              # Entry point
├── .env                   # Environment configuration
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies & scripts
├── models/
│   └── Student.js         # Mongoose schema
├── routes/
│   └── studentRoutes.js   # API routes
├── controllers/
│   └── studentController.js  # Business logic
├── middleware/
│   └── errorHandler.js    # Global error handler
└── public/
    ├── index.html         # Frontend UI
    ├── style.css          # Styling
    └── app.js             # Frontend logic
```

## 🛠️ Installation

```bash
cd experiment10
npm install
```

## ▶️ Running the Application

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

**Server runs on**: http://localhost:5000

**Prerequisites**:
- MongoDB must be running on `mongodb://127.0.0.1:27017/collegeDB`

## API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/students` | Create a new student |
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get student by ID |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

### Request/Response Examples

**POST /api/students**
```json
// Request
{ "name": "Rahul", "email": "rahul@gmail.com", "course": "BCA" }

// Response (201)
{ "success": true, "data": { "_id": "...", "name": "Rahul", ... } }
```

**GET /api/students**
```json
// Response (200)
{ "success": true, "data": [...] }
```

## 🎨 Frontend UI

The frontend provides a modern single-page dashboard with:
- Fixed navbar with app title
- Two-column layout (Add/Edit Form + Student Table)
- Real-time form validation
- Toast notifications for actions
- Responsive design for mobile/desktop

## 📝 License

ISC