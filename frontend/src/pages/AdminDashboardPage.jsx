import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export const AdminDashboardPage = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'courses' | 'users' | 'enrollments'
  const [loading, setLoading] = useState(true);

  // New Course Modal State
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Web Development');
  const [newLevel, setNewLevel] = useState('Beginner');
  const [newPrice, setNewPrice] = useState(999);
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [statsRes, coursesRes, usersRes, enrollRes] = await Promise.all([
          api.getAdminStats(),
          api.getAdminCourses(),
          api.getAdminUsers(),
          api.getAdminEnrollments()
        ]);

        if (statsRes.success) setStats(statsRes.stats);
        if (coursesRes.success) setCourses(coursesRes.courses || []);
        if (usersRes.success) setUsers(usersRes.users || []);
        if (enrollRes.success) setEnrollments(enrollRes.enrollments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newTitle,
        category: newCategory,
        level: newLevel,
        price: Number(newPrice),
        description: newDesc,
        shortDescription: newDesc.slice(0, 120),
        modules: [
          {
            title: 'Module 1: Getting Started',
            description: 'Core fundamental lessons',
            order: 1,
            lessons: [
              {
                title: '1. Course Introduction',
                duration: '10:00',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                notes: 'Welcome to the course.',
                isFreePreview: true,
                order: 1
              }
            ]
          }
        ]
      };

      const res = await api.createCourse(payload);
      if (res.success) {
        setCourses([res.course, ...courses]);
        setCourseModalOpen(false);
        setNewTitle('');
        setNewDesc('');
        alert('Course created successfully!');
      }
    } catch (e) {
      alert('Error creating course: ' + e.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await api.deleteCourse(id);
      if (res.success) {
        setCourses(courses.filter(c => c._id !== id));
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: '6px' }}>Administrator Panel</span>
          <h1 style={{ fontSize: '30px', fontWeight: '800' }}>Platform Control Center</h1>
        </div>

        <button onClick={() => setCourseModalOpen(true)} className="btn btn-primary">
          + Add New Course
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        {['overview', 'courses', 'users', 'enrollments'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: activeTab === tab ? '700' : '500',
              backgroundColor: activeTab === tab ? 'var(--bg-surface-hover)' : 'transparent',
              color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-secondary)'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading analytics...</div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW STATS */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div className="card" style={{ padding: '24px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Platform Revenue</span>
                  <p style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-emerald)', margin: '8px 0 0 0' }}>
                    ₹{stats?.totalRevenue?.toLocaleString() || 0}
                  </p>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Students</span>
                  <p style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-primary)', margin: '8px 0 0 0' }}>
                    {stats?.totalStudents || 0}
                  </p>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Active Courses</span>
                  <p style={{ fontSize: '32px', fontWeight: '800', margin: '8px 0 0 0' }}>
                    {stats?.totalCourses || 0}
                  </p>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Enrollments</span>
                  <p style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-purple)', margin: '8px 0 0 0' }}>
                    {stats?.totalEnrollments || 0}
                  </p>
                </div>
              </div>

              {/* Recent activity audit */}
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Recent Student Enrollments</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(stats?.recentEnrollments || []).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-hover)', fontSize: '14px' }}>
                      <div>
                        <strong>{item.user?.name || 'Student'}</strong> enrolled in <em>{item.course?.title || 'Course'}</em>
                      </div>
                      <div style={{ fontWeight: '700', color: 'var(--accent-emerald)' }}>
                        ₹{item.amount || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COURSES MANAGER */}
          {activeTab === 'courses' && (
            <div className="card" style={{ padding: '20px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Course</th>
                    <th style={{ padding: '12px' }}>Category</th>
                    <th style={{ padding: '12px' }}>Level</th>
                    <th style={{ padding: '12px' }}>Price</th>
                    <th style={{ padding: '12px' }}>Enrolled</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px', fontWeight: '600' }}>{course.title}</td>
                      <td style={{ padding: '12px' }}><span className="badge badge-blue">{course.category}</span></td>
                      <td style={{ padding: '12px' }}>{course.level}</td>
                      <td style={{ padding: '12px', fontWeight: '700' }}>{course.price === 0 ? 'FREE' : `₹${course.price}`}</td>
                      <td style={{ padding: '12px' }}>{course.enrolledCount || 0}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleDeleteCourse(course._id)}
                          style={{ color: 'var(--accent-danger)', fontWeight: '600', fontSize: '13px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: USERS DIRECTORY */}
          {activeTab === 'users' && (
            <div className="card" style={{ padding: '20px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Name</th>
                    <th style={{ padding: '12px' }}>Email</th>
                    <th style={{ padding: '12px' }}>Role</th>
                    <th style={{ padding: '12px' }}>Verified</th>
                    <th style={{ padding: '12px' }}>Courses</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px', fontWeight: '600' }}>{u.name}</td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${u.role === 'admin' ? 'badge-purple' : 'badge-blue'}`}>{u.role}</span>
                      </td>
                      <td style={{ padding: '12px' }}>{u.isVerified ? '✅ Yes' : '❌ No'}</td>
                      <td style={{ padding: '12px' }}>{u.enrolledCourses?.length || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: ENROLLMENTS LOG */}
          {activeTab === 'enrollments' && (
            <div className="card" style={{ padding: '20px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Learner</th>
                    <th style={{ padding: '12px' }}>Course</th>
                    <th style={{ padding: '12px' }}>Amount</th>
                    <th style={{ padding: '12px' }}>Method</th>
                    <th style={{ padding: '12px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map(en => (
                    <tr key={en._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px', fontWeight: '600' }}>{en.user?.name || 'Student'}</td>
                      <td style={{ padding: '12px' }}>{en.course?.title || 'Course'}</td>
                      <td style={{ padding: '12px', fontWeight: '700', color: 'var(--accent-emerald)' }}>₹{en.amount}</td>
                      <td style={{ padding: '12px' }}>{en.paymentMethod}</td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>{new Date(en.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Create Course Modal */}
      {courseModalOpen && (
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
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '28px', position: 'relative' }}>
            <button 
              onClick={() => setCourseModalOpen(false)} 
              style={{ position: 'absolute', top: '14px', right: '14px', fontSize: '18px', color: 'var(--text-muted)' }}
            >
              ✕
            </button>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>Add New Course</h2>

            <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)} 
                  required 
                  placeholder="e.g. Modern Next.js Architecture"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Category</label>
                  <select 
                    className="form-input" 
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value)}
                  >
                    <option>Web Development</option>
                    <option>Data Science</option>
                    <option>Mobile Development</option>
                    <option>UI/UX Design</option>
                    <option>Cloud & DevOps</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Level</label>
                  <select 
                    className="form-input" 
                    value={newLevel} 
                    onChange={e => setNewLevel(e.target.value)}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Price (INR, 0 for Free)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={newPrice} 
                  onChange={e => setNewPrice(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Description</label>
                <textarea 
                  className="form-input" 
                  rows="3" 
                  value={newDesc} 
                  onChange={e => setNewDesc(e.target.value)} 
                  required 
                  placeholder="Overview of what students will master..."
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                Publish Course
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
