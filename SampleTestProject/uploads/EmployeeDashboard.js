import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { employeeAPI, attendanceAPI, leaveAPI, profileEditAPI, salaryAPI, uploadAPI, bonusAPI, managerProjectAPI, resignationAPI, employeeDocumentAPI, bgvAPI, hrPolicyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import MyExitStatusPage from './MyExitStatusPage';
import DocumentUploadSection from '../components/DocumentUploadSection';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'MANAGER' || user?.role === 'GENERAL_MANAGER' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <div>
      <Navbar title="Employee Dashboard" />
      <div style={styles.container}>
        <Sidebar isManager={isManager} />
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<MyProfile />} />
            <Route path="/attendance" element={<MyAttendance />} />
            <Route path="/leaves" element={<MyLeaves />} />
            <Route path="/salary" element={<MySalary />} />
            <Route path="/my-projects" element={<EmployeeMyProjects />} />
            <Route path="/my-resignation" element={<MyExitStatusPage />} />
            <Route path="/documents" element={<DocumentUploadSection />} />
            {isManager && <Route path="/projects" element={<ManagerProjects />} />}
            {isManager && <Route path="/resignation-approvals" element={<ManagerResignationApprovals />} />}
            <Route path="/my-bgv" element={<MyBGVPage />} />
            <Route path="/my-policies" element={<MyPoliciesPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ isManager }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/employee', label: 'My Profile', icon: '👤' },
    { path: '/employee/attendance', label: 'My Attendance', icon: '📅' },
    { path: '/employee/leaves', label: 'My Leaves', icon: '🏖️' },
    { path: '/employee/salary', label: 'My Salary', icon: '💰' },
    { path: '/employee/my-projects', label: 'My Projects', icon: '📋' },
    { path: '/employee/my-resignation', label: 'My Resignation', icon: '🚪' },
    { path: '/employee/documents', label: 'My Documents', icon: '📄' },
  ];

  // Add Manager Projects menu for managers (to manage their own projects)
  if (isManager) {
    menuItems.push({ path: '/employee/projects', label: 'Manage Projects', icon: '📁' });
    menuItems.push({ path: '/employee/resignation-approvals', label: 'Resignation Approvals', icon: '📝' });
  }
  
  // Add BGV and HR Policies for all employees
  menuItems.push({ path: '/employee/my-bgv', label: 'My BGV', icon: '🔍' });
  menuItems.push({ path: '/employee/my-policies', label: 'My Policies', icon: '📋' });

  return (
    <div style={styles.sidebar}>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            ...styles.menuItem,
            backgroundColor: location.pathname === item.path ? '#27ae60' : 'transparent',
            color: location.pathname === item.path ? 'white' : '#333',
          }}
        >
          <span>{item.icon}</span> {item.label}
        </Link>
      ))}
    </div>
  );
};

// Editable Info Item Component
const EditableInfoItem = ({ label, value, fieldName, onEdit, canEdit = true }) => {
  return (
    <div style={styles.infoItem}>
      <span style={styles.infoLabel}>{label}</span>
      <div style={styles.editableValue}>
        <span style={styles.infoValue}>{value || '-'}</span>
        {canEdit && (
          <button 
            onClick={() => onEdit(fieldName, value)}
            style={styles.editIconBtn}
            title={`Edit ${label}`}
          >
            ✏️
          </button>
        )}
      </div>
    </div>
  );
};

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editRequests, setEditRequests] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState({ name: '', label: '', value: '' });
  const [newValue, setNewValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Profile picture upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
    loadEditRequests();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await employeeAPI.getMyProfile();
      setProfile(res.data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadEditRequests = async () => {
    try {
      const res = await profileEditAPI.getMyRequests();
      setEditRequests(res.data || []);
    } catch (error) {
      // Silently fail - edit requests are not critical
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadProfilePicture = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      // Upload the file
      const uploadRes = await uploadAPI.uploadProfilePicture(selectedFile);
      const fileUrl = uploadRes.data.fileUrl;

      // Update profile with new picture URL
      await employeeAPI.updateProfilePicture(fileUrl);

      // Update local state
      setProfile({ ...profile, profilePictureUrl: fileUrl });
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleEditClick = (fieldName, currentValue) => {
    const fieldLabels = {
      phoneNumber: 'Phone Number',
      address: 'Address',
    };
    setEditingField({ 
      name: fieldName, 
      label: fieldLabels[fieldName], 
      value: currentValue 
    });
    setNewValue(currentValue || '');
    setShowEditModal(true);
  };

  const handleSubmitEdit = async () => {
    if (!newValue.trim()) {
      toast.error('Please enter a new value');
      return;
    }

    setSubmitting(true);
    try {
      await profileEditAPI.requestEdit({
        fieldName: editingField.name,
        newValue: newValue,
      });
      toast.success(`Edit request for ${editingField.label} submitted successfully!`);
      setShowEditModal(false);
      setNewValue('');
      loadEditRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit edit request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#27ae60';
      case 'PENDING': return '#f39c12';
      case 'REJECTED': return '#e74c3c';
      default: return '#7f8c8d';
    }
  };

  const getFieldLabel = (fieldName) => {
    switch (fieldName) {
      case 'phoneNumber': return 'Phone Number';
      case 'address': return 'Address';
      default: return fieldName;
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading profile...</div>;
  }

  if (!profile) {
    return <div style={styles.loading}>Profile not found</div>;
  }

  const fullProfilePicUrl = profile.profilePictureUrl 
    ? (profile.profilePictureUrl.startsWith('http') ? profile.profilePictureUrl : `http://34.47.170.212:9090${profile.profilePictureUrl}`)
    : null;
  const fullCompanyLogoUrl = profile.companyLogoUrl
    ? (profile.companyLogoUrl.startsWith('http') ? profile.companyLogoUrl : `http://34.47.170.212:9090${profile.companyLogoUrl}`)
    : null;

  const pendingRequests = editRequests.filter(r => r.status === 'PENDING');

  return (
    <div>
      <h2 style={styles.pageTitle}>My Profile</h2>
      
      {/* Profile Picture Section */}
      <div style={styles.profileHeader}>
        <div style={styles.profilePicContainer}>
          {/* Current or Preview Image */}
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Preview" 
              style={styles.profilePic}
            />
          ) : fullProfilePicUrl ? (
            <img 
              src={fullProfilePicUrl} 
              alt="Profile" 
              style={styles.profilePic}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            style={{
              ...styles.profilePicPlaceholder,
              display: (fullProfilePicUrl || previewUrl) ? 'none' : 'flex'
            }}
          >
            {profile.fullName?.charAt(0).toUpperCase()}
          </div>
          
          {/* Upload Button Overlay */}
          {!selectedFile && (
            <label style={styles.uploadOverlay}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <span style={styles.uploadIcon}>📷</span>
            </label>
          )}
        </div>
        
        <div style={styles.profileHeaderInfo}>
          <h2 style={styles.profileHeaderName}>{profile.fullName}</h2>
          <p style={styles.profileHeaderRole}>{profile.role?.replace('_', ' ')}</p>
          <p style={styles.profileHeaderEmail}>{profile.email}</p>
          
          {/* Upload Actions */}
          {selectedFile && (
            <div style={styles.uploadActions}>
              <button
                onClick={handleUploadProfilePicture}
                disabled={uploading}
                style={{
                  ...styles.uploadBtn,
                  opacity: uploading ? 0.6 : 1,
                  cursor: uploading ? 'not-allowed' : 'pointer',
                }}
              >
                {uploading ? 'Uploading...' : '✓ Upload'}
              </button>
              <button
                onClick={handleCancelUpload}
                disabled={uploading}
                style={styles.cancelUploadBtn}
              >
                ✕ Cancel
              </button>
            </div>
          )}
          {!selectedFile && (
            <label style={styles.changePhotoLabel}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <span style={styles.changePhotoText}>📷 Change Photo</span>
            </label>
          )}
        </div>
      </div>

      {/* Company Information */}
      {profile.companyName && (
        <div style={styles.companyCard}>
          <h3 style={styles.sectionTitle}>Company Information</h3>
          <div style={styles.companyInfo}>
            {fullCompanyLogoUrl ? (
              <img 
                src={fullCompanyLogoUrl} 
                alt="Company Logo" 
                style={styles.companyLogo}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              style={{
                ...styles.logoPlaceholder,
                display: fullCompanyLogoUrl ? 'none' : 'flex'
              }}
            >
              {profile.companyName.charAt(0).toUpperCase()}
            </div>
            <div style={styles.companyDetails}>
              <h2 style={styles.companyName}>{profile.companyName}</h2>
              <p style={styles.companyId}>Company ID: {profile.companyId}</p>
            </div>
          </div>
        </div>
      )}

      {/* Personal Information */}
      <div style={styles.profileCard}>
        <h3 style={styles.sectionTitle}>Personal Information</h3>
        <div style={styles.infoGrid}>
          <InfoItem label="Full Name" value={profile.fullName} />
          <InfoItem label="Username" value={profile.username} />
          <InfoItem label="Email" value={profile.email} />
          <InfoItem label="Role" value={profile.role?.replace('_', ' ')} />
          <EditableInfoItem 
            label="Phone Number" 
            value={profile.phoneNumber} 
            fieldName="phoneNumber"
            onEdit={handleEditClick}
          />
          <InfoItem label="Date of Birth" value={formatDate(profile.dateOfBirth)} />
          <EditableInfoItem 
            label="Address" 
            value={profile.address} 
            fieldName="address"
            onEdit={handleEditClick}
          />
          <InfoItem label="Emergency Contact" value={profile.emergencyContact} />
        </div>
        {pendingRequests.length > 0 && (
          <div style={styles.pendingNotice}>
            <span style={styles.pendingIcon}>⏳</span>
            <span>You have {pendingRequests.length} pending edit request(s) for approval</span>
          </div>
        )}
      </div>

      {/* Employment Information */}
      <div style={styles.profileCard}>
        <h3 style={styles.sectionTitle}>Employment Information</h3>
        <div style={styles.infoGrid}>
          <InfoItem label="Employee Code" value={profile.employeeCode} />
          <InfoItem label="Department" value={profile.department} />
          <InfoItem label="Designation" value={profile.designation} />
          <InfoItem label="Date of Joining" value={formatDate(profile.dateOfJoining)} />
          <InfoItem label="Salary" value={formatCurrency(profile.salary)} />
          <InfoItem label="Member Since" value={formatDateTime(profile.createdAt)} />
        </div>
      </div>

      {/* Edit Requests History */}
      {editRequests.length > 0 && (
        <div style={styles.profileCard}>
          <h3 style={styles.sectionTitle}>Edit Request History</h3>
          <div style={styles.editHistoryTable}>
            <table style={styles.attendanceTable}>
              <thead>
                <tr>
                  <th style={styles.attendanceTh}>Field</th>
                  <th style={styles.attendanceTh}>Old Value</th>
                  <th style={styles.attendanceTh}>New Value</th>
                  <th style={styles.attendanceTh}>Status</th>
                  <th style={styles.attendanceTh}>Date</th>
                </tr>
              </thead>
              <tbody>
                {editRequests.slice(0, 5).map((request) => (
                  <tr key={request.id} style={styles.attendanceTr}>
                    <td style={styles.attendanceTd}>{getFieldLabel(request.fieldName)}</td>
                    <td style={styles.attendanceTd}>{request.oldValue || '-'}</td>
                    <td style={styles.attendanceTd}>{request.newValue}</td>
                    <td style={styles.attendanceTd}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(request.status),
                      }}>
                        {request.status}
                      </span>
                    </td>
                    <td style={styles.attendanceTd}>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {editRequests.length > 5 && (
              <p style={styles.viewMore}>Showing last 5 requests</p>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.editModal}>
            <h3 style={styles.modalTitle}>Edit {editingField.label}</h3>
            <p style={styles.currentValue}>Current: {editingField.value || '-'}</p>
            <textarea
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={`Enter new ${editingField.label}...`}
              style={styles.editTextarea}
              rows={editingField.name === 'address' ? 3 : 1}
            />
            <p style={styles.editNote}>
              ℹ️ This edit request will be sent to your admin for approval.
            </p>
            <div style={styles.modalButtons}>
              <button 
                onClick={() => setShowEditModal(false)} 
                style={styles.modalCancelBtn}
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitEdit} 
                disabled={submitting}
                style={styles.modalSubmitBtn}
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div style={styles.infoItem}>
    <span style={styles.infoLabel}>{label}</span>
    <span style={styles.infoValue}>{value || '-'}</span>
  </div>
);

// My Attendance Component with Weekly View
const MyAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [notes, setNotes] = useState('');
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly' or 'history'
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
  const [weeklyData, setWeeklyData] = useState([]);
  const [submittingWeekly, setSubmittingWeekly] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editFormData, setEditFormData] = useState({ checkInTime: '', checkOutTime: '', notes: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [canEdit, setCanEdit] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (viewMode === 'weekly') {
      loadWeeklyData();
    }
  }, [currentWeekStart, viewMode]);

  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  function getWeekDays(weekStart) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  }

  const loadData = async () => {
    try {
      const [attendanceRes, todayRes] = await Promise.all([
        attendanceAPI.getMyAttendance(),
        attendanceAPI.getTodayAttendance(),
      ]);
      setAttendance(attendanceRes.data || []);
      setTodayAttendance(todayRes.data);
    } catch (error) {
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const loadWeeklyData = async () => {
    try {
      const weekStartStr = currentWeekStart.toISOString().split('T')[0];
      const res = await attendanceAPI.getWeeklyAttendance(weekStartStr);
      setWeeklyData(res.data || []);
      
      // Check edit permissions for each record
      const editPermissions = {};
      for (const record of (res.data || [])) {
        if (record.id) {
          try {
            const canEditRes = await attendanceAPI.canEditAttendance(record.id);
            editPermissions[record.id] = canEditRes.data.canEdit;
          } catch (e) {
            editPermissions[record.id] = false;
          }
        }
      }
      setCanEdit(editPermissions);
    } catch (error) {
      toast.error('Failed to load weekly attendance');
    }
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      await attendanceAPI.checkIn(notes);
      toast.success('Checked in successfully!');
      setNotes('');
      loadData();
      if (viewMode === 'weekly') loadWeeklyData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check in');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setCheckingOut(true);
    try {
      await attendanceAPI.checkOut(notes);
      toast.success('Checked out successfully!');
      setNotes('');
      loadData();
      if (viewMode === 'weekly') loadWeeklyData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check out');
    } finally {
      setCheckingOut(false);
    }
  };

  const handleSubmitWeekly = async () => {
    const weekDays = getWeekDays(currentWeekStart);
    
    // Working days are Monday (0) to Friday (4), Saturday (5) and Sunday (6) are holidays
    const workingDays = weekDays.slice(0, 5); // Mon-Fri
    const weekends = weekDays.slice(5); // Sat-Sun
    
    // Check if all 5 working days have attendance marked
    const workingDaysWithAttendance = workingDays.filter(day => {
      const existing = weeklyData.find(r => 
        new Date(r.attendanceDate).toDateString() === day.toDateString()
      );
      // Must have check-in time OR be ON_LEAVE/ABSENT to be considered as marked
      return existing && (existing.checkInTime || existing.status === 'ON_LEAVE' || existing.status === 'ABSENT');
    });

    if (workingDaysWithAttendance.length < 5) {
      const missingDays = 5 - workingDaysWithAttendance.length;
      toast.error(`Please mark attendance for all 5 working days (Mon-Fri). ${missingDays} day(s) missing.`);
      return;
    }

    // Check if already submitting
    if (submittingWeekly) {
      return;
    }
    
    // Filter only records that need to be submitted (REJECTED or PENDING - not APPROVED)
    const recordsToSubmit = [];
    let hasRejectedRecords = false;
    
    for (let i = 0; i < weekDays.length; i++) {
      const day = weekDays[i];
      const existing = weeklyData.find(r => 
        new Date(r.attendanceDate).toDateString() === day.toDateString()
      );
      
      const isWeekend = i >= 5;
      
      if (existing) {
        // Only submit if NOT APPROVED (submit REJECTED and PENDING)
        if (existing.approvalStatus !== 'APPROVED') {
          if (existing.approvalStatus === 'REJECTED') {
            hasRejectedRecords = true;
          }
          recordsToSubmit.push({
            attendanceDate: day.toISOString().split('T')[0],
            status: existing.status,
            checkInTime: existing.checkInTime || null,
            checkOutTime: existing.checkOutTime || null,
            notes: existing.notes || null
          });
        }
      } else if (isWeekend) {
        // Include weekends as HOLIDAY if not existing
        recordsToSubmit.push({
          attendanceDate: day.toISOString().split('T')[0],
          status: 'HOLIDAY',
          checkInTime: null,
          checkOutTime: null,
          notes: 'Weekend Holiday'
        });
      }
    }
    
    // If no records to submit (all approved), show message
    if (recordsToSubmit.length === 0) {
      toast.info('All attendance records for this week are already approved.');
      return;
    }
    
    // Check if all records are already pending (no changes to submit)
    const allPending = recordsToSubmit.every(r => {
      const existing = weeklyData.find(wd => 
        new Date(wd.attendanceDate).toDateString() === new Date(r.attendanceDate).toDateString()
      );
      return existing && existing.approvalStatus === 'PENDING' && existing.id;
    });
    
    if (allPending && recordsToSubmit.length > 0) {
      toast.info('Attendance already submitted. Please wait for admin approval or edit individual days.');
      return;
    }

    setSubmittingWeekly(true);
    try {
      await attendanceAPI.submitWeeklyAttendance({
        weekStartDate: currentWeekStart.toISOString().split('T')[0],
        attendances: recordsToSubmit
      });
      
      if (hasRejectedRecords) {
        toast.success('Corrected attendance records submitted successfully!');
      } else {
        toast.success('Weekly attendance submitted successfully!');
      }
      loadWeeklyData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit weekly attendance');
    } finally {
      setSubmittingWeekly(false);
    }
  };

  // Handle resubmitting a single rejected record without editing
  const handleResubmitSingle = async (record) => {
    if (record.approvalStatus !== 'REJECTED') {
      return;
    }
    
    try {
      await attendanceAPI.submitWeeklyAttendance({
        weekStartDate: currentWeekStart.toISOString().split('T')[0],
        attendances: [{
          attendanceDate: record.attendanceDate,
          status: record.status,
          checkInTime: record.checkInTime || null,
          checkOutTime: record.checkOutTime || null,
          notes: record.notes || null
        }]
      });
      
      toast.success('Attendance resubmitted successfully!');
      loadWeeklyData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resubmit attendance');
    }
  };

  const handleEditClick = (record, dayDate = null) => {
    // Check if the date is a weekend
    let dateToCheck = dayDate;
    if (record && record.attendanceDate) {
      dateToCheck = new Date(record.attendanceDate);
    }
    
    if (dateToCheck) {
      const dayOfWeek = dateToCheck.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        toast.error('Attendance cannot be edited for Saturday or Sunday.');
        return;
      }
    }
    
    if (record) {
      // Editing existing record
      setEditingRecord(record);
      setEditFormData({
        checkInTime: record.checkInTime || '',
        checkOutTime: record.checkOutTime || '',
        notes: record.notes || '',
        status: record.status || 'PRESENT'
      });
    } else {
      // Adding new record for a day
      setEditingRecord({
        isNew: true,
        attendanceDate: dayDate.toISOString().split('T')[0]
      });
      setEditFormData({
        checkInTime: '',
        checkOutTime: '',
        notes: '',
        status: 'PRESENT'
      });
    }
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      if (editingRecord.isNew) {
        // Creating new attendance record
        const newAttendance = {
          attendanceDate: editingRecord.attendanceDate,
          checkInTime: editFormData.checkInTime || null,
          checkOutTime: editFormData.checkOutTime || null,
          status: editFormData.status,
          notes: editFormData.notes || null
        };
        await attendanceAPI.submitAttendance(newAttendance);
        toast.success('Attendance added successfully!');
      } else {
        // Updating existing record
        await attendanceAPI.updateAttendance(editingRecord.id, editFormData);
        toast.success('Attendance updated successfully!');
      }
      setShowEditModal(false);
      setEditingRecord(null);
      loadWeeklyData();
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save attendance');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#27ae60';
      case 'PENDING': return '#f39c12';
      case 'REJECTED': return '#e74c3c';
      default: return '#7f8c8d';
    }
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case 'PRESENT': return '#27ae60';
      case 'ABSENT': return '#e74c3c';
      case 'HALF_DAY': return '#f39c12';
      case 'WORK_FROM_HOME': return '#3498db';
      case 'ON_LEAVE': return '#9b59b6';
      default: return '#7f8c8d';
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    return timeStr;
  };

  const weekDays = getWeekDays(currentWeekStart);
  
  // Check if today is a weekend (Saturday = 6, Sunday = 0)
  const today = new Date();
  const todayDayOfWeek = today.getDay();
  const isTodayWeekend = todayDayOfWeek === 0 || todayDayOfWeek === 6;
  
  const canCheckIn = !isTodayWeekend && (!todayAttendance || !todayAttendance.checkInTime);
  const canCheckOut = !isTodayWeekend && todayAttendance && todayAttendance.checkInTime && !todayAttendance.checkOutTime;

  if (loading) {
    return <div style={styles.loading}>Loading attendance...</div>;
  }

  return (
    <div>
      <h2 style={styles.pageTitle}>My Attendance</h2>
      
      {/* Check In/Out Card */}
      <div style={styles.attendanceCard}>
        <h3 style={styles.sectionTitle}>📍 Today's Attendance</h3>
        <div style={styles.todayStatus}>
          {todayAttendance ? (
            <div style={styles.todayInfo}>
              <div style={styles.timeRow}>
                <div style={styles.timeBox}>
                  <span style={styles.timeLabel}>Check In</span>
                  <span style={styles.timeValue}>
                    {todayAttendance.checkInTime || '--:--'}
                  </span>
                </div>
                <div style={styles.timeBox}>
                  <span style={styles.timeLabel}>Check Out</span>
                  <span style={styles.timeValue}>
                    {todayAttendance.checkOutTime || '--:--'}
                  </span>
                </div>
                <div style={styles.timeBox}>
                  <span style={styles.timeLabel}>Working Hours</span>
                  <span style={styles.timeValue}>
                    {todayAttendance.workingHours ? `${todayAttendance.workingHours}h` : '--'}
                  </span>
                </div>
              </div>
              <div style={styles.statusRow}>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: getAttendanceStatusColor(todayAttendance.status),
                }}>
                  {todayAttendance.status}
                </span>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(todayAttendance.approvalStatus),
                }}>
                  {todayAttendance.approvalStatus}
                </span>
              </div>
              {todayAttendance.approvalStatus === 'REJECTED' && todayAttendance.rejectionReason && (
                <div style={styles.rejectionAlert}>
                  <span style={styles.rejectionIcon}>⚠️</span>
                  <div>
                    <strong>Rejected:</strong> {todayAttendance.rejectionReason}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p style={styles.noAttendance}>No attendance recorded for today</p>
          )}
          
          {/* Weekend Message */}
          {isTodayWeekend && (
            <div style={styles.weekendMessage}>
              <span style={styles.weekendIcon}>🌴</span>
              <div>
                <strong>Weekend Holiday!</strong>
                <p style={{margin: '4px 0 0 0', fontSize: '13px'}}>Attendance cannot be marked on Saturday or Sunday.</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div style={styles.actionSection}>
          <textarea
            placeholder="Add notes (optional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={styles.notesInput}
          />
          <div style={styles.buttonRow}>
            <button
              onClick={handleCheckIn}
              disabled={!canCheckIn || checkingIn}
              style={{
                ...styles.checkInBtn,
                opacity: canCheckIn ? 1 : 0.5,
                cursor: canCheckIn ? 'pointer' : 'not-allowed',
              }}
            >
              {checkingIn ? 'Checking In...' : '✅ Check In'}
            </button>
            <button
              onClick={handleCheckOut}
              disabled={!canCheckOut || checkingOut}
              style={{
                ...styles.checkOutBtn,
                opacity: canCheckOut ? 1 : 0.5,
                cursor: canCheckOut ? 'pointer' : 'not-allowed',
              }}
            >
              {checkingOut ? 'Checking Out...' : '🚪 Check Out'}
            </button>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div style={styles.viewToggle}>
        <button
          onClick={() => setViewMode('weekly')}
          style={{
            ...styles.toggleBtn,
            backgroundColor: viewMode === 'weekly' ? '#27ae60' : '#f0f0f0',
            color: viewMode === 'weekly' ? 'white' : '#333',
          }}
        >
          📅 Weekly View
        </button>
        <button
          onClick={() => setViewMode('history')}
          style={{
            ...styles.toggleBtn,
            backgroundColor: viewMode === 'history' ? '#27ae60' : '#f0f0f0',
            color: viewMode === 'history' ? 'white' : '#333',
          }}
        >
          📊 History
        </button>
      </div>

      {/* Weekly View */}
      {viewMode === 'weekly' && (
        <div style={styles.attendanceCard}>
          <h3 style={styles.sectionTitle}>Weekly Calendar</h3>
          
          {/* Week Navigation */}
          <div style={styles.weekNav}>
            <button 
              onClick={() => {
                const prevWeek = new Date(currentWeekStart);
                prevWeek.setDate(prevWeek.getDate() - 7);
                setCurrentWeekStart(prevWeek);
              }}
              style={styles.weekNavBtn}
            >
              ← Previous Week
            </button>
            <span style={styles.weekRange}>
              {currentWeekStart.toLocaleDateString()} - {new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </span>
            <button 
              onClick={() => {
                const nextWeek = new Date(currentWeekStart);
                nextWeek.setDate(nextWeek.getDate() + 7);
                setCurrentWeekStart(nextWeek);
              }}
              style={styles.weekNavBtn}
            >
              Next Week →
            </button>
          </div>

          {/* Weekly Calendar Grid */}
          <div style={styles.weeklyGrid}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, index) => {
              const dayDate = weekDays[index];
              const record = weeklyData.find(r => 
                new Date(r.attendanceDate).toDateString() === dayDate.toDateString()
              );
              const isToday = dayDate.toDateString() === new Date().toDateString();
              const isWeekend = index >= 5; // Sat (5) and Sun (6)
              
              return (
                <div 
                  key={dayName} 
                  style={{
                    ...styles.dayCard,
                    borderColor: isToday ? '#27ae60' : (isWeekend ? '#f39c12' : '#eee'),
                    backgroundColor: isToday ? '#f0fff4' : (isWeekend ? '#fff9e6' : 'white'),
                  }}
                >
                  <div style={styles.dayHeader}>
                    <span style={{
                      ...styles.dayName,
                      color: isWeekend ? '#f39c12' : '#7f8c8d',
                      fontWeight: isWeekend ? 'bold' : 'normal',
                    }}>{dayName}</span>
                    <span style={styles.dayDate}>{dayDate.getDate()}</span>
                    {isWeekend && <span style={{fontSize: '10px', color: '#f39c12', marginTop: '2px'}}>🌴 Holiday</span>}
                  </div>
                  {record ? (
                    <div style={styles.dayContent}>
                      <span style={{
                        ...styles.dayStatus,
                        backgroundColor: getAttendanceStatusColor(record.status),
                      }}>
                        {record.status}
                      </span>
                      {/* Approval Status Badge */}
                      <span style={{
                        ...styles.dayStatus,
                        backgroundColor: getStatusColor(record.approvalStatus),
                        marginTop: '4px',
                        fontSize: '10px',
                      }}>
                        {record.approvalStatus}
                      </span>
                      {/* Rejection Reason */}
                      {record.approvalStatus === 'REJECTED' && record.rejectionReason && (
                        <div style={{
                          fontSize: '10px',
                          color: '#e74c3c',
                          marginTop: '4px',
                          padding: '4px',
                          backgroundColor: '#ffeaea',
                          borderRadius: '4px',
                          textAlign: 'center',
                        }}>
                          ⚠️ {record.rejectionReason.substring(0, 25)}{record.rejectionReason.length > 25 ? '...' : ''}
                        </div>
                      )}
                      <div style={styles.dayTimes}>
                        <span>In: {formatTime(record.checkInTime)}</span>
                        <span>Out: {formatTime(record.checkOutTime)}</span>
                      </div>
                      {/* Show Edit/Resubmit button only for non-approved records (REJECTED or PENDING) */}
                      {!isWeekend && record.approvalStatus !== 'APPROVED' && (
                        <div style={record.approvalStatus === 'REJECTED' ? styles.buttonRow : {}}>
                          {/* Edit button for both REJECTED and PENDING */}
                          <button 
                            onClick={() => handleEditClick(record)}
                            style={{
                              ...styles.editDayBtn,
                              backgroundColor: record.approvalStatus === 'REJECTED' ? '#e74c3c' : '#f39c12',
                              width: record.approvalStatus === 'REJECTED' ? '48%' : '100%',
                            }}
                          >
                            ✏️ Edit
                          </button>
                          {/* Quick Resubmit button for REJECTED records - resubmits with current values */}
                          {record.approvalStatus === 'REJECTED' && (
                            <button 
                              onClick={() => handleResubmitSingle(record)}
                              style={{
                                ...styles.editDayBtn,
                                backgroundColor: '#27ae60',
                                width: '48%',
                                marginLeft: '4%',
                              }}
                            >
                              🔄 Resubmit
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={styles.dayContent}>
                      <span style={{
                        ...styles.dayStatus,
                        backgroundColor: isWeekend ? '#f39c12' : '#95a5a6',
                      }}>
                        {isWeekend ? '🌴 Holiday' : 'No Record'}
                      </span>
                      {!isWeekend && (
                        <button 
                          onClick={() => handleEditClick(null, dayDate)}
                          style={styles.addDayBtn}
                        >
                          ➕ Add
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Weekly Button - Disabled if all working days are APPROVED */}
          {(() => {
            // Working days are Monday (0) to Friday (4)
            const workingDays = weekDays.slice(0, 5);
            const workingDayRecords = workingDays.map(day => {
              return weeklyData.find(r => 
                new Date(r.attendanceDate).toDateString() === day.toDateString()
              );
            }).filter(r => r != null);
            
            // Check if all 5 days have records
            const hasAllRecords = workingDayRecords.length === 5;
            // Check if all records are approved
            const allApproved = hasAllRecords && workingDayRecords.every(r => r.approvalStatus === 'APPROVED');
            
            // Disable only if all records are approved (rejected records are handled individually)
            const isDisabled = submittingWeekly || allApproved;
            
            return (
              <button
                onClick={handleSubmitWeekly}
                disabled={isDisabled}
                style={{
                  ...styles.submitWeeklyBtn,
                  opacity: isDisabled ? 0.6 : 1,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  backgroundColor: allApproved ? '#95a5a6' : '#27ae60',
                }}
                title={allApproved ? 'All weekly attendance records are approved' : 'Submit weekly attendance'}
              >
                {submittingWeekly ? 'Submitting...' : (allApproved ? '✓ Weekly Attendance Approved' : '📤 Submit Weekly Attendance')}
              </button>
            );
          })()}
        </div>
      )}

      {/* History View */}
      {viewMode === 'history' && (
        <div style={styles.attendanceCard}>
          <h3 style={styles.sectionTitle}>📊 Attendance History</h3>
          
          {/* Attendance Table */}
          <div style={styles.tableContainer}>
            <table style={styles.attendanceTable}>
              <thead>
                <tr>
                  <th style={styles.attendanceTh}>Date</th>
                  <th style={styles.attendanceTh}>Check In</th>
                  <th style={styles.attendanceTh}>Check Out</th>
                  <th style={styles.attendanceTh}>Hours</th>
                  <th style={styles.attendanceTh}>Status</th>
                  <th style={styles.attendanceTh}>Approval</th>
                  <th style={styles.attendanceTh}>Admin Notes</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={styles.noDataCell}>
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  attendance.map((record) => (
                    <tr key={record.id} style={{
                      ...styles.attendanceTr,
                      backgroundColor: record.approvalStatus === 'REJECTED' ? '#fff5f5' : 'transparent',
                    }}>
                      <td style={styles.attendanceTd}>
                        {new Date(record.attendanceDate).toLocaleDateString()}
                      </td>
                      <td style={styles.attendanceTd}>
                        {record.checkInTime || '--:--'}
                      </td>
                      <td style={styles.attendanceTd}>
                        {record.checkOutTime || '--:--'}
                      </td>
                      <td style={styles.attendanceTd}>
                        {record.workingHours ? `${record.workingHours}h` : '--'}
                      </td>
                      <td style={styles.attendanceTd}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: getAttendanceStatusColor(record.status),
                        }}>
                          {record.status}
                        </span>
                      </td>
                      <td style={styles.attendanceTd}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(record.approvalStatus),
                        }}>
                          {record.approvalStatus}
                        </span>
                        {/* Show Rejection Reason */}
                        {record.approvalStatus === 'REJECTED' && record.rejectionReason && (
                          <div style={{
                            marginTop: '5px',
                            padding: '6px 10px',
                            backgroundColor: '#ffeaea',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: '#e74c3c',
                            border: '1px solid #ffcdd2',
                          }}>
                            <strong>⚠️ Reason:</strong> {record.rejectionReason}
                          </div>
                        )}
                        {record.approvalStatus === 'APPROVED' && record.approvedByName && (
                          <div style={{
                            marginTop: '5px',
                            fontSize: '11px',
                            color: '#27ae60',
                          }}>
                            ✓ By {record.approvedByName}
                          </div>
                        )}
                      </td>
                      <td style={styles.attendanceTd}>
                        {record.notes || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {showEditModal && editingRecord && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>
              {editingRecord.isNew ? '➕ Add Attendance' : '✏️ Edit Attendance'}
            </h3>
            <p style={styles.modalDate}>
              Date: {new Date(editingRecord.attendanceDate).toLocaleDateString()}
            </p>
            
            <div style={styles.modalField}>
              <label>Status</label>
              <select
                value={editFormData.status}
                onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                style={styles.modalInput}
              >
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="HALF_DAY">Half Day</option>
                <option value="WORK_FROM_HOME">Work From Home</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>
            
            <div style={styles.modalField}>
              <label>Check In Time</label>
              <input
                type="time"
                value={editFormData.checkInTime}
                onChange={(e) => setEditFormData({...editFormData, checkInTime: e.target.value})}
                style={styles.modalInput}
              />
            </div>
            
            <div style={styles.modalField}>
              <label>Check Out Time</label>
              <input
                type="time"
                value={editFormData.checkOutTime}
                onChange={(e) => setEditFormData({...editFormData, checkOutTime: e.target.value})}
                style={styles.modalInput}
              />
            </div>
            
            <div style={styles.modalField}>
              <label>Notes</label>
              <textarea
                value={editFormData.notes}
                onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                style={styles.modalTextarea}
                placeholder="Add notes (optional)..."
              />
            </div>
            
            <div style={styles.modalButtons}>
              <button onClick={() => setShowEditModal(false)} style={styles.modalCancelBtn}>
                Cancel
              </button>
              <button onClick={handleEditSubmit} style={styles.modalSaveBtn}>
                {editingRecord.isNew ? 'Add Attendance' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// My Salary Component - Modern Grid Design
const MySalary = () => {
  const [salarySlips, setSalarySlips] = useState([]);
  const [filteredSlips, setFilteredSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [downloading, setDownloading] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  // Generate last 5 years for buttons
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    loadSalarySlips();
  }, []);

  useEffect(() => {
    // Filter slips by selected year (convert both sides to number for comparison)
    const yearSlips = salarySlips.filter(slip => Number(slip.year) === Number(selectedYear));
    // Sort by month (descending - latest first)
    yearSlips.sort((a, b) => Number(b.month) - Number(a.month));
    setFilteredSlips(yearSlips);
  }, [salarySlips, selectedYear]);

  const loadSalarySlips = async () => {
    setLoading(true);
    try {
      const res = await salaryAPI.getMySalarySlips();
      const slips = res.data || [];
      setSalarySlips(slips);
      
      // Extract available years from slips for the buttons (convert to number)
      const yearsFromData = [...new Set(slips.map(s => Number(s.year)))].sort((a, b) => b - a);
      setAvailableYears(yearsFromData);
      
      // If we have data, select the most recent year that has data
      if (yearsFromData.length > 0) {
        // Check if current selectedYear has any slips, if not use the most recent year from data
        const currentYearSlips = slips.filter(s => Number(s.year) === Number(selectedYear));
        if (currentYearSlips.length === 0) {
          setSelectedYear(yearsFromData[0]);
        }
      }
    } catch (error) {
      toast.error('Failed to load salary slips');
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSelectedSlip(null);
  };

  const handleDownload = async (slipId, e) => {
    e.stopPropagation();
    setDownloading(slipId);
    try {
      const res = await salaryAPI.downloadSalarySlip(slipId);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `salary-slip-${slipId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Salary slip downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download salary slip');
    } finally {
      setDownloading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'GENERATED': return { bg: '#e3f2fd', text: '#1976d2', border: '#1976d2' };
      case 'SENT': return { bg: '#fff3e0', text: '#f57c00', border: '#f57c00' };
      case 'DOWNLOADED': return { bg: '#e8f5e9', text: '#388e3c', border: '#388e3c' };
      default: return { bg: '#f5f5f5', text: '#616161', border: '#616161' };
    }
  };

  const getMonthLabel = (monthValue) => {
    return months.find(m => m.value === monthValue)?.label || '';
  };

  const getMonthShort = (monthValue) => {
    return getMonthLabel(monthValue)?.substring(0, 3) || '';
  };

  if (loading) {
    return (
      <div style={modernStyles.loadingContainer}>
        <div style={modernStyles.spinner}></div>
        <p>Loading your payslips...</p>
      </div>
    );
  }

  return (
    <div style={modernStyles.container}>
      {/* CSS Animation for Spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Header */}
      <div style={modernStyles.header}>
        <h2 style={modernStyles.title}>My Payslips</h2>
        <p style={modernStyles.subtitle}>View and download your salary slips</p>
      </div>

      {/* Year Selector Buttons */}
      <div style={modernStyles.yearSelectorContainer}>
        <div style={modernStyles.yearButtonsWrapper}>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => handleYearChange(year)}
              style={{
                ...modernStyles.yearButton,
                ...(selectedYear === year ? modernStyles.yearButtonActive : {}),
              }}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div style={modernStyles.statsContainer}>
        <div style={modernStyles.statCard}>
          <span style={modernStyles.statValue}>{filteredSlips.length}</span>
          <span style={modernStyles.statLabel}>Payslips in {selectedYear}</span>
        </div>
        <div style={{ ...modernStyles.statCard, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <span style={modernStyles.statValue}>
            {filteredSlips.length > 0 ? formatCurrency(filteredSlips.reduce((sum, s) => sum + s.netSalary, 0)) : '₹0'}
          </span>
          <span style={modernStyles.statLabel}>Total Net Pay ({selectedYear})</span>
        </div>
      </div>

      {/* Payslip Grid */}
      {filteredSlips.length === 0 ? (
        <div style={modernStyles.emptyState}>
          <div style={modernStyles.emptyIcon}>📄</div>
          <h3 style={modernStyles.emptyTitle}>No payslips found</h3>
          <p style={modernStyles.emptyText}>No salary slips available for {selectedYear}</p>
        </div>
      ) : (
        <div style={modernStyles.gridContainer}>
          {filteredSlips.map((slip) => {
            const statusColors = getStatusColor(slip.status);
            return (
              <div
                key={slip.id}
                onClick={() => setSelectedSlip(slip)}
                style={modernStyles.payslipCard}
              >
                {/* Month Badge */}
                <div style={modernStyles.monthBadge}>
                  <span style={modernStyles.monthShort}>{getMonthShort(slip.month)}</span>
                  <span style={modernStyles.yearSmall}>{slip.year}</span>
                </div>

                {/* Card Content */}
                <div style={modernStyles.cardContent}>
                  <h4 style={modernStyles.cardMonth}>{getMonthLabel(slip.month)}</h4>
                  
                  <div style={modernStyles.amountContainer}>
                    <div style={modernStyles.amountRow}>
                      <span style={modernStyles.amountLabel}>Net Salary</span>
                      <span style={modernStyles.netAmount}>{formatCurrency(slip.netSalary)}</span>
                    </div>
                    <div style={modernStyles.amountRow}>
                      <span style={modernStyles.amountLabel}>Gross</span>
                      <span style={modernStyles.grossAmount}>{formatCurrency(slip.grossSalary)}</span>
                    </div>
                    {slip.bonus > 0 && (
                      <div style={modernStyles.amountRow}>
                        <span style={{...modernStyles.amountLabel, color: '#27ae60'}}>🎁 Bonus</span>
                        <span style={{...modernStyles.grossAmount, color: '#27ae60'}}>+{formatCurrency(slip.bonus)}</span>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    ...modernStyles.statusBadge,
                    backgroundColor: statusColors.bg,
                    color: statusColors.text,
                    border: `1px solid ${statusColors.border}`,
                  }}>
                    {slip.status}
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={(e) => handleDownload(slip.id, e)}
                  disabled={downloading === slip.id}
                  style={modernStyles.downloadButton}
                >
                  {downloading === slip.id ? '⏳' : '⬇️'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Payslip Detail Modal */}
      {selectedSlip && (
        <div style={modernStyles.modalOverlay} onClick={() => setSelectedSlip(null)}>
          <div style={modernStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={modernStyles.modalHeader}>
              <h3 style={modernStyles.modalTitle}>
                {getMonthLabel(selectedSlip.month)} {selectedSlip.year} - Payslip
              </h3>
              <button onClick={() => setSelectedSlip(null)} style={modernStyles.closeButton}>✕</button>
            </div>

            {/* Company Info */}
            <div style={modernStyles.companyInfo}>
              <div style={modernStyles.companyLogo}>🏢</div>
              <div>
                <h4 style={modernStyles.companyName}>{selectedSlip.companyName || 'Company'}</h4>
                <p style={modernStyles.employeeInfo}>{selectedSlip.employeeName} • {selectedSlip.employeeCode}</p>
              </div>
            </div>

            {/* Salary Breakdown */}
            <div style={modernStyles.breakdownContainer}>
              {/* Earnings */}
              <div style={modernStyles.breakdownSection}>
                <h5 style={modernStyles.breakdownTitle}>Earnings</h5>
                <div style={modernStyles.breakdownRow}>
                  <span>Basic Salary</span>
                  <span style={modernStyles.breakdownAmount}>{formatCurrency(selectedSlip.basicSalary)}</span>
                </div>
                <div style={modernStyles.breakdownRow}>
                  <span>HRA</span>
                  <span style={modernStyles.breakdownAmount}>{formatCurrency(selectedSlip.hra)}</span>
                </div>
                <div style={modernStyles.breakdownRow}>
                  <span>DA</span>
                  <span style={modernStyles.breakdownAmount}>{formatCurrency(selectedSlip.da)}</span>
                </div>
                {selectedSlip.specialAllowance > 0 && (
                  <div style={modernStyles.breakdownRow}>
                    <span>Special Allowance</span>
                    <span style={modernStyles.breakdownAmount}>{formatCurrency(selectedSlip.specialAllowance)}</span>
                  </div>
                )}
                {selectedSlip.otherAllowances > 0 && (
                  <div style={modernStyles.breakdownRow}>
                    <span>Other Allowances</span>
                    <span style={modernStyles.breakdownAmount}>{formatCurrency(selectedSlip.otherAllowances)}</span>
                  </div>
                )}
                {selectedSlip.bonus > 0 && (
                  <div style={modernStyles.breakdownRow}>
                    <span style={{ color: '#27ae60', fontWeight: '600' }}>🎁 Bonus</span>
                    <span style={{ ...modernStyles.breakdownAmount, color: '#27ae60', fontWeight: '600' }}>+{formatCurrency(selectedSlip.bonus)}</span>
                  </div>
                )}
                <div style={{ ...modernStyles.breakdownRow, ...modernStyles.totalRow }}>
                  <span>Gross Salary</span>
                  <span style={modernStyles.totalAmount}>{formatCurrency(selectedSlip.grossSalary)}</span>
                </div>
              </div>

              {/* Deductions */}
              <div style={modernStyles.breakdownSection}>
                <h5 style={{ ...modernStyles.breakdownTitle, color: '#e74c3c' }}>Deductions</h5>
                <div style={modernStyles.breakdownRow}>
                  <span>Provident Fund (PF)</span>
                  <span style={modernStyles.breakdownAmount}>{formatCurrency(selectedSlip.pf)}</span>
                </div>
                <div style={modernStyles.breakdownRow}>
                  <span>Professional Tax</span>
                  <span style={modernStyles.breakdownAmount}>{formatCurrency(selectedSlip.professionalTax)}</span>
                </div>
                <div style={modernStyles.breakdownRow}>
                  <span>Income Tax (TDS)</span>
                  <span style={modernStyles.breakdownAmount}>{formatCurrency(selectedSlip.incomeTax)}</span>
                </div>
                {selectedSlip.otherDeductions > 0 && (
                  <div style={modernStyles.breakdownRow}>
                    <span>Other Deductions</span>
                    <span style={modernStyles.breakdownAmount}>{formatCurrency(selectedSlip.otherDeductions)}</span>
                  </div>
                )}
                <div style={{ ...modernStyles.breakdownRow, ...modernStyles.totalRow }}>
                  <span>Total Deductions</span>
                  <span style={{ ...modernStyles.totalAmount, color: '#e74c3c' }}>{formatCurrency(selectedSlip.totalDeductions)}</span>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div style={modernStyles.netSalaryBox}>
              <div style={modernStyles.netSalaryContent}>
                <span style={modernStyles.netSalaryLabel}>Net Salary</span>
                <span style={modernStyles.netSalaryValue}>{formatCurrency(selectedSlip.netSalary)}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={modernStyles.modalActions}>
              <button onClick={() => setSelectedSlip(null)} style={modernStyles.cancelBtn}>Close</button>
              <button
                onClick={(e) => handleDownload(selectedSlip.id, e)}
                disabled={downloading === selectedSlip.id}
                style={modernStyles.downloadModalBtn}
              >
                {downloading === selectedSlip.id ? '⏳ Downloading...' : '⬇️ Download PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// My Leaves Component
const MyLeaves = () => {
  const [leaveBalance, setLeaveBalance] = useState({
    SL: { total: 10, used: 0, remaining: 10 },
    PL: { total: 15, used: 0, remaining: 15 },
    CL: { total: 12, used: 0, remaining: 12 },
    EL: { total: 20, used: 0, remaining: 20 },
  });
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'SL',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [numberOfDays, setNumberOfDays] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setNumberOfDays(diffDays > 0 ? diffDays : 0);
    } else {
      setNumberOfDays(0);
    }
  }, [formData.startDate, formData.endDate]);

  const loadData = async () => {
    try {
      const res = await leaveAPI.getMyLeaves();
      setLeaveHistory(res.data || []);
      // Calculate used leaves from history
      const used = { SL: 0, PL: 0, CL: 0, EL: 0 };
      (res.data || []).forEach(leave => {
        if (leave.status === 'APPROVED' && used[leave.leaveType] !== undefined) {
          used[leave.leaveType] += leave.numberOfDays;
        }
      });
      setLeaveBalance(prev => ({
        SL: { ...prev.SL, used: used.SL, remaining: prev.SL.total - used.SL },
        PL: { ...prev.PL, used: used.PL, remaining: prev.PL.total - used.PL },
        CL: { ...prev.CL, used: used.CL, remaining: prev.CL.total - used.CL },
        EL: { ...prev.EL, used: used.EL, remaining: prev.EL.total - used.EL },
      }));
    } catch (error) {
      toast.error('Failed to load leave data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setSubmitting(true);
    try {
      await leaveAPI.applyForLeave({
        ...formData,
        numberOfDays,
      });
      toast.success('Leave application submitted successfully!');
      setShowForm(false);
      setFormData({ leaveType: 'SL', startDate: '', endDate: '', reason: '' });
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply for leave');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#27ae60';
      case 'PENDING': return '#f39c12';
      case 'REJECTED': return '#e74c3c';
      default: return '#7f8c8d';
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading leave data...</div>;
  }

  return (
    <div>
      <h2 style={styles.pageTitle}>My Leaves</h2>

      {/* Leave Balance Cards */}
      <div style={styles.leaveBalanceGrid}>
        {Object.entries(leaveBalance).map(([type, balance]) => (
          <div key={type} style={styles.leaveBalanceCard}>
            <h4 style={styles.leaveTypeTitle}>{type}</h4>
            <div style={styles.leaveBalanceRow}>
              <div style={styles.leaveBalanceItem}>
                <span style={styles.leaveBalanceNumber}>{balance.total}</span>
                <span style={styles.leaveBalanceLabel}>Total</span>
              </div>
              <div style={styles.leaveBalanceItem}>
                <span style={{...styles.leaveBalanceNumber, color: '#e74c3c'}}>{balance.used}</span>
                <span style={styles.leaveBalanceLabel}>Used</span>
              </div>
              <div style={styles.leaveBalanceItem}>
                <span style={{...styles.leaveBalanceNumber, color: '#27ae60'}}>{balance.remaining}</span>
                <span style={styles.leaveBalanceLabel}>Remaining</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Apply for Leave Button */}
      <button 
        onClick={() => setShowForm(!showForm)}
        style={styles.applyLeaveBtn}
      >
        {showForm ? '✕ Cancel' : '+ Apply for Leave'}
      </button>

      {/* Leave Application Form */}
      {showForm && (
        <div style={styles.leaveFormCard}>
          <h3 style={styles.sectionTitle}>Apply for Leave</h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.leaveFormGrid}>
              <div style={styles.formField}>
                <label style={styles.label}>Leave Type *</label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                  style={styles.input}
                  required
                >
                  <option value="SL">Sick Leave (SL)</option>
                  <option value="PL">Privilege Leave (PL)</option>
                  <option value="CL">Casual Leave (CL)</option>
                  <option value="EL">Earned Leave (EL)</option>
                </select>
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Number of Days</label>
                <input
                  type="number"
                  value={numberOfDays}
                  readOnly
                  style={{...styles.input, backgroundColor: '#f0f0f0'}}
                />
              </div>
            </div>
            <div style={styles.formField}>
              <label style={styles.label}>Reason *</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                style={{...styles.notesInput, marginTop: '5px'}}
                placeholder="Enter reason for leave..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={styles.submitLeaveBtn}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      )}

      {/* Leave History */}
      <div style={styles.leaveHistoryCard}>
        <h3 style={styles.sectionTitle}>Leave History</h3>
        <div style={styles.tableContainer}>
          <table style={styles.attendanceTable}>
            <thead>
              <tr>
                <th style={styles.attendanceTh}>Type</th>
                <th style={styles.attendanceTh}>Start Date</th>
                <th style={styles.attendanceTh}>End Date</th>
                <th style={styles.attendanceTh}>Days</th>
                <th style={styles.attendanceTh}>Reason</th>
                <th style={styles.attendanceTh}>Status</th>
                <th style={styles.attendanceTh}>Applied On</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.noDataCell}>
                    No leave records found
                  </td>
                </tr>
              ) : (
                leaveHistory.map((leave) => (
                  <tr key={leave.id} style={styles.attendanceTr}>
                    <td style={styles.attendanceTd}>
                      <span style={styles.leaveTypeBadge}>{leave.leaveType}</span>
                    </td>
                    <td style={styles.attendanceTd}>
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td style={styles.attendanceTd}>
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td style={styles.attendanceTd}>{leave.numberOfDays}</td>
                    <td style={styles.attendanceTd}>{leave.reason}</td>
                    <td style={styles.attendanceTd}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(leave.status),
                      }}>
                        {leave.status}
                      </span>
                    </td>
                    <td style={styles.attendanceTd}>
                      {new Date(leave.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Manager Projects Component (for Managers to manage their projects)
const ManagerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const [teamFormData, setTeamFormData] = useState({
    employeeId: '',
    roleInProject: '',
    allocationPercentage: 100,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await managerProjectAPI.getMyProjects();
      setProjects(res.data || []);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableEmployees = async (projectId) => {
    try {
      const res = await managerProjectAPI.getAvailableEmployees(projectId);
      setAvailableEmployees(res.data || []);
    } catch (error) {
      toast.error('Failed to load available employees');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await managerProjectAPI.createProject(formData);
      toast.success('Project created successfully!');
      setShowCreateForm(false);
      setFormData({ name: '', description: '', startDate: '', endDate: '' });
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    
    setSubmitting(true);
    try {
      await managerProjectAPI.addTeamMember(selectedProject.id, teamFormData);
      toast.success('Team member added successfully!');
      setTeamFormData({ employeeId: '', roleInProject: '', allocationPercentage: 100 });
      // Refresh project details
      const res = await managerProjectAPI.getProjectById(selectedProject.id);
      setSelectedProject(res.data);
      loadAvailableEmployees(selectedProject.id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add team member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveTeamMember = async (employeeId) => {
    if (!selectedProject) return;
    if (!window.confirm('Are you sure you want to remove this team member?')) return;
    
    try {
      await managerProjectAPI.removeTeamMember(selectedProject.id, employeeId);
      toast.success('Team member removed successfully!');
      // Refresh project details
      const res = await managerProjectAPI.getProjectById(selectedProject.id);
      setSelectedProject(res.data);
      loadAvailableEmployees(selectedProject.id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove team member');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await managerProjectAPI.deleteProject(projectId);
      toast.success('Project deleted successfully!');
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return '#27ae60';
      case 'COMPLETED': return '#3498db';
      case 'ON_HOLD': return '#f39c12';
      case 'CANCELLED': return '#e74c3c';
      default: return '#7f8c8d';
    }
  };

  const openProjectDetails = async (project) => {
    try {
      const res = await managerProjectAPI.getProjectById(project.id);
      setSelectedProject(res.data);
      loadAvailableEmployees(project.id);
    } catch (error) {
      toast.error('Failed to load project details');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading projects...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={styles.pageTitle}>My Projects</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={styles.applyLeaveBtn}
        >
          {showCreateForm ? '✕ Cancel' : '+ Create Project'}
        </button>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <div style={styles.leaveFormCard}>
          <h3 style={styles.sectionTitle}>Create New Project</h3>
          <form onSubmit={handleCreateProject}>
            <div style={styles.leaveFormGrid}>
              <div style={styles.formField}>
                <label style={styles.label}>Project Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={styles.input}
                  required
                  placeholder="Enter project name"
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.formField}>
              <label style={styles.label}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{...styles.notesInput, marginTop: '5px'}}
                placeholder="Enter project description..."
                rows={3}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={styles.submitLeaveBtn}
            >
              {submitting ? 'Creating...' : 'Create Project'}
            </button>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div style={styles.leaveHistoryCard}>
        <h3 style={styles.sectionTitle}>Your Projects ({projects.length})</h3>
        {projects.length === 0 ? (
          <p style={styles.noAttendance}>No projects found. Create your first project!</p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.attendanceTable}>
              <thead>
                <tr>
                  <th style={styles.attendanceTh}>Project Name</th>
                  <th style={styles.attendanceTh}>Status</th>
                  <th style={styles.attendanceTh}>Start Date</th>
                  <th style={styles.attendanceTh}>End Date</th>
                  <th style={styles.attendanceTh}>Team Size</th>
                  <th style={styles.attendanceTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} style={styles.attendanceTr}>
                    <td style={styles.attendanceTd}>
                      <strong>{project.name}</strong>
                      {project.description && (
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
                          {project.description.substring(0, 50)}{project.description.length > 50 ? '...' : ''}
                        </p>
                      )}
                    </td>
                    <td style={styles.attendanceTd}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(project.status),
                      }}>
                        {project.status}
                      </span>
                    </td>
                    <td style={styles.attendanceTd}>
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}
                    </td>
                    <td style={styles.attendanceTd}>
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'}
                    </td>
                    <td style={styles.attendanceTd}>{project.teamSize || 0}</td>
                    <td style={styles.attendanceTd}>
                      <button 
                        onClick={() => openProjectDetails(project)}
                        style={{...styles.editDayBtn, marginRight: '5px'}}
                      >
                        👥 Manage Team
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        style={{...styles.editDayBtn, backgroundColor: '#e74c3c', color: 'white'}}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.editModal, maxWidth: '700px', width: '90%'}}>
            <h3 style={styles.modalTitle}>{selectedProject.name}</h3>

            <p style={{ color: '#666', marginBottom: '20px' }}>
              {selectedProject.description || 'No description'}
            </p>

            {/* Team Members */}
            <h4 style={{...styles.sectionTitle, fontSize: '16px'}}>Team Members ({selectedProject.teamMembers?.length || 0})</h4>
            
            {selectedProject.teamMembers && selectedProject.teamMembers.length > 0 ? (
              <div style={{ maxHeight: '200px', overflow: 'auto', marginBottom: '20px' }}>
                <table style={{...styles.attendanceTable, fontSize: '13px'}}>
                  <thead>
                    <tr>
                      <th style={{...styles.attendanceTh, padding: '8px'}}>Name</th>
                      <th style={{...styles.attendanceTh, padding: '8px'}}>Role</th>
                      <th style={{...styles.attendanceTh, padding: '8px'}}>Allocation</th>
                      <th style={{...styles.attendanceTh, padding: '8px'}}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProject.teamMembers.map((member) => (
                      <tr key={member.id}>
                        <td style={{...styles.attendanceTd, padding: '8px'}}>
                          <div>{member.employeeName}</div>
                          <div style={{fontSize: '11px', color: '#666'}}>{member.employeeEmail}</div>
                        </td>
                        <td style={{...styles.attendanceTd, padding: '8px'}}>{member.roleInProject || '-'}</td>
                        <td style={{...styles.attendanceTd, padding: '8px'}}>{member.allocationPercentage}%</td>
                        <td style={{...styles.attendanceTd, padding: '8px'}}>
                          <button 
                            onClick={() => handleRemoveTeamMember(member.employeeId)}
                            style={{...styles.editDayBtn, backgroundColor: '#e74c3c', color: 'white', padding: '4px 8px', fontSize: '12px'}}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{...styles.noAttendance, marginBottom: '20px'}}>No team members yet.</p>
            )}

            {/* Add Team Member Form */}
            <h4 style={{...styles.sectionTitle, fontSize: '16px'}}>Add Team Member</h4>
            <form onSubmit={handleAddTeamMember}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
                <div>
                  <label style={{...styles.label, fontSize: '12px'}}>Employee *</label>
                  <select
                    value={teamFormData.employeeId}
                    onChange={(e) => setTeamFormData({...teamFormData, employeeId: e.target.value})}
                    style={{...styles.input, fontSize: '13px'}}
                    required
                  >
                    <option value="">Select Employee</option>
                    {availableEmployees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullName} ({emp.employeeCode || emp.username})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{...styles.label, fontSize: '12px'}}>Role</label>
                  <input
                    type="text"
                    value={teamFormData.roleInProject}
                    onChange={(e) => setTeamFormData({...teamFormData, roleInProject: e.target.value})}
                    style={{...styles.input, fontSize: '13px'}}
                    placeholder="e.g., Developer"
                  />
                </div>
                <div>
                  <label style={{...styles.label, fontSize: '12px'}}>Allocation %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={teamFormData.allocationPercentage}
                    onChange={(e) => setTeamFormData({...teamFormData, allocationPercentage: parseInt(e.target.value)})}
                    style={{...styles.input, fontSize: '13px'}}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || availableEmployees.length === 0}
                  style={{...styles.modalSubmitBtn, padding: '8px 16px', fontSize: '13px'}}
                >
                  {submitting ? 'Adding...' : 'Add'}
                </button>
              </div>
              {availableEmployees.length === 0 && (
                <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '5px' }}>
                  No available employees to add.
                </p>
              )}
            </form>

            {/* Cancel Button at Bottom */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <button 
                onClick={() => setSelectedProject(null)}
                style={{
                  padding: '10px 30px',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Employee My Projects Component (for employees to view their assigned projects)
const EmployeeMyProjects = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyProjects();
  }, []);

  const loadMyProjects = async () => {
    try {
      const res = await employeeAPI.getMyProjects();
      setData(res.data);
    } catch (error) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return '#27ae60';
      case 'COMPLETED': return '#3498db';
      case 'ON_HOLD': return '#f39c12';
      case 'CANCELLED': return '#e74c3c';
      default: return '#7f8c8d';
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading your projects...</div>;
  }

  return (
    <div>
      <h2 style={styles.pageTitle}>My Projects</h2>

      {/* Reporting Manager Card */}
      {data?.reportingManager && (
        <div style={styles.profileCard}>
          <h3 style={styles.sectionTitle}>👔 Reporting Manager</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#27ae60',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {data.reportingManager.managerName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{data.reportingManager.managerName}</h4>
              <p style={{ margin: '0 0 3px 0', color: '#7f8c8d', fontSize: '14px' }}>
                {data.reportingManager.designation || data.reportingManager.managerRole}
              </p>
              <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>
                📧 {data.reportingManager.managerEmail}
              </p>
              {data.reportingManager.department && (
                <p style={{ margin: '3px 0 0 0', color: '#666', fontSize: '13px' }}>
                  🏢 {data.reportingManager.department}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div style={styles.leaveHistoryCard}>
        <h3 style={styles.sectionTitle}>
          📋 My Project Assignments ({data?.projects?.length || 0})
        </h3>
        
        {!data?.projects || data.projects.length === 0 ? (
          <p style={styles.noAttendance}>You are not assigned to any projects yet.</p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.attendanceTable}>
              <thead>
                <tr>
                  <th style={styles.attendanceTh}>Project Name</th>
                  <th style={styles.attendanceTh}>Your Role</th>
                  <th style={styles.attendanceTh}>Allocation</th>
                  <th style={styles.attendanceTh}>Status</th>
                  <th style={styles.attendanceTh}>Start Date</th>
                  <th style={styles.attendanceTh}>End Date</th>
                  <th style={styles.attendanceTh}>Project Manager</th>
                </tr>
              </thead>
              <tbody>
                {data.projects.map((project) => (
                  <tr key={project.projectId} style={styles.attendanceTr}>
                    <td style={styles.attendanceTd}>
                      <strong>{project.projectName}</strong>
                      {project.description && (
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
                          {project.description.substring(0, 60)}{project.description.length > 60 ? '...' : ''}
                        </p>
                      )}
                    </td>
                    <td style={styles.attendanceTd}>{project.roleInProject || '-'}</td>
                    <td style={styles.attendanceTd}>{project.allocationPercentage}%</td>
                    <td style={styles.attendanceTd}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(project.projectStatus),
                      }}>
                        {project.projectStatus}
                      </span>
                    </td>
                    <td style={styles.attendanceTd}>
                      {project.projectStartDate ? new Date(project.projectStartDate).toLocaleDateString() : '-'}
                    </td>
                    <td style={styles.attendanceTd}>
                      {project.projectEndDate ? new Date(project.projectEndDate).toLocaleDateString() : '-'}
                    </td>
                    <td style={styles.attendanceTd}>
                      <div>{project.managerName}</div>
                      <div style={{fontSize: '11px', color: '#666'}}>{project.managerEmail}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Card */}
      {data?.projects && data.projects.length > 0 && (
        <div style={{...styles.leaveBalanceCard, marginTop: '20px'}}>
          <h4 style={{...styles.leaveTypeTitle, color: '#27ae60'}}>📊 Project Summary</h4>
          <div style={styles.leaveBalanceRow}>
            <div style={styles.leaveBalanceItem}>
              <span style={{...styles.leaveBalanceNumber, color: '#3498db'}}>{data.projects.length}</span>
              <span style={styles.leaveBalanceLabel}>Total Projects</span>
            </div>
            <div style={styles.leaveBalanceItem}>
              <span style={{...styles.leaveBalanceNumber, color: '#27ae60'}}>
                {data.projects.filter(p => p.projectStatus === 'ACTIVE').length}
              </span>
              <span style={styles.leaveBalanceLabel}>Active</span>
            </div>
            <div style={styles.leaveBalanceItem}>
              <span style={{...styles.leaveBalanceNumber, color: '#e74c3c'}}>
                {data.projects.reduce((sum, p) => sum + (p.allocationPercentage || 0), 0)}%
              </span>
              <span style={styles.leaveBalanceLabel}>Total Allocation</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCurrency = (amount) => {
  if (!amount) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const styles = {
  container: {
    display: 'flex',
    minHeight: 'calc(100vh - 70px)',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRight: '1px solid #dee2e6',
  },
  menuItem: {
    display: 'block',
    padding: '12px 15px',
    borderRadius: '5px',
    textDecoration: 'none',
    marginBottom: '5px',
    transition: 'all 0.3s',
  },
  content: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#f5f6fa',
  },
  pageTitle: {
    marginBottom: '20px',
    color: '#2c3e50',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#666',
  },
  companyCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    color: '#27ae60',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '2px solid #27ae60',
  },
  companyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
  },
  companyLogo: {
    width: '100px',
    height: '100px',
    objectFit: 'contain',
    borderRadius: '10px',
    border: '2px solid #eee',
  },
  logoPlaceholder: {
    width: '100px',
    height: '100px',
    borderRadius: '10px',
    backgroundColor: '#27ae60',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    color: 'white',
    fontWeight: 'bold',
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    margin: '0 0 5px 0',
    color: '#2c3e50',
    fontSize: '28px',
  },
  companyId: {
    color: '#7f8c8d',
    fontSize: '14px',
  },
  profileCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  infoLabel: {
    fontSize: '12px',
    color: '#7f8c8d',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoValue: {
    fontSize: '16px',
    color: '#2c3e50',
    fontWeight: '500',
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
  },
  profilePicContainer: {
    position: 'relative',
  },
  profilePic: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #27ae60',
  },
  profilePicPlaceholder: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#27ae60',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    color: 'white',
    fontWeight: 'bold',
    border: '4px solid #27ae60',
  },
  uploadOverlay: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'white',
    border: '2px solid white',
  },
  uploadIcon: {
    fontSize: '16px',
  },
  uploadActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  uploadBtn: {
    padding: '8px 16px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  cancelUploadBtn: {
    padding: '8px 16px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  changePhotoLabel: {
    display: 'inline-block',
    marginTop: '10px',
    cursor: 'pointer',
  },
  changePhotoText: {
    fontSize: '14px',
    color: '#27ae60',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  profileHeaderInfo: {
    flex: 1,
  },
  profileHeaderName: {
    margin: '0 0 5px 0',
    color: '#2c3e50',
    fontSize: '28px',
  },
  profileHeaderRole: {
    margin: '0 0 5px 0',
    color: '#27ae60',
    fontSize: '16px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  profileHeaderEmail: {
    margin: 0,
    color: '#7f8c8d',
    fontSize: '14px',
  },
  // Attendance styles
  attendanceCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  todayStatus: {
    marginBottom: '20px',
  },
  todayInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  timeRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  timeBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px 25px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    minWidth: '100px',
  },
  timeLabel: {
    fontSize: '12px',
    color: '#7f8c8d',
    textTransform: 'uppercase',
    marginBottom: '5px',
  },
  timeValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statusRow: {
    display: 'flex',
    gap: '10px',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  noAttendance: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: '20px',
  },
  actionSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  notesInput: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    minHeight: '60px',
    resize: 'vertical',
  },
  buttonRow: {
    display: 'flex',
    gap: '15px',
  },
  checkInBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
  },
  checkOutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
  },
  tableContainer: {
    overflowX: 'auto',
  },
  attendanceTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  attendanceTh: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
  },
  attendanceTr: {
    borderBottom: '1px solid #eee',
  },
  attendanceTd: {
    padding: '12px',
    fontSize: '14px',
  },
  noDataCell: {
    textAlign: 'center',
    padding: '30px',
    color: '#7f8c8d',
  },
  // Weekly view styles
  viewToggle: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  toggleBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  weekNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  weekNavBtn: {
    padding: '8px 16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  weekRange: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2c3e50',
  },
  weeklyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '10px',
    marginBottom: '20px',
  },
  dayCard: {
    border: '2px solid #eee',
    borderRadius: '8px',
    padding: '10px',
    textAlign: 'center',
  },
  dayHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  dayName: {
    fontSize: '12px',
    color: '#7f8c8d',
    textTransform: 'uppercase',
  },
  dayDate: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  dayContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  dayStatus: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '10px',
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  dayTimes: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '11px',
    color: '#7f8c8d',
  },
  rejectionAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 15px',
    backgroundColor: '#fff5f5',
    border: '1px solid #ffcdd2',
    borderRadius: '8px',
    marginTop: '10px',
    color: '#e74c3c',
    fontSize: '13px',
  },
  rejectionIcon: {
    fontSize: '16px',
  },
  weekendMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 15px',
    backgroundColor: '#fff9e6',
    border: '1px solid #f39c12',
    borderRadius: '8px',
    marginTop: '15px',
    color: '#d68910',
    fontSize: '14px',
  },
  weekendIcon: {
    fontSize: '24px',
  },
  editDayBtn: {
    padding: '4px 8px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    marginTop: '5px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '5px',
  },
  addDayBtn: {
    padding: '4px 8px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    marginTop: '5px',
  },
  submitWeeklyBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    width: '400px',
    maxWidth: '90%',
  },
  modalTitle: {
    marginBottom: '10px',
    color: '#2c3e50',
  },
  modalDate: {
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: '15px',
  },
  modalField: {
    marginBottom: '15px',
  },
  modalInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
  },
  modalTextarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical',
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  modalCancelBtn: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  modalSaveBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#27ae60',
    color: 'white',
    cursor: 'pointer',
  },
  // Leave styles
  leaveBalanceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  leaveBalanceCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  leaveTypeTitle: {
    margin: '0 0 15px 0',
    color: '#2c3e50',
    fontSize: '18px',
    textAlign: 'center',
  },
  leaveBalanceRow: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  leaveBalanceItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  leaveBalanceNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  leaveBalanceLabel: {
    fontSize: '12px',
    color: '#7f8c8d',
    textTransform: 'uppercase',
  },
  applyLeaveBtn: {
    padding: '12px 24px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '20px',
  },
  leaveFormCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  leaveFormGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '15px',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#555',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
  },
  submitLeaveBtn: {
    padding: '12px 24px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '10px',
  },
  leaveHistoryCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  leaveTypeBadge: {
    padding: '4px 8px',
    backgroundColor: '#e8f4f8',
    color: '#2980b9',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  // Salary/Payslip styles
  salaryCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  salaryTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  salaryDetailCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    marginTop: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  earningsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
    color: '#27ae60',
  },
  deductionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
    color: '#e74c3c',
  },
  netSalaryHighlight: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
    marginTop: '10px',
    borderTop: '2px solid #2c3e50',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  downloadBtn: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  filterContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterSelect: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    minWidth: '120px',
  },
  filterBtn: {
    padding: '10px 20px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  slipHeader: {
    textAlign: 'center',
    marginBottom: '25px',
    paddingBottom: '20px',
    borderBottom: '2px solid #eee',
  },
  slipTitle: {
    margin: '0 0 5px 0',
    color: '#2c3e50',
    fontSize: '24px',
  },
  slipPeriod: {
    color: '#7f8c8d',
    fontSize: '16px',
  },
  employeeInfoSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '25px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  infoSection: {
    marginBottom: '20px',
  },
  sectionHeading: {
    color: '#2c3e50',
    marginBottom: '10px',
    fontSize: '16px',
    fontWeight: '600',
  },
  amount: {
    fontWeight: '600',
  },
  noSlipContainer: {
    textAlign: 'center',
    padding: '50px',
    color: '#7f8c8d',
  },
  noSlipIcon: {
    fontSize: '48px',
    marginBottom: '15px',
  },
  noSlipText: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  noSlipSubtext: {
    fontSize: '14px',
    color: '#95a5a6',
  },
  viewBtn: {
    padding: '6px 12px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  // Edit request styles
  editRequestCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  editFormRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
  },
  submitEditBtn: {
    padding: '10px 20px',
    backgroundColor: '#9b59b6',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  pendingSummary: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px 20px',
    backgroundColor: '#fff3cd',
    borderRadius: '8px',
    marginBottom: '20px',
    color: '#856404',
  },
  pendingIcon: {
    fontSize: '20px',
  },
  editHistoryCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  oldValue: {
    color: '#e74c3c',
    textDecoration: 'line-through',
  },
  newValue: {
    color: '#27ae60',
    fontWeight: '600',
  },
  // Editable Profile Styles
  editableValue: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  editIconBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '4px',
    borderRadius: '4px',
    opacity: 0.6,
    transition: 'opacity 0.2s',
  },
  pendingNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 15px',
    backgroundColor: '#fff3cd',
    borderRadius: '8px',
    marginTop: '15px',
    color: '#856404',
    fontSize: '14px',
  },
  editHistoryTable: {
    overflowX: 'auto',
  },
  viewMore: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '12px',
    marginTop: '10px',
  },
  // Edit Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  editModal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
  modalTitle: {
    marginBottom: '15px',
    color: '#2c3e50',
  },
  currentValue: {
    color: '#7f8c8d',
    marginBottom: '15px',
    fontSize: '14px',
  },
  editTextarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    resize: 'vertical',
    minHeight: '60px',
  },
  editNote: {
    color: '#7f8c8d',
    fontSize: '13px',
    marginTop: '10px',
    fontStyle: 'italic',
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  modalCancelBtn: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
  },
  modalSubmitBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#27ae60',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
};

// Modern Payslip Styles
const modernStyles = {
  container: {
    padding: '10px',
  },
  header: {
    marginBottom: '25px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  // Year Selector
  yearSelectorContainer: {
    marginBottom: '25px',
  },
  yearButtonsWrapper: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  yearButton: {
    padding: '12px 24px',
    border: '2px solid #e5e7eb',
    borderRadius: '25px',
    backgroundColor: 'white',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '80px',
  },
  yearButtonActive: {
    backgroundColor: '#4f46e5',
    color: 'white',
    borderColor: '#4f46e5',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
  },
  // Stats
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    padding: '20px 25px',
    borderRadius: '16px',
    color: 'white',
    boxShadow: '0 4px 15px rgba(79, 70, 229, 0.25)',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    display: 'block',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '13px',
    opacity: 0.9,
  },
  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f9fafb',
    borderRadius: '16px',
    border: '2px dashed #e5e7eb',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 8px 0',
  },
  emptyText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  // Grid
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  // Payslip Card
  payslipCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #f3f4f6',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
  },
  monthBadge: {
    width: '60px',
    height: '60px',
    backgroundColor: '#4f46e5',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    flexShrink: 0,
  },
  monthShort: {
    fontSize: '14px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  yearSmall: {
    fontSize: '10px',
    opacity: 0.9,
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  cardMonth: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 12px 0',
  },
  amountContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '12px',
  },
  amountRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  netAmount: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#059669',
  },
  grossAmount: {
    fontSize: '13px',
    color: '#6b7280',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  downloadButton: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  // Loading
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    color: '#6b7280',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #4f46e5',
    borderRadius: '50%',
    marginBottom: '15px',
    animation: 'spin 1s linear infinite',
  },
  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 25px',
    borderBottom: '1px solid #f3f4f6',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  closeButton: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px 25px',
    backgroundColor: '#f9fafb',
  },
  companyLogo: {
    width: '50px',
    height: '50px',
    backgroundColor: '#4f46e5',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  companyName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 4px 0',
  },
  employeeInfo: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
  },
  breakdownContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px 25px',
  },
  breakdownSection: {
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    padding: '15px',
  },
  breakdownTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 12px 0',
  },
  breakdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '13px',
    color: '#4b5563',
    borderBottom: '1px dashed #e5e7eb',
  },
  breakdownAmount: {
    fontWeight: '500',
    color: '#1f2937',
  },
  totalRow: {
    borderTop: '2px solid #e5e7eb',
    borderBottom: 'none',
    marginTop: '8px',
    paddingTop: '12px',
    fontWeight: '600',
    color: '#1f2937',
  },
  totalAmount: {
    color: '#059669',
    fontSize: '14px',
  },
  netSalaryBox: {
    padding: '20px 25px',
    backgroundColor: '#ecfdf5',
    borderTop: '1px solid #d1fae5',
    borderBottom: '1px solid #d1fae5',
  },
  netSalaryContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netSalaryLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#065f46',
  },
  netSalaryValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#059669',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    padding: '20px 25px',
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    backgroundColor: 'white',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  downloadModalBtn: {
    flex: 1,
    padding: '12px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#4f46e5',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  // Resignation Approval Styles
  subtitle: {
    color: '#666',
    marginBottom: '20px',
  },
  tableContainer: {
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    background: '#f8f9fa',
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#333',
    borderBottom: '2px solid #dee2e6',
  },
  tr: {
    borderBottom: '1px solid #dee2e6',
  },
  td: {
    padding: '12px',
  },
  employeeInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  email: {
    fontSize: '12px',
    color: '#666',
  },
  reasonCell: {
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  approveBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  rejectBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  noAction: {
    color: '#999',
    fontSize: '12px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '400px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'vertical',
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  confirmApproveBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  confirmRejectBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

// Manager Resignation Approvals Component
const ManagerResignationApprovals = () => {
  const [resignations, setResignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResignation, setSelectedResignation] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    loadResignations();
  }, []);

  const loadResignations = async () => {
    try {
      setLoading(true);
      const response = await resignationAPI.getPendingForManager();
      setResignations(response.data || []);
    } catch (error) {
      toast.error('Failed to load resignation requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await resignationAPI.managerApprove({
        resignationId: selectedResignation.id,
        approved: true,
        remarks: remarks
      });
      toast.success('Resignation approved successfully');
      setShowApproveModal(false);
      setRemarks('');
      loadResignations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve resignation');
    }
  };

  const handleReject = async () => {
    try {
      await resignationAPI.managerApprove({
        resignationId: selectedResignation.id,
        approved: false,
        remarks: remarks
      });
      toast.success('Resignation rejected');
      setShowRejectModal(false);
      setRemarks('');
      loadResignations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject resignation');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'PENDING_MANAGER': '#f39c12',
      'MANAGER_APPROVED': '#3498db',
      'PENDING_ADMIN': '#3498db',
      'APPROVED': '#27ae60',
      'REJECTED': '#e74c3c',
    };
    return {
      backgroundColor: colors[status] || '#95a5a6',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
    };
  };

  if (loading) {
    return <div style={styles.loading}>Loading resignation requests...</div>;
  }

  return (
    <div>
      <h2 style={styles.pageTitle}>Resignation Approvals</h2>
      <p style={styles.subtitle}>Review and approve employee resignation requests</p>
      
      {resignations.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📝</div>
          <h3>No Pending Resignations</h3>
          <p>There are no resignation requests awaiting your approval.</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Employee</th>
                <th style={styles.th}>Request Date</th>
                <th style={styles.th}>Proposed LWD</th>
                <th style={styles.th}>Notice Period</th>
                <th style={styles.th}>Reason</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resignations.map((resignation) => (
                <tr key={resignation.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.employeeInfo}>
                      <strong>{resignation.employee?.fullName}</strong>
                      <span style={styles.email}>{resignation.employee?.email}</span>
                    </div>
                  </td>
                  <td style={styles.td}>{new Date(resignation.requestDate).toLocaleDateString()}</td>
                  <td style={styles.td}>{new Date(resignation.proposedLastWorkingDay).toLocaleDateString()}</td>
                  <td style={styles.td}>{resignation.noticePeriodDays} days</td>
                  <td style={styles.td}>
                    <div style={styles.reasonCell} title={resignation.reason}>
                      {resignation.reason?.substring(0, 50)}...
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={getStatusBadge(resignation.status)}>
                      {resignation.status === 'PENDING_MANAGER' ? 'Pending' : 
                       resignation.status === 'MANAGER_APPROVED' ? 'Manager Approved' :
                       resignation.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {resignation.status === 'PENDING_MANAGER' ? (
                      <div style={styles.actionButtons}>
                        <button
                          style={styles.approveBtn}
                          onClick={() => {
                            setSelectedResignation(resignation);
                            setShowApproveModal(true);
                          }}
                        >
                          Approve
                        </button>
                        <button
                          style={styles.rejectBtn}
                          onClick={() => {
                            setSelectedResignation(resignation);
                            setShowRejectModal(true);
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={styles.noAction}>Awaiting Admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Approve Resignation</h3>
            <p>Employee: <strong>{selectedResignation?.employee?.fullName}</strong></p>
            <div style={styles.formGroup}>
              <label>Remarks (Optional)</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add any remarks..."
                style={styles.textarea}
                rows="3"
              />
            </div>
            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={() => setShowApproveModal(false)}>
                Cancel
              </button>
              <button style={styles.confirmApproveBtn} onClick={handleApprove}>
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Reject Resignation</h3>
            <p>Employee: <strong>{selectedResignation?.employee?.fullName}</strong></p>
            <div style={styles.formGroup}>
              <label>Reason for Rejection *</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Provide reason for rejection..."
                style={styles.textarea}
                rows="3"
                required
              />
            </div>
            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={() => setShowRejectModal(false)}>
                Cancel
              </button>
              <button 
                style={styles.confirmRejectBtn} 
                onClick={handleReject}
                disabled={!remarks.trim()}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// My BGV Page Component
const MyBGVPage = () => {
  const [bgvRequests, setBgvRequests] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  const handleViewPolicy = (fileUrl) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      if (!fileUrl) {
        toast.error('File URL not available');
        return;
      }
      const downloadUrl = `${process.env.REACT_APP_API_URL || 'http://34.47.170.212:9090'}/api/files/download?path=${encodeURIComponent(fileUrl)}&token=${token}`;
      window.open(downloadUrl, '_blank');
    } catch (error) {
      toast.error('Error opening file: ' + error.message);
    }
  };

  useEffect(() => {
    loadBGVRequests();
  }, []);

  const loadBGVRequests = async () => {
    try {
      setLoading(true);
      const response = await bgvAPI.getMyBGVStatus();
      const requests = Array.isArray(response.data) ? response.data : 
                      (response.data && typeof response.data === 'object' && !response.data.message) ? [response.data] : [];
      setBgvRequests(requests);
      if (requests.length > 0 && requests[0].id) {
        loadDocuments(requests[0].id);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load BGV status');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async (bgvId) => {
    try {
      const response = await bgvAPI.getMyDocuments(bgvId);
      setDocuments(response.data || []);
    } catch (error) {
      console.error('Failed to load documents');
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !selectedDocument || !selectedRequest) return;
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('bgvRequestId', selectedRequest.id);
      formData.append('documentType', selectedDocument.documentType);
      await bgvAPI.uploadDocument(formData);
      toast.success('Document uploaded successfully');
      setShowUploadModal(false);
      setUploadFile(null);
      setSelectedDocument(null);
      loadDocuments(selectedRequest.id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload document');
    }
  };

  const handleSubmitForVerification = async (bgvId) => {
    try {
      await bgvAPI.submitForVerification(bgvId);
      toast.success('Documents submitted for verification');
      loadBGVRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit');
    }
  };

  const openUploadModal = (request, doc) => {
    setSelectedRequest(request);
    setSelectedDocument(doc);
    setShowUploadModal(true);
  };

  const getStatusBadge = (status) => {
    const config = {
      'PENDING': { color: '#f39c12', bg: '#fff3cd', label: 'Pending Upload' },
      'UPLOADED': { color: '#3498db', bg: '#d1ecf1', label: 'Uploaded' },
      'UNDER_REVIEW': { color: '#9b59b6', bg: '#e8daef', label: 'Under Review' },
      'APPROVED': { color: '#27ae60', bg: '#d4edda', label: 'Approved' },
      'REJECTED': { color: '#e74c3c', bg: '#f8d7da', label: 'Rejected' }
    };
    const style = config[status] || { color: '#666', bg: '#eee', label: status };
    return {
      backgroundColor: style.bg,
      color: style.color,
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      border: `1px solid ${style.color}`,
      display: 'inline-block'
    };
  };

  const progressPercentage = documents.length > 0 
    ? Math.round((documents.filter(d => d.status !== 'PENDING').length / documents.length) * 100) 
    : 0;

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50', marginBottom: '5px' }}>
          🔍 Background Verification
        </h2>
        <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Manage your verification documents and track status</p>
      </div>
      
      {bgvRequests.length === 0 ? (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          borderRadius: '12px', 
          padding: '50px', 
          textAlign: 'center',
          border: '2px dashed #dee2e6'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📋</div>
          <h3 style={{ color: '#495057', marginBottom: '10px' }}>No BGV Request Found</h3>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>
            No background verification has been initiated for you yet.<br/>
            Your HR will initiate BGV when required.
          </p>
        </div>
      ) : (
        <div>
          {bgvRequests.map((bgv) => (
            <div key={bgv.id} style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '25px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              {/* Status Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: '1px solid #e9ecef'
              }}>
                <div>
                  <span style={{ fontSize: '14px', color: '#6c757d', marginRight: '10px' }}>Status:</span>
                  <span style={getStatusBadge(bgv.status)}>{bgv.status?.replace(/_/g, ' ')}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>Employee Type</div>
                  <div style={{ fontWeight: '600', color: '#495057' }}>{bgv.employeeType}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#495057' }}>Document Upload Progress</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#3498db' }}>{progressPercentage}%</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#e9ecef', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${progressPercentage}%`, 
                    height: '100%', 
                    backgroundColor: progressPercentage === 100 ? '#27ae60' : '#3498db',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '5px' }}>
                  {documents.filter(d => d.status !== 'PENDING').length} of {documents.length} documents uploaded
                </div>
              </div>

              {/* Documents List */}
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50', marginBottom: '15px' }}>
                Required Documents
              </h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                {documents.map((doc) => (
                  <div key={doc.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '15px 20px',
                    backgroundColor: doc.status === 'PENDING' ? '#fff' : '#f8f9fa',
                    border: `1px solid ${doc.status === 'PENDING' ? '#dee2e6' : '#28a745'}`,
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>
                        {doc.status === 'PENDING' ? '📄' : '✅'}
                      </span>
                      <div>
                        <div style={{ fontWeight: '500', color: '#2c3e50' }}>{doc.documentName}</div>
                        <div style={{ fontSize: '12px', color: '#6c757d' }}>
                          {doc.status === 'PENDING' ? 'Waiting for upload' : 'Uploaded successfully'}
                        </div>
                      </div>
                    </div>
                    <div>
                      {doc.status === 'PENDING' ? (
                        <button
                          style={{
                            padding: '8px 20px',
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                          onClick={() => openUploadModal(bgv, doc)}
                        >
                          Upload
                        </button>
                      ) : doc.fileUrl ? (
                        <button
                          onClick={() => handleViewPolicy(doc.fileUrl)}
                          style={{
                            padding: '8px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          View
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
              
              {bgv.status === 'PENDING' && documents.every(d => d.status !== 'PENDING') && (
                <div style={{ marginTop: '25px', textAlign: 'center', padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>🎉</div>
                  <h4 style={{ color: '#155724', marginBottom: '10px' }}>All Documents Uploaded!</h4>
                  <p style={{ color: '#155724', fontSize: '14px', marginBottom: '15px' }}>
                    You can now submit your documents for verification.
                  </p>
                  <button
                    style={{
                      padding: '12px 30px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSubmitForVerification(bgv.id)}
                  >
                    Submit for Verification
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.editModal, maxWidth: '500px' }}>
            <h3 style={{ ...styles.modalTitle, marginBottom: '20px' }}>📤 Upload Document</h3>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px', 
              marginBottom: '20px' 
            }}>
              <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '5px' }}>
                {selectedDocument?.documentName}
              </div>
              <div style={{ fontSize: '13px', color: '#6c757d' }}>
                Please upload a clear scan or photo of your document (PDF, JPG, PNG)
              </div>
            </div>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setUploadFile(e.target.files[0])}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '2px dashed #dee2e6',
                borderRadius: '8px',
                marginBottom: '15px'
              }}
            />
            {uploadFile && (
              <div style={{ 
                padding: '10px', 
                backgroundColor: '#d1ecf1', 
                borderRadius: '6px',
                marginBottom: '20px',
                fontSize: '13px',
                color: '#0c5460'
              }}>
                ✅ Selected: {uploadFile.name}
              </div>
            )}
            <div style={styles.modalButtons}>
              <button 
                style={{ ...styles.cancelBtn, padding: '10px 25px' }} 
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </button>
              <button 
                style={{ 
                  ...styles.confirmApproveBtn, 
                  padding: '10px 25px',
                  opacity: !uploadFile ? 0.5 : 1
                }} 
                onClick={handleUpload}
                disabled={!uploadFile}
              >
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// My Policies Page Component
const MyPoliciesPage = () => {
  const [pendingPolicies, setPendingPolicies] = useState([]);
  const [acknowledgedPolicies, setAcknowledgedPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAcknowledgeModal, setShowAcknowledgeModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);

  const handleViewPolicy = (fileUrl) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      if (!fileUrl) {
        toast.error('File URL not available');
        return;
      }
      const downloadUrl = `${process.env.REACT_APP_API_URL || 'http://34.47.170.212:9090'}/api/files/download?path=${encodeURIComponent(fileUrl)}&token=${token}`;
      window.open(downloadUrl, '_blank');
    } catch (error) {
      toast.error('Error opening file: ' + error.message);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const pendingResponse = await hrPolicyAPI.getMyPendingPolicies();
      const ackResponse = await hrPolicyAPI.getMyAcknowledgedPolicies();
      setPendingPolicies(pendingResponse.data || []);
      setAcknowledgedPolicies(ackResponse.data || []);
    } catch (error) {
      toast.error('Failed to load policies');
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async () => {
    try {
      await hrPolicyAPI.acknowledgePolicy(selectedAssignment.id);
      toast.success('Policy acknowledged successfully');
      setShowAcknowledgeModal(false);
      setAcknowledged(false);
      setSelectedAssignment(null);
      loadPolicies();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to acknowledge');
    }
  };

  const openAcknowledgeModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowAcknowledgeModal(true);
  };

  const getTypeBadge = (type) => {
    const config = {
      'POLICY': { bg: '#e3f2fd', color: '#1976d2', label: 'Policy' },
      'FORM': { bg: '#f3e5f5', color: '#7b1fa2', label: 'Form' }
    };
    const style = config[type] || { bg: '#eee', color: '#666', label: type };
    return {
      backgroundColor: style.bg,
      color: style.color,
      padding: '5px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-block'
    };
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Invalid Date') return 'No due date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'No due date';
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'No due date';
    }
  };

  const getPolicyName = (policy) => {
    return policy?.policyName || policy?.title || policy?.name || 'Unnamed Policy';
  };

  const getPolicyDescription = (policy) => {
    return policy?.description || 'No description available';
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  const totalPolicies = pendingPolicies.length + acknowledgedPolicies.length;
  const completionRate = totalPolicies > 0 
    ? Math.round((acknowledgedPolicies.length / totalPolicies) * 100) 
    : 0;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50', marginBottom: '5px' }}>
          📋 HR Policies & Forms
        </h2>
        <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Review and acknowledge company policies and forms</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '10px', border: '1px solid #ffc107' }}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#856404' }}>{pendingPolicies.length}</div>
          <div style={{ fontSize: '13px', color: '#856404' }}>Pending Acknowledgment</div>
        </div>
        <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '10px', border: '1px solid #28a745' }}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#155724' }}>{acknowledgedPolicies.length}</div>
          <div style={{ fontSize: '13px', color: '#155724' }}>Acknowledged</div>
        </div>
        <div style={{ backgroundColor: '#e7f3ff', padding: '20px', borderRadius: '10px', border: '1px solid #2196f3' }}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#0d47a1' }}>{completionRate}%</div>
          <div style={{ fontSize: '13px', color: '#0d47a1' }}>Completion Rate</div>
        </div>
      </div>
      
      {/* Pending Policies */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>⏳</span> Pending Acknowledgment
        </h3>
        {pendingPolicies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
            <h4 style={{ color: '#28a745', marginBottom: '5px' }}>All Caught Up!</h4>
            <p style={{ color: '#6c757d', fontSize: '14px' }}>No pending policies to acknowledge.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {pendingPolicies.map((assignment) => (
              <div key={assignment.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                backgroundColor: '#fff',
                border: '1px solid #dee2e6',
                borderRadius: '10px',
                transition: 'box-shadow 0.2s ease',
                ':hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    backgroundColor: assignment.policy?.policyType === 'FORM' ? '#f3e5f5' : '#e3f2fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    {assignment.policy?.policyType === 'FORM' ? '📝' : '📄'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#2c3e50', fontSize: '16px', marginBottom: '4px' }}>
                      {getPolicyName(assignment.policy)}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '6px' }}>
                      {getPolicyDescription(assignment.policy).substring(0, 80)}
                      {getPolicyDescription(assignment.policy).length > 80 ? '...' : ''}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={getTypeBadge(assignment.policy?.policyType)}>
                        {assignment.policy?.policyType}
                      </span>
                      <span style={{ fontSize: '12px', color: '#6c757d' }}>
                        📅 Assigned: {formatDate(assignment.assignedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {assignment.policy?.fileUrl && (
                    <button
                      onClick={() => handleViewPolicy(assignment.policy.fileUrl)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      👁️ View
                    </button>
                  )}
                  <button
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    onClick={() => openAcknowledgeModal(assignment)}
                  >
                    ✓ Acknowledge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Acknowledged Policies */}
      {acknowledgedPolicies.length > 0 && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>✅</span> Acknowledged Policies
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {acknowledgedPolicies.map((assignment) => (
              <div key={assignment.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '15px 20px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #28a745',
                borderRadius: '8px',
                opacity: 0.9
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>✓</span>
                  <div>
                    <div style={{ fontWeight: '500', color: '#2c3e50' }}>{getPolicyName(assignment.policy)}</div>
                    <div style={{ fontSize: '12px', color: '#28a745' }}>
                      Acknowledged on {formatDate(assignment.acknowledgedAt)}
                    </div>
                  </div>
                </div>
                <span style={getTypeBadge(assignment.policy?.policyType)}>
                  {assignment.policy?.policyType}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acknowledge Modal */}
      {showAcknowledgeModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.editModal, maxWidth: '550px' }}>
            <h3 style={{ ...styles.modalTitle, marginBottom: '20px' }}>✍️ Acknowledge Policy</h3>
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
              <div style={{ fontWeight: '600', color: '#2c3e50', fontSize: '18px', marginBottom: '10px' }}>
                {getPolicyName(selectedAssignment?.policy)}
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d', lineHeight: '1.6' }}>
                {getPolicyDescription(selectedAssignment?.policy)}
              </div>
            </div>
            <div style={{ 
              backgroundColor: '#fff3cd', 
              padding: '15px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              border: '1px solid #ffc107'
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '12px' }}>
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  style={{ marginTop: '3px', width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '14px', color: '#856404', lineHeight: '1.5' }}>
                  I have read and understood this policy. I agree to comply with all terms and conditions mentioned herein. I understand that this acknowledgment is legally binding.
                </span>
              </label>
            </div>
            <div style={styles.modalButtons}>
              <button 
                style={{ ...styles.cancelBtn, padding: '12px 25px' }} 
                onClick={() => setShowAcknowledgeModal(false)}
              >
                Cancel
              </button>
              <button 
                style={{ 
                  ...styles.confirmApproveBtn, 
                  padding: '12px 25px',
                  opacity: !acknowledged ? 0.5 : 1,
                  backgroundColor: !acknowledged ? '#6c757d' : '#28a745'
                }} 
                onClick={handleAcknowledge}
                disabled={!acknowledged}
              >
                Confirm Acknowledgment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
