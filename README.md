# LearnPulse - Online Course Platform (Full Stack)

A complete, production-ready Full Stack Learning Management Platform built with **React**, **Node.js (Express)**, **MongoDB (Mongoose)**, **JWT Authentication**, and **Razorpay (Test Mode)**.

---

## 🌟 Features Overview

### 1. Authentication & Security
- **Registration & Login**: Email and password authentication with salted bcrypt hashing.
- **JWT Authorization**: Stateless Bearer tokens with 7-day expiration.
- **Email Verification**: 6-digit verification code system with email notifications (SMTP or dev console logger).
- **Password Recovery**: Secure tokenized password reset flow with 15-minute expiration.
- **Role-Based Guards**: Distinct `student` and `admin` roles protecting sensitive endpoints.
- **1-Click Demo Logins**: Pre-configured buttons for **Demo Student** and **Demo Admin** in the authentication modal.

### 2. User & Course Discovery
- **Public Course Catalog**: Instant search across titles, descriptions, and instructors.
- **Faceted Filtering**: Filter by Category (Web Dev, Data Science, UI/UX, DevOps), Difficulty Level (Beginner, Intermediate, Advanced), and Pricing (All, Free, Paid).
- **Course Landing Page**: Detailed syllabus outline with expandable modules, lesson duration, instructor bio, and **Free Preview Video** modal.

### 3. Payment & Enrollment Flow
- **Razorpay Test Mode Integration**: Order creation via backend API, frontend Razorpay Checkout checkout.js popup, and server-side HMAC-SHA256 cryptographic signature validation.
- **Interactive Sandbox Fallback**: Built-in test payment simulator for offline/sandboxed environments.
- **Free Course Instant Enrollment**: 1-click enroll for zero-cost courses.
- **Email Receipts**: Automatic enrollment confirmation and receipt notification.

### 4. Interactive Learning Classroom
- **Student Dashboard**: Overview of enrolled courses, lessons completed, in-progress list, and overall completion rate.
- **Classroom Video Player**: Custom playback interface with play/pause, time scrubber, volume slider, playback speeds (0.75x to 2x), and fullscreen mode.
- **Curriculum Sidebar**: Collapsible syllabus tree with green checkmarks for completed lessons.
- **Real-Time Progress Tracking**: Dynamic progress bar calculating completion percentage on every lesson toggle.
- **Completion Milestone**: Celebration modal upon reaching 100% completion.

### 5. Admin Control Center
- **Platform Analytics**: Total revenue in ₹, active student count, published courses, and total enrollments.
- **Course Manager**: Add new courses with multi-module curriculum builder, edit details, and delete courses.
- **User Directory**: View registered users, roles, verification status, and enrolled course counts.
- **Enrollment Logs**: Real-time transaction history with student name, course, payment ID, and timestamp.

### 6. Design System & Theme
- **Dark & Light Mode**: Seamless theme toggle persisted in `localStorage` and applied to root DOM elements.
- **Responsive Layout**: Designed for mobile, tablet, and desktop viewports.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or MongoDB Atlas URI)

### 1. Installation
Clone or extract the repository, then install dependencies for both backend and frontend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration
Copy `.env.example` in `backend/` to `.env`:
```bash
cd backend
cp .env.example .env
```
Default configuration values:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/course_platform
JWT_SECRET=learnpulse_super_secret_jwt_key_2026_xyz
JWT_EXPIRES_IN=7d
RAZORPAY_KEY_ID=rzp_test_YourTestKeyIdHere
RAZORPAY_KEY_SECRET=YourTestKeySecretHere
```

### 3. Seed Database
Populate the database with realistic courses, curriculum lessons, and demo accounts:
```bash
cd backend
npm run seed
```
**Default Seed Accounts:**
- **Admin**: `admin@example.com` / `Admin@123Password`
- **Student**: `student@example.com` / `Student@123Password`

### 4. Run Application
In separate terminal windows:
```bash
# Terminal 1 - Start Backend API (Port 5000)
cd backend
npm run dev

# Terminal 2 - Start Frontend React App (Port 5173)
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📦 Commit Archives (v1.zip - v10.zip)

The project includes 10 progressive commit archives:
- `v1.zip`: Scaffolding, configuration, and base server structure.
- `v2.zip`: MongoDB connection, User model, and JWT token utilities.
- `v3.zip`: Authentication routes, controllers, and email notification service.
- `v4.zip`: Course schema, curriculum structures, and database seeder.
- `v5.zip`: Public course catalog API with search and filtering.
- `v6.zip`: Razorpay test mode payment integration and enrollment models.
- `v7.zip`: Student learning system, progress tracking, and video endpoints.
- `v8.zip`: Admin management API and platform analytics.
- `v9.zip`: Frontend client foundation, theme switcher, and catalog pages.
- `v10.zip`: Full classroom player, Razorpay checkout, admin portal, and documentation.

Refer to `COMMITS.md` for manual Git commit instructions.
