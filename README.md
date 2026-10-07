# LearnPulse - Online Course Platform

A full-stack learning management system built with React, Node.js (Express), MongoDB, JWT Authentication, and Razorpay Test Mode integration.

## Key Features
- **Authentication**: JWT token authentication, registration with email verification flow, login, and forgot/reset password.
- **Course Discovery**: Public course catalog, faceted search, category filtering, difficulty level selection, and detailed syllabus preview.
- **Enrollment & Payments**: Seamless checkout powered by Razorpay (Test Mode) with signature verification and free course instant enrollment.
- **Classroom Player**: Responsive video learning interface with lesson progress tracking, completion toggles, and dynamic progress bar.
- **Admin Management**: Full administrative control for courses, modules, lessons, user directory, and platform enrollment analytics.
- **Theme Support**: Polished Dark and Light mode toggle with persistent state.

## Repository Structure
```
online-course-platform/
├── backend/            # Express REST API, MongoDB Mongoose models, Razorpay & JWT auth
├── frontend/           # React SPA with dark/light themes and student classroom
├── TECH_STACK.md       # Architectural decisions and technical specifications
├── COMMITS.md          # Progressive commit log and manual Git upload guide
└── README.md           # Setup, configuration, and testing instructions
```

See `TECH_STACK.md` for architectural details and `COMMITS.md` for commit release history.
