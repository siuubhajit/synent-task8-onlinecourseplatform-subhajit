# Technical Architecture & Stack Overview

This document outlines the architectural decisions, libraries, and design patterns utilized in the LearnPulse Online Course Platform.

## 1. System Architecture
The application follows a decoupled client-server architecture:
- **Client Tier**: A responsive Single Page Application (SPA) written in React, offering reactive state management for theme toggling, video playback, and authentication state.
- **API Tier**: RESTful Express service running on Node.js, structured into routing, controller logic, middleware pipelines, and data access layers.
- **Data Tier**: Document-oriented storage with MongoDB via Mongoose ODM for schemas, data validation, and referencing.
- **Payment Gateway**: Razorpay Test Mode with server-side HMAC-SHA256 signature verification.

## 2. Technology Choices & Rationale
- **Frontend: React (Vite)**
  - Fast HMR during local development.
  - Component-driven architecture makes UI state (active lesson, video player, dark mode) straightforward to isolate and test.
  - CSS custom properties and utility classes provide seamless switching between dark slate and clean light themes.
- **Backend: Node.js & Express**
  - Lightweight, non-blocking I/O ideal for handling student queries, progress tracking pings, and webhook callbacks.
  - Modular middleware pattern cleanly isolates authentication guards (`protect`, `adminOnly`) and centralized error handling.
- **Database: MongoDB (Mongoose)**
  - Schema flexibility: courses naturally store nested modules and lessons within a unified document tree while referencing user enrollment records.
- **Security & Authentication: JWT & bcryptjs**
  - Stateless JSON Web Tokens allow authentication across frontend API requests without server session storage overhead.
  - Salted bcrypt hashing (cost factor 10) prevents plain-text credential leaks.
- **Payment Processing: Razorpay (Test Mode)**
  - Two-stage checkout flow: backend creates a signed order, the frontend opens the Razorpay test modal, and the backend verifies the cryptographic signature before granting course enrollment.
