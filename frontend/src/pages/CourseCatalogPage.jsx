import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CourseCard } from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';

export const CourseCatalogPage = ({ onNavigate, initialFilters = {} }) => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || 'All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [priceType, setPriceType] = useState(initialFilters.priceType || 'all');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  const { isEnrolledInCourse } = useAuth();

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const catRes = await api.getCategories();
        if (catRes.success) setCategories(['All', ...catRes.categories]);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (selectedLevel !== 'All') params.level = selectedLevel;
        if (priceType !== 'all') params.priceType = priceType;
        if (sort) params.sort = sort;

        const res = await api.getCourses(params);
        if (res.success) {
          setCourses(res.courses || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [search, selectedCategory, selectedLevel, priceType, sort]);

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Course Catalog</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          Discover hands-on courses taught by veteran industry professionals.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Search Bar */}
        <div>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Search course title, keywords, or instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Pills / Selects */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Categories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: selectedCategory === cat ? '700' : '500',
                  backgroundColor: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--bg-surface-hover)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.15s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dropdown Filters */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="form-input"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={priceType}
              onChange={(e) => setPriceType(e.target.value)}
              className="form-input"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
            >
              <option value="all">All Prices</option>
              <option value="free">Free Courses</option>
              <option value="paid">Paid Courses</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="form-input"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid of Courses */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading courses...
        </div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>No courses match your criteria</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Try clearing filters or search terms.</p>
          <button 
            onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedLevel('All'); setPriceType('all'); }}
            className="btn btn-secondary btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {courses.map(course => (
            <CourseCard
              key={course._id}
              course={course}
              isEnrolled={isEnrolledInCourse(course._id)}
              onSelect={(id) => onNavigate('course-details', { courseId: id })}
            />
          ))}
        </div>
      )}

    </div>
  );
};
