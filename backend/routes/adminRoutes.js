const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAdminCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getUsers,
  getEnrollments
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes here require valid JWT and admin role
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/courses', getAdminCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);
router.get('/users', getUsers);
router.get('/enrollments', getEnrollments);

module.exports = router;
