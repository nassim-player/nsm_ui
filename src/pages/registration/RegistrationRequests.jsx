import React, { useState, useEffect } from 'react';
import { User, Phone, Users, Calendar, MapPin, Briefcase, Mail, Info, X, Zap, Award, Activity, Truck, Home, Check, Slash, AlertCircle, Clock, Filter, CheckCircle, XCircle, Loader, Trash2 } from 'react-feather';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal/Modal';
import { InfoCard, InfoRow } from '../../components/common/Card/InfoCard';
import { Steps } from '../../components/common/Steps/Steps';
import './RegistrationRequests.scss';

import { useTranslation } from '../../context/LanguageContext';

// Status options with colors - Moved inside component or using a function to translate
const getStatusOptions = (t) => [
    { value: 'pending', label: t('req.status_pending'), color: '#eab308' },
    { value: 'scheduled', label: t('req.status_scheduled'), color: '#3b82f6' },
    { value: 'in_review', label: t('req.status_in_review'), color: '#f97316' },
    { value: 'approved', label: t('req.status_approved'), color: '#22c55e' },
    { value: 'rejected', label: t('req.status_rejected'), color: '#ef4444' },
];

// Render status badge
const renderStatus = (status, t) => {
    const statusOptions = getStatusOptions(t);
    const statusInfo = statusOptions.find(s => s.value === status);
    if (!statusInfo) return '-';
    return (
        <span
            className="dt-badge"
            style={{
                background: `${statusInfo.color}20`,
                color: statusInfo.color
            }}
        >
            {statusInfo.label}
        </span>
    );
};

// Render name with avatar
const renderParentName = (value) => (
    <div className="dt-cell-name">
        <div className="dt-avatar">
            <User size={16} />
        </div>
        <span>{value || '-'}</span>
    </div>
);

// Render phone with icon
const renderPhone = (value) => {
    if (!value || value === '-') return '-';
    return (
        <span className="dt-cell-phone">
            <Phone size={14} />
            {value}
        </span>
    );
};

// Render student count badge
const renderStudentCount = (value, t) => (
    <span className="dt-badge student-count-badge">
        <Users size={14} />
        {value} {value === 1 ? t('req.student') : t('req.students')}
    </span>
);

// Render gender badge
const renderGender = (value, t) => {
    if (!value || value === '-') return '-';
    const isMale = value === 'ذكر' || value === 'male' || value === 'Male';
    return (
        <span className={`dt-badge gender-badge ${isMale ? 'male' : 'female'}`}>
            {isMale ? t('male') : t('female')}
        </span>
    );
};

// Render Alive/Deceased status
const renderAliveStatus = (value, t) => {
    if (!value || value === '-') return '-';
    // Handle both Arabic and English status values
    const isAlive = value.includes('حياة') || value === 'alive' || value === 'على قيد الحياة';
    return (
        <span className={`dt-badge status-badge ${isAlive ? 'alive' : 'deceased'}`}>
            {isAlive ? t('alive') : t('deceased')}
        </span>
    );
};

// Render meeting slot with date and time info
const renderMeetingSlot = (value, hideDate = false) => {
    if (!value || value === '-') return (
        <span className="dt-cell-slot empty">-</span>
    );

    // Format: "2026-02-15 10:30"
    const [date, time] = value.split(' ');

    return (
        <div className="dt-cell-slot">
            <div className="slot-badge time-badge">
                <span className="tag green">
                    <Clock size={12} />
                    {time}
                </span>
            </div>
            {!hideDate && (
                <div className="slot-badge date-badge">
                    <span className="tag purple">
                        <Calendar size={12} />
                        {date.split('-').reverse().join('/')}
                    </span>
                </div>
            )}
        </div>
    );
};

// Render family status badge
const renderFamilyStatus = (value) => {
    if (!value || value === '-') return '-';
    const isMarried = value === 'married' || value === 'متزوج' || value === 'متزوجان';
    const isDivorced = value === 'divorced' || value === 'مطلق' || value === 'مطلقان';

    return (
        <span className={`dt-badge status-badge ${isMarried ? 'alive' : isDivorced ? 'deceased' : 'active'}`}>
            {value}
        </span>
    );
};

// Column configuration - Moved logic inside component
const getDefaultColumns = (t) => [
    { key: 'meetingSlot', label: t('req.meeting_slot'), visible: true, width: 160, render: renderMeetingSlot },
    { key: 'parentName', label: t('req.guardian_name'), visible: true, width: 200, render: renderParentName },
    { key: 'role', label: t('req.role'), visible: true, width: 80 },
    { key: 'phone', label: t('req.phone'), visible: true, width: 150, render: renderPhone },
    { key: 'studentCount', label: t('req.students_count'), visible: true, width: 120, render: (val) => renderStudentCount(val, t) },
    { key: 'submissionDate', label: t('req.submission_date'), visible: true, width: 130 },
    { key: 'status', label: t('req.status'), visible: true, width: 120, render: (val) => renderStatus(val, t) },
];

// Extra columns available from the database
const getExtraColumns = (t) => [
    { key: 'id', label: t('req.id'), category: t('nav.management'), width: 120 },
    // Family & Address
    { key: 'address', label: t('req.address'), category: t('req.family_info'), width: 200 },
    { key: 'familyMembers', label: t('req.family_members'), category: t('req.family_info'), width: 120 },
    { key: 'familyStatus', label: t('req.family_status'), category: t('req.family_info'), width: 130, render: renderFamilyStatus },

    // Father details
    { key: 'fatherName', label: t('req.father_name'), category: t('req.father'), width: 180 },
    { key: 'fatherPhone', label: t('req.father_phone'), category: t('req.father'), width: 140, render: renderPhone },
    { key: 'fatherEmail', label: t('req.father_email'), category: t('req.father'), width: 180 },
    { key: 'fatherJob', label: t('req.father_job'), category: t('req.father'), width: 140 },
    { key: 'fatherStatus', label: t('req.father_status'), category: t('req.father'), width: 120, render: (val) => renderAliveStatus(val, t) },

    // Mother details
    { key: 'motherName', label: t('req.mother_name'), category: t('req.mother'), width: 180 },
    { key: 'motherPhone', label: t('req.mother_phone'), category: t('req.mother'), width: 140, render: renderPhone },
    { key: 'motherEmail', label: t('req.mother_email'), category: t('req.mother'), width: 180 },
    { key: 'motherJob', label: t('req.mother_job'), category: t('req.mother'), width: 140 },
    { key: 'motherStatus', label: t('req.mother_status'), category: t('req.mother'), width: 120, render: (val) => renderAliveStatus(val, t) },

    // Guardian details
    { key: 'guardianName', label: t('req.guardian_name'), category: t('guardian'), width: 180 },
    { key: 'guardianPhone', label: t('req.guardian_phone'), category: t('guardian'), width: 140, render: renderPhone },
    { key: 'guardianRelation', label: t('req.guardian_relation'), category: t('guardian'), width: 120 },

    // Survey & Others
    { key: 'discoverySource', label: t('req.discovery_source'), category: t('req.academic_path'), width: 150 },
    { key: 'reasonForChoice', label: t('req.reason_choice'), category: t('req.academic_path'), width: 200 },
    { key: 'additionalRequests', label: t('req.add_requests'), category: t('req.academic_path'), width: 200 },
];

// Step indicator component
const RegistrationSteps = ({ currentStatus }) => {
    const { t } = useTranslation();
    const steps = [
        { id: 1, label: t('req.step1'), description: t('req.step1_desc') },
        { id: 2, label: t('req.step2'), description: t('req.step2_desc') },
        { id: 3, label: t('req.step3'), description: t('req.step3_desc') },
        { id: 4, label: t('req.step4'), description: t('req.step4_desc') },
    ];

    // Determine current step index (0-3)
    let currentStepIndex = 0; // Default to Step 1
    if (['approved', 'scheduled'].includes(currentStatus)) {
        currentStepIndex = 1; // Step 2
    } else if (currentStatus === 'financial') { // Placeholder for future
        currentStepIndex = 2; // Step 3
    } else if (currentStatus === 'finalized') { // Placeholder for future
        currentStepIndex = 3; // Step 4
    }

    return (
        <Steps
            steps={steps}
            currentStepIndex={currentStepIndex}
            className="registration-detail-steps"
        />
    );
};

// Function to re-attach renderers to columns (lost during JSON serialization in localStorage)
const rehydrateColumns = (columns, defaultCols) => {
    // Re-attach render functions from default columns
    return columns.map(col => {
        const master = defaultCols.find(m => m.key === col.key);
        return master ? { ...col, render: master.render, label: master.label } : col; // Updating label to current lang too
    });
};

export const RegistrationRequests = () => {
    const { t } = useTranslation();
    const defaultColumns = React.useMemo(() => getDefaultColumns(t), [t]);
    const extraColumns = React.useMemo(() => getExtraColumns(t), [t]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [isBulkRejecting, setIsBulkRejecting] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [rejReason, setRejReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);
    const [selectionEnabled, setSelectionEnabled] = useState(false);

    // Persist column configuration in local storage
    const [currentColumns, setCurrentColumns] = useState(() => {
        const saved = localStorage.getItem('registration_requests_columns_v2');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return rehydrateColumns(parsed, defaultColumns);
            } catch (e) {
                console.error("Error parsing saved columns:", e);
                return defaultColumns;
            }
        }
        return defaultColumns;
    });

    // Update column renderers to respond to dateFilter
    const processedColumns = React.useMemo(() => {
        return currentColumns.map(col => {
            if (col.key === 'meetingSlot') {
                return {
                    ...col,
                    render: (val) => renderMeetingSlot(val, !!dateFilter)
                };
            }
            return col;
        });
    }, [currentColumns, dateFilter]);

    // Update labels when language changes
    useEffect(() => {
        setCurrentColumns(prev => rehydrateColumns(prev, defaultColumns));
    }, [defaultColumns]);

    const handleColumnsChange = (newColumns) => {
        setCurrentColumns(newColumns);
        localStorage.setItem('registration_requests_columns_v2', JSON.stringify(newColumns));
    };

    // Fetch registration requests on mount
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('/api/registrationRequests.php');
                const data = await response.json();

                if (data.success) {
                    // Add mock meeting slots for demonstration
                    const mockSlots = [
                        '2026-02-15 09:30',
                        '2026-02-15 11:15',
                        '2026-02-16 10:00',
                        '2026-02-17 14:45',
                        '2026-02-18 08:30'
                    ];

                    const enrichedData = (data.data || []).map((req, idx) => ({
                        ...req,
                        meetingSlot: req.meetingSlot || mockSlots[idx % mockSlots.length]
                    }));

                    setRequests(enrichedData);
                } else {
                    throw new Error(data.error || 'فشل في تحميل البيانات');
                }
            } catch (err) {
                console.error('Error fetching registration requests:', err);
                setError(err.message || 'حدث خطأ أثناء تحميل الطلبات');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    // Fetch single registration details
    const handleRowClick = async (row) => {
        try {
            setDetailLoading(true);
            setIsDetailModalOpen(true);
            const response = await fetch(`/api/registrationDetail.php?id=${row.parentId}`);
            const data = await response.json();

            if (data.success) {
                setSelectedRequest(data.data);
                setRejReason(data.data.rejectionReason || '');
                setIsRejecting(false);
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            console.error('Error fetching details:', err);
            setError('فشل في تحميل تفاصيل الطلب');
            setIsDetailModalOpen(false);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleUpdateStatus = async (status, reason = null) => {
        if (!selectedRequest?.parentId) return;

        try {
            setActionLoading(true);
            const response = await fetch('/api/updateRegistrationStatus.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    parentId: selectedRequest.parentId,
                    status,
                    rejectionReason: reason
                })
            });
            const data = await response.json();

            if (data.success) {
                // Update local list
                setRequests(prev => prev.map(req =>
                    req.parentId === selectedRequest.parentId ? { ...req, status } : req
                ));
                // Update currently viewed detail
                setSelectedRequest(prev => ({ ...prev, status, rejectionReason: reason }));
                setIsRejecting(false);
                setRejReason('');
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            console.error('Error updating status:', err);
            alert('فشل في تحديث حالة الطلب: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    // Handle bulk reject
    const handleBulkReject = async () => {
        if (!rejReason.trim()) return;

        setActionLoading(true);
        try {
            // In a real app, this would be a single API call
            // For now, we'll simulate or map through
            const results = await Promise.all(selectedRows.map(id => {
                const req = requests.find(r => r.id === id || requests.indexOf(r) === id);
                return fetch('/api/updateRegistrationStatus.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        parentId: req.parentId,
                        status: 'rejected',
                        rejectionReason: rejReason
                    })
                }).then(res => res.json());
            }));

            const allSuccess = results.every(r => r.success);
            if (allSuccess) {
                setRequests(prev => prev.map(req =>
                    selectedRows.includes(req.id || requests.indexOf(req)) ? { ...req, status: 'rejected' } : req
                ));
                setSelectedRows([]);
                setIsBulkRejecting(false);
                setRejReason('');
            } else {
                alert('فشل في تحديث بعض الطلبات');
            }
        } catch (err) {
            console.error('Bulk reject error:', err);
            alert('حدث خطأ أثناء الرفض الجماعي');
        } finally {
            setActionLoading(false);
        }
    };

    const handleBulkRemove = () => {
        const confirmClear = window.confirm(`هل أنت متأكد من حذف ${selectedRows.length} طلب من القائمة؟ (سيتم الحذف من العرض فقط)`);
        if (confirmClear) {
            setRequests(prev => prev.filter(req => !selectedRows.includes(req.id || requests.indexOf(req))));
            setSelectedRows([]);
        }
    };

    // Filter data based on date filter
    const filteredData = React.useMemo(() => {
        if (!dateFilter) return requests;
        return requests.filter(req => {
            if (!req.meetingSlot) return false;
            return req.meetingSlot.startsWith(dateFilter);
        });
    }, [requests, dateFilter]);

    // Custom search filter
    const searchFilter = (row, query) => {
        return (
            (row.parentName && row.parentName.includes(query)) ||
            (row.phone && row.phone.includes(query)) ||
            (row.id && String(row.id).includes(query))
        );
    };

    return (
        <div className="registration-requests">
            <div className="page-header">
                <div className="header-content">
                    <h1>{t('req.title')}</h1>
                    <p>{t('req.subtitle')}</p>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedRows.length > 0 && (
                <div className="dt-bulk-actions">
                    <div className="selection-info">
                        <span className="count">{selectedRows.length}</span>
                        <span>{t('req.bulk_rows_selected')}</span>
                    </div>
                    <div className="action-buttons">
                        <button
                            className="bulk-btn reject"
                            onClick={() => setIsBulkRejecting(true)}
                        >
                            <X size={16} />
                            {t('req.reject_selected')}
                        </button>
                        <button
                            className="bulk-btn remove"
                            onClick={handleBulkRemove}
                        >
                            <Trash2 size={16} />
                            {t('req.remove_selected')}
                        </button>
                        <button className="bulk-btn clear" onClick={() => setSelectedRows([])}>
                            {t('req.deselect')}
                        </button>
                    </div>
                </div>
            )}

            <DataTable
                data={filteredData}
                columns={processedColumns}
                defaultColumns={defaultColumns}
                extraColumns={extraColumns}
                loading={loading}
                error={error}
                selectable={selectionEnabled}
                selectedRows={selectedRows}
                onSelectedRowsChange={setSelectedRows}
                searchPlaceholder={t('req.search_placeholder')}
                searchFilter={searchFilter}
                onRowClick={handleRowClick}
                onColumnsChange={handleColumnsChange}
                emptyIcon={User}
                emptyTitle={t('req.no_requests')}
                emptyMessage={t('req.no_requests_msg')}
                footerText={t('req.total_requests_count')}
                headerActions={
                    <div className="dt-header-actions-wrapper">
                        <button
                            className={`dt-selection-toggle ${selectionEnabled ? 'active' : ''}`}
                            onClick={() => {
                                setSelectionEnabled(!selectionEnabled);
                                if (selectionEnabled) setSelectedRows([]);
                            }}
                            title={selectionEnabled ? "إيقاف وضع التحديد" : "تفعيل وضع التحديد"}
                        >
                            <span className="status-dot"></span>
                            <CheckCircle size={18} />
                            <span>{t('req.selection_mode')}</span>
                        </button>

                        <div className={`dt-date-filter ${dateFilter ? 'active' : ''}`}>
                            <Calendar size={18} />
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                            {dateFilter && (
                                <button className="clear-date" onClick={() => setDateFilter('')} title="مسح التاريخ">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                }
            />

            {/* Bulk Reject Reason Modal */}
            <Modal
                isOpen={isBulkRejecting}
                onClose={() => setIsBulkRejecting(false)}
                title={<span>{t('req.bulk_reject_title') || "سبب الرفض الجماعي"} ({selectedRows.length} {t('req.requests')})</span>}
                icon={XCircle}
                size="medium"
                footer={
                    <>
                        <button className="cancel-btn" onClick={() => setIsBulkRejecting(false)} disabled={actionLoading}>{t('commissions.cancel')}</button>
                        <button
                            className="confirm-btn"
                            onClick={handleBulkReject}
                            disabled={!rejReason.trim() || actionLoading}
                        >
                            {actionLoading ? <Loader className="spin" size={16} /> : <Trash2 size={16} />}
                            {t('req.confirm_bulk_reject') || "تأكيد الرفض الجماعي"}
                        </button>
                    </>
                }
            >
                <div className="reject-modal-content">
                    <p>{t('req.bulk_reject_hint') || "يرجى تحديد سبب رفض الطلبات المحددة:"}</p>
                    <div className="reason-chips">
                        {[t('req.reason_info_insufficient') || 'المعلومات غير كافية', t('req.reason_full_capacity') || 'المقاعد ممتلئة', t('req.reason_out_of_range') || 'خارج النطاق الجغرافي', t('req.reason_other') || 'أخرى'].map(reason => (
                            <button
                                key={reason}
                                className={`reason-chip ${rejReason === reason ? 'active' : ''}`}
                                onClick={() => setRejReason(reason)}
                            >
                                {reason}
                            </button>
                        ))}
                    </div>
                    <textarea
                        placeholder={t('req.custom_reason_placeholder') || "اكتب سبباً مخصصاً..."}
                        value={rejReason}
                        onChange={(e) => setRejReason(e.target.value)}
                    />
                </div>
            </Modal>

            {/* Registration Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title={t('req.details')}
                subtitle={selectedRequest && `${t('req.date')}: ${selectedRequest.meetingDate || selectedRequest.meetingSlot}`}
                icon={User}
                size="full"
                headerActions={
                    selectedRequest && (
                        <div className="registration-steps-wrapper">
                            <Steps
                                steps={getSteps(t)}
                                currentStepIndex={getCurrentStepIndex(selectedRequest.status)}
                                direction="horizontal"
                            />
                        </div>
                    )
                }
                className="request-detail-modal"
            >
                {detailLoading ? (
                    <div className="modal-loading">
                        <div className="spinner"></div>
                        <p>{t('finalization.processing')}</p>
                    </div>
                ) : selectedRequest ? (
                    <div className="detail-grid">
                        {/* Parent Cards Grid */}
                        <div className="parents-section">
                            <div className="section-title">
                                <Users size={18} />
                                {t('req.family_info')}
                            </div>
                            <div className="cards-grid">
                                {/* Father Card - Show only if exists */}
                                {selectedRequest.father?.firstNameAr && (
                                    <InfoCard
                                        title={t('req.father')}
                                        icon={User}
                                        variant="father"
                                        highlight={selectedRequest.primaryRole === 'father'}
                                        badge={selectedRequest.primaryRole === 'father' ? t('req.registered_by_him') : renderAliveStatus(selectedRequest.father.status, t)}
                                    >
                                        <InfoRow label="الاسم الكامل" value={`${selectedRequest.father.firstNameAr} ${selectedRequest.father.lastNameAr}`} />
                                        <InfoRow label="الاسم (LAT)" value={`${selectedRequest.father.firstNameLat} ${selectedRequest.father.lastNameLat}`} />
                                        <InfoRow icon={Briefcase} label="المهنة" value={selectedRequest.father.job} />
                                        <InfoRow icon={Phone} label="الهاتف" value={selectedRequest.father.phone} color="#3b82f6" />
                                        <InfoRow icon={Mail} label="البريد" value={selectedRequest.father.email} />
                                    </InfoCard>
                                )}

                                {/* Mother Card - Show only if exists */}
                                {selectedRequest.mother?.firstNameAr && (
                                    <InfoCard
                                        title={t('req.mother')}
                                        icon={User}
                                        variant="mother"
                                        highlight={selectedRequest.primaryRole === 'mother'}
                                        badge={selectedRequest.primaryRole === 'mother' ? t('req.registered_by_her') : renderAliveStatus(selectedRequest.mother.status, t)}
                                    >
                                        <InfoRow label="الاسم الكامل" value={`${selectedRequest.mother.firstNameAr} ${selectedRequest.mother.lastNameAr}`} />
                                        <InfoRow label="الاسم (LAT)" value={`${selectedRequest.mother.firstNameLat} ${selectedRequest.mother.lastNameLat}`} />
                                        <InfoRow icon={Briefcase} label="المهنة" value={selectedRequest.mother.job} />
                                        <InfoRow icon={Phone} label="الهاتف" value={selectedRequest.mother.phone} color="#ef4444" />
                                        <InfoRow icon={Mail} label="البريد" value={selectedRequest.mother.email} />
                                    </InfoCard>
                                )}

                                {/* Guardian / Kafil Card - Show if role is guardian OR has data */}
                                {(selectedRequest.primaryRole === 'guardian' || selectedRequest.guardian?.firstNameAr) && (
                                    <InfoCard
                                        title={selectedRequest.guardian?.relation === 'other' ? t('req.other_guardian') : t('req.legal_guardian')}
                                        icon={Award}
                                        variant="guardian"
                                        highlight={selectedRequest.primaryRole === 'guardian'}
                                        badge={selectedRequest.primaryRole === 'guardian' ? t('req.primary_registrant') : (selectedRequest.guardian.relation === 'other' ? selectedRequest.guardian.relationOther : selectedRequest.guardian.relation)}
                                    >
                                        <InfoRow label="الاسم" value={`${selectedRequest.guardian.firstNameAr} ${selectedRequest.guardian.lastNameAr}`} />
                                        <InfoRow icon={Briefcase} label="المهنة" value={selectedRequest.guardian.job} />
                                        <InfoRow icon={Phone} label="الهاتف" value={selectedRequest.guardian.phone} color="#8b5cf6" />
                                    </InfoCard>
                                )}

                                {/* Family Info */}
                                <InfoCard
                                    title="العائلة والسكن"
                                    icon={Home}
                                    variant="family"
                                >
                                    <InfoRow label="أفراد الأسرة" value={selectedRequest.family.members} />
                                    <InfoRow label="الحالة العائلية" value={selectedRequest.family.status === 'married' ? 'متزوجان' : 'مطلقان'} />
                                    <InfoRow icon={MapPin} label="العنوان" value={selectedRequest.family.address} color="#f59e0b" />
                                </InfoCard>
                            </div>
                        </div>

                        {/* Students Section */}
                        <div className="students-section">
                            <div className="section-title">
                                <Users size={18} />
                                التلاميذ المسجلين ({selectedRequest.students.length})
                            </div>
                            <div className="students-list">
                                {selectedRequest.students.map((student, idx) => (
                                    <div key={student.id} className="student-detail-card">
                                        <div className="student-header">
                                            <div className="st-info">
                                                <div className="st-avatar">{idx + 1}</div>
                                                <div className="st-name-group">
                                                    <h5>{student.firstName} {student.lastName}</h5>
                                                    <span>{student.firstNameLat} {student.lastNameLat}</span>
                                                </div>
                                            </div>
                                            <div className="st-grade-badge">
                                                {student.requestedGrade}
                                            </div>
                                        </div>
                                        <div className="st-body">
                                            <div className="st-grid">
                                                <div className="st-column">
                                                    <h6>المعلومات الشخصية</h6>
                                                    <InfoRow icon={Calendar} label="تاريخ الميلاد" value={student.birthday} />
                                                    <InfoRow icon={MapPin} label="مكان الميلاد" value={`${student.birthCity}, ${student.birthWilaya}`} />
                                                    <InfoRow label="الجنس" value={renderGender(student.gender, t)} />
                                                    <InfoRow label="الجنسية" value={student.nationality} />
                                                </div>
                                                <div className="st-column">
                                                    <h6>المسار الدراسي</h6>
                                                    <InfoRow label="المستوى الحالي" value={student.currentGrade} />
                                                    <InfoRow label="هل هو معيد؟" value={student.repeater} />
                                                    <InfoRow label="المدرسة السابقة" value={student.previousSchool} />
                                                    <div className="results-row">
                                                        <span>النتائج:</span>
                                                        <div className="results">
                                                            <span className="res">ف1: {student.term1Result}</span>
                                                            <span className="res">ف2: {student.term2Result}</span>
                                                            <span className="res">ف3: {student.term3Result}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="st-column">
                                                    <h6>الصحة والنقل</h6>
                                                    <InfoRow icon={Activity} label="الحالة الطبية" value={student.medicalStatus} color="#ef4444" />
                                                    <InfoRow icon={Truck} label="حافلة مدرسية" value={student.needsBus === 'نعم' ? `نعم (${student.busLine})` : 'لا'} color="#3b82f6" />
                                                    <InfoRow label="فصيلة الدم" value={student.bloodType} />
                                                </div>
                                            </div>
                                            {student.notes && (
                                                <div className="st-notes">
                                                    <InfoRow icon={Info} label="ملاحظات" value={student.notes} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Application Status Management - SPAM ONLY MODE */}
                        <div className="status-management-section spam-mode">
                            <div className="spam-warning-card">
                                <div className="warning-content">
                                    <div className="warning-icon-area">
                                        <AlertCircle size={24} />
                                    </div>
                                    <div className="warning-text">
                                        <h4>هل تعتقد أن هذا طلب عشوائي (Spam)؟</h4>
                                        <p>يمكنك حذف هذا الطلب نهائياً إذا كان يبدو غير صالح أو وهمي.</p>
                                    </div>
                                </div>

                                <button
                                    className="btn-remove-spam"
                                    onClick={() => handleUpdateStatus('rejected', 'SPAM / طلب وهمي')}
                                    disabled={actionLoading}
                                >
                                    <Trash2 size={18} />
                                    <span>حذف الطلب نهائياً</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </div>
    );
};
