import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaUsers,
  FaPlus,
  FaUserShield,
  FaUserPlus,
  FaExchangeAlt,
  FaSignOutAlt,
  FaFlask,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DRDO_LOGO_URL = '/DrdoLogo.png';

// eslint-disable-next-line no-unused-vars
function SidebarButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-5 py-3 mb-3 bg-white text-[#1b2940] rounded-lg font-medium hover:bg-[#e3eaf3] border border-blue-200 shadow-sm transition"
    >
      <Icon className="text-xl" /> {label}
    </button>
  );
}

function ModalCard({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-2">
      <div className="bg-white w-full max-w-sm sm:max-w-md rounded-xl border-b-4 border-blue-900 shadow-2xl p-5 relative animate-fadeIn overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-900 hover:text-red-600 text-2xl"
          aria-label="Close modal"
        >
          <FaTimes />
        </button>
        <div className="flex flex-col items-center mb-2">
          <img src={DRDO_LOGO_URL} alt="DRDO Logo" className="h-12 w-12 mb-2 rounded-full border shadow" />
          <h2 className="text-lg font-extrabold text-blue-900 text-center uppercase tracking-wider">{title}</h2>
          <div className="w-10 h-1 bg-blue-900 rounded-full mt-2" />
        </div>
        {children}
      </div>
      <style>{`
        .animate-fadeIn { animation: fadeIn .15s;}
        @keyframes fadeIn {from{opacity:0;transform:scale(0.96);} to {opacity:1;transform:scale(1);} }
      `}</style>
    </div>
  );
}

const sidebarOptions = [
  { label: 'Create Group', icon: FaPlus, form: 'group' },
  { label: 'Add Admin', icon: FaUserShield, form: 'admin' },
  { label: 'Add Scientist', icon: FaUserPlus, form: 'scientist' },
  { label: 'Assign Admin', icon: FaExchangeAlt, form: 'assignAdmin' },
];

export default function SupervisorDashboard() {
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
          headers: { Authorization: `Bearer ${token}` }
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
      setRefreshKey(prev => prev + 1);
      handleCancel();
    } catch (error) {
      console.error('Save failed:', error.response?.data || error.message);
      alert('Failed to save. Please check input or server.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const renderInput = (label, name, type = 'text') => (
    <div className="flex flex-col mb-3">
      <label className="text-sm text-gray-700 font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name] || ''}
        onChange={handleFormInput}
        className="border border-gray-300 p-2 rounded-md w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );

  function renderFormContent(formType) {
    return (
      <form onSubmit={e => { e.preventDefault(); handleSave(); }} autoComplete="off">
        {formType === 'group' && renderInput('Group Name', 'group_name')}
        {formType === 'assignAdmin' && (
          <div className="grid grid-cols-1 gap-4">
            {renderInput('Admin ID', 'admin_id')}
            {renderInput('Group ID', 'group_id')}
          </div>
        )}
        {formType === 'admin' && (
          <div className="grid grid-cols-1 gap-4">
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
        {formType === 'scientist' && (
          <div className="grid grid-cols-1 gap-4">
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
        <div className="mt-5 flex justify-end gap-4">
          <button type="submit" className="bg-blue-900 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition">Save</button>
          <button type="button" onClick={handleCancel} className="bg-gray-200 text-black px-6 py-2 rounded-md hover:bg-gray-300 font-semibold transition">Cancel</button>
        </div>
      </form>
    );
  }

  const Sidebar = () => (
    <div className={`
      fixed top-0 left-0 z-40 h-full
      ${sidebarOpen ? '' : 'pointer-events-none select-none'}
    `}>
      {/* Sidebar positioned at top-left */}
      <aside className={`
        w-[240px] max-w-[90vw] bg-[#1b2940] text-white h-full flex flex-col px-4 pt-10 shadow-xl border-r border-blue-900
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        relative
      `}>
        <button
          className="absolute right-2 top-2 text-xl text-white hover:text-red-500"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>
        <img src={DRDO_LOGO_URL} alt="Sidebar DRDO Logo" className="h-12 w-12 mb-3 rounded-full border bg-white shadow border-blue-100 p-1" />
        <h2 className="text-lg font-bold mb-7 tracking-wide">Supervisor Panel</h2>
        {sidebarOptions.map(opt =>
          <SidebarButton
            key={opt.label}
            icon={opt.icon}
            label={opt.label}
            onClick={() => { setActiveForm(opt.form); setSidebarOpen(false); }}
          />
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-5 py-3 mt-auto mb-6 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold border border-red-700 shadow text-base justify-center transition"
        >
          <FaSignOutAlt className="text-lg" /> Logout
        </button>
      </aside>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#e7ecf3] font-sans">
      {/* Header with menu button on left */}
      <header className="bg-[#1b2940] text-white shadow relative z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              className="mr-4 text-2xl bg-[#195394] rounded-full p-2 hover:bg-blue-800 border border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars />
            </button>
            <img src={DRDO_LOGO_URL} alt="DRDO Logo" className="h-10 w-10 rounded-full bg-white border border-blue-100 p-1 shadow" />
            <span className="font-extrabold text-lg lg:text-xl uppercase tracking-wider">
              DefenCore
            </span>
          </div>
          <span className="hidden sm:block font-semibold text-xs tracking-wider text-slate-200">
            Ministry of Defence, Govt. of India
          </span>
        </div>
        <div className="w-full h-1 bg-gradient-to-r from-[#0a58aa] via-[#1464c8] to-[#00a3db]" />
      </header>

      {/* Sidebar positioned at top-left */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 px-3 sm:px-8 py-8 transition-all">
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1b2940] tracking-tight">Supervisor Dashboard</h1>
          <div className="h-0.5 mt-2 bg-gradient-to-r max-w-xs from-[#0a58aa] to-[#195394] rounded-full" />
        </div>
        <div className="mb-6">
          <p className="text-xl md:text-2xl text-[#254D99] font-semibold text-center tracking-wide border-b pb-2 border-blue-100 max-w-xl mx-auto">
            Group Hierarchy
          </p>
        </div>
        {/* Group Cards */}
        <section className="space-y-8 max-w-4xl mx-auto">
          {hierarchy.length === 0 && (
            <div className="text-center text-gray-400 italic">No group hierarchy found.</div>
          )}
          {hierarchy.map((group) => (
            <div
              key={group.group_id}
              className="bg-white rounded-xl shadow-lg px-5 py-4 border-l-4 border-[#195394] transition hover:shadow-2xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
                <div className="flex gap-3 items-center">
                  <FaUsers className="text-blue-800 text-xl" />
                  <span className="text-xl font-bold text-[#1b2940]">{group.group_name}</span>
                  <span className="text-gray-400 font-normal text-base">(ID: {group.group_id})</span>
                </div>
                <div className="text-sm text-blue-900 font-medium">
                  Managed Grades:{" "}
                  {group.managed_grades && group.managed_grades.length > 0
                    ? group.managed_grades.join(', ')
                    : <span className="italic text-gray-400">None</span>
                  }
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mt-3">
                <div>
                  <div className="flex gap-1 items-center mb-1">
                    <FaUserShield className="text-blue-900" />
                    <span className="font-semibold text-[#254D99]">Admins</span>
                  </div>
                  <div className="rounded overflow-hidden border">
                    <div className="text-sm font-semibold bg-blue-900 text-white px-3 py-1">Name | ID</div>
                    <div>
                      {group.administrators && group.administrators.length > 0 ? (
                        group.administrators.map((a) => (
                          <div key={a.id} className="px-3 py-1 flex justify-between border-b last:border-none bg-blue-50">
                            <span className="text-black">{a.firstname} {a.lastname}</span>
                            <span className="text-black">{a.id}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-1 italic text-gray-400">None</div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex gap-1 items-center mb-1">
                    <FaFlask className="text-blue-900" />
                    <span className="font-semibold text-[#254D99]">Scientists</span>
                  </div>
                  <div className="rounded overflow-hidden border">
                    <div className="text-sm font-semibold bg-blue-900 text-white px-3 py-1">Name | Grade</div>
                    <div>
                      {group.scientists && group.scientists.length > 0 ? (
                        group.scientists.map((s) => (
                          <div key={s.emp_id} className="px-3 py-1 flex justify-between border-b last:border-none bg-blue-50">
                            <span className="text-black">{s.firstname} {s.lastname}</span>
                            <span className="text-black">{s.grade}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-1 italic text-gray-400">None</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
        {/* Modals */}
        {activeForm && (
          <ModalCard
            title={
              activeForm === "group" ? "Create Group"
                : activeForm === "admin" ? "Add Admin"
                  : activeForm === "scientist" ? "Add Scientist"
                    : activeForm === "assignAdmin" ? "Assign Admin"
                      : ""
            }
            onClose={handleCancel}
          >
            {renderFormContent(activeForm)}
          </ModalCard>
        )}
      </main>
      {/* Footer */}
      <footer className="bg-[#1b2940] text-white text-center py-2 text-xs border-t border-blue-900">
        &copy; {new Date().getFullYear()} DefenCore, India. All rights reserved.
      </footer>
    </div>
  );
}