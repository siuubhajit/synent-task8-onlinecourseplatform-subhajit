import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ProgressBar } from '../components/ProgressBar';

export const DashboardPage = ({ onNavigate }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'in_progress' | 'completed'

  const { user } = useAuth();

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const res = await api.getMyCourses();
        if (res.success) {
          setCourses(res.courses || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolled();
  }, []);

  const inProgressCourses = courses.filter(c => !c.progress?.isCompleted);
  const completedCourses = courses.filter(c => c.progress?.isCompleted);

  const displayedCourses = 
    activeTab === 'in_progress' ? inProgressCourses :
    activeTab === 'completed' ? completedCourses : courses;

  const averageProgress = courses.length > 0
    ? Math.round(courses.reduce((acc, c) => acc + (c.progress?.progressPercentage || 0), 0) / courses.length)
    : 0;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      
      {/* Header Banner */}
      <div style={{
        padding: '30px',
        borderRadius: '16px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-blue" style={{ marginBottom: '8px' }}>Student Dashboard</span>
            <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Welcome back, {user?.name || 'Learner'}! 👋</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Track your enrolled programs, continue active lessons, and earn certificates.
            </p>
          </div>

          <button 
            onClick={() => onNavigate('catalog')}
            className="btn btn-primary btn-sm"
          >
            + Enroll in More Courses
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Enrolled Programs</span>
            <p style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0 0 0' }}>{courses.length}</p>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>In Progress</span>
            <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-primary)', margin: '4px 0 0 0' }}>{inProgressCourses.length}</p>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Completed</span>
            <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-emerald)', margin: '4px 0 0 0' }}>{completedCourses.length}</p>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Average Progress</span>
            <p style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0 0 0' }}>{averageProgress}%</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('all')}
          className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All Programs ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('in_progress')}
          className={`btn btn-sm ${activeTab === 'in_progress' ? 'btn-primary' : 'btn-secondary'}`}
        >
          In Progress ({inProgressCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`btn btn-sm ${activeTab === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Completed ({completedCourses.length})
        </button>
      </div>

      {/* Course List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>Loading your dashboard...</div>
      ) : displayedCourses.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No courses in this section</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Ready to learn something new today?</p>
          <button onClick={() => onNavigate('catalog')} className="btn btn-primary">
            Explore Course Catalog
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {displayedCourses.map(course => (
            <div key={course._id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <img 
                src={course.thumbnail} 
                alt={course.title}
                style={{ width: '100%', height: '160px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <span className="badge badge-purple" style={{ width: 'fit-content', marginBottom: '8px' }}>
                  {course.category}
                </span>

                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
                  {course.title}
                </h3>

                <div style={{ marginBottom: '18px', marginTop: 'auto' }}>
                  <ProgressBar percentage={course.progress?.progressPercentage || 0} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {course.progress?.completedLessonsCount || 0}/{course.totalLessons || 6} Lessons Done
                  </span>

                  <button
                    onClick={() => onNavigate('classroom', { courseId: course._id })}
                    className="btn btn-primary btn-sm"
                  >
                    {course.progress?.isCompleted ? 'Review Class 🎓' : 'Continue →'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
