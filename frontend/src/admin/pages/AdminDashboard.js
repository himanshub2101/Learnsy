import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import Sidebar from '../components/Sidebar';
import DashboardCharts from '../components/DashboardCharts';

const AdminDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourse, setFilteredCourse] = useState('All');
  const [courses, setCourses] = useState([]);
  const [sortKey, setSortKey] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFullMetrics, setShowFullMetrics] = useState(false);
const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const navigate = useNavigate();

  // ✅ Token-based route protection
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
    } else {
      fetchEnrollments();
    }
  }, [navigate]);

  // ✅ Fetch Enrollments
  const fetchEnrollments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'enrollments'));
      const data = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setEnrollments(data);
      const uniqueCourses = [...new Set(data.map(item => item.courseName))];
      setCourses(uniqueCourses);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      await deleteDoc(doc(db, 'enrollments', id));
      fetchEnrollments();
    }
  };

  const handleSort = (key) => {
    const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(newOrder);
  };

  const sortedData = [...enrollments].sort((a, b) => {
    const valA = a[sortKey]?.toLowerCase?.() || a[sortKey];
    const valB = b[sortKey]?.toLowerCase?.() || b[sortKey];
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter(entry => {
    const matchesCourse = filteredCourse === 'All' || entry.courseName === filteredCourse;
    const matchesSearch = `${entry.firstName} ${entry.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin-login');
  };

  return (

    <>
<Sidebar onMinimizeChange={setIsSidebarMinimized} />
<div className={`admin-container ${isSidebarMinimized ? 'sidebar-mini' : ''}`}>
      <div className="admin-header">
        <img src="/assets/logo.png" alt="Learnsy Logo" className="admin-logo" />
        <div className="admin-header-right">
          <p className="welcome-msg">
            Welcome back, Admin! Here's the latest enrollment data.
          </p>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>

      <h1>Admin Dashboard</h1>
      <h3>Total Enrollments: {filteredData.length}</h3>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={filteredCourse} onChange={(e) => setFilteredCourse(e.target.value)}>
          <option value="All">All Courses</option>
          {courses.map((course, i) => (
            <option key={i} value={course}>{course}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '1rem' }}>
  <button 
    onClick={() => setShowFullMetrics(prev => !prev)}
    style={{
      padding: '8px 16px',
      backgroundColor: '#6d28d2',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}
  >
    {showFullMetrics ? 'Hide Full Metrics' : 'View Full Metrics'}
  </button>
</div>

<DashboardCharts enrollments={filteredData} />

      <table className="enrollment-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('firstName')}>Name {sortKey === 'firstName' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('email')}>Email {sortKey === 'email' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
            <th>Phone</th>
            <th onClick={() => handleSort('courseName')}>Course {sortKey === 'courseName' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('submittedAt')}>Date {sortKey === 'submittedAt' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((entry, i) => (
            <tr key={i}>
              <td>{entry.firstName} {entry.lastName}</td>
              <td>{entry.email}</td>
              <td>{entry.phone}</td>
              <td>{entry.courseName}</td>
              <td>{new Date(entry.submittedAt).toLocaleString()}</td>
              <td>
                <button onClick={() => handleDelete(entry.id)} className="delete-button">🗑️</button>
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
