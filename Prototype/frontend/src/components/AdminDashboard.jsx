'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AdminDashboard() {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('group_id');
  const [scientists, setScientists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchScientists = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/scientists', {
        params: { group_id: groupId },
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

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      fetchScientists();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/search', {
        params: {
          name: searchTerm,
          admin_group_id: groupId,
        },
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
    navigate(`/scientist/${id}?group_id=${groupId}`);
  };

  useEffect(() => {
    fetchScientists();
  }, []);

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
        <div style={{ fontSize: '16px', color: '#555' }}>
          Total Scientists: <strong>{scientists.length}</strong>
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
          {/* Column headers */}
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
            <div style={{ width: '100px' }}>ID</div>
            <div style={{ flex: 1 }}>Name</div>
            <div style={{ width: '100px', textAlign: 'center' }}>Grade</div>
            <div style={{ width: '160px', textAlign: 'center' }}>Category</div>
            <div style={{ flex: 1, textAlign: 'right' }}>Research Area</div>
          </div>

          {/* Scientist Rows */}
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
              <div style={{ width: '100px', color: '#1A202C' }}>
                {sci.emp_id}
              </div>
              <div style={{ flex: 1, fontWeight: '500', color: '#1A202C' }}>
                {sci.firstname} {sci.lastname}
              </div>
              <div style={{ width: '100px', textAlign: 'center', color: '#4A5568' }}>
                {sci.grade}
              </div>
              <div style={{ width: '160px', textAlign: 'center', color: '#4A5568' }}>
                {sci.category}
              </div>
              <div style={{ flex: 1, textAlign: 'right', color: '#4A5568' }}>
                {sci.research_area}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}