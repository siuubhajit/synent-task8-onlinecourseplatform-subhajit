const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');

/**
 * Platform metrics: overall revenue, total enrollments, active courses, student count.
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalEnrollments = await Enrollment.countDocuments({ paymentStatus: 'completed' });

    // Aggregate total revenue from completed enrollments
    const revenueAggregate = await Enrollment.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAggregate.length > 0 ? revenueAggregate[0].totalRevenue : 0;

    // Fetch recent 5 enrollments with user and course info
    const recentEnrollments = await Enrollment.find({ paymentStatus: 'completed' })
      .populate('user', 'name email')
      .populate('course', 'title price')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalCourses,
        totalStudents,
        totalEnrollments,
        totalRevenue,
        recentEnrollments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Fetch all courses for admin view (including unpublished).
 */
const getAdminCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a new course with nested modules and lessons.
 */
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      instructor,
      category,
      level,
      price,
      thumbnail,
      modules = []
    } = req.body;

    if (!title || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and price are required.'
      });
    }

    const course = await Course.create({
      title,
      description,
      shortDescription,
      instructor: instructor || req.user.name,
      category: category || 'Web Development',
      level: level || 'Beginner',
      price: Number(price),
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
      modules,
      isPublished: true
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      course
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update an existing course details or its syllabus modules.
 */
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    Object.assign(course, updates);
    await course.save();

    res.json({
      success: true,
      message: 'Course updated successfully.',
      course
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete a course and clean up references.
 */
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    res.json({
      success: true,
      message: 'Course deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * List all registered platform users.
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email role isVerified enrolledCourses createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * List all enrollment transactions with student and course details.
 */
const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('user', 'name email')
      .populate('course', 'title price')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAdminCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getUsers,
  getEnrollments
};
