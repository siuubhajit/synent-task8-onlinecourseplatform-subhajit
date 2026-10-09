import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CourseDetailsPage = ({ courseId, onNavigate, onOpenAuth, onEnrollSuccess }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  const { isAuthenticated, isEnrolledInCourse, user, refreshUser } = useAuth();
  const isEnrolled = isEnrolledInCourse(courseId);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.getCourseById(courseId);
        if (res.success && res.course) {
          setCourse(res.course);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) {
    return <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>Loading course syllabus...</div>;
  }

  if (!course) {
    return <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>Course not found.</div>;
  }

  const handleEnrollClick = async () => {
    if (!isAuthenticated) {
      onOpenAuth('login');
      return;
    }

    if (isEnrolled) {
      onNavigate('classroom', { courseId: course._id });
      return;
    }

    setEnrolling(true);

    try {
      // Step 1: Create Order
      const orderRes = await api.createOrder(course._id);

      if (orderRes.free) {
        // Free enrollment completed directly
        await refreshUser();
        onEnrollSuccess('Enrolled in free course successfully!');
        onNavigate('classroom', { courseId: course._id });
        return;
      }

      // Step 2: Paid Course - Razorpay Integration
      const options = {
        key: orderRes.keyId,
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: 'LearnPulse Academy',
        description: course.title,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100',
        order_id: orderRes.orderId,
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: { color: '#2563eb' },
        handler: async function (response) {
          // Verification
          const verifyRes = await api.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            courseId: course._id
          });

          if (verifyRes.success) {
            await refreshUser();
            onEnrollSuccess('Payment verified! Welcome to the course.');
            onNavigate('classroom', { courseId: course._id });
          } else {
            alert('Verification failed: ' + verifyRes.message);
          }
        }
      };

      // Check if Razorpay script is on window
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback test simulation dialog for offline sandbox
        const simulatePay = confirm(`[Razorpay Test Mode]

Course: ${course.title}
Amount: ₹${course.price}
Order ID: ${orderRes.orderId}

Click OK to simulate successful test payment, or Cancel to abort.`);
        if (simulatePay) {
          const verifyRes = await api.verifyPayment({
            razorpay_order_id: orderRes.orderId,
            razorpay_payment_id: 'pay_test_' + Date.now(),
            razorpay_signature: 'SIMULATED_TEST_SIGNATURE',
            courseId: course._id
          });

          if (verifyRes.success) {
            await refreshUser();
            onEnrollSuccess('Test payment verified! Welcome to the course.');
            onNavigate('classroom', { courseId: course._id });
          }
        }
      }
    } catch (err) {
      alert('Enrollment error: ' + err.message);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      
      {/* Back link */}
      <button onClick={() => onNavigate('catalog')} style={{ color: 'var(--accent-primary)', fontSize: '14px', marginBottom: '20px' }}>
        ← Back to Course Catalog
      </button>

      {/* Main Grid: Details on Left, Sticky Card on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '40px', alignItems: 'start' }}>
        
        {/* Left Column */}
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <span className="badge badge-blue">{course.category}</span>
            <span className="badge badge-green">{course.level}</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.25', marginBottom: '14px' }}>
            {course.title}
          </h1>

          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
            {course.description}
          </p>

          <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '36px' }}>
            <span>Instructor: <strong>{course.instructor}</strong></span>
            <span>Duration: <strong>{course.totalDuration}</strong></span>
            <span>Enrolled: <strong>{course.enrolledCount} learners</strong></span>
          </div>

          {/* Curriculum Accordion */}
          <div style={{ marginTop: '30px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px' }}>Course Syllabus</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(course.modules || []).map((mod, modIdx) => (
                <div key={mod._id || modIdx} className="card" style={{ padding: '18px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>{mod.title}</h3>
                  {mod.description && (
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{mod.description}</p>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(mod.lessons || []).map((lesson, lIdx) => (
                      <div 
                        key={lesson._id || lIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-surface-hover)',
                          fontSize: '14px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span>▶</span>
                          <span style={{ fontWeight: '500' }}>{lesson.title}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lesson.duration}</span>
                          {lesson.isFreePreview && (
                            <button
                              onClick={() => setPreviewVideo(lesson.videoUrl)}
                              style={{
                                fontSize: '11px',
                                fontWeight: '700',
                                color: 'var(--accent-primary)',
                                backgroundColor: 'rgba(37,99,235,0.1)',
                                padding: '3px 8px',
                                borderRadius: '4px'
                              }}
                            >
                              Free Preview 👁
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Card */}
        <div className="card" style={{ position: 'sticky', top: '90px', padding: '24px' }}>
          <img 
            src={course.thumbnail} 
            alt={course.title}
            style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '18px' }}
          />

          <div style={{ marginBottom: '18px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block' }}>One-time investment</span>
            <div style={{ fontSize: '32px', fontWeight: '800' }}>
              {course.price === 0 ? 'FREE' : `₹${course.price}`}
            </div>
          </div>

          <button
            onClick={handleEnrollClick}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px', marginBottom: '16px' }}
            disabled={enrolling}
          >
            {isEnrolled ? 'Open Classroom →' : course.price === 0 ? 'Enroll for Free' : `Enroll Now (₹${course.price})`}
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <div>✓ Full lifetime access to all lessons</div>
            <div>✓ Interactive lesson completion tracking</div>
            <div>✓ Verified certificate upon 100% completion</div>
            <div>✓ Direct access on desktop and mobile</div>
            <div>✓ Secure Razorpay Test Mode checkout</div>
          </div>
        </div>

      </div>

      {/* Free Preview Video Modal */}
      {previewVideo && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '720px', padding: '16px', position: 'relative' }}>
            <button 
              onClick={() => setPreviewVideo(null)} 
              style={{ position: 'absolute', top: '10px', right: '14px', fontSize: '18px', color: 'var(--text-muted)' }}
            >
              ✕
            </button>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>Lesson Free Preview</h3>
            <video 
              src={previewVideo} 
              controls 
              autoPlay 
              style={{ width: '100%', borderRadius: '8px', maxHeight: '420px', backgroundColor: '#000' }}
            />
          </div>
        </div>
      )}

    </div>
  );
};
