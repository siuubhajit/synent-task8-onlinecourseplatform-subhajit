const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');

dotenv.config();

const coursesSeed = [
  {
    title: 'Full Stack Web Development with React & Node.js',
    shortDescription: 'Master modern full-stack engineering with React, Express, MongoDB, and secure authentication.',
    description: 'A comprehensive, project-driven course designed to take you from fundamentals to production-ready deployments. You will learn modern React patterns, component state architecture, Express routing, REST API design, MongoDB modeling, and payment integration with Razorpay.',
    instructor: 'David Mehta (Senior Software Architect)',
    category: 'Web Development',
    level: 'Beginner',
    price: 999, // ₹999
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
    totalDuration: '6h 15m',
    isPublished: true,
    modules: [
      {
        title: 'Module 1: Modern JavaScript & React Foundations',
        description: 'Understand ES6+ syntax, React JSX, component lifecycles, and Hooks.',
        order: 1,
        lessons: [
          {
            title: '1. Course Orientation & Environment Setup',
            duration: '08:45',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            notes: 'Install Node.js 18+, VS Code, and MongoDB Compass. Clone the starter repository.',
            isFreePreview: true,
            order: 1
          },
          {
            title: '2. React Component Architecture & Props',
            duration: '14:20',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            notes: 'Understanding one-way data flow and pure functional components.',
            isFreePreview: true,
            order: 2
          },
          {
            title: '3. State Management with useState and useEffect',
            duration: '18:10',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            notes: 'Managing component state, side effects, and API fetching patterns.',
            isFreePreview: false,
            order: 3
          }
        ]
      },
      {
        title: 'Module 2: Backend Development with Express & MongoDB',
        description: 'Build robust REST APIs with Express, Mongoose, and JWT authentication.',
        order: 2,
        lessons: [
          {
            title: '4. Express Server Setup & Middleware Pipeline',
            duration: '12:30',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            notes: 'Configuring CORS, body parsing, and route organization.',
            isFreePreview: false,
            order: 1
          },
          {
            title: '5. Mongoose Models, Validation & Schema Design',
            duration: '22:15',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            notes: 'Designing relational-style references and embedded subdocuments.',
            isFreePreview: false,
            order: 2
          },
          {
            title: '6. JWT Authentication, Password Hashing & Protected Routes',
            duration: '25:40',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            notes: 'Securing API endpoints using Bearer tokens and bcryptjs.',
            isFreePreview: false,
            order: 3
          }
        ]
      },
      {
        title: 'Module 3: Razorpay Payment Gateway & Deployment',
        description: 'Integrate checkout flows and deploy your full-stack application.',
        order: 3,
        lessons: [
          {
            title: '7. Razorpay Order Creation & Webhook Verification',
            duration: '19:50',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            notes: 'Handling test-mode payments and cryptographic signature verification.',
            isFreePreview: false,
            order: 1
          },
          {
            title: '8. Production Build & Deployment Checklist',
            duration: '16:30',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            notes: 'Configuring environment variables, optimizing bundle size, and health monitoring.',
            isFreePreview: false,
            order: 2
          }
        ]
      }
    ]
  },
  {
    title: 'Python for Data Science and Machine Learning',
    shortDescription: 'Analyze data, build predictive models, and master NumPy, Pandas, Matplotlib, and Scikit-Learn.',
    description: 'Learn practical data analysis and applied machine learning with Python. From data cleaning and statistical visualization to building classification and regression pipelines.',
    instructor: 'Priya Sharma (Data Science Lead)',
    category: 'Data Science',
    level: 'Intermediate',
    price: 1499, // ₹1499
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    totalDuration: '5h 40m',
    isPublished: true,
    modules: [
      {
        title: 'Module 1: Data Manipulation with NumPy & Pandas',
        description: 'Vectorized computing and dataframe transformations.',
        order: 1,
        lessons: [
          {
            title: '1. Introduction to Data Science Workflows',
            duration: '10:15',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
            notes: 'Jupyter notebook setup and essential Python refresher.',
            isFreePreview: true,
            order: 1
          },
          {
            title: '2. Data Cleaning & Handling Missing Values',
            duration: '18:40',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            notes: 'Imputation strategies and exploratory data analysis.',
            isFreePreview: false,
            order: 2
          }
        ]
      },
      {
        title: 'Module 2: Supervised Learning with Scikit-Learn',
        description: 'Building regression and classification pipelines.',
        order: 2,
        lessons: [
          {
            title: '3. Linear Regression & Feature Engineering',
            duration: '21:10',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            notes: 'Evaluating models with MSE and R-squared.',
            isFreePreview: false,
            order: 1
          },
          {
            title: '4. Decision Trees & Random Forests',
            duration: '24:00',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
            notes: 'Ensemble methods and hyperparameter tuning.',
            isFreePreview: false,
            order: 2
          }
        ]
      }
    ]
  },
  {
    title: 'UI/UX Design Systems & Figma Mastery',
    shortDescription: 'Design intuitive interfaces, accessible components, and high-fidelity interactive prototypes.',
    description: 'Step into modern product design. Learn typography rules, responsive grid systems, auto-layout mastery in Figma, and build cohesive component design tokens.',
    instructor: 'Aarav Sen (Principal Product Designer)',
    category: 'UI/UX Design',
    level: 'Beginner',
    price: 0, // Free Course!
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=60',
    totalDuration: '3h 15m',
    isPublished: true,
    modules: [
      {
        title: 'Module 1: Design Fundamentals',
        description: 'Visual hierarchy, typography scales, and accessible color contrast.',
        order: 1,
        lessons: [
          {
            title: '1. Color Theory and WCAG Contrast Standards',
            duration: '11:20',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            notes: 'Choosing accessible brand palettes for dark and light interfaces.',
            isFreePreview: true,
            order: 1
          },
          {
            title: '2. Auto-Layout and Responsive Constraints',
            duration: '16:05',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            notes: 'Building fluid components that adapt to mobile and desktop screens.',
            isFreePreview: true,
            order: 2
          }
        ]
      }
    ]
  },
  {
    title: 'DevOps & Docker Deployment Bootcamp',
    shortDescription: 'Containerize microservices, build automated CI/CD pipelines, and deploy with confidence.',
    description: 'Learn modern DevOps practices for web developers. Master containerization with Docker, multi-stage builds, reverse proxies with NGINX, and zero-downtime deployment pipelines.',
    instructor: 'Rohan Deshmukh (Cloud Infrastructure Lead)',
    category: 'Cloud & DevOps',
    level: 'Advanced',
    price: 799,
    thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=60',
    totalDuration: '4h 10m',
    isPublished: true,
    modules: [
      {
        title: 'Module 1: Docker Containers & Compose',
        description: 'From Dockerfile basics to multi-container development environments.',
        order: 1,
        lessons: [
          {
            title: '1. Containerizing Node.js and React Applications',
            duration: '15:10',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            notes: 'Layer caching and minimizing production image size.',
            isFreePreview: true,
            order: 1
          }
        ]
      }
    ]
  }
];

const seedDatabase = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/course_platform';
  console.log(`[Seeder] Connecting to MongoDB: ${uri}`);

  try {
    await mongoose.connect(uri);
    console.log('[Seeder] Connected successfully.');

    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('[Seeder] Cleared previous users and courses.');

    const admin = await User.create({
      name: 'Platform Administrator',
      email: 'admin@example.com',
      password: 'Admin@123Password',
      role: 'admin',
      isVerified: true
    });
    console.log(`[Seeder] Created Admin User: admin@example.com / Admin@123Password`);

    const student = await User.create({
      name: 'Rahul Sharma',
      email: 'student@example.com',
      password: 'Student@123Password',
      role: 'student',
      isVerified: true
    });
    console.log(`[Seeder] Created Demo Student User: student@example.com / Student@123Password`);

    const createdCourses = await Course.insertMany(coursesSeed);
    console.log(`[Seeder] Successfully seeded ${createdCourses.length} courses with full curriculums.`);

    student.enrolledCourses.push(createdCourses[0]._id);
    await student.save();
    console.log(`[Seeder] Pre-enrolled student in: "${createdCourses[0].title}"`);

    await mongoose.disconnect();
    console.log('[Seeder] Database seeding finished cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('[Seeder Error]', err.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { coursesSeed };
