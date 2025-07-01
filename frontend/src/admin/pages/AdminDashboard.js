// src/pages/AdminDashboard.jsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate }             from 'react-router-dom';
import api                         from '../../api/axios';      // ← Axios instance
import Sidebar                     from '../components/Sidebar';
import DashboardCharts             from '../components/DashboardCharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
  /* ───────── state ───────── */
  const [enrollments, setEnrollments]   = useState([]);
  const [searchTerm,  setSearchTerm]    = useState('');
  const [filteredCourse, setFilteredCourse] = useState('All');
  const [courses, setCourses]           = useState([]);
  const [sortKey, setSortKey]           = useState('submittedAt');
  const [sortOrder, setSortOrder]       = useState('desc');
  const [showFullMetrics, setShowFullMetrics] = useState(false);
  const [sidebarMini, setSidebarMini]   = useState(false);
  const navigate = useNavigate();

  /* ───────── route‑guard & data fetch ───────── */
  const fetchEnrollments = useCallback(async () => {
    try {
      const { data } = await api.get('/enrollments');
      // 🔄 map snake_case → camelCase for React
      const mapped = data.map(e => ({
        id:           e.id,
        firstName:    e.first_name,
        lastName:     e.last_name,
        email:        e.email,
        phone:        e.phone,
        courseName:   e.course_name,
        submittedAt:  e.submitted_at,
      }));
      setEnrollments(mapped);
      setCourses([...new Set(mapped.map(i => i.courseName))]);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin-login');
      } else {
        console.error('Fetching enrollments failed:', err);
      }
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return;
    }
    // attach token once
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    fetchEnrollments();
  }, [fetchEnrollments, navigate]);

  /* ───────── handlers ───────── */
  const handleDelete = async id => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await api.delete(`/enrollments/${id}`);
      // optimistic update
      setEnrollments(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert(err.response?.data?.detail || 'Delete failed');
    }
  };

  const handleSort = key => {
    const order = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(order);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  /* ───────── derived data ───────── */
  const sorted = [...enrollments].sort((a, b) => {
    const aVal = a[sortKey]?.toString().toLowerCase() || '';
    const bVal = b[sortKey]?.toString().toLowerCase() || '';
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ?  1 : -1;
    return 0;
  });

  const filtered = sorted.filter(e => {
    const matchesCourse =
      filteredCourse === 'All' || e.courseName === filteredCourse;
    const matchesSearch =
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  /* ───────── JSX ───────── */
  return (
    <>
      <Sidebar onMinimizeChange={setSidebarMini} />

      <div className={`admin-container ${sidebarMini ? 'sidebar-mini' : ''}`}>
        {/* ─── Header ─── */}
        <div className="admin-header">
          <img src="/assets/logo.png" alt="Learnsy logo" className="admin-logo" />
          <div className="admin-header-right">
            <p className="welcome-msg">
              Welcome back, Admin! Here&#39;s the latest enrollment data.
            </p>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>

        <h1>Admin Dashboard</h1>
        <h3>Total Enrollments: {filtered.length}</h3>

        {/* ─── Filters ─── */}
        <div className="controls">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          <select
            value={filteredCourse}
            onChange={e => setFilteredCourse(e.target.value)}
          >
            <option value="All">All Courses</option>
            {courses.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* ─── Charts ─── */}
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={() => setShowFullMetrics(p => !p)}
            className="metrics-btn"
          >
            {showFullMetrics ? 'Hide Full Metrics' : 'View Full Metrics'}
          </button>
        </div>

        <DashboardCharts enrollments={filtered} showAll={showFullMetrics} />

        {/* ─── Table ─── */}
        <table className="enrollment-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('firstName')}>
                Name {sortKey === 'firstName' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('email')}>
                Email {sortKey === 'email' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th>Phone</th>
              <th onClick={() => handleSort('courseName')}>
                Course {sortKey === 'courseName' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('submittedAt')}>
                Date {sortKey === 'submittedAt' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(e => (
              <tr key={e.id}>
                <td>{e.firstName} {e.lastName}</td>
                <td>{e.email}</td>
                <td>{e.phone}</td>
                <td>{e.courseName}</td>
                <td>{new Date(e.submittedAt).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="delete-button"
                    title="Delete enrollment"
                  >🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminDashboard;