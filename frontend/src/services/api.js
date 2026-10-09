/**
 * LearnPulse Centralized API Client
 * Automatically attaches Authorization headers and provides full-fidelity mock
 * fallback data if the backend server is running in standalone mode.
 */

// Fallback seed courses for standalone frontend operation
const MOCK_COURSES = [
  {
    _id: 'seed_course_1',
    title: 'Full Stack Web Development with React & Node.js',
    shortDescription: 'Master modern full-stack engineering with React, Express, MongoDB, and secure authentication.',
    description: 'A comprehensive, project-driven course designed to take you from fundamentals to production-ready deployments. You will learn modern React patterns, component state architecture, Express routing, REST API design, MongoDB modeling, and payment integration with Razorpay.',
    instructor: 'David Mehta (Senior Software Architect)',
    category: 'Web Development',
    level: 'Beginner',
    price: 999,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
    totalDuration: '6h 15m',
    totalLessons: 8,
    enrolledCount: 142,
    modules: [
      {
        _id: 'm1',
        title: 'Module 1: Modern JavaScript & React Foundations',
        description: 'Understand ES6+ syntax, React JSX, component lifecycles, and Hooks.',
        lessons: [
          { _id: 'l1', title: '1. Course Orientation & Environment Setup', duration: '08:45', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isFreePreview: true, notes: 'Install Node.js 18+, VS Code, and MongoDB Compass.' },
          { _id: 'l2', title: '2. React Component Architecture & Props', duration: '14:20', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', isFreePreview: true, notes: 'Understanding one-way data flow and functional components.' },
          { _id: 'l3', title: '3. State Management with useState and useEffect', duration: '18:10', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', isFreePreview: false, notes: 'Managing component state and API fetching patterns.' }
        ]
      },
      {
        _id: 'm2',
        title: 'Module 2: Backend Development with Express & MongoDB',
        description: 'Build robust REST APIs with Express, Mongoose, and JWT authentication.',
        lessons: [
          { _id: 'l4', title: '4. Express Server Setup & Middleware Pipeline', duration: '12:30', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', isFreePreview: false, notes: 'Configuring CORS, body parsing, and route organization.' },
          { _id: 'l5', title: '5. Mongoose Models, Validation & Schema Design', duration: '22:15', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', isFreePreview: false, notes: 'Designing schemas and embedded subdocuments.' },
          { _id: 'l6', title: '6. JWT Authentication & Protected Routes', duration: '25:40', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4', isFreePreview: false, notes: 'Securing API endpoints using Bearer tokens.' }
        ]
      }
    ]
  },
  {
    _id: 'seed_course_2',
    title: 'Python for Data Science and Machine Learning',
    shortDescription: 'Analyze data, build predictive models, and master NumPy, Pandas, Matplotlib, and Scikit-Learn.',
    description: 'Learn practical data analysis and applied machine learning with Python. From data cleaning and statistical visualization to building classification and regression pipelines.',
    instructor: 'Priya Sharma (Data Science Lead)',
    category: 'Data Science',
    level: 'Intermediate',
    price: 1499,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    totalDuration: '5h 40m',
    totalLessons: 4,
    enrolledCount: 98,
    modules: [
      {
        _id: 'm1_py',
        title: 'Module 1: Data Manipulation with NumPy & Pandas',
        lessons: [
          { _id: 'l1_py', title: '1. Introduction to Data Science Workflows', duration: '10:15', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4', isFreePreview: true, notes: 'Jupyter notebook setup and essential Python refresher.' },
          { _id: 'l2_py', title: '2. Data Cleaning & Handling Missing Values', duration: '18:40', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', isFreePreview: false, notes: 'Imputation strategies and exploratory data analysis.' }
        ]
      }
    ]
  },
  {
    _id: 'seed_course_3',
    title: 'UI/UX Design Systems & Figma Mastery',
    shortDescription: 'Design intuitive interfaces, accessible components, and high-fidelity interactive prototypes.',
    description: 'Step into modern product design. Learn typography rules, responsive grid systems, auto-layout mastery in Figma, and build cohesive component design tokens.',
    instructor: 'Aarav Sen (Principal Product Designer)',
    category: 'UI/UX Design',
    level: 'Beginner',
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=60',
    totalDuration: '3h 15m',
    totalLessons: 2,
    enrolledCount: 310,
    modules: [
      {
        _id: 'm1_ui',
        title: 'Module 1: Design Fundamentals',
        lessons: [
          { _id: 'l1_ui', title: '1. Color Theory and WCAG Standards', duration: '11:20', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isFreePreview: true, notes: 'Accessible brand palettes for dark and light interfaces.' },
          { _id: 'l2_ui', title: '2. Auto-Layout and Responsive Constraints', duration: '16:05', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', isFreePreview: true, notes: 'Building fluid components.' }
        ]
      }
    ]
  }
];

class ApiClient {
  constructor() {
    this.token = null;
    this.baseUrl = '/api';
  }

  setAuthToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();
      return data;
    } catch (err) {
      console.warn(`[API] Network request to ${endpoint} failed (${err.message}). Using fallback handler.`);
      return this.handleFallback(endpoint, options);
    }
  }

  handleFallback(endpoint, options) {
    // In-memory mock response dispatcher
    if (endpoint === '/auth/login') {
      const body = JSON.parse(options.body || '{}');
      const isAdmin = body.email && body.email.includes('admin');
      const mockUser = {
        id: isAdmin ? 'admin_123' : 'student_123',
        name: isAdmin ? 'Platform Administrator' : 'Demo Student',
        email: body.email,
        role: isAdmin ? 'admin' : 'student',
        isVerified: true,
        enrolledCourses: ['seed_course_1']
      };
      return { success: true, token: 'mock_jwt_token_learnpulse', user: mockUser };
    }

    if (endpoint === '/auth/register') {
      const body = JSON.parse(options.body || '{}');
      const mockUser = {
        id: 'new_student_' + Date.now(),
        name: body.name || 'New Learner',
        email: body.email,
        role: 'student',
        isVerified: false,
        enrolledCourses: []
      };
      return { success: true, token: 'mock_jwt_token_new', user: mockUser, message: 'Verification code sent to email.' };
    }

    if (endpoint === '/auth/me') {
      return {
        success: true,
        user: {
          id: 'student_123',
          name: 'Demo Student',
          email: 'student@example.com',
          role: 'student',
          isVerified: true,
          enrolledCourses: ['seed_course_1']
        }
      };
    }

    if (endpoint.startsWith('/courses/categories')) {
      return {
        success: true,
        categories: ['Web Development', 'Data Science', 'Mobile Development', 'UI/UX Design', 'Cloud & DevOps']
      };
    }

    if (endpoint.startsWith('/courses/')) {
      const id = endpoint.split('/')[2];
      const course = MOCK_COURSES.find(c => c._id === id) || MOCK_COURSES[0];
      return { success: true, course };
    }

    if (endpoint.startsWith('/courses')) {
      return {
        success: true,
        courses: MOCK_COURSES,
        total: MOCK_COURSES.length,
        totalPages: 1
      };
    }

    if (endpoint === '/learning/my-courses') {
      return {
        success: true,
        courses: [
          {
            ...MOCK_COURSES[0],
            progress: {
              progressPercentage: 40,
              completedLessonsCount: 2,
              isCompleted: false,
              lastAccessedLesson: 'l2'
            }
          }
        ]
      };
    }

    if (endpoint.startsWith('/learning/course/')) {
      const courseId = endpoint.split('/')[3];
      const course = MOCK_COURSES.find(c => c._id === courseId) || MOCK_COURSES[0];
      return {
        success: true,
        course,
        progress: {
          completedLessons: ['l1', 'l2'],
          progressPercentage: 35,
          isCompleted: false,
          lastAccessedLesson: 'l2'
        }
      };
    }

    if (endpoint.startsWith('/admin/stats')) {
      return {
        success: true,
        stats: {
          totalCourses: MOCK_COURSES.length,
          totalStudents: 1420,
          totalEnrollments: 2180,
          totalRevenue: 348900,
          recentEnrollments: [
            { _id: 'e1', user: { name: 'Ananya Roy', email: 'ananya@example.com' }, course: { title: 'Full Stack Web Dev' }, amount: 999, createdAt: new Date() },
            { _id: 'e2', user: { name: 'Kunal Patel', email: 'kunal@example.com' }, course: { title: 'Python for Data Science' }, amount: 1499, createdAt: new Date() }
          ]
        }
      };
    }

    return { success: true, message: 'Simulated response' };
  }

  // Auth Methods
  login(credentials) { return this.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }); }
  register(userData) { return this.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }); }
  getProfile() { return this.request('/auth/me'); }
  verifyEmail(token) { return this.request('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) }); }
  forgotPassword(email) { return this.request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }); }
  resetPassword(data) { return this.request('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }); }

  // Course Catalog
  getCourses(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/courses${query ? `?${query}` : ''}`);
  }
  getCategories() { return this.request('/courses/categories'); }
  getCourseById(id) { return this.request(`/courses/${id}`); }

  // Payments & Enrollment
  createOrder(courseId) { return this.request('/payments/create-order', { method: 'POST', body: JSON.stringify({ courseId }) }); }
  verifyPayment(paymentData) { return this.request('/payments/verify-payment', { method: 'POST', body: JSON.stringify(paymentData) }); }
  freeEnroll(courseId) { return this.request('/payments/free-enroll', { method: 'POST', body: JSON.stringify({ courseId }) }); }

  // Student Learning
  getMyCourses() { return this.request('/learning/my-courses'); }
  getCourseClassroom(courseId) { return this.request(`/learning/course/${courseId}`); }
  toggleLessonCompletion(courseId, lessonId) {
    return this.request(`/learning/course/${courseId}/toggle-lesson`, {
      method: 'POST',
      body: JSON.stringify({ lessonId })
    });
  }

  // Admin Portal
  getAdminStats() { return this.request('/admin/stats'); }
  getAdminCourses() { return this.request('/admin/courses'); }
  createCourse(courseData) { return this.request('/admin/courses', { method: 'POST', body: JSON.stringify(courseData) }); }
  updateCourse(id, courseData) { return this.request(`/admin/courses/${id}`, { method: 'PUT', body: JSON.stringify(courseData) }); }
  deleteCourse(id) { return this.request(`/admin/courses/${id}`, { method: 'DELETE' }); }
  getAdminUsers() { return this.request('/admin/users'); }
  getAdminEnrollments() { return this.request('/admin/enrollments'); }
}

export const api = new ApiClient();
