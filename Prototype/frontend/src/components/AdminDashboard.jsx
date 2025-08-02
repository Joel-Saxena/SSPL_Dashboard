import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DRDO_LOGO_URL = '/DrdoLogo.png';

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

  // Authorization
  useEffect(() => {
    if (!token || role !== 'admin') {
      alert('Unauthorized. Please login as Admin.');
      navigate('/');
    } else {
      setAuthorized(true);
    }
  }, [navigate, token, role]);

  // Fetch scientists
  useEffect(() => {
    const fetchScientists = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/admin/scientists', {
          headers: { Authorization: `Bearer ${token}` },
          params: { group_id: groupId }
        });
        setScientists(response.data);
        setError(null);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('Failed to load scientists');
      } finally {
        setLoading(false);
      }
    };
    if (authorized) fetchScientists();
  }, [authorized, token, groupId]);

  // Search
  const handleSearch = async () => {
    if (searchTerm.trim() === '') return;
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: { ScientistName: searchTerm, admin_group_id: groupId }
      });
      setScientists(response.data);
      setError(null);
    } catch {
      setError('Error searching scientists');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/profile?emp_id=${id}&group_id=${groupId}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (!authorized) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#e7ecf3] font-sans">
      {/* Header */}
      <header className="bg-[#1b2940] text-white shadow relative z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <img src={DRDO_LOGO_URL} alt="DRDO Logo" className="h-10 w-10 rounded-full bg-white border border-blue-100 p-1 shadow" />
            <span className="font-extrabold text-lg lg:text-xl uppercase tracking-wider">
              DefenCore
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-medium text-blue-100 text-base">Total Scientists: <span className="font-bold text-white">{scientists.length}</span></span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition focus:outline-none"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
        <div className="w-full h-1 bg-gradient-to-r from-[#0a58aa] via-[#1464c8] to-[#00a3db]" />
      </header>

      {/* Dashboard Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-8 py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1b2940]">
            Admin Dashboard
          </h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search scientist by name…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              className="px-4 py-2 rounded-md border border-slate-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-black text-base w-64"
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-1 px-4 py-2 rounded-md bg-[#195394] hover:bg-[#254d99] text-white font-medium shadow transition"
            >
              <FaSearch /> Search
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center text-blue-900 font-semibold py-10">Loading scientists…</div>
        ) : error ? (
          <div className="text-center text-red-600 font-semibold">{error}</div>
        ) : scientists.length === 0 ? (
          <div className="text-center text-gray-500 italic">No scientists found.</div>
        ) : (
          <div className="rounded-xl border border-blue-100 shadow bg-white overflow-x-auto mt-4">
            <div className="min-w-[650px]">
              <div className="flex px-6 py-3 bg-[#003366] text-white font-bold text-base rounded-t-xl">
                <div className="w-24">ID</div>
                <div className="flex-1">Name</div>
                <div className="w-28 text-center">Grade</div>
                <div className="w-36 text-center">Category</div>
                <div className="w-32 text-center">Pay Level</div>
                <div className="flex-1 text-right">Research Area</div>
              </div>
              {scientists.map((sci, index) => (
                <div
                  key={sci.emp_id}
                  tabIndex={0}
                  onClick={() => handleRowClick(sci.emp_id)}
                  className={`
                    flex px-6 py-3 cursor-pointer
                    transition-colors duration-150
                    ${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'} 
                    hover:bg-blue-100 focus:bg-blue-200
                  `}
                  style={{ outline: 'none' }}
                >
                  <div className="w-24 text-black font-medium">{sci.emp_id}</div>
                  <div className="flex-1 text-black font-semibold">{sci.firstname} {sci.lastname}</div>
                  <div className="w-28 text-center text-gray-700">{sci.grade}</div>
                  <div className="w-36 text-center text-gray-700">{sci.category}</div>
                  <div className="w-32 text-center text-gray-700">{sci.pay_level}</div>
                  <div className="flex-1 text-right text-gray-700">{sci.research_area}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1b2940] text-white text-center py-2 text-xs border-t border-blue-900">
        &copy; {new Date().getFullYear()} DefenCore, India. All rights reserved.
      </footer>
    </div>
  );
}
