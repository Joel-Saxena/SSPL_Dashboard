import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ScientistProfile() {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('group_id');
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [phones, setPhones] = useState([]);
  const [landlines, setLandlines] = useState([]);

  const [formData, setFormData] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    email: '',
    gender: '',
    salary: '',
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
    address2_temporary: ''
  });


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/admin/scientist/${id}`,
          { params: { admin_group_id: groupId } }
        );
        const { profile, phones, landlines } = response.data;
        setProfile(profile);
        setPhones(phones);         // <— here
        setLandlines(landlines);   // <— and here
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);


  const handleDelete = async () => {
    try {
      // Should not provide option to delete scientist from frontend!
      // await axios.delete(`http://localhost:5000/api/admin/scientist/${id}`);
      alert('Not authorized to delete a scientist!');
    } catch (err) {
      console.error(err);
      alert('Failed to delete scientist');
    }
  };

  const handleUpdate = () => setShowUpdateForm(true);
  const handleCloseUpdate = () => setShowUpdateForm(false);
  const handleUpdated = () => window.location.reload();

  const handleAddScientist = () => setShowAddForm(true);
  const handleCloseAdd = () => setShowAddForm(false);
  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/scientist', {
        ...formData,
        admin_group_id: groupId
      });
      alert('Scientist added successfully!');
      setShowAddForm(false);
      // reset all fields
      setFormData({
        firstname: '',
        middlename: '',
        lastname: '',
        email: '',
        gender: '',
        salary: '',
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
        address2_temporary: ''
      });
      navigate('/AdminDashboard?group_id=' + groupId);
    } catch (err) {
      console.error(err);
      alert('Failed to add scientist');
    }
  };


  // Layout: No vertical scroll, so we use a centered card and sidebar
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#F4F6F9',
      fontFamily: 'Segoe UI, sans-serif',
      boxSizing: 'border-box',
      padding: '0',
      overflow: 'auto',
      color: '#000',
    }}>
      {/* Header */}
      <header style={{
        background: '#003366',
        color: '#fff',
        padding: '0',
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        width: '100%'
      }}>
        Scientist Profile
      </header>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0',
          position: 'fixed', top: 10, left: 10, zIndex: 1000,
          background: '#003366', color: '#fff', border: 'none', borderRadius: '50%', width: 48, height: 48, fontSize: 24, cursor: 'pointer'
        }}
        aria-label="Open sidebar"
      >☰</button>

      {/* Sidebar */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: 280, height: '100vh', background: '#003366', color: '#fff', zIndex: 999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40
        }}>
          {/* Scientist Image */}
          <img
            src={"/Profile.jpeg"}
            alt="Scientist"
            style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', marginBottom: 16 }}
          />
          <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 32 }}>{profile?.firstname} {profile?.lastname}</div>
          <button style={sidebarBtn} onClick={handleUpdate}>UPDATE</button>
          <button style={sidebarBtn} onClick={handleAddScientist}>ADD SCIENTIST</button>
          <button style={sidebarBtn} onClick={() => navigate('/AdminDashboard?group_id=' + groupId)}>SEARCH</button>
          <button style={{ ...sidebarBtn, background: '#c00', color: '#fff' }} onClick={handleDelete}>DELETE SCIENTIST</button>
          <button style={{ ...sidebarBtn, marginTop: 'auto', marginBottom: 20 }} onClick={() => setSidebarOpen(false)}>Close</button>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '40px 16px 100px 16px',
        boxSizing: 'border-box',
        minHeight: 'calc(100vh - 60px)',
        width: '100%',
      }}>
        <main style={{
          width: '100%',
          maxWidth: 700,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 8px #eee',
          padding: 32,
          marginTop: 20,
          marginBottom: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <img
                src={"/Profile.jpeg"}
                alt="Scientist"
                style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid #003366', marginBottom: 16 }}
              />
              <div style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 24 }}>
                {profile.firstname} {profile.lastname}
              </div>

              {/* Personal Details */}
              <SectionHeader>Personal Details</SectionHeader>
              <DetailsTable>
                <ProfileRow label="Name" value={`${profile.firstname} ${profile.lastname}`} />
                <ProfileRow label="Email" value={profile.email} />
                <ProfileRow label="Gender" value={profile.gender} />
                <ProfileRow label="Aadhaar" value={profile.aadhaar} />
                <ProfileRow label="PAN" value={profile.pan_number} />
                <ProfileRow label="PIS/PIN" value={profile.pis_pin_number} />
                <ProfileRow label="Date of Birth" value={profile.date_of_birth} />
              </DetailsTable>

              {/* Contact Numbers */}
              <SectionHeader>Contact Numbers</SectionHeader>
              <DetailsTable>
                <ProfileRow label="Phone Numbers" value={phones.map(p => p.phone_no).join(', ')} />
                <ProfileRow label="Landlines" value={landlines.map(l => l.landline_no).join(', ')} />
              </DetailsTable>

              {/* Job Details */}
              <SectionHeader>Job Details</SectionHeader>
              <DetailsTable>
                <ProfileRow label="Category" value={profile.category} />
                <ProfileRow label="Research Area" value={profile.research_area} />
                <ProfileRow label="Grade" value={profile.grade} />
                <ProfileRow label="Pay Level" value={profile.pay_level} />
                <ProfileRow label="Group ID" value={profile.group_id} />
                <ProfileRow label="Date Joined" value={profile.date_of_joining} />
                <ProfileRow label="Present Since" value={profile.date_in_present_designation} />
                <ProfileRow label="Retirement Date" value={profile.date_of_retirement} />
              </DetailsTable>

              {/* Education & Qualification */}
              <SectionHeader>Education & Qualification</SectionHeader>
              <DetailsTable>
                <ProfileRow label="Qualification" value={profile.education_qualification} />
                <ProfileRow label="University" value={profile.university} />
                <ProfileRow label="Subject" value={profile.subject} />
              </DetailsTable>

              {/* Addresses */}
              <SectionHeader>Addresses</SectionHeader>
              <DetailsTable>
                <ProfileRow label="Permanent Address" value={profile.address1_permanent} />
                <ProfileRow label="Temporary Address" value={profile.address2_temporary} />
              </DetailsTable>

              {/* Work History */}
              {Array.isArray(profile.history) && profile.history.length > 0 && (
                <>
                  <SectionHeader>Work History</SectionHeader>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
                    <thead>
                      <tr style={{ background: '#e6eaf0' }}>
                        <th style={thStyle}>Designation</th>
                        <th style={thStyle}>Start Date</th>
                        <th style={thStyle}>End Date</th>
                        <th style={thStyle}>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.history.map((h, idx) => (
                        <tr key={idx}>
                          <td style={tdStyle}>{h.designation}</td>
                          <td style={tdStyle}>{h.start_date}</td>
                          <td style={tdStyle}>{h.end_date}</td>
                          <td style={tdStyle}>{h.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}
        </main>
      </div>


      {/* Update Scientist Modal */}
      {showUpdateForm && (
        <UpdateScientistForm
          profile={profile}
          onClose={handleCloseUpdate}
          onUpdated={handleUpdated}
        />
      )}


      {/* Add Scientist Modal */}
      {showAddForm && (
        <AddScientistForm
          formData={formData}
          onClose={handleCloseAdd}
          onSubmit={handleAddSubmit}
          onChange={handleFormChange}
        />
      )}


      {/* Footer */}
      <footer style={{
        background: '#003366',
        color: '#fff',
        textAlign: 'center',
        padding: 16,
        position: 'fixed',
        width: '100%',
        bottom: 0,
        marginTop: 'auto',
        boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)'
      }}>
        &copy; {new Date().getFullYear()} DRDO. All rights reserved.
      </footer>
    </div>
  );
}

// Sidebar button style
const sidebarBtn = {
  width: '90%',
  padding: '12px 0',
  margin: '8px 0',
  background: '#fff',
  color: '#003366',
  border: 'none',
  borderRadius: 6,
  fontWeight: 'bold',
  fontSize: 16,
  cursor: 'pointer'
};

// Section header component
function SectionHeader({ children }) {
  return <h2 style={{ color: '#003366', fontSize: 20, fontWeight: 'bold', margin: '32px 0 12px 0', alignSelf: 'flex-start' }}>{children}</h2>;
}

// Table for details
function DetailsTable({ children }) {
  return <div style={{ width: '100%', maxWidth: 500, border: '1px solid #e6eaf0', borderRadius: 8, marginBottom: 12, background: '#f9fbfd', padding: 16 }}>{children}</div>;
}

// Table cell styles for Work History
const thStyle = {
  padding: '8px',
  borderBottom: '1px solid #d1d5db',
  color: '#003366',
  fontWeight: 'bold',
  textAlign: 'left',
};
const tdStyle = {
  padding: '8px',
  borderBottom: '1px solid #e6eaf0',
  color: '#000',
};

// Profile row component
function ProfileRow({ label, value, isEditMode = false, onChange, name }) {
  return (
    <div style={{ display: 'flex', marginBottom: 12, alignItems: 'center' }}>
      <div style={{ width: 180, fontWeight: 'bold' }}>{label}:</div>
      <div style={{ flex: 1 }}>
        {isEditMode ? (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange && onChange(name, e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: '#fff',
              color: '#000'
            }}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        ) : (
          <div style={{
            padding: '8px 12px',
            border: '1px solid #e6eaf0',
            borderRadius: '4px',
            backgroundColor: '#f9fbfd',
            minHeight: '20px',
            color: value ? '#000' : '#888'
          }}>
            {value || 'N/A'}
          </div>
        )}
      </div>
    </div>
  );
}

function UpdateScientistForm({ profile, onClose, onUpdated }) {
  const [form, setForm] = useState({
    firstname: profile.firstname || '',
    middlename: profile.middlename || '',
    lastname: profile.lastname || '',
    email: profile.email || '',
    gender: profile.gender || '',
    salary: profile.salary || '',
    aadhaar: profile.aadhaar || '',
    pan_number: profile.pan_number || '',
    pis_pin_number: profile.pis_pin_number || '',
    education_qualification: profile.education_qualification || '',
    category: profile.category || '',
    research_area: profile.research_area || '',
    grade: profile.grade || '',
    pay_level: profile.pay_level || '',
    university: profile.university || '',
    subject: profile.subject || '',
    date_of_birth: profile.date_of_birth || '',
    date_of_joining: profile.date_of_joining || '',
    date_of_retirement: profile.date_of_retirement || '',
    date_in_present_designation: profile.date_in_present_designation || '',
    address1_permanent: profile.address1_permanent || '',
    address2_temporary: profile.address2_temporary || '',
    admin_group_id: profile.group_id || ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.put(`http://localhost:5000/api/admin/scientist/${profile.id}`, form);
      setSuccess('Scientist updated successfully!');
      if (onUpdated) onUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}>
      <div style={{
        background: '#fff', padding: 32, borderRadius: 12, minWidth: 500, color: '#000', maxHeight: '80vh', overflow: 'auto'
      }}>
        <h2 style={{ color: '#003366', marginBottom: 16 }}>Update Scientist</h2>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: 8 }}>{success}</div>}
        <form onSubmit={handleSubmit}>
          {/* Personal Details */}
          <SectionHeader>Personal Details</SectionHeader>
          <DetailsTable>
            <ProfileRow label="First Name" value={form.firstname} isEditMode={true} onChange={handleChange} name="firstname" />
            <ProfileRow label="Last Name" value={form.lastname} isEditMode={true} onChange={handleChange} name="lastname" />
            <ProfileRow label="Email" value={form.email} isEditMode={true} onChange={handleChange} name="email" />
            <ProfileRow label="Gender" value={form.gender} isEditMode={true} onChange={handleChange} name="gender" />
            <ProfileRow label="Aadhaar" value={form.aadhaar} isEditMode={true} onChange={handleChange} name="aadhaar" />
          </DetailsTable>
          {/* Job Details */}
          <SectionHeader>Job Details</SectionHeader>
          <DetailsTable>
            <ProfileRow label="Category" value={form.category} isEditMode={true} onChange={handleChange} name="category" />
            <ProfileRow label="Research Area" value={form.research_area} isEditMode={true} onChange={handleChange} name="research_area" />
            <ProfileRow label="Grade" value={form.grade} isEditMode={true} onChange={handleChange} name="grade" />
            <ProfileRow label="Salary" value={form.salary} isEditMode={true} onChange={handleChange} name="salary" />
          </DetailsTable>
          {/* Education */}
          <SectionHeader>Education</SectionHeader>
          <DetailsTable>
            <ProfileRow label="Education Qualification" value={form.education_qualification} isEditMode={true} onChange={handleChange} name="education_qualification" />
          </DetailsTable>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
            <button type="submit" style={btnStyle}>Update Scientist</button>
            <button type="button" style={btnStyle} onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddScientistForm({ formData, onClose, onSubmit, onChange }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}>
      <div style={{
        background: '#fff', padding: 32, borderRadius: 12, minWidth: 500, color: '#000', maxHeight: '80vh', overflow: 'auto'
      }}>
        <h2 style={{ color: '#003366', marginBottom: 16 }}>Add New Scientist</h2>
        <form onSubmit={onSubmit}>
          {/* Personal */}
          <SectionHeader>Personal Details</SectionHeader>
          <DetailsTable>
            <ProfileRow label="First Name" value={formData.firstname} isEditMode name="firstname" onChange={onChange} />
            <ProfileRow label="Middle Name" value={formData.middlename} isEditMode name="middlename" onChange={onChange} />
            <ProfileRow label="Last Name" value={formData.lastname} isEditMode name="lastname" onChange={onChange} />
            <ProfileRow label="Email" value={formData.email} isEditMode name="email" onChange={onChange} />
            <ProfileRow label="Gender" value={formData.gender} isEditMode name="gender" onChange={onChange} />
            <ProfileRow label="Aadhaar" value={formData.aadhaar} isEditMode name="aadhaar" onChange={onChange} />
            <ProfileRow label="PAN" value={formData.pan_number} isEditMode name="pan_number" onChange={onChange} />
            <ProfileRow label="PIS/PIN" value={formData.pis_pin_number} isEditMode name="pis_pin_number" onChange={onChange} />
            <ProfileRow label="DOB" value={formData.date_of_birth} isEditMode name="date_of_birth" onChange={onChange} />
          </DetailsTable>

          {/* Contact */}
          <SectionHeader>Contact Numbers</SectionHeader>
          <DetailsTable>
            <ProfileRow label="Phone Numbers" value={formData.phone_no || ''} isEditMode name="phone_no" onChange={onChange} />
            <ProfileRow label="Landlines" value={formData.landline_no || ''} isEditMode name="landline_no" onChange={onChange} />
          </DetailsTable>

          {/* Job */}
          <SectionHeader>Job Details</SectionHeader>
          <DetailsTable>
            <ProfileRow label="Category" value={formData.category} isEditMode name="category" onChange={onChange} />
            <ProfileRow label="Research Area" value={formData.research_area} isEditMode name="research_area" onChange={onChange} />
            <ProfileRow label="Grade" value={formData.grade} isEditMode name="grade" onChange={onChange} />
            <ProfileRow label="Pay Level" value={formData.pay_level} isEditMode name="pay_level" onChange={onChange} />
          </DetailsTable>

          {/* Education */}
          <SectionHeader>Education</SectionHeader>
          <DetailsTable>
            <ProfileRow label="Qualification" value={formData.education_qualification} isEditMode name="education_qualification" onChange={onChange} />
            <ProfileRow label="University" value={formData.university} isEditMode name="university" onChange={onChange} />
            <ProfileRow label="Subject" value={formData.subject} isEditMode name="subject" onChange={onChange} />
          </DetailsTable>

          {/* Dates & Addresses */}
          <SectionHeader>Dates & Addresses</SectionHeader>
          <DetailsTable>
            <ProfileRow label="Date Joined" value={formData.date_of_joining} isEditMode name="date_of_joining" onChange={onChange} />
            <ProfileRow label="Since Designation" value={formData.date_in_present_designation} isEditMode name="date_in_present_designation" onChange={onChange} />
            <ProfileRow label="Retirement" value={formData.date_of_retirement} isEditMode name="date_of_retirement" onChange={onChange} />
            <ProfileRow label="Permanent Addr" value={formData.address1_permanent} isEditMode name="address1_permanent" onChange={onChange} />
            <ProfileRow label="Temporary Addr" value={formData.address2_temporary} isEditMode name="address2_temporary" onChange={onChange} />
          </DetailsTable>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
            <button type="submit" style={btnStyle}>Add Scientist</button>
            <button type="button" style={btnStyle} onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}


const btnStyle = {
  background: '#003366', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer'
};
