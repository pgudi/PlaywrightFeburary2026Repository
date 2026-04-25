import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { adminAPI, uploadAPI, attendanceAPI, leaveAPI, profileEditAPI, salaryAPI, bonusAPI, adminExitAPI, adminDocumentAPI, resignationAPI, bgvAPI, hrPolicyAPI } from '../services/api';
import EmployeeSearch from '../components/EmployeeSearch';
import { toast } from 'react-toastify';
import ExitEmployeesPage from './ExitEmployeesPage';
import DocumentManagementPage from './DocumentManagementPage';

const AdminDashboard = () => {
  return (
    <div>
      <Navbar title="Admin Dashboard" />
      <div style={styles.container}>
        <Sidebar />
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/employees" element={<ManageEmployees />} />
            <Route path="/attendance" element={<AttendanceApproval />} />
            <Route path="/leaves" element={<LeaveApproval />} />
            <Route path="/profile-edits" element={<ProfileEditApproval />} />
            <Route path="/salary" element={<SalaryManagement />} />
            <Route path="/bonus" element={<BonusManagement />} />
            <Route path="/exit-employees" element={<ExitEmployeesPage />} />
            <Route path="/documents" element={<DocumentManagementPage />} />
            <Route path="/resignations" element={<ResignationManagementPage />} />
            <Route path="/bgv" element={<BGVManagementPage />} />
            <Route path="/hr-policies" element={<HRPoliciesPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/employees', label: 'Manage Employees', icon: '👥' },
    { path: '/admin/exit-employees', label: 'Exit Employees', icon: '🚪' },
    { path: '/admin/documents', label: 'Document Management', icon: '📄' },
    { path: '/admin/attendance', label: 'Attendance Approval', icon: '✅' },
    { path: '/admin/leaves', label: 'Leave Approvals', icon: '🏖️' },
    { path: '/admin/profile-edits', label: 'Profile Edit Requests', icon: '✏️' },
    { path: '/admin/salary', label: 'Salary Management', icon: '💰' },
    { path: '/admin/bonus', label: 'Bonus Management', icon: '🎁' },
    { path: '/admin/resignations', label: 'Resignation Approvals', icon: '📝' },
    { path: '/admin/bgv', label: 'BGV Management', icon: '🔍' },
    { path: '/admin/hr-policies', label: 'HR Policies', icon: '📋' },
  ];

  return (
    <div style={styles.sidebar}>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            ...styles.menuItem,
            backgroundColor: location.pathname === item.path ? '#9b59b6' : 'transparent',
            color: location.pathname === item.path ? 'white' : '#333',
          }}
        >
          <span>{item.icon}</span> {item.label}
        </Link>
      ))}
    </div>
  );
};

const DashboardHome = () => {
  const [stats, setStats] = useState({ employees: 0, company: null });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [employeesRes, companyRes] = await Promise.all([
        adminAPI.getAllEmployees(),
        adminAPI.getMyCompany().catch(() => ({ data: null })),
      ]);
      setStats({
        employees: employeesRes.data.length,
        company: companyRes.data,
      });
    } catch (error) {
      toast.error('Failed to load statistics');
    }
  };

  return (
    <div>
      <h2 style={styles.pageTitle}>Dashboard Overview</h2>

      {stats.company && (
        <div style={styles.companyCard}>
          <h3>My Company</h3>
          <div style={styles.companyInfo}>
            {stats.company.logoUrl ? (
              <img
                src={stats.company.logoUrl}
                alt="Company Logo"
                style={styles.companyLogo}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div style={{
              ...styles.logoPlaceholder,
              display: stats.company.logoUrl ? 'none' : 'flex'
            }}>
              {stats.company.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={styles.companyName}>{stats.company.name}</h2>
              <p>{stats.company.address}</p>
              <p>{stats.company.phone} | {stats.company.email}</p>
            </div>
          </div>
        </div>
      )}

      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, backgroundColor: '#9b59b6' }}>
          <h3 style={styles.statNumber}>{stats.employees}</h3>
          <p>Total Employees</p>
        </div>
      </div>
    </div>
  );
};

// Attendance Approval Component
const AttendanceApproval = () => {
  const [attendance, setAttendance] = useState([]);
  const [myCompany, setMyCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [processingBulk, setProcessingBulk] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filter, setFilter] = useState('PENDING');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const companyRes = await adminAPI.getMyCompany().catch(() => ({ data: null }));
      setMyCompany(companyRes.data);

      if (companyRes.data) {
        const attendanceRes = await attendanceAPI.getCompanyAttendance(companyRes.data.id);
        setAttendance(attendanceRes.data || []);
      }
    } catch (error) {
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (attendanceId) => {
    setProcessingId(attendanceId);
    try {
      await attendanceAPI.approveAttendance({
        attendanceId,
        approved: true,
        notes: 'Approved by admin',
      });
      toast.success('Attendance approved successfully!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve attendance');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectClick = (record) => {
    setSelectedAttendance(record);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setProcessingId(selectedAttendance.id);
    try {
      await attendanceAPI.approveAttendance({
        attendanceId: selectedAttendance.id,
        approved: false,
        rejectionReason,
      });
      toast.success('Attendance rejected');
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedAttendance(null);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject attendance');
    } finally {
      setProcessingId(null);
    }
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    const pendingIds = filteredAttendance
      .filter(r => r.approvalStatus === 'PENDING')
      .map(r => r.id);
    
    if (selectedIds.length === pendingIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingIds);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one record');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to approve ${selectedIds.length} attendance record(s)?`)) {
      return;
    }

    setProcessingBulk(true);
    let successCount = 0;
    let errorCount = 0;

    for (const id of selectedIds) {
      try {
        await attendanceAPI.approveAttendance({
          attendanceId: id,
          approved: true,
          notes: 'Bulk approved by admin',
        });
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} attendance record(s) approved successfully!`);
    }
    if (errorCount > 0) {
      toast.error(`Failed to approve ${errorCount} record(s)`);
    }
    
    setSelectedIds([]);
    setProcessingBulk(false);
    loadData();
  };

  const handleBulkRejectClick = () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one record');
      return;
    }
    setShowRejectModal(true);
  };

  const handleBulkReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setProcessingBulk(true);
    let successCount = 0;
    let errorCount = 0;

    for (const id of selectedIds) {
      try {
        await attendanceAPI.approveAttendance({
          attendanceId: id,
          approved: false,
          rejectionReason,
        });
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} attendance record(s) rejected!`);
    }
    if (errorCount > 0) {
      toast.error(`Failed to reject ${errorCount} record(s)`);
    }
    
    setSelectedIds([]);
    setRejectionReason('');
    setShowRejectModal(false);
    setProcessingBulk(false);
    loadData();
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

  const filteredAttendance = attendance.filter(record =>
    filter === 'ALL' || record.approvalStatus === filter
  );

  if (loading) {
    return <div style={styles.loading}>Loading attendance...</div>;
  }

  return (
    <div>
      <h2 style={styles.pageTitle}>Attendance Approval</h2>

      {/* Filter Tabs */}
      <div style={styles.filterTabs}>
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => { setFilter(status); setSelectedIds([]); }}
            style={{
              ...styles.filterTab,
              backgroundColor: filter === status ? '#9b59b6' : 'white',
              color: filter === status ? 'white' : '#333',
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {filter === 'PENDING' && selectedIds.length > 0 && (
        <div style={styles.bulkActions}>
          <span style={styles.selectedCount}>{selectedIds.length} selected</span>
          <button
            onClick={handleBulkApprove}
            disabled={processingBulk}
            style={{
              ...styles.bulkApproveBtn,
              opacity: processingBulk ? 0.5 : 1,
            }}
          >
            {processingBulk ? 'Processing...' : '✓ Approve All'}
          </button>
          <button
            onClick={handleBulkRejectClick}
            disabled={processingBulk}
            style={{
              ...styles.bulkRejectBtn,
              opacity: processingBulk ? 0.5 : 1,
            }}
          >
            {processingBulk ? 'Processing...' : '✕ Reject All'}
          </button>
          <button
            onClick={() => setSelectedIds([])}
            style={styles.clearSelectionBtn}
          >
            Clear
          </button>
        </div>
      )}

      {/* Attendance Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              {filter === 'PENDING' && (
                <th style={{...styles.th, width: '40px'}}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredAttendance.filter(r => r.approvalStatus === 'PENDING').length && filteredAttendance.filter(r => r.approvalStatus === 'PENDING').length > 0}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                  />
                </th>
              )}
              <th style={styles.th}>Employee</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Check In</th>
              <th style={styles.th}>Check Out</th>
              <th style={styles.th}>Hours</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Approval</th>
              <th style={styles.th}>Notes</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.length === 0 ? (
              <tr>
                <td colSpan={filter === 'PENDING' ? 10 : 9} style={styles.noDataCell}>
                  No attendance records found
                </td>
              </tr>
            ) : (
              filteredAttendance.map((record) => (
                <tr 
                  key={record.id} 
                  style={{
                    ...styles.tr,
                    backgroundColor: selectedIds.includes(record.id) ? '#f0e6ff' : 'transparent',
                  }}
                >
                  {filter === 'PENDING' && (
                    <td style={{...styles.td, textAlign: 'center'}}>
                      {record.approvalStatus === 'PENDING' && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(record.id)}
                          onChange={() => handleSelectOne(record.id)}
                          style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                        />
                      )}
                    </td>
                  )}
                  <td style={styles.td}>
                    <div style={styles.employeeCell}>
                      <strong>{record.employeeName}</strong>
                    </div>
                  </td>
                  <td style={styles.td}>
                    {new Date(record.attendanceDate).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>{record.checkInTime || '--:--'}</td>
                  <td style={styles.td}>{record.checkOutTime || '--:--'}</td>
                  <td style={styles.td}>
                    {record.workingHours ? `${record.workingHours}h` : '--'}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: getAttendanceStatusColor(record.status),
                    }}>
                      {record.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(record.approvalStatus),
                    }}>
                      {record.approvalStatus}
                    </span>
                  </td>
                  <td style={styles.td}>{record.notes || '-'}</td>
                  <td style={styles.td}>
                    {record.approvalStatus === 'PENDING' && (
                      <div style={styles.actionButtons}>
                        <button
                          onClick={() => handleApprove(record.id)}
                          disabled={processingId === record.id}
                          style={{
                            ...styles.approveBtn,
                            opacity: processingId === record.id ? 0.5 : 1,
                          }}
                        >
                          {processingId === record.id ? '...' : '✓'}
                        </button>
                        <button
                          onClick={() => handleRejectClick(record)}
                          disabled={processingId === record.id}
                          style={{
                            ...styles.rejectBtn,
                            opacity: processingId === record.id ? 0.5 : 1,
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {record.approvalStatus === 'APPROVED' && (
                      <span style={styles.approvedBy}>
                        By: {record.approvedByName || 'Admin'}
                      </span>
                    )}
                    {record.approvalStatus === 'REJECTED' && (
                      <span style={styles.rejectionText} title={record.rejectionReason}>
                        {record.rejectionReason?.substring(0, 20) || 'No reason'}...
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>
              {selectedIds.length > 0 ? `Reject ${selectedIds.length} Records` : 'Reject Attendance'}
            </h3>
            {selectedIds.length > 0 ? (
              <p>Bulk rejection for {selectedIds.length} selected attendance record(s)</p>
            ) : (
              <>
                <p>Employee: <strong>{selectedAttendance?.employeeName}</strong></p>
                <p>Date: {selectedAttendance && new Date(selectedAttendance.attendanceDate).toLocaleDateString()}</p>
              </>
            )}
            <textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              style={styles.modalTextarea}
            />
            <div style={styles.modalButtons}>
              <button 
                onClick={() => { setShowRejectModal(false); setSelectedAttendance(null); }} 
                style={styles.modalCancelBtn}
              >
                Cancel
              </button>
              <button 
                onClick={selectedIds.length > 0 ? handleBulkReject : handleReject} 
                disabled={processingBulk}
                style={styles.modalRejectBtn}
              >
                {processingBulk ? 'Processing...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Leave Approval Component
const LeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [myCompany, setMyCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState('PENDING');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const companyRes = await adminAPI.getMyCompany().catch(() => ({ data: null }));
      setMyCompany(companyRes.data);

      if (companyRes.data) {
        const leavesRes = await leaveAPI.getCompanyLeaves(companyRes.data.id);
        setLeaves(leavesRes.data || []);
      }
    } catch (error) {
      toast.error('Failed to load leave data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId) => {
    setProcessingId(leaveId);
    try {
      await leaveAPI.approveLeave({
        leaveId,
        approved: true,
        notes: 'Approved by admin',
      });
      toast.success('Leave approved successfully!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve leave');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectClick = (leave) => {
    setSelectedLeave(leave);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setProcessingId(selectedLeave.id);
    try {
      await leaveAPI.approveLeave({
        leaveId: selectedLeave.id,
        approved: false,
        rejectionReason,
      });
      toast.success('Leave rejected');
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedLeave(null);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject leave');
    } finally {
      setProcessingId(null);
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

  const filteredLeaves = leaves.filter(record =>
    filter === 'ALL' || record.status === filter
  );

  if (loading) {
    return <div style={styles.loading}>Loading leave requests...</div>;
  }

  return (
    <div>
      <h2 style={styles.pageTitle}>Leave Approvals</h2>

      {/* Filter Tabs */}
      <div style={styles.filterTabs}>
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              ...styles.filterTab,
              backgroundColor: filter === status ? '#9b59b6' : 'white',
              color: filter === status ? 'white' : '#333',
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Leave Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Employee</th>
              <th style={styles.th}>Leave Type</th>
              <th style={styles.th}>Start Date</th>
              <th style={styles.th}>End Date</th>
              <th style={styles.th}>Days</th>
              <th style={styles.th}>Reason</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length === 0 ? (
              <tr>
                <td colSpan="8" style={styles.noDataCell}>
                  No leave requests found
                </td>
              </tr>
            ) : (
              filteredLeaves.map((leave) => (
                <tr key={leave.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.employeeCell}>
                      <strong>{leave.employeeName}</strong>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.leaveTypeBadge}>{leave.leaveType}</span>
                  </td>
                  <td style={styles.td}>
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.daysBadge,
                      backgroundColor: leave.numberOfDays > 3 ? '#e74c3c' : '#3498db',
                    }}>
                      {leave.numberOfDays} {leave.numberOfDays > 3 && '⚠️'}
                    </span>
                  </td>
                  <td style={styles.td} title={leave.reason}>
                    {leave.reason.length > 30 ? leave.reason.substring(0, 30) + '...' : leave.reason}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(leave.status),
                    }}>
                      {leave.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {leave.status === 'PENDING' && (
                      <div style={styles.actionButtons}>
                        <button
                          onClick={() => handleApprove(leave.id)}
                          disabled={processingId === leave.id}
                          style={{
                            ...styles.approveBtn,
                            opacity: processingId === leave.id ? 0.5 : 1,
                          }}
                        >
                          {processingId === leave.id ? '...' : '✓'}
                        </button>
                        <button
                          onClick={() => handleRejectClick(leave)}
                          disabled={processingId === leave.id}
                          style={{
                            ...styles.rejectBtn,
                            opacity: processingId === leave.id ? 0.5 : 1,
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {leave.status === 'APPROVED' && (
                      <span style={styles.approvedBy}>
                        By: {leave.approvedByName || 'Admin'}
                      </span>
                    )}
                    {leave.status === 'REJECTED' && (
                      <span style={styles.rejectionText} title={leave.rejectionReason}>
                        {leave.rejectionReason?.substring(0, 20) || 'No reason'}...
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Reject Leave</h3>
            <p>Employee: <strong>{selectedLeave?.employeeName}</strong></p>
            <p>Leave Type: <strong>{selectedLeave?.leaveType}</strong></p>
            <p>Duration: {selectedLeave?.numberOfDays} days</p>
            <textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              style={styles.modalTextarea}
            />
            <div style={styles.modalButtons}>
              <button onClick={() => setShowRejectModal(false)} style={styles.modalCancelBtn}>
                Cancel
              </button>
              <button onClick={handleReject} style={styles.modalRejectBtn}>
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Profile Edit Approval Component
const ProfileEditApproval = () => {
  const [requests, setRequests] = useState([]);
  const [myCompany, setMyCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState('PENDING');
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const companyRes = await adminAPI.getMyCompany().catch(() => ({ data: null }));
      setMyCompany(companyRes.data);

      if (companyRes.data) {
        const requestsRes = await profileEditAPI.getCompanyRequests(companyRes.data.id);
        setRequests(requestsRes.data || []);
      }
    } catch (error) {
      toast.error('Failed to load profile edit requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    setProcessingId(requestId);
    try {
      await profileEditAPI.approveRequest({
        requestId,
        approved: true,
      });
      toast.success('Profile edit request approved!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    setProcessingId(requestId);
    try {
      await profileEditAPI.approveRequest({
        requestId,
        approved: false,
      });
      toast.success('Profile edit request rejected');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewComparison = (request) => {
    setSelectedRequest(request);
    setShowCompareModal(true);
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

  const filteredRequests = requests.filter(record =>
    filter === 'ALL' || record.status === filter
  );

  if (loading) {
    return <div style={styles.loading}>Loading edit requests...</div>;
  }

  return (
    <div>
      <h2 style={styles.pageTitle}>Profile Edit Requests</h2>

      {/* Filter Tabs */}
      <div style={styles.filterTabs}>
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              ...styles.filterTab,
              backgroundColor: filter === status ? '#9b59b6' : 'white',
              color: filter === status ? 'white' : '#333',
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Employee</th>
              <th style={styles.th}>Field</th>
              <th style={styles.th}>Old Value</th>
              <th style={styles.th}>New Value</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.noDataCell}>
                  No edit requests found
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr key={request.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.employeeCell}>
                      <strong>{request.employeeName}</strong>
                    </div>
                  </td>
                  <td style={styles.td}>
                    {getFieldLabel(request.fieldName)}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.oldValue}>{request.oldValue || '-'}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.newValue}>{request.newValue}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(request.status),
                    }}>
                      {request.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => handleViewComparison(request)}
                        style={styles.viewBtn}
                      >
                        👁️
                      </button>
                      {request.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(request.id)}
                            disabled={processingId === request.id}
                            style={{
                              ...styles.approveBtn,
                              opacity: processingId === request.id ? 0.5 : 1,
                            }}
                          >
                            {processingId === request.id ? '...' : '✓'}
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            disabled={processingId === request.id}
                            style={{
                              ...styles.rejectBtn,
                              opacity: processingId === request.id ? 0.5 : 1,
                            }}
                          >
                            ✕
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Comparison Modal */}
      {showCompareModal && selectedRequest && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modal, width: '500px' }}>
            <h3 style={styles.modalTitle}>Profile Edit Comparison</h3>
            <p style={styles.compareEmployee}>
              Employee: <strong>{selectedRequest.employeeName}</strong>
            </p>
            <p style={styles.compareField}>
              Field: <strong>{getFieldLabel(selectedRequest.fieldName)}</strong>
            </p>

            <div style={styles.compareContainer}>
              <div style={styles.compareBox}>
                <h4 style={styles.compareBoxTitle}>Current Value</h4>
                <div style={styles.compareBoxContent}>
                  <span style={styles.compareOldValue}>
                    {selectedRequest.oldValue || '(empty)'}
                  </span>
                </div>
              </div>

              <div style={styles.compareArrow}>→</div>

              <div style={styles.compareBox}>
                <h4 style={styles.compareBoxTitle}>Proposed Value</h4>
                <div style={styles.compareBoxContent}>
                  <span style={styles.compareNewValue}>
                    {selectedRequest.newValue}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.compareMeta}>
              <p>Requested on: {new Date(selectedRequest.createdAt).toLocaleString()}</p>
              {selectedRequest.status !== 'PENDING' && (
                <p>
                  Actioned on: {selectedRequest.actionedAt
                    ? new Date(selectedRequest.actionedAt).toLocaleString()
                    : '-'}
                </p>
              )}
            </div>

            <div style={styles.modalButtons}>
              <button onClick={() => setShowCompareModal(false)} style={styles.modalCancelBtn}>
                Close
              </button>
              {selectedRequest.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => {
                      handleReject(selectedRequest.id);
                      setShowCompareModal(false);
                    }}
                    style={styles.modalRejectBtn}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setShowCompareModal(false);
                    }}
                    style={styles.modalApproveBtn}
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Salary Management Component
const SalaryManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [myCompany, setMyCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('generate');
  const [generatedSlips, setGeneratedSlips] = useState([]);
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [existingSlips, setExistingSlips] = useState([]); // Track existing payslips for selected employee

  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: '',
    hra: '',
    da: '',
    specialAllowance: '',
    conveyance: '',
    medical: '',
    otherAllowances: '',
    bonus: '',
    pf: '',
    professionalTax: '',
    incomeTax: '',
    otherDeductions: '',
  });

  // Bulk generation state
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    loadData();
    loadSlips();
  }, []);

  // Refetch slips when month/year filters change
  useEffect(() => {
    if (activeTab === 'view' && myCompany) {
      const y = filterYear ? parseInt(filterYear) : new Date().getFullYear();
      loadSlipsForYear(y);
    }
  }, [filterMonth, filterYear, activeTab, myCompany]);

  // Load slips for all months of a year
  const loadSlipsForYear = async (year) => {
    try {
      setLoading(true);
      const companyRes = await adminAPI.getMyCompany().catch(() => ({ data: null }));
      if (companyRes.data) {
        // Fetch slips for all 12 months of the year
        const allSlips = [];
        for (let month = 1; month <= 12; month++) {
          try {
            const slipsRes = await salaryAPI.getSlipsByCompany(companyRes.data.id, month, year);
            if (slipsRes.data && slipsRes.data.length > 0) {
              allSlips.push(...slipsRes.data);
            }
          } catch (err) {
            // Ignore errors for months with no data
          }
        }
        setGeneratedSlips(allSlips);
      }
    } catch (error) {
      toast.error('Failed to load salary slips');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [employeesRes, companyRes] = await Promise.all([
        adminAPI.getAllEmployees(),
        adminAPI.getMyCompany().catch(() => ({ data: null })),
      ]);
      setEmployees(employeesRes.data);
      setMyCompany(companyRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadSlips = async (month = new Date().getMonth() + 1, year = new Date().getFullYear()) => {
    try {
      const companyRes = await adminAPI.getMyCompany().catch(() => ({ data: null }));
      if (companyRes.data) {
        const slipsRes = await salaryAPI.getSlipsByCompany(companyRes.data.id, month, year);
        setGeneratedSlips(slipsRes.data || []);
      }
    } catch (error) {
      toast.error('Failed to load salary slips');
    }
  };

  // Auto-calculate totals
  const calculateTotals = () => {
    const earnings = {
      basic: parseFloat(formData.basicSalary) || 0,
      hra: parseFloat(formData.hra) || 0,
      da: parseFloat(formData.da) || 0,
      specialAllowance: parseFloat(formData.specialAllowance) || 0,
      conveyance: parseFloat(formData.conveyance) || 0,
      medical: parseFloat(formData.medical) || 0,
      otherAllowances: parseFloat(formData.otherAllowances) || 0,
      bonus: parseFloat(formData.bonus) || 0,
    };

    const deductions = {
      pf: parseFloat(formData.pf) || 0,
      professionalTax: parseFloat(formData.professionalTax) || 0,
      incomeTax: parseFloat(formData.incomeTax) || 0,
      otherDeductions: parseFloat(formData.otherDeductions) || 0,
    };

    const grossSalary = Object.values(earnings).reduce((a, b) => a + b, 0);
    const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
    const netSalary = grossSalary - totalDeductions;

    return { earnings, deductions, grossSalary, totalDeductions, netSalary };
  };

  const totals = calculateTotals();

  // Fetch existing payslips when employee or year changes
  useEffect(() => {
    if (formData.employeeId && !bulkMode) {
      loadExistingSlipsForEmployee(formData.employeeId, formData.year);
    } else {
      setExistingSlips([]);
    }
  }, [formData.employeeId, formData.year, bulkMode]);

  const loadExistingSlipsForEmployee = async (employeeId, year) => {
    try {
      const slipsRes = await salaryAPI.getSlipsByEmployee(employeeId);
      if (slipsRes.data) {
        // Filter slips for the selected year
        const yearSlips = slipsRes.data.filter(slip => slip.year === year);
        setExistingSlips(yearSlips);
      }
    } catch (error) {
      // Silently fail - don't block the user
      setExistingSlips([]);
    }
  };

  // Check if a specific month has an existing payslip
  const hasExistingSlip = (month) => {
    return existingSlips.some(slip => slip.month === month);
  };

  // Get the count of existing slips for current selection
  const getExistingSlipCount = () => {
    return existingSlips.filter(slip => slip.month === formData.month).length;
  };

  const handleInputChange = (field, value) => {
    if (field === 'employeeId' && value) {
      // Auto-populate salary fields based on employee's profile salary
      const selectedEmployee = employees.find(emp => emp.id.toString() === value.toString());
      if (selectedEmployee && selectedEmployee.salary) {
        const baseSalary = parseFloat(selectedEmployee.salary) || 0;
        // Auto-calculate all fields based on base salary
        setFormData(prev => ({
          ...prev,
          [field]: value,
          basicSalary: baseSalary.toFixed(2),
          hra: (baseSalary * 0.40).toFixed(2), // 40% of basic
          da: (baseSalary * 0.20).toFixed(2), // 20% of basic
          specialAllowance: (baseSalary * 0.15).toFixed(2), // 15% of basic
          conveyance: 5000.00.toFixed(2), // Fixed
          medical: 5000.00.toFixed(2), // Fixed
          otherAllowances: 3000.00.toFixed(2), // Fixed
          pf: (baseSalary * 0.12).toFixed(2), // 12% of basic
          professionalTax: 200.00.toFixed(2), // Fixed
          incomeTax: (baseSalary * 0.10).toFixed(2), // 10% of basic
          otherDeductions: 0.00.toFixed(2),
        }));
        toast.success(`Salary fields auto-filled for ${selectedEmployee.fullName}`);
        return;
      }
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.employeeId && !bulkMode) {
      toast.error('Please select an employee');
      return false;
    }
    if (!formData.month || !formData.year) {
      toast.error('Please select month and year');
      return false;
    }
    // Skip basic salary validation in bulk mode (will be auto-calculated from profile)
    if (!bulkMode && parseFloat(formData.basicSalary) <= 0) {
      toast.error('Basic salary must be greater than 0');
      return false;
    }
    return true;
  };

  const checkExistingSlip = async () => {
    if (bulkMode) return true;
    // Check if slip already exists for this employee, month, and year
    if (hasExistingSlip(formData.month)) {
      toast.error(`A payslip already exists for ${months.find(m => m.value === formData.month)?.label} ${formData.year}. Please select a different month or delete the existing slip first.`);
      return false;
    }
    return true;
  };

  const checkPendingBonus = async () => {
    // Check if there's a pending bonus request for the employee(s), month, and year
    try {
      if (bulkMode) {
        // In bulk mode, check all selected employees (or all employees if none selected)
        const employeesToProcess = selectedEmployees.length > 0 
          ? selectedEmployees 
          : employees.map(e => e.id);
        
        for (const employeeId of employeesToProcess) {
          const res = await bonusAPI.hasPendingBonus(
            parseInt(employeeId),
            parseInt(formData.month),
            parseInt(formData.year)
          );
          if (res.data?.hasPendingBonus === true) {
            const emp = employees.find(e => e.id === employeeId);
            const empName = emp ? emp.fullName : `Employee ID ${employeeId}`;
            toast.error(`Cannot generate payslip: There is a pending bonus request for ${empName} for ${months.find(m => m.value === formData.month)?.label} ${formData.year}. Please wait for Super Admin to approve or reject the bonus request first.`);
            return false;
          }
        }
      } else {
        // Single employee mode
        const res = await bonusAPI.hasPendingBonus(
          parseInt(formData.employeeId),
          parseInt(formData.month),
          parseInt(formData.year)
        );
        if (res.data?.hasPendingBonus === true) {
          toast.error(`Cannot generate payslip: There is a pending bonus request for ${months.find(m => m.value === formData.month)?.label} ${formData.year}. Please wait for Super Admin to approve or reject the bonus request first.`);
          return false;
        }
      }
    } catch (error) {
      // If check fails, log but continue - backend will validate anyway
      console.error('Failed to check pending bonus:', error);
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;

    const canProceed = await checkExistingSlip();
    if (!canProceed) return;

    const noPendingBonus = await checkPendingBonus();
    if (!noPendingBonus) return;

    setProcessing(true);
    try {
      // Ensure all numeric fields are properly converted to numbers
      const data = {
        employeeId: formData.employeeId,
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        basicSalary: parseFloat(formData.basicSalary) || 0,
        hra: parseFloat(formData.hra) || 0,
        da: parseFloat(formData.da) || 0,
        specialAllowance: parseFloat(formData.specialAllowance) || 0,
        conveyance: parseFloat(formData.conveyance) || 0,
        medical: parseFloat(formData.medical) || 0,
        otherAllowances: parseFloat(formData.otherAllowances) || 0,
        bonus: parseFloat(formData.bonus) || 0,
        pf: parseFloat(formData.pf) || 0,
        professionalTax: parseFloat(formData.professionalTax) || 0,
        incomeTax: parseFloat(formData.incomeTax) || 0,
        otherDeductions: parseFloat(formData.otherDeductions) || 0,
      };

      if (bulkMode) {
        // For bulk generation, only send employeeIds, month, and year
        // Salary components will be auto-calculated from each employee's profile salary
        await salaryAPI.generateBulkSlips({
          employeeIds: selectedEmployees.length > 0 ? selectedEmployees : employees.map(e => e.id),
          month: parseInt(formData.month),
          year: parseInt(formData.year),
        });
        toast.success('Bulk salary slips generated successfully!');
      } else {
        await salaryAPI.generateSlip(data);
        toast.success('Salary slip generated successfully!');
      }

      resetForm();
      const y = filterYear ? parseInt(filterYear) : new Date().getFullYear();
      loadSlipsForYear(y);
      setActiveTab('view');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate salary slip');
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      basicSalary: '',
      hra: '',
      da: '',
      specialAllowance: '',
      conveyance: '',
      medical: '',
      otherAllowances: '',
      bonus: '',
      pf: '',
      professionalTax: '',
      incomeTax: '',
      otherDeductions: '',
    });
    setBulkMode(false);
    setSelectedEmployees([]);
  };

  const handleEmployeeSelect = (employeeId) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
    } else {
      setSelectedEmployees(prev => [...prev, employeeId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(e => e.id));
    }
  };

  const handleViewSlip = (slip) => {
    setSelectedSlip(slip);
    setShowDetailModal(true);
  };

  const handleDownloadPDF = async (slip) => {
    try {
      const response = await salaryAPI.downloadSlip(slip.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `salary-slip-${slip.employeeName}-${slip.month}-${slip.year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  const handleSendEmail = async (slip) => {
    try {
      await salaryAPI.sendSlipEmail(slip.id);
      toast.success('Salary slip sent to employee via email');
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  const handleDeleteSlip = async (slipId) => {
    if (!window.confirm('Are you sure you want to delete this salary slip?')) return;
    try {
      await salaryAPI.deleteSlip(slipId);
      toast.success('Salary slip deleted');
      const y = filterYear ? parseInt(filterYear) : new Date().getFullYear();
      loadSlipsForYear(y);
    } catch (error) {
      toast.error('Failed to delete slip');
    }
  };

  // Client-side filter for employee, month, year, and status
  const filteredSlips = generatedSlips.filter(slip => {
    const matchEmployee = !filterEmployee || slip.employeeId?.toString() === filterEmployee;
    const matchStatus = filterStatus === 'ALL' || slip.status === filterStatus;
    const matchMonth = !filterMonth || parseInt(slip.month) === parseInt(filterMonth);
    const matchYear = !filterYear || parseInt(slip.year) === parseInt(filterYear);
    return matchEmployee && matchStatus && matchMonth && matchYear;
  });

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

  const years = [2024, 2025, 2026];

  if (loading) {
    return <div style={styles.loading}>Loading salary management...</div>;
  }

  return (
    <div>
      <h2 style={styles.pageTitle}>💰 Salary Management</h2>

      {/* Tabs */}
      <div style={styles.filterTabs}>
        {['generate', 'view'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.filterTab,
              backgroundColor: activeTab === tab ? '#9b59b6' : 'white',
              color: activeTab === tab ? 'white' : '#333',
            }}
          >
            {tab === 'generate' ? '📝 Generate Slip' : '📋 View Slips'}
          </button>
        ))}
      </div>

      {activeTab === 'generate' && (
        <>
          {/* Bulk Mode Toggle */}
          <div style={styles.bulkActionBar}>
            <label style={styles.bulkToggle}>
              <input
                type="checkbox"
                checked={bulkMode}
                onChange={(e) => setBulkMode(e.target.checked)}
              />
              <span>Bulk Generate for Multiple Employees</span>
            </label>
          </div>

          {/* Employee Selection */}
          <div style={styles.salaryFormCard}>
            <h3 style={styles.sectionTitle}>
              {bulkMode ? '👥 Select Employees' : '👤 Select Employee'}
            </h3>

            {bulkMode ? (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label style={styles.bulkToggle}>
                    <input
                      type="checkbox"
                      checked={selectedEmployees.length === employees.length}
                      onChange={handleSelectAll}
                    />
                    <span><strong>Select All Employees</strong></span>
                  </label>
                </div>
                <div style={styles.employeeSelectGrid}>
                  {employees.map(emp => (
                    <label key={emp.id} style={styles.employeeCheckbox}>
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp.id)}
                        onChange={() => handleEmployeeSelect(emp.id)}
                      />
                      <span>{emp.fullName} ({emp.employeeCode || emp.id})</span>
                    </label>
                  ))}
                </div>
                <p style={{ marginTop: '10px', color: '#666' }}>
                  Selected: {selectedEmployees.length} employees
                </p>
              </>
            ) : (
              <select
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                style={styles.input}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.employeeCode || emp.id})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Period Selection */}
          <div style={styles.salaryFormCard}>
            <h3 style={styles.sectionTitle}>📅 Salary Period</h3>
            <div style={styles.salaryFormGrid}>
              <div style={styles.formField}>
                <label style={styles.label}>Month</label>
                <select
                  value={formData.month}
                  onChange={(e) => handleInputChange('month', parseInt(e.target.value))}
                  style={{
                    ...styles.input,
                    borderColor: !bulkMode && formData.employeeId && hasExistingSlip(formData.month) ? '#e74c3c' : '#ddd',
                    backgroundColor: !bulkMode && formData.employeeId && hasExistingSlip(formData.month) ? '#fdf2f2' : 'white',
                  }}
                >
                  {months.map(m => (
                    <option key={m.value} value={m.value}>
                      {m.label} {hasExistingSlip(m.value) ? '✓ (Generated)' : ''}
                    </option>
                  ))}
                </select>
                {!bulkMode && formData.employeeId && hasExistingSlip(formData.month) && (
                  <div style={{
                    color: '#e74c3c',
                    fontSize: '12px',
                    marginTop: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span>⚠️</span>
                    <span>Payslip already exists for {months.find(m => m.value === formData.month)?.label} {formData.year}</span>
                  </div>
                )}
                {!bulkMode && formData.employeeId && existingSlips.length > 0 && (
                  <div style={{
                    color: '#27ae60',
                    fontSize: '11px',
                    marginTop: '8px',
                    padding: '8px',
                    backgroundColor: '#f0fff4',
                    borderRadius: '4px',
                    border: '1px solid #c6f6d5'
                  }}>
                    <strong>Existing payslips for selected employee in {formData.year}:</strong>
                    <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {months.filter(m => hasExistingSlip(m.value)).map(m => (
                        <span key={m.value} style={{
                          backgroundColor: '#27ae60',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '10px'
                        }}>
                          {m.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  style={styles.input}
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Earnings Section - Hidden in Bulk Mode */}
          {!bulkMode && (
            <div style={styles.salaryFormCard}>
              <h3 style={styles.sectionTitle}>💵 Earnings</h3>
              <div style={styles.salaryFormGrid}>
                <div style={styles.formField}>
                  <label style={styles.label}>Basic Salary *</label>
                  <input
                    type="number"
                    placeholder="Enter basic salary"
                    value={formData.basicSalary}
                    onChange={(e) => handleInputChange('basicSalary', e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formField}>
                  <label style={styles.label}>HRA</label>
                  <input
                    type="number"
                    placeholder="Enter HRA"
                    value={formData.hra}
                    onChange={(e) => handleInputChange('hra', e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formField}>
                  <label style={styles.label}>DA</label>
                  <input
                    type="number"
                    placeholder="Enter DA"
                    value={formData.da}
                    onChange={(e) => handleInputChange('da', e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formField}>
                  <label style={styles.label}>Special Allowance</label>
                  <input
                    type="number"
                    placeholder="Enter special allowance"
                    value={formData.specialAllowance}
                    onChange={(e) => handleInputChange('specialAllowance', e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formField}>
                  <label style={styles.label}>Conveyance</label>
                  <input
                    type="number"
                    placeholder="Enter conveyance"
                    value={formData.conveyance}
                    onChange={(e) => handleInputChange('conveyance', e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formField}>
                  <label style={styles.label}>Medical</label>
                  <input
                    type="number"
                    placeholder="Enter medical allowance"
                    value={formData.medical}
                    onChange={(e) => handleInputChange('medical', e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formField}>
                  <label style={styles.label}>Other Allowances</label>
                  <input
                    type="number"
                    placeholder="Enter other allowances"
                    value={formData.otherAllowances}
                    onChange={(e) => handleInputChange('otherAllowances', e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Deductions Section - Hidden in Bulk Mode */}
          {!bulkMode && (
            <div style={styles.salaryFormCard}>
              <h3 style={styles.sectionTitle}>📉 Deductions</h3>
              <div style={styles.salaryFormGrid}>
                <div style={styles.formField}>
                  <label style={styles.label}>PF (Provident Fund)</label>
                  <input
                    type="number"
                    placeholder="Enter PF amount"
                    value={formData.pf}
                    onChange={(e) => handleInputChange('pf', e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formField}>
                  <label style={styles.label}>Professional Tax</label>
                  <input
                    type="number"
                    placeholder="Enter professional tax"
                    value={formData.professionalTax}
                    onChange={(e) => handleInputChange('professionalTax', e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formField}>
                  <label style={styles.label}>Income Tax (TDS)</label>
                  <input
                    type="number"
                    placeholder="Enter income tax"
                    value={formData.incomeTax}
                    onChange={(e) => handleInputChange('incomeTax', e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formField}>
                  <label style={styles.label}>Other Deductions</label>
                  <input
                    type="number"
                    placeholder="Enter other deductions"
                    value={formData.otherDeductions}
                    onChange={(e) => handleInputChange('otherDeductions', e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Calculation Preview - Hidden in Bulk Mode */}
          {!bulkMode && (
            <div style={styles.calculationPreview}>
              <h3 style={styles.sectionTitle}>📊 Salary Calculation Preview</h3>
              <div style={styles.calculationGrid}>
                <div style={styles.calcBox}>
                  <span style={styles.calcLabel}>Gross Salary</span>
                  <span style={styles.calcValue}>₹{totals.grossSalary.toLocaleString()}</span>
                </div>
                <div style={styles.calcBox}>
                  <span style={styles.calcLabel}>Total Deductions</span>
                  <span style={{ ...styles.calcValue, color: '#e74c3c' }}>-₹{totals.totalDeductions.toLocaleString()}</span>
                </div>
                <div style={styles.netSalaryBox}>
                  <span style={styles.netLabel}>Net Salary</span>
                  <span style={styles.netValue}>₹{totals.netSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Mode Info Message */}
          {bulkMode && (
            <div style={{ ...styles.salaryFormCard, backgroundColor: '#e8f5e9', border: '1px solid #4caf50' }}>
              <h3 style={styles.sectionTitle}>✅ Auto-Calculation Enabled</h3>
              <p style={{ color: '#2e7d32', margin: '10px 0' }}>
                Salary components will be automatically calculated for each employee based on their profile salary:
              </p>
              <ul style={{ color: '#2e7d32', marginLeft: '20px', lineHeight: '1.8' }}>
                <li>Basic Salary = Profile Salary</li>
                <li>HRA = 40% of Basic</li>
                <li>DA = 20% of Basic</li>
                <li>Special Allowance = 15% of Basic</li>
                <li>Conveyance = ₹5,000 (fixed)</li>
                <li>Medical = ₹5,000 (fixed)</li>
                <li>Other Allowances = ₹3,000 (fixed)</li>
                <li>PF = 12% of Basic</li>
                <li>Professional Tax = ₹200 (fixed)</li>
                <li>Income Tax = 10% of Basic</li>
              </ul>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={processing || (!bulkMode && formData.employeeId && hasExistingSlip(formData.month))}
            style={{
              ...styles.generateBtn,
              opacity: processing || (!bulkMode && formData.employeeId && hasExistingSlip(formData.month)) ? 0.5 : 1,
              backgroundColor: !bulkMode && formData.employeeId && hasExistingSlip(formData.month) ? '#95a5a6' : '#27ae60',
              cursor: !bulkMode && formData.employeeId && hasExistingSlip(formData.month) ? 'not-allowed' : 'pointer',
            }}
            title={!bulkMode && formData.employeeId && hasExistingSlip(formData.month)
              ? 'Payslip already exists for this month. Please select a different month or delete the existing slip.'
              : ''}
          >
            {processing ? 'Generating...' :
              (!bulkMode && formData.employeeId && hasExistingSlip(formData.month))
                ? '⚠️ Payslip Already Exists'
                : (bulkMode ? `Generate for ${selectedEmployees.length || employees.length} Employees` : 'Generate Salary Slip')}
          </button>
        </>
      )}

      {activeTab === 'view' && (
        <>
          {/* Filters */}
          <div style={styles.salaryFormCard}>
            <h3 style={styles.sectionTitle}>🔍 Filter Slips</h3>
            <div style={styles.salaryFormGrid}>
              <div style={styles.formField}>
                <label style={styles.label}>Employee</label>
                <select
                  value={filterEmployee}
                  onChange={(e) => setFilterEmployee(e.target.value)}
                  style={styles.input}
                >
                  <option value="">All Employees</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Month</label>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  style={styles.input}
                >
                  <option value="">All Months</option>
                  {months.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Year</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  style={styles.input}
                >
                  <option value="">All Years</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={styles.input}
                >
                  <option value="ALL">All Status</option>
                  <option value="GENERATED">Generated</option>
                  <option value="SENT">Sent</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Slips Table */}
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Employee</th>
                  <th style={styles.th}>Month/Year</th>
                  <th style={styles.th}>Gross Salary</th>
                  <th style={styles.th}>Net Salary</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSlips.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={styles.noDataCell}>
                      No salary slips found
                    </td>
                  </tr>
                ) : (
                  filteredSlips.map((slip) => (
                    <tr key={slip.id} style={styles.tr}>
                      <td style={styles.td}>
                        <strong>{slip.employeeName}</strong>
                      </td>
                      <td style={styles.td}>
                        {months.find(m => m.value === Number(slip.month))?.label} {slip.year}
                      </td>
                      <td style={styles.td}>₹{slip.grossSalary?.toLocaleString()}</td>
                      <td style={styles.td}>
                        <strong style={{ color: '#27ae60' }}>
                          ₹{slip.netSalary?.toLocaleString()}
                        </strong>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: slip.status === 'PAID' ? '#27ae60' :
                            slip.status === 'SENT' ? '#3498db' : '#f39c12',
                        }}>
                          {slip.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button
                            onClick={() => handleViewSlip(slip)}
                            style={styles.viewBtn}
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(slip)}
                            style={{ ...styles.viewBtn, backgroundColor: '#e74c3c' }}
                            title="Download PDF"
                          >
                            📄
                          </button>
                          <button
                            onClick={() => handleSendEmail(slip)}
                            style={{ ...styles.viewBtn, backgroundColor: '#27ae60' }}
                            title="Send Email"
                          >
                            📧
                          </button>
                          <button
                            onClick={() => handleDeleteSlip(slip.id)}
                            style={styles.rejectBtn}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedSlip && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modal, width: '600px', maxHeight: '80vh', overflow: 'auto' }}>
            <h3 style={styles.modalTitle}>📄 Salary Slip Details</h3>

            <div style={styles.slipHeader}>
              <div>
                <p><strong>{selectedSlip.employeeName}</strong></p>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  {months.find(m => m.value === selectedSlip.month)?.label} {selectedSlip.year}
                </p>
              </div>
              <span style={{
                ...styles.statusBadge,
                backgroundColor: selectedSlip.status === 'PAID' ? '#27ae60' :
                  selectedSlip.status === 'SENT' ? '#3498db' : '#f39c12',
              }}>
                {selectedSlip.status}
              </span>
            </div>

            <div style={styles.slipSection}>
              <h4 style={styles.slipSectionTitle}>Earnings</h4>
              <div style={styles.slipRow}>
                <span>Basic Salary</span>
                <span>₹{selectedSlip.basicSalary?.toLocaleString()}</span>
              </div>
              <div style={styles.slipRow}>
                <span>HRA</span>
                <span>₹{selectedSlip.hra?.toLocaleString()}</span>
              </div>
              <div style={styles.slipRow}>
                <span>DA</span>
                <span>₹{selectedSlip.da?.toLocaleString()}</span>
              </div>
              <div style={styles.slipRow}>
                <span>Special Allowance</span>
                <span>₹{selectedSlip.specialAllowance?.toLocaleString()}</span>
              </div>
              <div style={styles.slipRow}>
                <span>Conveyance</span>
                <span>₹{selectedSlip.conveyance?.toLocaleString()}</span>
              </div>
              <div style={styles.slipRow}>
                <span>Medical</span>
                <span>₹{selectedSlip.medical?.toLocaleString()}</span>
              </div>
              <div style={styles.slipRow}>
                <span>Other Allowances</span>
                <span>₹{selectedSlip.otherAllowances?.toLocaleString()}</span>
              </div>
              {selectedSlip.bonus > 0 && (
                <div style={styles.slipRow}>
                  <span style={{ color: '#27ae60' }}>🎁 Bonus</span>
                  <span style={{ color: '#27ae60' }}>+₹{selectedSlip.bonus?.toLocaleString()}</span>
                </div>
              )}
              <div style={{ ...styles.slipRow, ...styles.slipTotal }}>
                <span><strong>Gross Salary</strong></span>
                <span><strong>₹{selectedSlip.grossSalary?.toLocaleString()}</strong></span>
              </div>
            </div>

            <div style={styles.slipSection}>
              <h4 style={styles.slipSectionTitle}>Deductions</h4>
              <div style={styles.slipRow}>
                <span>PF</span>
                <span>₹{selectedSlip.pf?.toLocaleString()}</span>
              </div>
              <div style={styles.slipRow}>
                <span>Professional Tax</span>
                <span>₹{selectedSlip.professionalTax?.toLocaleString()}</span>
              </div>
              <div style={styles.slipRow}>
                <span>Income Tax (TDS)</span>
                <span>₹{selectedSlip.incomeTax?.toLocaleString()}</span>
              </div>
              <div style={styles.slipRow}>
                <span>Other Deductions</span>
                <span>₹{selectedSlip.otherDeductions?.toLocaleString()}</span>
              </div>
              <div style={{ ...styles.slipRow, ...styles.slipTotal }}>
                <span><strong>Total Deductions</strong></span>
                <span><strong style={{ color: '#e74c3c' }}>-₹{selectedSlip.totalDeductions?.toLocaleString()}</strong></span>
              </div>
            </div>

            <div style={styles.slipNet}>
              <span>Net Salary</span>
              <span>₹{selectedSlip.netSalary?.toLocaleString()}</span>
            </div>

            <div style={styles.modalButtons}>
              <button onClick={() => setShowDetailModal(false)} style={styles.modalCancelBtn}>
                Close
              </button>
              <button
                onClick={() => { handleDownloadPDF(selectedSlip); setShowDetailModal(false); }}
                style={{ ...styles.modalCancelBtn, backgroundColor: '#e74c3c', color: 'white' }}
              >
                Download PDF
              </button>
              <button
                onClick={() => { handleSendEmail(selectedSlip); setShowDetailModal(false); }}
                style={{ ...styles.modalCancelBtn, backgroundColor: '#27ae60', color: 'white' }}
              >
                Send to Employee
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [myCompany, setMyCompany] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    role: 'HR',
    companyId: '',
    employeeCode: '',
    department: '',
    designation: '',
    dateOfJoining: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    emergencyContact: '',
    salary: '',
    profilePictureUrl: '',
  });
  const [phoneError, setPhoneError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const roles = [
    'HR',
    'HR_MANAGER',
    'SOFTWARE_ENGINEER',
    'MANAGER',
    'GENERAL_MANAGER',
    'DEVELOPER',
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [employeesRes, companyRes] = await Promise.all([
        adminAPI.getAllEmployees(),
        adminAPI.getMyCompany().catch(() => ({ data: null })),
      ]);
      setEmployees(employeesRes.data);
      setMyCompany(companyRes.data);
      if (companyRes.data) {
        setFormData(prev => ({ ...prev, companyId: companyRes.data.id }));
      }
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      email: '',
      fullName: '',
      role: 'HR',
      companyId: myCompany?.id || '',
      employeeCode: '',
      department: '',
      designation: '',
      dateOfJoining: '',
      dateOfBirth: '',
      phoneNumber: '',
      address: '',
      emergencyContact: '',
      salary: '',
      profilePictureUrl: '',
    });
    setEditingId(null);
    setPhoneError('');
    setPreviewUrl(null);
    setShowForm(false);
  };

  const validatePhone = (phone) => {
    if (!phone || phone.trim() === '') return true;
    // Allow + for country code, and -, spaces, () as separators
    // Must contain 10-15 digits total (e.g., +1-555-123-4567 or 123-456-7890)
    const digitsOnly = phone.replace(/\D/g, '');
    const validFormat = /^[+]?[\d\-\(\)\s.]+$/.test(phone.trim());
    return validFormat && digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, phoneNumber: value });
    if (!validatePhone(value)) {
      setPhoneError('Phone number must be 10-15 digits (e.g., +1-555-123-4567)');
    } else {
      setPhoneError('');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      // Upload the file
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadAPI.uploadProfilePicture(file);
      setFormData(prev => ({ ...prev, profilePictureUrl: response.data.fileUrl }));
      toast.success('Profile picture uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone(formData.phoneNumber)) {
      toast.error('Phone number must be 10-15 digits (e.g., +1-555-123-4567)');
      return;
    }

    try {
      if (editingId) {
        await adminAPI.updateEmployee(editingId, {
          ...formData,
          salary: parseFloat(formData.salary) || 0,
        });
        toast.success('Employee updated successfully');
      } else {
        await adminAPI.createEmployee({
          ...formData,
          salary: parseFloat(formData.salary) || 0,
        });
        toast.success('Employee created successfully');
      }
      resetForm();
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save employee');
    }
  };

  const handleEdit = (emp) => {
    setFormData({
      username: emp.username,
      password: '',
      email: emp.email,
      fullName: emp.fullName,
      role: emp.role,
      companyId: emp.companyId,
      employeeCode: emp.employeeCode || '',
      department: emp.department || '',
      designation: emp.designation || '',
      dateOfJoining: emp.dateOfJoining || '',
      dateOfBirth: emp.dateOfBirth || '',
      phoneNumber: emp.phoneNumber || '',
      address: emp.address || '',
      emergencyContact: emp.emergencyContact || '',
      salary: emp.salary || '',
      profilePictureUrl: emp.profilePictureUrl || '',
    });
    setEditingId(emp.id);
    setPreviewUrl(emp.profilePictureUrl || null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await adminAPI.deleteEmployee(id);
      toast.success('Employee deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete employee');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.pageTitle}>Manage Employees</h2>
        <button style={styles.addBtn} onClick={() => showForm ? resetForm() : setShowForm(true)}>
          {showForm ? 'Cancel' : '+ Add Employee'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.formContainer}>
          <h3 style={styles.sectionTitle}>{editingId ? '✏️ Edit Employee' : '📋 Create Employee'}</h3>

          {/* Account Information */}
          <div style={styles.formSection}>
            <h4 style={styles.subSectionTitle}>👤 Account Information</h4>
            <div style={styles.formGrid}>
              <div style={styles.formField}>
                <label style={styles.label}>Username *</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formField}>
                <label style={styles.label}>Password (optional)</label>
                <input
                  type="password"
                  placeholder={editingId ? "Leave blank to keep current" : "Leave blank for default: Employee@123"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formField}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formField}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formField}>
                <label style={styles.label}>Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  style={styles.input}
                  required
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>{role.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formField}>
                <label style={styles.label}>Company *</label>
                <input
                  type="text"
                  value={myCompany?.name || 'Loading...'}
                  style={{ ...styles.input, backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div style={styles.formSection}>
            <h4 style={styles.subSectionTitle}>💼 Employment Details</h4>
            <div style={styles.formGrid}>
              <div style={styles.formField}>
                <label style={styles.label}>Employee Code</label>
                <input
                  type="text"
                  placeholder="e.g., EMP001"
                  value={formData.employeeCode}
                  onChange={(e) => handleInputChange('employeeCode', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formField}>
                <label style={styles.label}>Department</label>
                <input
                  type="text"
                  placeholder="e.g., Engineering"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formField}>
                <label style={styles.label}>Designation</label>
                <input
                  type="text"
                  placeholder="e.g., Software Developer"
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formField}>
                <label style={styles.label}>Date of Joining</label>
                <input
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formField}>
                <label style={styles.label}>Salary (INR)</label>
                <input
                  type="number"
                  placeholder="e.g., 75000"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div style={styles.formSection}>
            <h4 style={styles.subSectionTitle}>🏠 Personal Information</h4>
            <div style={styles.formGrid}>
              <div style={styles.formField}>
                <label style={styles.label}>Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formField}>
                <label style={styles.label}>Phone Number (10-15 digits)</label>
                <input
                  type="text"
                  placeholder="e.g., +1-555-123-4567"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  style={{ ...styles.input, borderColor: phoneError ? '#e74c3c' : undefined }}
                />
                {phoneError && <span style={styles.errorText}>{phoneError}</span>}
              </div>

              <div style={styles.formField}>
                <label style={styles.label}>Address</label>
                <input
                  type="text"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formField}>
                <label style={styles.label}>Emergency Contact</label>
                <input
                  type="text"
                  placeholder="e.g., +1-555-999-0000"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formField}>
                <label style={styles.label}>Profile Picture *</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  style={{ display: 'none' }}
                />

                {/* Preview */}
                <div style={styles.previewContainer}>
                  {(() => {
                    const displayUrl = previewUrl || (formData.profilePictureUrl
                      ? (formData.profilePictureUrl.startsWith('http') ? formData.profilePictureUrl : `http://34.47.170.212:9090${formData.profilePictureUrl}`)
                      : null);
                    return displayUrl ? (
                      <img
                        src={displayUrl}
                        alt="Profile Preview"
                        style={styles.previewImage}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div style={styles.previewPlaceholder}>
                        <span style={styles.previewPlaceholderText}>
                          {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={uploading}
                  style={styles.uploadBtn}
                >
                  {uploading ? 'Uploading...' : '📁 Choose File'}
                </button>

                {/* URL Display (read-only) */}
                {formData.profilePictureUrl && (
                  <input
                    type="text"
                    value={formData.profilePictureUrl}
                    readOnly
                    style={{ ...styles.input, marginTop: '10px', fontSize: '12px', backgroundColor: '#f5f5f5' }}
                  />
                )}
              </div>
            </div>
          </div>

          <button type="submit" style={styles.submitBtn}>
            {editingId ? 'Update Employee' : 'Create Employee'}
          </button>
        </form>
      )}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Photo</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const fullImageUrl = emp.profilePictureUrl
                ? (emp.profilePictureUrl.startsWith('http') ? emp.profilePictureUrl : `http://34.47.170.212:9090${emp.profilePictureUrl}`)
                : null;
              return (
                <tr key={emp.id} style={styles.tr}>
                  <td style={styles.td}>{emp.id}</td>
                  <td style={styles.td}>
                    {fullImageUrl ? (
                      <img
                        src={fullImageUrl}
                        alt={emp.fullName}
                        style={styles.profilePic}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div style={{
                      ...styles.profilePicPlaceholder,
                      display: fullImageUrl ? 'none' : 'flex'
                    }}>
                      {emp.fullName?.charAt(0).toUpperCase()}
                    </div>
                  </td>
                  <td style={styles.td}>{emp.fullName}</td>
                  <td style={styles.td}>{emp.username}</td>
                  <td style={styles.td}>
                    <span style={styles.roleBadge}>{emp.role?.replace('_', ' ')}</span>
                  </td>
                  <td style={styles.td}>{emp.department || '-'}</td>
                  <td style={styles.td}>{emp.phoneNumber || '-'}</td>
                  <td style={styles.td}>
                    <button style={styles.editBtn} onClick={() => handleEdit(emp)}>Edit</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(emp.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Bonus Management Component
const BonusManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [myCompany, setMyCompany] = useState(null);
  const [bonusRequests, setBonusRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('request');
  const [processing, setProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    amount: '',
    reason: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

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

  const years = [2024, 2025, 2026];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [employeesRes, companyRes] = await Promise.all([
        adminAPI.getAllEmployees(),
        adminAPI.getMyCompany().catch(() => ({ data: null })),
      ]);
      setEmployees(employeesRes.data);
      setMyCompany(companyRes.data);

      if (companyRes.data) {
        const bonusRes = await bonusAPI.getCompanyBonusRequests(companyRes.data.id);
        setBonusRequests(bonusRes.data || []);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.employeeId) {
      toast.error('Please select an employee');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid bonus amount');
      return;
    }
    if (!formData.reason.trim()) {
      toast.error('Please provide a reason for the bonus');
      return;
    }

    // Check if salary slip already exists for this employee/month/year
    setProcessing(true);
    try {
      const existsRes = await salaryAPI.checkSalarySlipExists(
        parseInt(formData.employeeId),
        parseInt(formData.month),
        parseInt(formData.year)
      );
      if (existsRes.data === true) {
        toast.error(`Cannot request bonus: Salary slip already generated for ${months.find(m => m.value === formData.month)?.label} ${formData.year}. Please select a different month.`);
        setProcessing(false);
        return;
      }
    } catch (error) {
      // If check fails, log but continue - backend will validate anyway
      console.error('Failed to check salary slip existence:', error);
    }

    try {
      await bonusAPI.requestBonus({
        employeeId: parseInt(formData.employeeId),
        amount: parseFloat(formData.amount),
        reason: formData.reason,
        month: parseInt(formData.month),
        year: parseInt(formData.year),
      });
      toast.success('Bonus request submitted successfully! Waiting for Super Admin approval.');
      resetForm();
      loadData();
      setActiveTab('view');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit bonus request');
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      amount: '',
      reason: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this bonus request?')) return;
    try {
      await bonusAPI.deleteBonusRequest(requestId);
      toast.success('Bonus request deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete bonus request');
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

  const filteredRequests = bonusRequests.filter(record =>
    filterStatus === 'ALL' || record.status === filterStatus
  );

  if (loading) {
    return <div style={styles.loading}>Loading bonus management...</div>;
  }

  return (
    <div>
      <h2 style={styles.pageTitle}>🎁 Bonus Management</h2>

      {/* Tabs */}
      <div style={styles.filterTabs}>
        {['request', 'view'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.filterTab,
              backgroundColor: activeTab === tab ? '#9b59b6' : 'white',
              color: activeTab === tab ? 'white' : '#333',
            }}
          >
            {tab === 'request' ? '📝 Request Bonus' : '📋 View Requests'}
          </button>
        ))}
      </div>

      {activeTab === 'request' && (
        <form onSubmit={handleSubmit} style={styles.formContainer}>
          <h3 style={styles.sectionTitle}>Request Bonus for Employee</h3>
          <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
            Submit a bonus request for an employee. The request will be sent to the Super Admin for approval.
          </p>

          <div style={styles.formGrid}>
            <div style={styles.formField}>
              <label style={styles.label}>Select Employee *</label>
              <select
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                style={styles.input}
                required
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.employeeCode || emp.id})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formField}>
              <label style={styles.label}>Bonus Amount (₹) *</label>
              <input
                type="number"
                placeholder="Enter bonus amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                style={styles.input}
                min="1"
                step="0.01"
                required
              />
            </div>

            <div style={styles.formField}>
              <label style={styles.label}>For Month *</label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                style={styles.input}
                required
              >
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div style={styles.formField}>
              <label style={styles.label}>For Year *</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                style={styles.input}
                required
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formField}>
            <label style={styles.label}>Reason for Bonus *</label>
            <textarea
              placeholder="Enter the reason for this bonus (e.g., Performance excellence, Project completion, etc.)"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={processing}
            style={{
              ...styles.submitBtn,
              opacity: processing ? 0.5 : 1,
            }}
          >
            {processing ? 'Submitting...' : 'Submit Bonus Request'}
          </button>
        </form>
      )}

      {activeTab === 'view' && (
        <>
          {/* Filter Tabs */}
          <div style={styles.filterTabs}>
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  ...styles.filterTab,
                  backgroundColor: filterStatus === status ? '#9b59b6' : 'white',
                  color: filterStatus === status ? 'white' : '#333',
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Bonus Requests Table */}
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Employee</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Period</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Requested By</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={styles.noDataCell}>
                      No bonus requests found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr key={request.id} style={styles.tr}>
                      <td style={styles.td}>
                        <strong>{request.employeeName}</strong>
                      </td>
                      <td style={styles.td}>
                        <strong style={{ color: '#27ae60' }}>
                          ${request.amount?.toLocaleString()}
                        </strong>
                      </td>
                      <td style={styles.td}>
                        {months.find(m => m.value === request.month)?.label} {request.year}
                      </td>
                      <td style={styles.td} title={request.reason}>
                        {request.reason?.length > 30 
                          ? request.reason.substring(0, 30) + '...' 
                          : request.reason}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(request.status),
                        }}>
                          {request.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {request.requestedByName || 'Admin'}
                      </td>
                      <td style={styles.td}>
                        {request.status === 'PENDING' && (
                          <button
                            onClick={() => handleDeleteRequest(request.id)}
                            style={styles.rejectBtn}
                            title="Delete Request"
                          >
                            🗑️
                          </button>
                        )}
                        {request.status === 'APPROVED' && (
                          <span style={{ color: '#27ae60', fontSize: '12px' }}>
                            Approved by {request.approvedByName}
                          </span>
                        )}
                        {request.status === 'REJECTED' && (
                          <span style={{ color: '#e74c3c', fontSize: '12px' }} title={request.rejectionReason}>
                            {request.rejectionReason?.substring(0, 20) || 'No reason'}...
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
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
  companyCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  companyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginTop: '15px',
  },
  companyLogo: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
    borderRadius: '10px',
    border: '1px solid #eee',
  },
  logoPlaceholder: {
    width: '80px',
    height: '80px',
    borderRadius: '10px',
    backgroundColor: '#9b59b6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    color: 'white',
    fontWeight: 'bold',
  },
  companyName: {
    margin: '0 0 10px 0',
    color: '#9b59b6',
  },
  statsGrid: {
    display: 'flex',
    gap: '20px',
  },
  statCard: {
    padding: '30px',
    borderRadius: '10px',
    color: 'white',
    minWidth: '200px',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '36px',
    margin: '0 0 10px 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  addBtn: {
    backgroundColor: '#9b59b6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  },
  formSection: {
    marginBottom: '25px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee',
  },
  sectionTitle: {
    color: '#9b59b6',
    marginBottom: '20px',
    fontSize: '20px',
    fontWeight: '600',
  },
  subSectionTitle: {
    color: '#9b59b6',
    marginBottom: '15px',
    fontSize: '16px',
    fontWeight: '600',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  input: {
    padding: '12px 14px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.3s',
    outline: 'none',
    backgroundColor: '#fafafa',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: '12px',
  },
  submitBtn: {
    backgroundColor: '#9b59b6',
    color: 'white',
    border: 'none',
    padding: '14px 30px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    width: '100%',
    marginTop: '10px',
    boxShadow: '0 4px 10px rgba(155, 89, 182, 0.3)',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#8e44ad',
    color: 'white',
    padding: '15px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tr: {
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '15px',
    fontSize: '14px',
    color: '#444',
  },
  roleBadge: {
    backgroundColor: '#e8daef',
    color: '#7d3c98',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
  },
  editBtn: {
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    marginRight: '5px',
    transition: 'all 0.3s',
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.3s',
  },
  profilePic: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #9b59b6',
  },
  profilePicPlaceholder: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#9b59b6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    color: 'white',
    fontWeight: 'bold',
    border: '2px solid #9b59b6',
  },
  previewContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '15px',
  },
  previewImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #9b59b6',
  },
  previewPlaceholder: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px solid #ddd',
  },
  previewPlaceholderText: {
    fontSize: '40px',
    color: '#999',
    fontWeight: 'bold',
  },
  uploadBtn: {
    backgroundColor: '#9b59b6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    width: '100%',
    transition: 'all 0.3s',
  },
  // Attendance approval styles
  filterTabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  filterTab: {
    padding: '10px 20px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  bulkActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
  },
  selectedCount: {
    fontWeight: '600',
    color: '#495057',
    marginRight: '10px',
  },
  bulkApproveBtn: {
    padding: '8px 16px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  bulkRejectBtn: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  clearSelectionBtn: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  noDataCell: {
    textAlign: 'center',
    padding: '30px',
    color: '#7f8c8d',
  },
  employeeCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  actionButtons: {
    display: 'flex',
    gap: '5px',
  },
  approveBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  rejectBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  viewBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  approvedBy: {
    fontSize: '12px',
    color: '#27ae60',
  },
  rejectionText: {
    fontSize: '12px',
    color: '#e74c3c',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#666',
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
    padding: '30px',
    borderRadius: '10px',
    width: '400px',
    maxWidth: '90%',
  },
  modalTitle: {
    marginBottom: '15px',
    color: '#2c3e50',
  },
  modalTextarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    minHeight: '100px',
    resize: 'vertical',
    marginTop: '15px',
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
  modalRejectBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#e74c3c',
    color: 'white',
    cursor: 'pointer',
  },
  modalApproveBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#27ae60',
    color: 'white',
    cursor: 'pointer',
  },
  // Leave styles
  leaveTypeBadge: {
    padding: '4px 8px',
    backgroundColor: '#e8f4f8',
    color: '#2980b9',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  daysBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  // Profile Edit comparison styles
  compareEmployee: {
    marginBottom: '10px',
    fontSize: '14px',
  },
  compareField: {
    marginBottom: '20px',
    fontSize: '14px',
  },
  compareContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px',
  },
  compareBox: {
    flex: 1,
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #eee',
  },
  compareBoxTitle: {
    margin: '0 0 10px 0',
    fontSize: '12px',
    color: '#7f8c8d',
    textTransform: 'uppercase',
  },
  compareBoxContent: {
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
  },
  compareArrow: {
    fontSize: '24px',
    color: '#9b59b6',
  },
  compareOldValue: {
    color: '#e74c3c',
    textDecoration: 'line-through',
  },
  compareNewValue: {
    color: '#27ae60',
    fontWeight: '600',
  },
  compareMeta: {
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #eee',
    fontSize: '12px',
    color: '#7f8c8d',
  },
  oldValue: {
    color: '#e74c3c',
    textDecoration: 'line-through',
  },
  newValue: {
    color: '#27ae60',
    fontWeight: '600',
  },
  // Salary Management Styles
  salaryFormCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  },
  salaryFormGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  bulkActionBar: {
    backgroundColor: '#f8f9fa',
    padding: '15px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #e0e0e0',
  },
  bulkToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
  },
  employeeSelectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '10px',
    maxHeight: '300px',
    overflowY: 'auto',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  employeeCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    backgroundColor: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  earningsSection: {
    backgroundColor: '#e8f5e9',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #c8e6c9',
  },
  deductionsSection: {
    backgroundColor: '#ffebee',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #ffcdd2',
  },
  calculationPreview: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    border: '2px solid #9b59b6',
  },
  calculationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginTop: '15px',
  },
  calcBox: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  calcLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  calcValue: {
    display: 'block',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  netSalaryBox: {
    backgroundColor: '#9b59b6',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    color: 'white',
  },
  netLabel: {
    display: 'block',
    fontSize: '12px',
    textTransform: 'uppercase',
    marginBottom: '8px',
    opacity: 0.9,
  },
  netValue: {
    display: 'block',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  generateBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '16px 30px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    width: '100%',
    boxShadow: '0 4px 10px rgba(39, 174, 96, 0.3)',
    transition: 'all 0.3s',
  },
  // Slip Detail Modal Styles
  slipHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  slipSection: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  slipSectionTitle: {
    margin: '0 0 15px 0',
    color: '#9b59b6',
    fontSize: '14px',
    textTransform: 'uppercase',
    borderBottom: '1px solid #ddd',
    paddingBottom: '8px',
  },
  slipRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px',
  },
  slipTotal: {
    borderTop: '1px solid #ddd',
    marginTop: '10px',
    paddingTop: '10px',
    fontSize: '16px',
  },
  slipNet: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    backgroundColor: '#9b59b6',
    borderRadius: '8px',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '20px',
  },
  // Resignation Management Styles
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
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
  noAction: {
    color: '#999',
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
  cancelBtn: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
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

// BGV Management Component
const BGVManagementPage = () => {
  const [bgvRequests, setBgvRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedBGV, setSelectedBGV] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [initiateForm, setInitiateForm] = useState({
    employeeId: '',
    employeeType: 'FRESHER',
    remarks: ''
  });

  useEffect(() => {
    loadBGVRequests();
    loadEmployees();
  }, []);

  const loadBGVRequests = async () => {
    try {
      setLoading(true);
      const response = await bgvAPI.getCompanyBGVRequests();
      setBgvRequests(response.data || []);
    } catch (error) {
      toast.error('Failed to load BGV requests');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await adminAPI.getAllEmployees();
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Failed to load employees');
    }
  };

  const handleInitiateBGV = async () => {
    try {
      await bgvAPI.initiateBGV(initiateForm);
      toast.success('BGV initiated successfully');
      setShowInitiateModal(false);
      setInitiateForm({ employeeId: '', employeeType: 'FRESHER', remarks: '' });
      loadBGVRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initiate BGV');
    }
  };

  const handleViewDocuments = async (bgv) => {
    try {
      const response = await bgvAPI.getBGVDocuments(bgv.id);
      setSelectedDocuments(response.data || []);
      setSelectedBGV(bgv);
      setShowVerifyModal(true);
    } catch (error) {
      toast.error('Failed to load documents');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'PENDING': '#f39c12',
      'IN_PROGRESS': '#3498db',
      'SUBMITTED': '#9b59b6',
      'UNDER_REVIEW': '#e67e22',
      'APPROVED': '#27ae60',
      'REJECTED': '#e74c3c',
      'PARTIAL_APPROVED': '#f1c40f'
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
    return <div style={styles.loading}>Loading BGV requests...</div>;
  }

  return (
    <div>
      <h2 style={styles.pageTitle}>BGV Management</h2>
      <div style={{ marginBottom: '20px' }}>
        <button 
          style={styles.generateBtn}
          onClick={() => setShowInitiateModal(true)}
        >
          + Initiate BGV
        </button>
      </div>
      
      {bgvRequests.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🔍</div>
          <h3>No BGV Requests</h3>
          <p>No background verification requests found.</p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            Click "Initiate BGV" to start a new verification process.
          </p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Employee</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Initiated</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bgvRequests.map((bgv) => (
                <tr key={bgv.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.employeeInfo}>
                      <strong>{bgv.employee?.fullName}</strong>
                      <span style={styles.email}>{bgv.employee?.email}</span>
                    </div>
                  </td>
                  <td style={styles.td}>{bgv.employeeType}</td>
                  <td style={styles.td}>
                    <span style={getStatusBadge(bgv.status)}>
                      {bgv.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(bgv.initiatedAt).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.approveBtn}
                      onClick={() => handleViewDocuments(bgv)}
                    >
                      View Docs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Initiate BGV Modal */}
      {showInitiateModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Initiate BGV</h3>
            <div style={styles.formGroup}>
              <label>Select Employee *</label>
              <select
                value={initiateForm.employeeId}
                onChange={(e) => setInitiateForm({...initiateForm, employeeId: e.target.value})}
                style={styles.input}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.email})</option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label>Employee Type *</label>
              <select
                value={initiateForm.employeeType}
                onChange={(e) => setInitiateForm({...initiateForm, employeeType: e.target.value})}
                style={styles.input}
              >
                <option value="FRESHER">Fresher</option>
                <option value="EXPERIENCED">Experienced</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label>Remarks</label>
              <textarea
                value={initiateForm.remarks}
                onChange={(e) => setInitiateForm({...initiateForm, remarks: e.target.value})}
                style={styles.textarea}
                rows="2"
              />
            </div>
            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={() => setShowInitiateModal(false)}>
                Cancel
              </button>
              <button 
                style={styles.confirmApproveBtn} 
                onClick={handleInitiateBGV}
                disabled={!initiateForm.employeeId}
              >
                Initiate BGV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Documents Modal */}
      {showVerifyModal && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.modal, maxWidth: '700px'}}>
            <h3>BGV Documents - {selectedBGV?.employee?.fullName}</h3>
            <table style={{...styles.table, marginTop: '20px'}}>
              <thead>
                <tr>
                  <th style={styles.th}>Document</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>File</th>
                </tr>
              </thead>
              <tbody>
                {selectedDocuments.map((doc) => (
                  <tr key={doc.id} style={styles.tr}>
                    <td style={styles.td}>{doc.documentName}</td>
                    <td style={styles.td}>
                      <span style={getStatusBadge(doc.status)}>
                        {doc.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {doc.fileUrl ? (
                        <a href={`http://34.47.170.212:9090${doc.fileUrl}`} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      ) : (
                        'Not uploaded'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={() => setShowVerifyModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// HR Policies Component
const HRPoliciesPage = () => {
  const [policies, setPolicies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policyForm, setPolicyForm] = useState({
    title: '',
    description: '',
    type: 'POLICY',
    category: 'GENERAL',
    file: null
  });
  const [assignForm, setAssignForm] = useState({
    employeeId: ''
  });

  useEffect(() => {
    loadPolicies();
    loadEmployees();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const response = await hrPolicyAPI.getAllPolicies();
      setPolicies(response.data || []);
    } catch (error) {
      toast.error('Failed to load policies');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await adminAPI.getAllEmployees();
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Failed to load employees');
    }
  };

  const handleUploadPolicy = async () => {
    try {
      const formData = new FormData();
      formData.append('title', policyForm.title);
      formData.append('description', policyForm.description);
      formData.append('type', policyForm.type);
      formData.append('category', policyForm.category);
      if (policyForm.file) {
        formData.append('file', policyForm.file);
      }
      
      await hrPolicyAPI.createPolicy(formData);
      toast.success('Policy uploaded successfully');
      setShowUploadModal(false);
      setPolicyForm({ title: '', description: '', type: 'POLICY', category: 'GENERAL', file: null });
      loadPolicies();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload policy');
    }
  };

  const handleAssignPolicy = async () => {
    try {
      await hrPolicyAPI.assignPolicyToEmployee({
        policyId: selectedPolicy.id,
        employeeId: assignForm.employeeId
      });
      toast.success('Policy assigned successfully');
      setShowAssignModal(false);
      setAssignForm({ employeeId: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign policy');
    }
  };

  const openAssignModal = (policy) => {
    setSelectedPolicy(policy);
    setShowAssignModal(true);
  };

  const getTypeBadge = (type) => {
    return {
      backgroundColor: type === 'POLICY' ? '#3498db' : '#9b59b6',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
    };
  };

  const getStatusBadge = (active) => {
    return {
      backgroundColor: active ? '#27ae60' : '#e74c3c',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
    };
  };

  if (loading) {
    return <div style={styles.loading}>Loading HR Policies...</div>;
  }

  return (
    <div>
      <h2 style={styles.pageTitle}>HR Policies & Forms</h2>
      <div style={{ marginBottom: '20px' }}>
        <button 
          style={styles.generateBtn}
          onClick={() => setShowUploadModal(true)}
        >
          + Upload Policy/Form
        </button>
      </div>
      
      {policies.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📋</div>
          <h3>No Policies</h3>
          <p>No HR policies or forms uploaded yet.</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Uploaded</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id} style={styles.tr}>
                  <td style={styles.td}>
                    <strong>{policy.policyName || policy.title}</strong>
                  </td>
                  <td style={styles.td}>
                    <span style={getTypeBadge(policy.policyType || policy.type)}>
                      {policy.policyType || policy.type}
                    </span>
                  </td>
                  <td style={styles.td}>{policy.category}</td>
                  <td style={styles.td}>
                    <span style={getStatusBadge(policy.active)}>
                      {policy.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(policy.createdAt).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={{...styles.approveBtn, marginRight: '8px'}}
                      onClick={() => openAssignModal(policy)}
                    >
                      Assign
                    </button>
                    {policy.fileUrl && (
                      <button
                        onClick={() => {
                          const token = localStorage.getItem('token');
                          const downloadUrl = `http://34.47.170.212:9090/api/files/download?path=${encodeURIComponent(policy.fileUrl)}&token=${token}`;
                          window.open(downloadUrl, '_blank');
                        }}
                        style={styles.viewBtn}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Upload Policy/Form</h3>
            <div style={styles.formGroup}>
              <label>Title *</label>
              <input
                type="text"
                value={policyForm.title}
                onChange={(e) => setPolicyForm({...policyForm, title: e.target.value})}
                style={styles.input}
                placeholder="e.g., POSH Policy"
              />
            </div>
            <div style={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={policyForm.description}
                onChange={(e) => setPolicyForm({...policyForm, description: e.target.value})}
                style={styles.textarea}
                rows="2"
              />
            </div>
            <div style={styles.formGroup}>
              <label>Type *</label>
              <select
                value={policyForm.type}
                onChange={(e) => setPolicyForm({...policyForm, type: e.target.value})}
                style={styles.input}
              >
                <option value="POLICY">Policy</option>
                <option value="FORM">Form</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label>Category *</label>
              <select
                value={policyForm.category}
                onChange={(e) => setPolicyForm({...policyForm, category: e.target.value})}
                style={styles.input}
              >
                <option value="POSH">POSH</option>
                <option value="INTEGRITY">Integrity</option>
                <option value="CONFIDENTIALITY">Confidentiality</option>
                <option value="PF">PF Declaration</option>
                <option value="GRATUITY">Gratuity</option>
                <option value="ESI">ESI</option>
                <option value="GENERAL">General</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label>Document File (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPolicyForm({...policyForm, file: e.target.files[0]})}
                style={styles.input}
              />
            </div>
            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={() => setShowUploadModal(false)}>
                Cancel
              </button>
              <button 
                style={styles.confirmApproveBtn} 
                onClick={handleUploadPolicy}
                disabled={!policyForm.title}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Assign {selectedPolicy?.title}</h3>
            <div style={styles.formGroup}>
              <label>Select Employee *</label>
              <select
                value={assignForm.employeeId}
                onChange={(e) => setAssignForm({...assignForm, employeeId: e.target.value})}
                style={styles.input}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.email})</option>
                ))}
              </select>
            </div>
            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={() => setShowAssignModal(false)}>
                Cancel
              </button>
              <button 
                style={styles.confirmApproveBtn} 
                onClick={handleAssignPolicy}
                disabled={!assignForm.employeeId}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Resignation Management Component
const ResignationManagementPage = () => {
  const [resignations, setResignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myCompany, setMyCompany] = useState(null);
  const [selectedResignation, setSelectedResignation] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    loadMyCompany();
  }, []);

  useEffect(() => {
    if (myCompany) {
      loadResignations();
    }
  }, [myCompany]);

  const loadMyCompany = async () => {
    try {
      const response = await adminAPI.getMyCompany();
      setMyCompany(response.data);
    } catch (error) {
      toast.error('Failed to load company info');
    }
  };

  const loadResignations = async () => {
    try {
      setLoading(true);
      const response = await resignationAPI.getPendingForAdmin(myCompany.id);
      setResignations(response.data || []);
    } catch (error) {
      toast.error('Failed to load resignation requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await resignationAPI.adminApprove({
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
      await resignationAPI.adminApprove({
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
      'PENDING': '#f39c12',
      'PENDING_MANAGER': '#f39c12',
      'MANAGER_APPROVED': '#3498db',
      'PENDING_ADMIN': '#3498db',
      'ADMIN_APPROVED': '#27ae60',
      'APPROVED': '#27ae60',
      'REJECTED': '#e74c3c',
      'CANCELLED': '#95a5a6'
    };
    const labels = {
      'PENDING_MANAGER': 'Pending Manager',
      'MANAGER_APPROVED': 'Manager Approved',
      'PENDING_ADMIN': 'Pending Admin',
      'APPROVED': 'Approved',
      'REJECTED': 'Rejected',
      'CANCELLED': 'Cancelled'
    };
    return {
      backgroundColor: colors[status] || '#95a5a6',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'capitalize'
    };
  };

  if (loading) {
    return <div style={styles.loading}>Loading resignation requests...</div>;
  }

  return (
    <div>
      <h2 style={styles.pageTitle}>Resignation Approvals</h2>
      
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
                      {resignation.status === 'PENDING_MANAGER' ? 'Pending Manager' : 
                       resignation.status === 'MANAGER_APPROVED' ? 'Manager Approved' :
                       resignation.status === 'APPROVED' ? 'Approved' :
                       resignation.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {resignation.status === 'PENDING_MANAGER' || resignation.status === 'MANAGER_APPROVED' ? (
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
                      <span style={styles.noAction}>-</span>
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

export default AdminDashboard;
