'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [scientists, setScientists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const groupId = localStorage.getItem('group_id');

  // ✅ First, check authorization (no early return)
  useEffect(() => {
    if (!token || role !== 'admin') {
      alert('Unauthorized. Please login as Admin.');
      navigate('/');
    } else {
      setAuthorized(true);
    }
  }, [navigate, token, role]);

  // ✅ Fetch scientists only if authorized
  useEffect(() => {
    const fetchScientists = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/admin/scientists', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { group_id: groupId }
        });
        setScientists(response.data);
        setError(null);
      } catch (err) {
        console.error('API Error:', err.response ? err.response.data : err.message);
        setError('Failed to load scientists');
      } finally {
        setLoading(false);
      }
    };

    if (authorized) {
      fetchScientists();
    }
  }, [authorized, token, groupId]);

  // 🧤 Block rendering until authorization is confirmed
  if (!authorized) return null;

  // 🔍 Handle scientist search
  const handleSearch = async () => {
    if (searchTerm.trim() === '') return;

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/search', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          ScientistName: searchTerm,
          admin_group_id: groupId
        }
      });
      setScientists(response.data);
      setError(null);
    } catch (err) {
      console.error('API Error:', err.response ? err.response.data : err.message);
      setError('Error searching scientists');
    } finally {
      setLoading(false);
    }
  };

const handleRowClick = (id) => {
  const group_id = localStorage.getItem('group_id'); // ← get from storage
  navigate(`/profile?emp_id=${id}&group_id=${group_id}`);
};


  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#F4F6F9',
        fontFamily: 'Segoe UI, sans-serif',
        boxSizing: 'border-box',
        padding: '40px',
        overflow: 'auto'
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
  <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#003366' }}>
    DRDO Admin Dashboard
  </h1>
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div style={{ fontSize: '16px', color: '#555' }}>
      Total Scientists: <strong>{scientists.length}</strong>
    </div>
    <button
      onClick={() => {
        localStorage.clear();
        navigate('/');
      }}
      style={{
        padding: '8px 16px',
        backgroundColor: '#c0392b',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginLeft: '20px'
      }}
    >
      Logout
    </button>
  </div>
</header>


      <div style={{ display: 'flex', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search scientist by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 12px',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            width: '300px',
            marginRight: '10px',
            backgroundColor: '#fff',
            color: '#000',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0057B8',
            color: 'black',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading scientists...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : scientists.length === 0 ? (
        <p>No scientists found.</p>
      ) : (
        <div style={{
          border: '1px solid #D1D5DB',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          overflowX: 'auto'
        }}>
          <div style={{
            display: 'flex',
            padding: '12px 20px',
            backgroundColor: '#003366',
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: '16px',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px'
          }}>
            <div style={{ width: '80px' }}>ID</div>
            <div style={{ flex: 1 }}>Name</div>
            <div style={{ width: '100px', textAlign: 'center' }}>Grade</div>
            <div style={{ width: '140px', textAlign: 'center' }}>Category</div>
            <div style={{ width: '120px', textAlign: 'center' }}>Pay Level</div>
            <div style={{ flex: 1, textAlign: 'right' }}>Research Area</div>
          </div>

          {scientists.map((sci, index) => (
            <div
              key={sci.emp_id}
              onClick={() => handleRowClick(sci.emp_id)}
              style={{
                display: 'flex',
                padding: '14px 20px',
                borderBottom: index === scientists.length - 1 ? 'none' : '1px solid #EEE',
                cursor: 'pointer',
                backgroundColor: index % 2 === 0 ? '#F9FAFB' : '#FFFFFF',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6F0FF'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#F9FAFB' : '#FFFFFF'}
            >
              <div style={{ width: '80px', color: '#1A202C' }}>{sci.emp_id}</div>
              <div style={{ flex: 1, fontWeight: '500', color: '#1A202C' }}>{sci.firstname} {sci.lastname}</div>
              <div style={{ width: '100px', textAlign: 'center', color: '#4A5568' }}>{sci.grade}</div>
              <div style={{ width: '140px', textAlign: 'center', color: '#4A5568' }}>{sci.category}</div>
              <div style={{ width: '120px', textAlign: 'center', color: '#4A5568' }}>{sci.pay_level}</div>
              <div style={{ flex: 1, textAlign: 'right', color: '#4A5568' }}>{sci.research_area}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

