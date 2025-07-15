import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaUsers,
  FaPlus,
  FaUserShield,
  FaUserPlus,
  FaExchangeAlt,
  FaTimes,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SupervisorDashboard = () => {
  const [hierarchy, setHierarchy] = useState([]);
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/supervisor/groups', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHierarchy(response.data.hierarchy);
      } catch (error) {
        console.error('Error fetching hierarchy:', error);
      }
    };
    fetchHierarchy();
  }, [refreshKey]);

  const handleFormInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setActiveForm(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (activeForm === 'group') {
        await axios.post('http://localhost:5000/api/supervisor/group', formData, config);
      } else if (activeForm === 'admin') {
        const payload = {
          employeeData: {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            gender: formData.gender,
            password: formData.password,
            aadhaar: formData.aadhaar,
            date_of_birth: formData.date_of_birth,
            education_qualification: formData.education_qualification,
          },
          group_id: formData.group_id,
          supervisor_id: formData.supervisor_id || null,
        };
        await axios.post('http://localhost:5000/api/supervisor/admin', payload, config);
      } else if (activeForm === 'scientist') {
        const payload = {
          employeeData: {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            gender: formData.gender,
            password: formData.password,
            aadhaar: formData.aadhaar,
            date_of_birth: formData.date_of_birth,
            education_qualification: formData.education_qualification,
          },
          group_id: formData.group_id,
          grade: formData.grade,
          category: formData.category,
          research_area: formData.research_area,
        };
        await axios.post('http://localhost:5000/api/supervisor/scientist', payload, config);
      } else if (activeForm === 'assignAdmin') {
        await axios.put('http://localhost:5000/api/supervisor/admin/group', formData, config);
      }

      setRefreshKey((prev) => prev + 1);
      setActiveForm(null);
      setFormData({});
    } catch (error) {
      console.error('Save failed:', error.response?.data || error.message);
      alert('Failed to save. Please check input or server.');
    }
  };

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const renderInput = (label, name, type = 'text') => (
    <div className="flex flex-col">
      <label className="text-sm text-gray-700 font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        onChange={handleFormInput}
        className="border border-gray-300 p-2 rounded-md w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );

  const renderForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl mx-4 relative">
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-red-600 hover:text-red-800"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-semibold mb-6 capitalize text-center text-[#003366]">
          {activeForm.replace(/([A-Z])/g, ' $1')}
        </h2>

        <div className="space-y-4">
          {activeForm === 'group' && renderInput('Group Name', 'group_name')}
          {activeForm === 'assignAdmin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('Admin ID', 'admin_id')}
              {renderInput('Group ID', 'group_id')}
            </div>
          )}
          {activeForm === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('First Name', 'firstname')}
              {renderInput('Last Name', 'lastname')}
              {renderInput('Email', 'email')}
              {renderInput('Gender', 'gender')}
              {renderInput('Password', 'password', 'password')}
              {renderInput('Aadhaar', 'aadhaar')}
              {renderInput('Date of Birth', 'date_of_birth', 'date')}
              {renderInput('Education Qualification', 'education_qualification')}
              {renderInput('Group ID', 'group_id')}
              {renderInput('Supervisor ID (optional)', 'supervisor_id')}
            </div>
          )}
          {activeForm === 'scientist' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('First Name', 'firstname')}
              {renderInput('Last Name', 'lastname')}
              {renderInput('Email', 'email')}
              {renderInput('Gender', 'gender')}
              {renderInput('Password', 'password', 'password')}
              {renderInput('Aadhaar', 'aadhaar')}
              {renderInput('Date of Birth', 'date_of_birth', 'date')}
              {renderInput('Education Qualification', 'education_qualification')}
              {renderInput('Group ID', 'group_id')}
              {renderInput('Grade', 'grade')}
              {renderInput('Category', 'category')}
              {renderInput('Research Area', 'research_area')}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-black px-5 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#e3eaf3] relative">
      {/* Sidebar Toggle Button */}
      <button
        onClick={handleSidebarToggle}
        className="fixed top-4 left-4 z-50 bg-[#003366] text-white border-none rounded-full w-12 h-12 text-2xl cursor-pointer flex justify-center items-center shadow-lg hover:bg-[#002244] transition-colors"
        aria-label="Open sidebar"
      >
        ☰
      </button>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed top-0 left-0 w-72 h-full bg-[#003366] text-white z-40 flex flex-col pt-10 items-center shadow-2xl">
          <h2 className="text-xl font-bold mb-6">Super Admin</h2>
          <button onClick={() => { setActiveForm('group'); setSidebarOpen(false); }} className="w-11/12 py-3 mb-3 bg-white text-[#003366] rounded font-bold hover:bg-gray-100 transition-colors"><FaPlus className="inline mr-2" /> Create Group</button>
          <button onClick={() => { setActiveForm('admin'); setSidebarOpen(false); }} className="w-11/12 py-3 mb-3 bg-white text-[#003366] rounded font-bold hover:bg-gray-100 transition-colors"><FaUserShield className="inline mr-2" /> Add Admin</button>
          <button onClick={() => { setActiveForm('scientist'); setSidebarOpen(false); }} className="w-11/12 py-3 mb-3 bg-white text-[#003366] rounded font-bold hover:bg-gray-100 transition-colors"><FaUserPlus className="inline mr-2" /> Add Scientist</button>
          <button onClick={() => { setActiveForm('assignAdmin'); setSidebarOpen(false); }} className="w-11/12 py-3 mb-3 bg-white text-[#003366] rounded font-bold hover:bg-gray-100 transition-colors"><FaExchangeAlt className="inline mr-2" /> Assign Admin</button>
          <button onClick={handleSidebarToggle} className="w-11/12 py-3 mt-auto mb-5 bg-white text-[#003366] rounded font-bold hover:bg-gray-100 transition-colors">CLOSE</button>
        </div>
      )}

      {/* Main Dashboard Content */}
{!activeForm && (
  <main className="flex-1 p-6 md:ml-0 w-full">
    {/* Header Section */}
    <div className="relative mb-8">

      {/* Heading and Subheading */}
      <div className="mb-8">
  {/* Top Row: Dashboard title (left) + Logout button (right) */}
  <div className="flex justify-between items-center px-4 md:px-8">
    <h1 className="text-3xl font-bold text-[#003366] ml-12">Supervisor Dashboard</h1>
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  </div>

  {/* Second Row: Subheading centered */}
  <div className="mt-8 mb-2">
    <p className="text-2xl text-[#374151] font-semibold text-center">
      Group Hierarchy
    </p>
  </div>
</div>

    </div>

    {/* Hierarchy Cards */}
    <div className="space-y-6">
      {hierarchy.map((group) => (
        <div
  key={group.group_id}
  className="bg-[#f9fbfd] rounded-lg shadow-lg p-4 border-l-4 border-[#003366] transition-transform hover:scale-[1.01]"
>

          <h2 className="text-xl font-semibold text-[#003366]">
            {group.group_name} (ID: {group.group_id})
          </h2>
          <p className="text-sm text-gray-600">Managed Grades: {group.managed_grades.join(', ') || 'None'}</p>
          <div className="mt-2">
            <h3 className="font-semibold text-blue-800">Admins:</h3>
            <div className="pl-4 space-y-1">
              {group.administrators.map((a) => (
                <div key={a.id} className="text-black">
                  {a.firstname} {a.lastname} (ID: {a.id})
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <h3 className="font-semibold text-blue-800">Scientists:</h3>
            <div className="pl-4 space-y-1">
              {group.scientists.map((s) => (
                <div key={s.emp_id} className="text-black">
                  {s.firstname} {s.lastname} - Grade: {s.grade}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </main>
)}

      {/* Form Overlay */}
      {activeForm && renderForm()}
    </div>
  );
};

export default SupervisorDashboard;
