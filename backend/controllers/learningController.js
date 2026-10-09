const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');

/**
 * Fetch all enrolled courses for the logged-in student along with current progress %.
 */
const getMyCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'enrolledCourses',
      select: 'title thumbnail category level totalDuration totalLessons instructor'
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const enrolledList = user.enrolledCourses || [];

    // Fetch progress records for each course
    const progressRecords = await Progress.find({
      user: req.user._id,
      course: { $in: enrolledList.map(c => c._id) }
    });

    const progressMap = {};
    progressRecords.forEach(p => {
      progressMap[p.course.toString()] = {
        progressPercentage: p.progressPercentage,
        completedLessonsCount: p.completedLessons.length,
        isCompleted: p.isCompleted,
        lastAccessedLesson: p.lastAccessedLesson
      };
    });

    const results = enrolledList.map(course => {
      const prog = progressMap[course._id.toString()] || {
        progressPercentage: 0,
        completedLessonsCount: 0,
        isCompleted: false,
        lastAccessedLesson: ''
      };

      return {
        _id: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        category: course.category,
        level: course.level,
        totalDuration: course.totalDuration,
        totalLessons: course.totalLessons,
        instructor: course.instructor,
        progress: prog
      };
    });

    res.json({
      success: true,
      count: results.length,
      courses: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Classroom player view: unlocks all video links, notes, and curriculum.
 * Verified to only permit enrolled students or platform administrators.
 */
const getCourseClassroom = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const isEnrolled = req.user.enrolledCourses.some(
      id => id.toString() === courseId.toString()
    );
    const isAdmin = req.user.role === 'admin';

    if (!isEnrolled && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Please enroll in this course to access the classroom.'
      });
    }

    // Get or initialize progress document
    let progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      progress = await Progress.create({
        user: userId,
        course: courseId,
        completedLessons: [],
        progressPercentage: 0
      });
    }

    res.json({
      success: true,
      course,
      progress: {
        completedLessons: progress.completedLessons,
        progressPercentage: progress.progressPercentage,
        isCompleted: progress.isCompleted,
        lastAccessedLesson: progress.lastAccessedLesson
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Toggle lesson completion state and recalculate overall course progress percentage.
 */
const toggleLessonCompletion = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId } = req.body;
    const userId = req.user._id;

    if (!lessonId) {
      return res.status(400).json({ success: false, message: 'lessonId is required.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    let progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      progress = new Progress({
        user: userId,
        course: courseId,
        completedLessons: []
      });
    }

    const lessonIndex = progress.completedLessons.indexOf(lessonId.toString());
    let isCompletedNow = false;

    if (lessonIndex > -1) {
      // Unmark completed
      progress.completedLessons.splice(lessonIndex, 1);
      isCompletedNow = false;
    } else {
      // Mark completed
      progress.completedLessons.push(lessonId.toString());
      isCompletedNow = true;
    }

    // Recalculate percentage based on course totalLessons
    const totalLessons = course.totalLessons || 1;
    const completedCount = progress.completedLessons.length;
    const calculatedPercentage = Math.min(
      100,
      Math.round((completedCount / totalLessons) * 100)
    );

    progress.progressPercentage = calculatedPercentage;
    progress.lastAccessedLesson = lessonId.toString();

    if (calculatedPercentage >= 100 && !progress.isCompleted) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
    } else if (calculatedPercentage < 100) {
      progress.isCompleted = false;
      progress.completedAt = undefined;
    }

    await progress.save();

    res.json({
      success: true,
      lessonId,
      isLessonCompleted: isCompletedNow,
      progressPercentage: progress.progressPercentage,
      completedLessons: progress.completedLessons,
      isCourseCompleted: progress.isCompleted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyCourses,
  getCourseClassroom,
  toggleLessonCompletion
};
