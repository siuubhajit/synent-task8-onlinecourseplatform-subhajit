import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CourseCard } from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';

export const HomePage = ({ onNavigate }) => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isEnrolledInCourse } = useAuth();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await api.getCourses({ limit: 3 });
        if (res.success) {
          setFeaturedCourses(res.courses || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '70px 0 60px 0',
        background: 'radial-gradient(ellipse at top, rgba(37,99,235,0.12), transparent 70%)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', backgroundColor: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
            <span style={{ fontSize: '14px' }}>🚀</span>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Interactive Full-Stack Learning System</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: '800',
            letterSpacing: '-1.5px',
            lineHeight: '1.15',
            marginBottom: '20px'
          }}>
            Accelerate your career with <span style={{ color: 'var(--accent-primary)' }}>expert-led engineering</span> courses.
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            marginBottom: '32px'
          }}>
            Join over 15,000 students learning React, Express, MongoDB, UI/UX systems, and cloud architecture. Real video lessons, real progress tracking, and Razorpay-integrated enrollment.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onNavigate('catalog')}
              className="btn btn-primary"
              style={{ padding: '14px 28px', fontSize: '16px' }}
            >
              Browse All Courses →
            </button>
            <button 
              onClick={() => onNavigate('catalog', { priceType: 'free' })}
              className="btn btn-secondary"
              style={{ padding: '14px 28px', fontSize: '16px' }}
            >
              View Free Courses
            </button>
          </div>

          {/* Social Proof Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginTop: '50px',
            padding: '24px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-primary)', margin: 0 }}>15,000+</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Active Students</p>
            </div>
            <div>
              <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-emerald)', margin: 0 }}>100%</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Hands-on Curriculum</p>
            </div>
            <div>
              <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-amber)', margin: 0 }}>4.9/5</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Average Course Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section style={{ padding: '50px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <span className="badge badge-blue" style={{ marginBottom: '8px' }}>Top Picks</span>
              <h2 style={{ fontSize: '28px', fontWeight: '800' }}>Featured Programs</h2>
            </div>
            <button 
              onClick={() => onNavigate('catalog')}
              className="btn btn-outline btn-sm"
            >
              See Catalog (All) →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {featuredCourses.map(course => (
              <CourseCard
                key={course._id}
                course={course}
                isEnrolled={isEnrolledInCourse(course._id)}
                onSelect={(id) => onNavigate('course-details', { courseId: id })}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
