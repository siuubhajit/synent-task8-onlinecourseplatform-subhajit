const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  duration: {
    type: String,
    default: '10:00'
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL or stream path is required']
  },
  notes: {
    type: String,
    default: ''
  },
  isFreePreview: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 1
  }
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 1
  },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Course description is required']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  instructor: {
    type: String,
    default: 'LearnPulse Engineering Faculty'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Web Development',
      'Data Science',
      'Mobile Development',
      'UI/UX Design',
      'Cloud & DevOps',
      'Cybersecurity'
    ],
    default: 'Web Development'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative']
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'
  },
  modules: [moduleSchema],
  totalDuration: {
    type: String,
    default: '4h 30m'
  },
  totalLessons: {
    type: Number,
    default: 0
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

courseSchema.pre('save', function (next) {
  if (this.modules && Array.isArray(this.modules)) {
    this.totalLessons = this.modules.reduce((acc, mod) => acc + (mod.lessons ? mod.lessons.length : 0), 0);
  }
  if (this.title && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
