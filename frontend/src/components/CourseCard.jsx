import React from 'react';

export const CourseCard = ({ course, onSelect, isEnrolled }) => {
  const getLevelBadgeClass = (lvl) => {
    if (lvl === 'Beginner') return 'badge-green';
    if (lvl === 'Intermediate') return 'badge-blue';
    return 'badge-amber';
  };

  return (
    <div 
      className="card" 
      onClick={() => onSelect(course._id)}
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer'
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', backgroundColor: '#0f172a' }}>
        <img 
          src={course.thumbnail} 
          alt={course.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
          loading="lazy"
        />
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
          <span className={`badge ${getLevelBadgeClass(course.level)}`}>
            {course.level}
          </span>
          <span className="badge badge-purple" style={{ backgroundColor: 'rgba(0,0,0,0.65)', color: '#fff' }}>
            {course.category}
          </span>
        </div>
        {isEnrolled && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: '#10b981',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '700',
            padding: '3px 8px',
            borderRadius: '6px'
          }}>
            Enrolled ✓
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          marginBottom: '8px',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {course.title}
        </h3>

        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          marginBottom: '14px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flexGrow: 1
        }}>
          {course.shortDescription || course.description}
        </p>

        {/* Metadata info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--text-muted)',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)',
          marginBottom: '14px'
        }}>
          <span>⏱️ {course.totalDuration || '4h 30m'}</span>
          <span>📚 {course.totalLessons || 6} lessons</span>
          <span>👤 {course.instructor ? course.instructor.split(' ')[0] : 'Faculty'}</span>
        </div>

        {/* Price & Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {course.price === 0 ? (
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent-emerald)' }}>FREE</span>
            ) : (
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>₹{course.price}</span>
            )}
          </div>
          <button className="btn btn-outline btn-sm">
            {isEnrolled ? 'Open Class' : 'View Course'}
          </button>
        </div>
      </div>
    </div>
  );
};
