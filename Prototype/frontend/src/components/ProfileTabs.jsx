import React, { useState, useEffect } from 'react';
import { FaUser, FaBriefcase, FaUsers, FaFileAlt, FaPlus, FaTrash, FaDownload, FaEye } from 'react-icons/fa';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const TAB_LIST = [
  { label: 'Personal Details', icon: <FaUser /> },
  { label: 'Service Details', icon: <FaBriefcase /> },
  { label: 'Family Details', icon: <FaUsers /> },
  { label: 'Documents', icon: <FaFileAlt /> },
];

const initialPersonal = {
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  dob: '',
  aadhaar: '',
  pan: '',
  pisPin: '',
  email: '',
  payLevel: '',
  category: '',
  educationQualification: '',
  university: '',
  subject: '',
  permAddress: '',
  tempAddress: '',
};

const DESIGNATION_OPTIONS = [
  { value: 'DRDS', label: 'DRDS' },
  { value: 'DRTC', label: 'DRTC' },
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'ALLIED', label: 'ALLIED' },
];

const SUB_DESIGNATION_OPTIONS = {
  DRDS: [
    'SCIENTIST H', 'SCIENTIST G', 'SCIENTIST F', 'SCIENTIST E', 'SCIENTIST D', 'SCIENTIST C', 'SCIENTIST B'
  ],
  DRTC: [
    'TECHNICAL OFFICER D', 'TECHNICAL OFFICER C', 'TECHNICAL OFFICER B', 'TECHNICAL OFFICER A', 'TECHNICAL ASSISTANT B', 'TECHNICIAN C', 'TECHNICIAN B', 'TECHNICIAN A'
  ],
  ADMIN: [
    'CHIEF ADMINISTRATIVE OFFICER', 'SR. ADMINISTRATIVE OFFICER-I', 'SR. ADMINISTRATIVE OFFICER-II', 'ADMINISTRATIVE OFFICER', 'SR. ADMIN. ASSISTANT', 'ADMIN. ASSISTANT B', 'ADMIN. ASSISTANT A'
  ],
  ALLIED: [
    'SR. ACCOUNT OFFICER-I', 'SR. ACCOUNT OFFICER-II', 'SR. STORE OFFICER-I', 'SR. STORE ASSISTANT', 'STORE ASSISTANT B', 'STORE ASSISTANT A', 'MTS', 'ALS-I', 'ALS-II', 'SENIOR SECURITY ASSISTANT', 'SECURITY ASSISTANT B', 'SECURITY ASSISTANT A', 'STORE CUM MANAGER', 'ASSISTANT HALWAI-CUM-COOK'
  ],
};

const initialService = {
  designation: '',
  subDesignation: '',
  payLevel: '',
  group: '',
  supervisor: '',
  dateOfJoining: '',
  dateOfRetirement: '',
  dateCurrentDesig: '',
};

const initialSpouse = {
  name: '',
  dob: '',
  occupation: '',
};

const initialChild = {
  name: '',
  gender: '',
  dob: '',
};

const initialParent = {
  name: '',
  dob: '',
  address: '',
};

const initialEmergency = {
  name: '',
  relation: '',
  mobile: '',
  address: '',
};

const initialFamily = {
  spouse: { ...initialSpouse },
  children: [],
  father: { ...initialParent },
  mother: { ...initialParent },
  emergency: { ...initialEmergency },
};

const DOCUMENT_CATEGORIES = [
  {
    category: 'Identity & Proofs',
    docs: [
      { key: 'aadhaar', label: 'Aadhaar Card', required: true },
      { key: 'pan', label: 'PAN Card', required: true },
    ],
  },
  {
    category: 'Educational Qualification Certificates',
    docs: [
      { key: 'marksheets', label: '10th / 12th Marksheets', required: true },
      { key: 'degrees', label: 'Graduation / Post Graduation Degrees', required: true },
    ],
  },
  {
    category: 'Employment & Service Docs',
    docs: [
      { key: 'promotion_orders', label: 'Promotion Orders', required: true },
      { key: 'transfer_orders', label: 'Transfer Orders', required: true },
    ],
  },
  {
    category: 'Pension & Finance',
    docs: [
      { key: 'nps_gpf', label: 'NPS/GPF Statement', required: true },
      { key: 'bank_passbook', label: 'Bank Passbook Copy / Cancelled Cheque', required: true },
      { key: 'nomination_form', label: 'Nomination Form for Pension/GPF', required: true },
    ],
  },
];

const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <div style={{ position: 'relative', width: '100%' }}>
    <input
      className="input"
      value={value}
      onClick={onClick}
      ref={ref}
      placeholder={placeholder}
      readOnly
      style={{ width: '100%', paddingRight: '2.5rem', height: '40px', color: '#000' }}
    />
    <img
      src="/CalanderIcon.png"
      alt="Calendar"
      style={{
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 24,
        height: 24,
        cursor: 'pointer'
      }}
      onClick={onClick}
    />
  </div>
));

function ProfileTabs() {
  const [searchParams] = useSearchParams();
  const empId = searchParams.get('emp_id');
  const groupId = searchParams.get('group_id');

  // Sync group_id from URL to localStorage if present
  useEffect(() => {
    if (groupId) {
      localStorage.setItem('group_id', groupId);
    }
  }, [groupId]);
  
  const [tab, setTab] = useState(0);
  const [personal, setPersonal] = useState(initialPersonal);
  const [service, setService] = useState(initialService);
  const [family, setFamily] = useState(initialFamily);
  const [showSpouse, setShowSpouse] = useState(true);
  const [showChildren, setShowChildren] = useState(true);
  const [showParents, setShowParents] = useState(true);
  const [showEmergency, setShowEmergency] = useState(true);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [docFiles, setDocFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Edit mode states for each tab
  const [editMode, setEditMode] = useState({
    personal: false,
    service: false,
    family: false,
    documents: false
  });
  
  // Backup data for each tab
  const [backupData, setBackupData] = useState({
    personal: {},
    service: {},
    family: {},
    documents: {}
  });

  // Add Scientist Modal State
  const [showAddScientistModal, setShowAddScientistModal] = useState(false);
  const [addScientistForm, setAddScientistForm] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    email: '',
    gender: '',
    aadhaar: '',
    pan_number: '',
    pis_pin_number: '',
    education_qualification: '',
    category: '',
    research_area: '',
    grade: '',
    pay_level: '',
    university: '',
    subject: '',
    date_of_birth: '',
    date_of_joining: '',
    date_of_retirement: '',
    date_in_present_designation: '',
    address1_permanent: '',
    address2_temporary: '',
    password: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // If empId is provided (from AdminDashboard), fetch that scientist's data
        if (empId && groupId) {
          const response = await axios.get(`http://localhost:5000/api/admin/scientist/${empId}`, {
            params: { admin_group_id: groupId }
          });
          
          const { profile } = response.data;
          
          setPersonal({
            firstName: profile.firstname || '',
            middleName: profile.middlename || '',
            lastName: profile.lastname || '',
            gender: profile.gender || '',
            dob: profile.date_of_birth || '',
            aadhaar: profile.aadhaar || '',
            pan: profile.pan_number || '',
            pisPin: profile.pis_pin_number || '',
            email: profile.email || '',
            payLevel: profile.pay_level || '',
            category: profile.category || '',
            educationQualification: profile.education_qualification || '',
            university: profile.university || '',
            subject: profile.subject || '',
            permAddress: profile.address1_permanent || '',
            tempAddress: profile.address2_temporary || '',
          });

          setService({
            designation: '',
            subDesignation: '',
            payLevel: profile.pay_level || '',
            group: groupId || '',
            supervisor: '',
            dateOfJoining: profile.date_of_joining || '',
            dateOfRetirement: profile.date_of_retirement || '',
            dateCurrentDesig: profile.date_in_present_designation || '',
          });
        } else {
          // Get user data from localStorage (set by your Home component)
          const userData = JSON.parse(localStorage.getItem('user'));
          const localGroupId = localStorage.getItem('group_id');
          
          if (!userData || !userData.id) {
            setError('User not found. Please login again.');
            return;
          }

          // For now, we'll populate with user data from localStorage
          // In a real scenario, you'd fetch from backend
          setPersonal({
            firstName: userData.firstname || '',
            middleName: userData.middlename || '',
            lastName: userData.lastname || '',
            gender: userData.gender || '',
            dob: userData.date_of_birth || '',
            aadhaar: userData.aadhaar || '',
            pan: userData.pan_number || '',
            pisPin: userData.pis_pin_number || '',
            email: userData.email || '',
            payLevel: userData.pay_level || '',
            category: userData.category || '',
            educationQualification: userData.education_qualification || '',
            university: userData.university || '',
            subject: userData.subject || '',
            permAddress: userData.address1_permanent || '',
            tempAddress: userData.address2_temporary || '',
          });

          setService({
            designation: '',
            subDesignation: '',
            payLevel: userData.pay_level || '',
            group: localGroupId || '',
            supervisor: '',
            dateOfJoining: userData.date_of_joining || '',
            dateOfRetirement: userData.date_of_retirement || '',
            dateCurrentDesig: userData.date_in_present_designation || '',
          });
        }

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [empId, groupId]);

  // --- Handlers ---
  const handlePersonalChange = e => {
    const { name, value, type, checked } = e.target;
    setPersonal(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleServiceChange = e => {
    const { name, value, type, checked } = e.target;
    setService(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleSpouseChange = e => {
    const { name, value, type, checked } = e.target;
    setFamily(prev => ({ ...prev, spouse: { ...prev.spouse, [name]: type === 'checkbox' ? checked : value } }));
  };
  const handleChildChange = (idx, e) => {
    const { name, value, type, checked } = e.target;
    setFamily(prev => {
      const children = prev.children.map((child, i) =>
        i === idx ? { ...child, [name]: type === 'checkbox' ? checked : value } : child
      );
      return { ...prev, children };
    });
  };
  const handleAddChild = () => {
    setFamily(prev => ({ ...prev, children: [...prev.children, { ...initialChild }] }));
  };
  const handleRemoveChild = idx => {
    setFamily(prev => ({ ...prev, children: prev.children.filter((_, i) => i !== idx) }));
  };
  const handleParentChange = (parent, e) => {
    const { name, value, type, checked } = e.target;
    setFamily(prev => ({ ...prev, [parent]: { ...prev[parent], [name]: type === 'checkbox' ? checked : value } }));
  };
  const handleEmergencyChange = e => {
    const { name, value } = e.target;
    setFamily(prev => ({ ...prev, emergency: { ...prev.emergency, [name]: value } }));
  };
  const handleDocFileChangeStructured = (key, e) => {
    const file = e.target.files[0];
    if (file) {
      setDocFiles(prev => ({ ...prev, [key]: { file, name: file.name } }));
    }
  };
  const handleDeleteDocStructured = key => {
    setDocFiles(prev => {
      const newDocs = { ...prev };
      delete newDocs[key];
      return newDocs;
    });
  };
  const handleViewDocStructured = key => {
    const doc = docFiles[key];
    if (doc && doc.file) {
    const url = URL.createObjectURL(doc.file);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
    }
  };
  const handleDownloadDocStructured = key => {
    const doc = docFiles[key];
    if (doc && doc.file) {
      const url = URL.createObjectURL(doc.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicUrl(URL.createObjectURL(file));
    }
  };


  // Sidebar handlers
  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);
  const handleAddNewScientist = () => {
    setShowAddScientistModal(true);
    setSidebarOpen(false); // Close sidebar when opening modal
  };
  const handleGoToDashboard = () => {
    const groupId = localStorage.getItem('group_id');
    window.location.href = `/AdminDashboard?group_id=${groupId}`;
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('group_id');
    window.location.href = '/';
  };

  // Add Scientist Form Handlers
  const handleAddScientistFormChange = (e) => {
    const { name, value } = e.target;
    setAddScientistForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddScientistSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const groupId = localStorage.getItem('group_id');
      if (!groupId) {
        alert('Group ID not found. Please login again.');
        return;
      }

      // Split the form data
      const {
        category,
        research_area,
        grade,
        ...employeeData
      } = addScientistForm;

      // Prepare payload for supervisor route
      const payload = {
        employeeData,
        category,
        research_area,
        grade,
        group_id: groupId
      };

      // Send request to supervisor endpoint
      await axios.post('http://localhost:5000/api/supervisor/scientist', payload);

      alert('Scientist added successfully!');
      setShowAddScientistModal(false);

      // Reset form
      setAddScientistForm({
        firstname: '',
        middlename: '',
        lastname: '',
        email: '',
        gender: '',
        aadhaar: '',
        pan_number: '',
        pis_pin_number: '',
        education_qualification: '',
        category: '',
        research_area: '',
        grade: '',
        pay_level: '',
        university: '',
        subject: '',
        date_of_birth: '',
        date_of_joining: '',
        date_of_retirement: '',
        date_in_present_designation: '',
        address1_permanent: '',
        address2_temporary: '',
        password: ''
      });

    } catch (err) {
      console.error('Error adding scientist:', err);
      alert('Failed to add scientist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAddScientistModal = () => {
    setShowAddScientistModal(false);
    // Reset form
    setAddScientistForm({
      firstname: '',
      middlename: '',
      lastname: '',
      email: '',
      gender: '',
      aadhaar: '',
      pan_number: '',
      pis_pin_number: '',
      education_qualification: '',
      category: '',
      research_area: '',
      grade: '',
      pay_level: '',
      university: '',
      subject: '',
      date_of_birth: '',
      date_of_joining: '',
      date_of_retirement: '',
      date_in_present_designation: '',
      address1_permanent: '',
      address2_temporary: '',
      password: ''
    });
  };

  // Edit and Save handlers for each tab
  const handleEditTab = (tabName) => {
    // Backup current data
    setBackupData(prev => ({
      ...prev,
      [tabName]: tabName === 'personal' ? { ...personal } : 
                 tabName === 'service' ? { ...service } : 
                 tabName === 'family' ? { ...family } : 
                 { ...docFiles }
    }));
    
    // Enable edit mode
    setEditMode(prev => ({ ...prev, [tabName]: true }));
  };

  const handleSaveTab = async (tabName) => {
    try {
      setLoading(true);
      
      // Determine which scientist ID to use
      const scientistId = empId || JSON.parse(localStorage.getItem('user'))?.id;
      const adminGroupId = groupId || localStorage.getItem('group_id');
      
      if (!scientistId) {
        alert('User not found. Please login again.');
        return;
      }

      let payload = {};
      
      // Prepare payload based on tab
      if (tabName === 'personal') {
        payload = {
          admin_group_id: adminGroupId,
          firstname: personal.firstName,
          middlename: personal.middleName,
          lastname: personal.lastName,
          gender: personal.gender,
          aadhaar: personal.aadhaar,
          education_qualification: personal.educationQualification,
          category: personal.category,
          pay_level: personal.payLevel,
          university: personal.university,
          subject: personal.subject,
          date_of_birth: personal.dob,
          pan_number: personal.pan,
          pis_pin_number: personal.pisPin,
          address1_permanent: personal.permAddress,
          address2_temporary: personal.tempAddress,
        };
      } else if (tabName === 'service') {
        payload = {
          admin_group_id: adminGroupId,
          pay_level: service.payLevel,
          date_of_joining: service.dateOfJoining,
          date_of_retirement: service.dateOfRetirement,
          date_in_present_designation: service.dateCurrentDesig,
        };
      }
      // Note: Family and Documents tabs don't have backend fields, so they only save to frontend

      // Send update to backend for personal and service tabs
      if (tabName === 'personal' || tabName === 'service') {
        await axios.put(`http://localhost:5000/api/admin/scientist/${scientistId}`, payload);
      }
      
      // Disable edit mode
      setEditMode(prev => ({ ...prev, [tabName]: false }));
      
      alert(`${tabName.charAt(0).toUpperCase() + tabName.slice(1)} details saved successfully!`);
    } catch (err) {
      console.error('Error saving tab data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = (tabName) => {
    // Restore backup data
    if (tabName === 'personal') {
      setPersonal(backupData.personal);
    } else if (tabName === 'service') {
      setService(backupData.service);
    } else if (tabName === 'family') {
      setFamily(backupData.family);
    } else if (tabName === 'documents') {
      setDocFiles(backupData.documents);
    }
    
    // Disable edit mode
    setEditMode(prev => ({ ...prev, [tabName]: false }));
  };

  // === Personal Details Tab ===
  // State: personal, editMode.personal, backupData.personal
  // Handlers: handlePersonalChange, handleEditTab('personal'), handleSaveTab('personal'), handleCancelEdit('personal')
  // Render: renderPersonal
  const renderPersonal = () => (
    <div className="space-y-4">
      {/* Tab Header with Edit/Save Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#003366]">Personal Details</h2>
        <div className="flex gap-2">
          {!editMode.personal ? (
            <button
              onClick={() => handleEditTab('personal')}
              className="bg-[#003366] text-white px-4 py-2 rounded-md hover:bg-[#002244] transition-colors"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => handleSaveTab('personal')}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => handleCancelEdit('personal')}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <form className="space-y-4">
        {/* Profile Picture Section (keep as is) */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative flex flex-col items-center justify-center">
            <img
              src={profilePicUrl || '/Profile.jpeg'}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-[#003366] shadow-lg bg-white"
            />
            {editMode.personal && (
              <label
                htmlFor="profile-pic-upload"
                className="absolute bottom-2 right-2 bg-[#003366] text-white rounded-full p-3 cursor-pointer shadow-md hover:bg-[#002244] transition flex items-center justify-center"
                title="Change Picture"
                style={{fontSize: '1.5rem'}}
              >
                <FaPlus />
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <span className="mt-3 text-base text-[#003366] font-medium">
            {editMode.personal ? 'Upload Profile Picture' : 'Profile Picture'}
          </span>
        </div>
        
        {/* Personal Details Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-base leading-relaxed">First Name</label>
            <input 
              name="firstName" 
              value={personal.firstName} 
              onChange={handlePersonalChange} 
              className="input" 
              required 
              disabled={!editMode.personal}
            />
          </div>
          <div>
            <label className="block font-semibold text-base leading-relaxed">Middle Name</label>
            <input 
              name="middleName" 
              value={personal.middleName} 
              onChange={handlePersonalChange} 
              className="input" 
              disabled={!editMode.personal}
            />
          </div>
          <div>
            <label className="block font-semibold text-base leading-relaxed">Last Name</label>
            <input 
              name="lastName" 
              value={personal.lastName} 
              onChange={handlePersonalChange} 
              className="input" 
              required 
              disabled={!editMode.personal}
            />
          </div>
          <div>
            <label className="block font-semibold text-base leading-relaxed">Gender</label>
            <select 
              name="gender" 
              value={personal.gender} 
              onChange={handlePersonalChange} 
              className="input" 
              required 
              disabled={!editMode.personal}
            >
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-base leading-relaxed">Date of Birth</label>
            <DatePicker
              selected={personal.dob ? new Date(personal.dob) : null}
              onChange={date => handlePersonalChange({ target: { name: 'dob', value: date ? date.toISOString().slice(0, 10) : '' } })}
              customInput={<CustomDateInput placeholder="Select date" />}
              dateFormat="yyyy-MM-dd"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              disabled={!editMode.personal}
            />
          </div>
          <div>
            <label className="block font-semibold text-base leading-relaxed">Aadhaar Number</label>
            <input 
              name="aadhaar" 
              value={personal.aadhaar} 
              onChange={handlePersonalChange} 
              className="input" 
              disabled={!editMode.personal}
            />
          </div>
          <div>
            <label className="block font-semibold text-base leading-relaxed">PAN Number</label>
            <input 
              name="pan" 
              value={personal.pan} 
              onChange={handlePersonalChange} 
              className="input" 
              disabled={!editMode.personal}
            />
          </div>
          <div>
            <label className="block font-semibold text-base leading-relaxed">PIS/PIN Number</label>
            <input 
              name="pisPin" 
              value={personal.pisPin} 
              onChange={handlePersonalChange} 
              className="input" 
              disabled={!editMode.personal}
            />
          </div>
          <div>
            <label className="block font-semibold text-base leading-relaxed">Email</label>
            <input 
              name="email" 
              value={personal.email} 
              onChange={handlePersonalChange} 
              className="input" 
              disabled={!editMode.personal}
            />
          </div>
          <div>
            <label className="block font-semibold text-base leading-relaxed">Pay Level</label>
            <input 
              name="payLevel" 
              value={personal.payLevel} 
              onChange={handlePersonalChange} 
              className="input" 
              disabled={!editMode.personal}
            />
          </div>
          <div>
            <label className="block font-semibold text-base leading-relaxed">Category</label>
            <select 
              name="category" 
              value={personal.category} 
              onChange={handlePersonalChange} 
              className="input"
              disabled={!editMode.personal}
            >
              <option value="">Select</option>
              <option value="GEN">General</option>
              <option value="OBC">Other Backward Class (OBC)</option>
              <option value="SC">Scheduled Caste (SC)</option>
              <option value="ST">Scheduled Tribe (ST)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-base leading-relaxed">Education Qualification</label>
            <input 
              name="educationQualification" 
              value={personal.educationQualification} 
              onChange={handlePersonalChange} 
              className="input" 
              disabled={!editMode.personal}
            />
          </div>
          <div>
            <label className="block font-semibold text-base leading-relaxed">University</label>
            <input 
              name="university" 
              value={personal.university} 
              onChange={handlePersonalChange} 
              className="input" 
              disabled={!editMode.personal}
            />
          </div>
          <div>
            <label className="block font-semibold text-base leading-relaxed">Subject</label>
            <input 
              name="subject" 
              value={personal.subject} 
              onChange={handlePersonalChange} 
              className="input" 
              disabled={!editMode.personal}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold text-base leading-relaxed">Permanent Address</label>
            <textarea 
              name="permAddress" 
              value={personal.permAddress} 
              onChange={handlePersonalChange} 
              className="input" 
              disabled={!editMode.personal}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold text-base leading-relaxed">Temporary Address</label>
            <textarea 
              name="tempAddress" 
              value={personal.tempAddress} 
              onChange={handlePersonalChange} 
              className="input" 
              disabled={!editMode.personal}
            />
          </div>
        </div>
      </form>
    </div>
  );

  // === Service Details Tab ===
  // State: service, editMode.service, backupData.service
  // Handlers: handleServiceChange, handleEditTab('service'), handleSaveTab('service'), handleCancelEdit('service')
  // Render: renderService
  const renderService = () => (
    <div className="space-y-4">
      {/* Tab Header with Edit/Save Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#003366]">Service Details</h2>
        <div className="flex gap-2">
          {!editMode.service ? (
            <button
              onClick={() => handleEditTab('service')}
              className="bg-[#003366] text-white px-4 py-2 rounded-md hover:bg-[#002244] transition-colors"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => handleSaveTab('service')}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => handleCancelEdit('service')}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-base leading-relaxed">Designation</label>
            <select 
              name="designation" 
              value={service.designation} 
              onChange={handleServiceChange} 
              className="input"
              disabled={!editMode.service}
            >
              <option value="">Select</option>
              {DESIGNATION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {service.designation && (
          <div>
              <label className="block font-semibold text-base leading-relaxed">Sub-Designation</label>
              <select 
                name="subDesignation" 
                value={service.subDesignation} 
                onChange={handleServiceChange} 
                className="input"
                disabled={!editMode.service}
              >
                <option value="">Select</option>
                {SUB_DESIGNATION_OPTIONS[service.designation]?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
          </div>
          )}
          <div>
            <label className="block font-semibold text-base leading-relaxed">Pay Level</label>
            <input 
              name="payLevel" 
              value={service.payLevel} 
              onChange={handleServiceChange} 
              className="input" 
              disabled={!editMode.service}
            />
          </div>
          <div>
            <label className="block font-semibold text-base leading-relaxed">Group</label>
            <input 
              name="group" 
              value={service.group} 
              onChange={handleServiceChange} 
              className="input" 
              disabled={!editMode.service}
            />
          </div>
          <div>
            <label className="block font-semibold text-base leading-relaxed">Supervisor</label>
            <input 
              name="supervisor" 
              value={service.supervisor} 
              onChange={handleServiceChange} 
              className="input" 
              disabled={!editMode.service}
            />
          </div>
          <div className="input-date-wrapper">
            <label className="block font-semibold text-base leading-relaxed">Date of Joining</label>
            <DatePicker
              selected={service.dateOfJoining ? new Date(service.dateOfJoining) : null}
              onChange={date => handleServiceChange({ target: { name: 'dateOfJoining', value: date ? date.toISOString().slice(0, 10) : '' } })}
              customInput={<CustomDateInput placeholder="Select date" />}
              dateFormat="yyyy-MM-dd"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              disabled={!editMode.service}
            />
          </div>
          <div className="input-date-wrapper">
            <label className="block font-semibold text-base leading-relaxed">Date of Retirement</label>
            <DatePicker
              selected={service.dateOfRetirement ? new Date(service.dateOfRetirement) : null}
              onChange={date => handleServiceChange({ target: { name: 'dateOfRetirement', value: date ? date.toISOString().slice(0, 10) : '' } })}
              customInput={<CustomDateInput placeholder="Select date" />}
              dateFormat="yyyy-MM-dd"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              disabled={!editMode.service}
            />
          </div>
          <div>
            <label className="block font-semibold text-base leading-relaxed">Date in Present Designation</label>
            <DatePicker
              selected={service.dateCurrentDesig ? new Date(service.dateCurrentDesig) : null}
              onChange={date => handleServiceChange({ target: { name: 'dateCurrentDesig', value: date ? date.toISOString().slice(0, 10) : '' } })}
              customInput={<CustomDateInput placeholder="Select date" />}
              dateFormat="yyyy-MM-dd"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              disabled={!editMode.service}
            />
          </div>
        </div>
      </form>
    </div>
  );

  // === Family Details Tab ===
  // State: family, showSpouse, showChildren, showParents, showEmergency, editMode.family, backupData.family
  // Handlers: handleSpouseChange, handleChildChange, handleAddChild, handleRemoveChild, handleParentChange, handleEmergencyChange, handleEditTab('family'), handleSaveTab('family'), handleCancelEdit('family')
  // Render: renderFamily
  const renderFamily = () => (
    <div className="space-y-6">
      {/* Spouse */}
      <div className="rounded-xl shadow bg-white p-6 mb-2">
        <button type="button" className="flex items-center w-full justify-between bg-[#003366] text-white px-4 py-3 rounded-t-xl font-semibold text-lg focus:outline-none" onClick={() => setShowSpouse(v => !v)}>
          <span>Spouse Details</span>
          <span>{showSpouse ? '-' : '+'}</span>
        </button>
        {showSpouse && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block font-medium text-black">Full Name</label>
              <input name="name" value={family.spouse.name} onChange={handleSpouseChange} className="input" />
            </div>
            <div>
              <label className="block font-medium text-black">DOB</label>
              <DatePicker
                selected={family.spouse.dob ? new Date(family.spouse.dob) : null}
                onChange={date => handleSpouseChange({ target: { name: 'dob', value: date ? date.toISOString().slice(0, 10) : '' } })}
                customInput={<CustomDateInput placeholder="Select date" />}
                dateFormat="yyyy-MM-dd"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
              />
            </div>
            <div>
              <label className="block font-medium text-black">Occupation</label>
              <input name="occupation" value={family.spouse.occupation} onChange={handleSpouseChange} className="input" />
            </div>
          </div>
        )}
      </div>
      {/* Children */}
      <div className="rounded-xl shadow bg-white p-6 mb-2">
        <button type="button" className="flex items-center w-full justify-between bg-[#003366] text-white px-4 py-3 rounded-t-xl font-semibold text-lg focus:outline-none" onClick={() => setShowChildren(v => !v)}>
          <span>Children Details</span>
          <span>{showChildren ? '-' : '+'}</span>
        </button>
        {showChildren && (
          <div className="space-y-4 mt-4">
            {family.children.map((child, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end bg-blue-50 rounded-lg p-4">
                <div>
                  <label className="block font-medium text-black">Name</label>
                  <input name="name" value={child.name} onChange={e => handleChildChange(idx, e)} className="input" />
                </div>
                <div>
                  <label className="block font-medium text-black">Gender</label>
                  <select name="gender" value={child.gender} onChange={e => handleChildChange(idx, e)} className="input">
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-black">DOB</label>
                  <DatePicker
                    selected={child.dob ? new Date(child.dob) : null}
                    onChange={date => handleChildChange(idx, { target: { name: 'dob', value: date ? date.toISOString().slice(0, 10) : '' } })}
                    customInput={<CustomDateInput placeholder="Select date" />}
                    dateFormat="yyyy-MM-dd"
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => handleRemoveChild(idx)} className="ml-2 text-red-500 bg-white border border-red-200 rounded-full p-2 hover:bg-red-50 transition"><FaTrash /></button>
                </div>
              </div>
            ))}
            <button type="button" onClick={handleAddChild} className="btn-primary flex items-center gap-2 mt-2"><FaPlus /> Add Child</button>
          </div>
        )}
      </div>
      {/* Parents */}
      <div className="rounded-xl shadow bg-white p-6 mb-2">
        <button type="button" className="flex items-center w-full justify-between bg-[#003366] text-white px-4 py-3 rounded-t-xl font-semibold text-lg focus:outline-none" onClick={() => setShowParents(v => !v)}>
          <span>Parent Details</span>
          <span>{showParents ? '-' : '+'}</span>
        </button>
        {showParents && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {/* Father */}
            <div>
              <label className="block font-medium text-black">Father's Name</label>
              <input name="name" value={family.father.name} onChange={e => handleParentChange('father', e)} className="input" />
              <label className="block font-medium text-black mt-2">DOB</label>
              <DatePicker
                selected={family.father.dob ? new Date(family.father.dob) : null}
                onChange={date => handleParentChange('father', { target: { name: 'dob', value: date ? date.toISOString().slice(0, 10) : '' } })}
                customInput={<CustomDateInput placeholder="Select date" />}
                dateFormat="yyyy-MM-dd"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
              />
              <label className="block font-medium text-black mt-2">Address (if different)</label>
              <input name="address" value={family.father.address} onChange={e => handleParentChange('father', e)} className="input" />
            </div>
            {/* Mother */}
            <div>
              <label className="block font-medium text-black">Mother's Name</label>
              <input name="name" value={family.mother.name} onChange={e => handleParentChange('mother', e)} className="input" />
              <label className="block font-medium text-black mt-2">DOB</label>
              <DatePicker
                selected={family.mother.dob ? new Date(family.mother.dob) : null}
                onChange={date => handleParentChange('mother', { target: { name: 'dob', value: date ? date.toISOString().slice(0, 10) : '' } })}
                customInput={<CustomDateInput placeholder="Select date" />}
                dateFormat="yyyy-MM-dd"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
              />
              <label className="block font-medium text-black mt-2">Address (if different)</label>
              <input name="address" value={family.mother.address} onChange={e => handleParentChange('mother', e)} className="input" />
            </div>
          </div>
        )}
      </div>
      {/* Emergency Contact */}
      <div className="rounded-xl shadow bg-white p-6 mb-2">
        <button type="button" className="flex items-center w-full justify-between bg-[#003366] text-white px-4 py-3 rounded-t-xl font-semibold text-lg focus:outline-none" onClick={() => setShowEmergency(v => !v)}>
          <span>Emergency Contact</span>
          <span>{showEmergency ? '-' : '+'}</span>
        </button>
        {showEmergency && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block font-medium text-black">Name</label>
              <input name="name" value={family.emergency.name} onChange={handleEmergencyChange} className="input" />
            </div>
            <div>
              <label className="block font-medium text-black">Relation</label>
              <input name="relation" value={family.emergency.relation} onChange={handleEmergencyChange} className="input" />
            </div>
            <div>
              <label className="block font-medium text-black">Mobile Number</label>
              <input name="mobile" value={family.emergency.mobile} onChange={handleEmergencyChange} className="input" />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block font-medium text-black">Address</label>
              <input name="address" value={family.emergency.address} onChange={handleEmergencyChange} className="input" />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // === Documents Tab ===
  // State: docFiles, editMode.documents, backupData.documents
  // Handlers: handleDocFileChangeStructured, handleDeleteDocStructured, handleViewDocStructured, handleDownloadDocStructured, handleEditTab('documents'), handleSaveTab('documents'), handleCancelEdit('documents')
  // Render: renderDocuments
  const renderDocuments = () => (
    <div className="space-y-8">
      {DOCUMENT_CATEGORIES.map(cat => (
        <div key={cat.category}>
          <h3 className="text-lg font-bold text-blue-800 mb-2">{cat.category}</h3>
          <div className="space-y-3">
            {cat.docs.map(doc => (
              <div key={doc.key} className="flex flex-col md:flex-row md:items-center gap-2 bg-gray-50 rounded p-3 shadow-sm">
                <label className="flex-1 font-medium text-black">
                  {doc.label}
                  {doc.required ? <span className="text-red-600 ml-1">*</span> : <span className="text-gray-500 ml-1">(Optional)</span>}
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={e => handleDocFileChangeStructured(doc.key, e)}
                  className="input flex-1"
                />
                {docFiles[doc.key] && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#003366] font-semibold">{docFiles[doc.key].name}</span>
                    <button type="button" onClick={() => handleViewDocStructured(doc.key)} className="text-[#003366]"><FaEye /></button>
                    <button type="button" onClick={() => handleDownloadDocStructured(doc.key)} className="text-[#003366]"><FaDownload /></button>
                    <button type="button" onClick={() => handleDeleteDocStructured(doc.key)} className="text-red-600"><FaTrash /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // === Add Scientist Modal Section ===
  // State: showAddScientistModal, addScientistForm
  // Handlers: handleAddScientistFormChange, handleAddScientistSubmit, handleCloseAddScientistModal
  // Render: renderAddScientistModal
  const renderAddScientistModal = () => (
    showAddScientistModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#003366]">Add New Scientist</h2>
            <button
              onClick={handleCloseAddScientistModal}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleAddScientistSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-[#003366] mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-sm mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstname"
                    value={addScientistForm.firstname}
                    onChange={handleAddScientistFormChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Middle Name</label>
                  <input
                    type="text"
                    name="middlename"
                    value={addScientistForm.middlename}
                    onChange={handleAddScientistFormChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastname"
                    value={addScientistForm.lastname}
                    onChange={handleAddScientistFormChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={addScientistForm.email}
                    onChange={handleAddScientistFormChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Gender *</label>
                  <select
                    name="gender"
                    value={addScientistForm.gender}
                    onChange={handleAddScientistFormChange}
                    className="input"
                    required
                  >
                    <option value="">Select</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={addScientistForm.password}
                    onChange={handleAddScientistFormChange}
                    className="input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Identity Documents */}
            <div>
              <h3 className="text-lg font-semibold text-[#003366] mb-4">Identity Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-sm mb-1">Aadhaar Number</label>
                  <input
                    type="text"
                    name="aadhaar"
                    value={addScientistForm.aadhaar}
                    onChange={handleAddScientistFormChange}
                    className="input"
                    maxLength="12"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">PAN Number</label>
                  <input
                    type="text"
                    name="pan_number"
                    value={addScientistForm.pan_number}
                    onChange={handleAddScientistFormChange}
                    className="input"
                    maxLength="10"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">PIS/PIN Number</label>
                  <input
                    type="text"
                    name="pis_pin_number"
                    value={addScientistForm.pis_pin_number}
                    onChange={handleAddScientistFormChange}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Education & Professional Details */}
            <div>
              <h3 className="text-lg font-semibold text-[#003366] mb-4">Education & Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-sm mb-1">Education Qualification</label>
                  <input
                    type="text"
                    name="education_qualification"
                    value={addScientistForm.education_qualification}
                    onChange={handleAddScientistFormChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">University</label>
                  <input
                    type="text"
                    name="university"
                    value={addScientistForm.university}
                    onChange={handleAddScientistFormChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={addScientistForm.subject}
                    onChange={handleAddScientistFormChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Category</label>
                  <select
                    name="category"
                    value={addScientistForm.category}
                    onChange={handleAddScientistFormChange}
                    className="input"
                  >
                    <option value="">Select</option>
                    <option value="GEN">General</option>
                    <option value="OBC">Other Backward Class (OBC)</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Research Area</label>
                  <input
                    type="text"
                    name="research_area"
                    value={addScientistForm.research_area}
                    onChange={handleAddScientistFormChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Grade</label>
                  <select
                    name="grade"
                    value={addScientistForm.grade}
                    onChange={handleAddScientistFormChange}
                    className="input"
                  >
                    <option value="">Select</option>
                    <option value="H">H</option>
                    <option value="G">G</option>
                    <option value="F">F</option>
                    <option value="E">E</option>
                    <option value="D">D</option>
                    <option value="C">C</option>
                    <option value="B">B</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Pay Level</label>
                  <input
                    type="text"
                    name="pay_level"
                    value={addScientistForm.pay_level}
                    onChange={handleAddScientistFormChange}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Important Dates */}
            <div>
              <h3 className="text-lg font-semibold text-[#003366] mb-4">Important Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-sm mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={addScientistForm.date_of_birth}
                    onChange={handleAddScientistFormChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Date of Joining</label>
                  <input
                    type="date"
                    name="date_of_joining"
                    value={addScientistForm.date_of_joining}
                    onChange={handleAddScientistFormChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Date of Retirement</label>
                  <input
                    type="date"
                    name="date_of_retirement"
                    value={addScientistForm.date_of_retirement}
                    onChange={handleAddScientistFormChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Date in Present Designation</label>
                  <input
                    type="date"
                    name="date_in_present_designation"
                    value={addScientistForm.date_in_present_designation}
                    onChange={handleAddScientistFormChange}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div>
              <h3 className="text-lg font-semibold text-[#003366] mb-4">Addresses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-sm mb-1">Permanent Address</label>
                  <textarea
                    name="address1_permanent"
                    value={addScientistForm.address1_permanent}
                    onChange={handleAddScientistFormChange}
                    className="input"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Temporary Address</label>
                  <textarea
                    name="address2_temporary"
                    value={addScientistForm.address2_temporary}
                    onChange={handleAddScientistFormChange}
                    className="input"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleCloseAddScientistModal}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#003366] text-white rounded-md hover:bg-[#002244] transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Scientist'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  // --- Main Render ---
  return (
    <div
      className="flex flex-col min-h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage: 'url("/Bgdrdo.jpeg")',
        minHeight: '100vh',
        minWidth: '100vw',
        fontFamily: 'Inter, Roboto, Open Sans, sans-serif',
      }}
    >
      {/* Header (copied from Home.jsx) */}
      <header className="bg-[#003366] text-white py-4 text-center shadow-md">
        <div className="overflow-hidden whitespace-nowrap">
          <p className="animate-scroll text-3xl font-bold">Welcome to DRDO</p>
        </div>
      </header>

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
        <div className="fixed top-0 left-0 w-72 h-full bg-[#003366] text-white z-40 flex flex-col items-center pt-10 shadow-2xl">
          {/* Profile Image */}
          <img
            src={profilePicUrl || "/Profile.jpeg"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white mb-4"
          />
          <div className="font-bold text-xl mb-8 text-center">
            {personal.firstName} {personal.lastName}
          </div>
          
          {/* Sidebar Buttons */}
          <button 
            className="w-11/12 py-3 mb-3 bg-white text-[#003366] border-none rounded font-bold text-base cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={handleAddNewScientist}
          >
            ADD NEW SCIENTIST
          </button>
          
          <button 
            className="w-11/12 py-3 mb-3 bg-white text-[#003366] border-none rounded font-bold text-base cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={handleGoToDashboard}
          >
            SEARCH
          </button>
          
          <button 
            className="w-11/12 py-3 mb-3 bg-red-600 text-white border-none rounded font-bold text-base cursor-pointer hover:bg-red-700 transition-colors"
            onClick={handleLogout}
          >
            LOGOUT
          </button>
          
          <button 
            className="w-11/12 py-3 mt-auto mb-5 bg-white text-[#003366] border-none rounded font-bold text-base cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={handleSidebarToggle}
          >
            CLOSE
          </button>
        </div>
      )}
      {/* Tabs */}
      <nav className="top-[56px] z-10 bg-white shadow flex gap-4 px-6 py-4 border-b" style={{fontFamily: 'Inter, Roboto, Open Sans, sans-serif'}}>
        {TAB_LIST.map((t, i) => (
          <button
            key={t.label}
            className={`flex items-center gap-3 px-7 py-3 rounded-t-xl font-semibold text-base transition-all duration-200
              ${tab === i
                ? 'bg-[#003366] text-white shadow border-b-4 border-[#003366]'
                : 'bg-blue-50 text-[#003366] hover:bg-blue-100'}
            `}
            style={{minWidth: '180px'}}
            onClick={() => setTab(i)}
          >
            {React.cloneElement(t.icon, { className: 'text-lg' })} {t.label}
          </button>
        ))}
      </nav>
      {/* Tab Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-10 w-full h-full">
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-2xl w-full md:w-3/4 p-6 mb-6">
          {loading && <p>Loading profile...</p>}
          {error && <p style={{ color: 'red' }}>{error.message}</p>}
          {!loading && !error && (
            <>
              {tab === 0 && renderPersonal()}
              {tab === 1 && renderService()}
              {tab === 2 && renderFamily()}
              {tab === 3 && renderDocuments()}
            </>
          )}
        </div>
      </main>
      {/* Footer (copied from Home.jsx) */}
      <footer className="bg-blue-900 text-white text-center py-3 text-sm">
        &copy; {new Date().getFullYear()} DRDO. All rights reserved.
      </footer>

      {/* Add Scientist Modal */}
      {renderAddScientistModal()}

      {/* Custom Scroll Animation (copied from Home.jsx) */}
      <style>{`
        .animate-scroll {
          display: inline-block;
          animation: scrollText 10s linear infinite;
        }
        @keyframes scrollText {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .input { border: 1px solid #000; background-color: #eaf4ff; min-height: 40px; width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.375rem; }
        .btn-primary { background-color: #003366; color: #fff; padding: 0.5rem 1rem; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); font-weight: 600; transition: background 0.2s; }
        .btn-primary:hover { background-color: #002244; }
        .btn-secondary { background-color: #e5e7eb; color: #003366; padding: 0.5rem 1rem; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); font-weight: 600; transition: background 0.2s; }
        .btn-secondary:hover { background-color: #d1d5db; }
        label { color: #000 !important; }
        select.input, select.input option { color: #000 !important; background-color: #eaf4ff; }
        input[type='date'].input { color: #000 !important; background-color: #eaf4ff; accent-color: #003366; }
        .input-date-wrapper { position: relative; display: inline-block; width: 100%; }
        .input-date-wrapper input.input {
          width: 100%;
          padding-right: 2.5rem;
        }
        .input-date-wrapper .calendar-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          cursor: pointer;
          pointer-events: auto;
        }
        input[type="date"].custom-date::-webkit-calendar-picker-indicator { opacity: 0; display: none; }
      `}</style>
    </div>
  );
}

export default ProfileTabs; 