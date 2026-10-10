import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { VideoPlayer } from '../components/VideoPlayer';
import { ProgressBar } from '../components/ProgressBar';

export const CoursePlayerPage = ({ courseId, onNavigate }) => {
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [celebrationOpen, setCelebrationOpen] = useState(false);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const res = await api.getCourseClassroom(courseId);
        if (res.success && res.course) {
          setCourse(res.course);
          setProgress(res.progress);

          // Find initial active lesson
          const allLessons = [];
          (res.course.modules || []).forEach(m => (m.lessons || []).forEach(l => allLessons.push(l)));

          let target = allLessons[0];
          if (res.progress?.lastAccessedLesson) {
            const found = allLessons.find(l => l._id.toString() === res.progress.lastAccessedLesson.toString());
            if (found) target = found;
          }
          setActiveLesson(target);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClassroom();
  }, [courseId]);

  if (loading) {
    return <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>Opening classroom stream...</div>;
  }

  if (!course || !activeLesson) {
    return <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>Course classroom not available.</div>;
  }

  const allLessons = [];
  (course.modules || []).forEach(m => (m.lessons || []).forEach(l => allLessons.push(l)));
  const currentIndex = allLessons.findIndex(l => l._id === activeLesson._id);

  const isCurrentLessonCompleted = progress?.completedLessons?.includes(activeLesson._id.toString());

  const handleToggleComplete = async () => {
    try {
      const res = await api.toggleLessonCompletion(course._id, activeLesson._id);
      if (res.success) {
        setProgress(prev => ({
          ...prev,
          completedLessons: res.completedLessons,
          progressPercentage: res.progressPercentage,
          isCompleted: res.isCourseCompleted
        }));

        if (res.isCourseCompleted && !celebrationOpen) {
          setCelebrationOpen(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNextLesson = () => {
    if (currentIndex < allLessons.length - 1) {
      setActiveLesson(allLessons[currentIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (currentIndex > 0) {
      setActiveLesson(allLessons[currentIndex - 1]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 70px)' }}>
      
      {/* Top Banner Bar */}
      <div style={{
        padding: '12px 24px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="btn btn-secondary btn-sm"
          >
            ← Dashboard
          </button>
          <span style={{ fontSize: '15px', fontWeight: '700' }}>{course.title}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '160px' }}>
            <ProgressBar percentage={progress?.progressPercentage || 0} showLabel={false} height="6px" />
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-primary)' }}>
            {progress?.progressPercentage || 0}%
          </span>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-outline btn-sm"
          >
            {sidebarOpen ? 'Hide Curriculum' : 'Show Curriculum'}
          </button>
        </div>
      </div>

      {/* Main Classroom Workspace */}
      <div style={{ display: 'flex', flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        
        {/* Left: Video Player & Controls Stage */}
        <div style={{ flexGrow: 1, padding: '24px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            
            {/* Video Component */}
            <VideoPlayer
              src={activeLesson.videoUrl}
              title={activeLesson.title}
              onEnded={() => {
                if (!isCurrentLessonCompleted) handleToggleComplete();
              }}
            />

            {/* Lesson Title & Completion Action Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '20px',
              padding: '16px 20px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px'
            }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '6px' }}>Current Lesson</span>
                <h2 style={{ fontSize: '18px', fontWeight: '800' }}>{activeLesson.title}</h2>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>⏱ Duration: {activeLesson.duration}</span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handlePrevLesson}
                  disabled={currentIndex === 0}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
                >
                  ⏮ Previous
                </button>

                <button
                  onClick={handleToggleComplete}
                  className={`btn btn-sm ${isCurrentLessonCompleted ? 'btn-success' : 'btn-primary'}`}
                >
                  {isCurrentLessonCompleted ? 'Completed ✓' : 'Mark as Completed'}
                </button>

                <button
                  onClick={handleNextLesson}
                  disabled={currentIndex === allLessons.length - 1}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: currentIndex === allLessons.length - 1 ? 0.5 : 1 }}
                >
                  Next ⏭
                </button>
              </div>
            </div>

            {/* Lesson Notes & Handouts Tab */}
            <div className="card" style={{ marginTop: '24px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '10px' }}>Lesson Notes & Summary</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                {activeLesson.notes || 'Follow along with the code demonstration in the video above. Make sure your local development server is running and your MongoDB connection string is properly configured in backend/.env.'}
              </p>
            </div>

          </div>
        </div>

        {/* Right Sidebar: Curriculum Navigation */}
        {sidebarOpen && (
          <aside style={{
            width: '360px',
            backgroundColor: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border-color)',
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Course Syllabus</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(course.modules || []).map((mod, modIdx) => (
                <div key={mod._id || modIdx}>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {mod.title}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(mod.lessons || []).map((lesson) => {
                      const isActive = activeLesson._id === lesson._id;
                      const isCompleted = progress?.completedLessons?.includes(lesson._id.toString());

                      return (
                        <div
                          key={lesson._id}
                          onClick={() => setActiveLesson(lesson)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            backgroundColor: isActive ? 'rgba(37,99,235,0.12)' : 'var(--bg-surface-hover)',
                            border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: isCompleted ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                              {isCompleted ? '✓' : '○'}
                            </span>
                            <span style={{ fontWeight: isActive ? '700' : '500', color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                              {lesson.title}
                            </span>
                          </div>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lesson.duration}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

      </div>

      {/* Completion Celebration Modal */}
      {celebrationOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="card animate-fade-in" style={{ maxWidth: '480px', padding: '32px', textAlign: 'center' }}>
            <span style={{ fontSize: '50px', display: 'block', marginBottom: '16px' }}>🎓</span>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Congratulations!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px' }}>
              You have completed 100% of <strong>{course.title}</strong>! You can review lessons anytime.
            </p>
            <button onClick={() => setCelebrationOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
              Continue Learning
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
