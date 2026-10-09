const express = require('express');
const router = express.Router();
const {
  getMyCourses,
  getCourseClassroom,
  toggleLessonCompletion
} = require('../controllers/learningController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-courses', protect, getMyCourses);
router.get('/course/:courseId', protect, getCourseClassroom);
router.post('/course/:courseId/toggle-lesson', protect, toggleLessonCompletion);

module.exports = router;
