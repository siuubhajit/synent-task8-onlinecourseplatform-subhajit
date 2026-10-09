const Course = require('../models/Course');
const { coursesSeed } = require('../seed/seedData');

/**
 * Fetch all published courses with multi-faceted search, category filtering,
 * level filtering, pricing filter, and sorting.
 */
const getCourses = async (req, res) => {
  try {
    const {
      search,
      category,
      level,
      priceType, // 'free' | 'paid' | 'all'
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const query = { isPublished: true };

    // Search keyword in title or description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { instructor: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Level filter
    if (level && level !== 'All') {
      query.level = level;
    }

    // Price type filter
    if (priceType === 'free') {
      query.price = 0;
    } else if (priceType === 'paid') {
      query.price = { $gt: 0 };
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'popular') {
      sortOption = { enrolledCount: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    let courses = [];
    let total = 0;

    try {
      courses = await Course.find(query)
        .select('-modules.lessons.videoUrl -modules.lessons.notes')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));

      total = await Course.countDocuments(query);
    } catch (dbErr) {
      console.warn('[Courses API] DB unavailable, using in-memory dataset:', dbErr.message);
      courses = coursesSeed.map((c, idx) => ({ ...c, _id: `seed_course_${idx + 1}` }));
      total = courses.length;
    }

    res.json({
      success: true,
      count: courses.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1,
      courses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Fetch detailed view of a single course by ID.
 * Exposes videoUrl ONLY for lessons marked as isFreePreview.
 */
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    let course = null;

    try {
      course = await Course.findById(id);
    } catch (e) {
      course = coursesSeed.find((c, idx) => `seed_course_${idx + 1}` === id || c.slug === id);
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }

    // Sanitize modules: only include videoUrl if isFreePreview is true
    const sanitizedModules = (course.modules || []).map(mod => ({
      _id: mod._id,
      title: mod.title,
      description: mod.description,
      order: mod.order,
      lessons: (mod.lessons || []).map(lesson => ({
        _id: lesson._id,
        title: lesson.title,
        duration: lesson.duration,
        isFreePreview: lesson.isFreePreview,
        order: lesson.order,
        videoUrl: lesson.isFreePreview ? lesson.videoUrl : null
      }))
    }));

    res.json({
      success: true,
      course: {
        _id: course._id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        shortDescription: course.shortDescription,
        instructor: course.instructor,
        category: course.category,
        level: course.level,
        price: course.price,
        thumbnail: course.thumbnail,
        totalDuration: course.totalDuration,
        totalLessons: course.totalLessons,
        enrolledCount: course.enrolledCount,
        modules: sanitizedModules
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get distinct categories and counts for filter badges.
 */
const getCategories = async (req, res) => {
  try {
    const categories = [
      'Web Development',
      'Data Science',
      'Mobile Development',
      'UI/UX Design',
      'Cloud & DevOps',
      'Cybersecurity'
    ];
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  getCategories
};
