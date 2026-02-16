import React, { useState } from 'react';
import { User, Phone, Users, CheckCircle, Calendar, DollarSign, Clock, Check, FileText, X, Zap, Briefcase, Mail, MapPin, Award, Activity, Truck, Home, Info, AlertCircle, Grid, List } from 'react-feather';
import { DataTable } from '../../components/common/DataTable';
import { useTranslation } from '../../context/LanguageContext';
import './RegistrationFinalization.scss';

// Extended Placeholder Data
const PLACEHOLDER_DATA = [
    {
        id: 'REQ-2026-001',
        parentName: 'أحمد الإبراهيمي',
        phone: '0555123456',
        studentCount: 2,
        financialStatus: 'approved',
        date: '2026-02-10',
        applicationNumber: 'REQ-2026-001',
        status: 'financial_cleared',
        primaryRole: 'father',
        father: {
            firstNameAr: 'أحمد', lastNameAr: 'الإبراهيمي',
            firstNameLat: 'Ahmed', lastNameLat: 'Brahimi',
            job: 'مهندس', phone: '0555123456', email: 'ahmed@example.com', status: 'alive'
        },
        mother: {
            firstNameAr: 'سعاد', lastNameAr: 'بن محمد',
            firstNameLat: 'Souad', lastNameLat: 'Ben Mohamed',
            job: 'معلمة', phone: '0555987654', email: 'souad@example.com', status: 'alive'
        },
        family: {
            members: 5, status: 'married', address: 'حي الزهور، الجزائر الوسطى'
        },
        students: [
            {
                id: 1, firstName: 'عمر', lastName: 'الإبراهيمي', firstNameLat: 'Omar', lastNameLat: 'Brahimi',
                requestedGrade: 'السنة الثالثة ابتدائي', birthday: '2018-05-15', gender: 'ذكر', nationality: 'جزائرية',
                medicalStatus: 'سليم', needsBus: 'نعم', busLine: 'خط بئر مراد رايس', bloodType: 'A+',
                currentGrade: 'السنة الثانية ابتدائي', repeater: 'لا', previousSchool: 'مدرسة النجاح',
                term1Result: '8.5', term2Result: '9.0', term3Result: 'Wait'
            },
            {
                id: 2, firstName: 'لينا', lastName: 'الإبراهيمي', firstNameLat: 'Lina', lastNameLat: 'Brahimi',
                requestedGrade: 'التحضيري', birthday: '2021-03-20', gender: 'أنثى', nationality: 'جزائرية',
                medicalStatus: 'حساسية الفول السوداني', needsBus: 'نعم', busLine: 'خط بئر مراد رايس', bloodType: 'O+',
                currentGrade: 'الروضة', repeater: 'لا', previousSchool: 'روضة الأمل',
                term1Result: '-', term2Result: '-', term3Result: '-'
            }
        ],
        meetingInfo: {
            date: '2026-02-05',
            time: '10:00',
            interviewer: 'د. فاطمة الزهراء',
            notes: 'الأب مهتم جداً بالجانب التربوي. الأطفال متجاوبون.'
        },
        commissionInfo: {
            decision: 'مقبول',
            date: '2026-02-06',
            notes: 'ملف مكتمل، المستوى الدراسي للأبناء ممتاز.'
        },
        financialInfo: {
            approved: true,
            date: '2026-02-08',
            notes: 'تمت الموافقة المالية'
        },
        parentNotes: 'يرجى وضع الأخوين في نفس الفوج إن أمكن.'
    },
    {
        id: 'REQ-2026-002',
        parentName: 'خالد المنصور',
        phone: '0666987654',
        studentCount: 1,
        financialStatus: 'approved',
        date: '2026-02-11',
        applicationNumber: 'REQ-2026-002',
        status: 'financial_cleared',
        primaryRole: 'father',
        father: {
            firstNameAr: 'خالد', lastNameAr: 'المنصور',
            firstNameLat: 'Khaled', lastNameLat: 'Mansour',
            job: 'طبيب', phone: '0666987654', email: 'khaled@example.com', status: 'alive'
        },
        family: {
            members: 3, status: 'married', address: 'حيدرة، الجزائر'
        },
        students: [
            {
                id: 3, firstName: 'ياسين', lastName: 'المنصور', firstNameLat: 'Yacine', lastNameLat: 'Mansour',
                requestedGrade: 'السنة الأولى متوسط', birthday: '2015-08-10', gender: 'ذكر', nationality: 'جزائرية',
                medicalStatus: 'سليم', needsBus: 'لا', bloodType: 'B+',
                currentGrade: 'السنة الخامسة ابتدائي', repeater: 'لا', previousSchool: 'مدرسة المستقبل',
                term1Result: '9.5', term2Result: '9.2', term3Result: '-'
            }
        ],
        meetingInfo: {
            date: '2026-02-07',
            time: '11:00',
            interviewer: 'أ. محمد العربي',
            notes: 'مستوى التلميذ ممتاز في الرياضيات.'
        },
        commissionInfo: {
            decision: 'مقبول',
            date: '2026-02-08',
            notes: 'يوصى بقبوله في القسم النموذجي.'
        },
        financialInfo: {
            approved: true,
            date: '2026-02-09',
            notes: 'تمت الموافقة المالية'
        },
        parentNotes: ''
    },
    {
        id: 'REQ-2026-003',
        parentName: 'سارة العلي',
        phone: '0777321456',
        studentCount: 3,
        financialStatus: 'approved',
        date: '2026-02-12',
        applicationNumber: 'REQ-2026-003',
        status: 'financial_cleared',
        primaryRole: 'mother',
        mother: {
            firstNameAr: 'سارة', lastNameAr: 'العلي',
            firstNameLat: 'Sara', lastNameLat: 'Ali',
            job: 'محامية', phone: '0777321456', email: 'sara@example.com', status: 'alive'
        },
        family: {
            members: 6, status: 'divorced', address: 'القبة، الجزائر'
        },
        students: [
            {
                id: 4, firstName: 'مريم', lastName: 'لعمامرة', firstNameLat: 'Meriem', lastNameLat: 'Lamamra',
                requestedGrade: 'التحضيري', birthday: '2021-01-05', gender: 'أنثى', nationality: 'جزائرية',
                medicalStatus: 'سليم', needsBus: 'نعم', busLine: 'خط القبة', bloodType: 'A-',
                currentGrade: '-', repeater: 'لا', previousSchool: '-',
                term1Result: '-', term2Result: '-', term3Result: '-'
            },
            {
                id: 5, firstName: 'أنس', lastName: 'لعمامرة', firstNameLat: 'Anes', lastNameLat: 'Lamamra',
                requestedGrade: 'السنة الثانية ابتدائي', birthday: '2019-04-12', gender: 'ذكر', nationality: 'جزائرية',
                medicalStatus: 'سليم', needsBus: 'نعم', busLine: 'خط القبة', bloodType: 'AB+',
                currentGrade: 'السنة الأولى ابتدائي', repeater: 'لا', previousSchool: 'مدرسة النور',
                term1Result: '7.5', term2Result: '8.0', term3Result: '-'
            },
            {
                id: 6, firstName: 'ريان', lastName: 'لعمامرة', firstNameLat: 'Rayane', lastNameLat: 'Lamamra',
                requestedGrade: 'السنة الخامسة ابتدائي', birthday: '2016-11-30', gender: 'ذكر', nationality: 'جزائرية',
                medicalStatus: 'سليم', needsBus: 'نعم', busLine: 'خط القبة', bloodType: 'O-',
                currentGrade: 'السنة الرابعة ابتدائي', repeater: 'لا', previousSchool: 'مدرسة النور',
                term1Result: '6.5', term2Result: '7.0', term3Result: '-'
            }
        ],
        meetingInfo: {
            date: '2026-02-08',
            time: '09:30',
            interviewer: 'د. سارة المنصوري',
            notes: 'الأم حريصة على متابعة الأبناء.'
        },
        commissionInfo: {
            decision: 'مقبول',
            date: '2026-02-09',
            notes: 'ملف إداري كامل.'
        },
        financialInfo: {
            approved: true,
            date: '2026-02-11',
            notes: 'تمت الموافقة المالية'
        },
        parentNotes: 'بسبب ظروف الطلاق، الأم هي المسؤول الوحيد.'
    }
];

// --- Helpers ---
const InfoRow = ({ icon: Icon, label, value, color }) => (
    <div className="info-row">
        <div className="label-group">
            {Icon && <Icon size={14} className="icon" style={color ? { color } : {}} />}
            <span className="label">{label}:</span>
        </div>
        <span className="value">{value || '-'}</span>
    </div>
);

const renderAliveStatus = (value, t) => {
    if (!value || value === '-') return '-';
    // Handle both Arabic and English status values
    const isAlive = value.includes('حياة') || value === 'alive' || value === 'على قيد الحياة';
    return (
        <span className={`status-tag ${isAlive ? 'alive' : 'deceased'}`}>
            {isAlive ? t('alive') : t('deceased')}
        </span>
    );
};

const renderGender = (value, t) => {
    if (!value || value === '-') return '-';
    return t ? t(value) : value;
};

// Step indicator component
const RegistrationSteps = ({ currentStatus }) => {
    const { t } = useTranslation();
    const steps = [
        { id: 1, label: t('steps.initial_reg'), description: t('steps.family_info') },
        { id: 2, label: t('steps.interview_committee'), description: t('steps.committee_assessment') },
        { id: 3, label: t('steps.financial_procedures'), description: t('steps.fees_payment') },
        { id: 4, label: t('finalization.title'), description: t('finalization.subtitle').substring(0, 20) + '...' }, // Simplified for step desc
    ];

    // For this page, we are at step 4 or completed all
    return (
        <div className="registration-steps-container">
            {steps.map((step, index) => {
                const isActive = index === 3; // Always step 4 for this page
                const isCompleted = index < 3;

                return (
                    <div key={step.id} className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                        <div className="step-point">
                            {isCompleted ? <Check size={14} /> : <span>{step.id}</span>}
                        </div>
                        <div className="step-content">
                            <span className="step-label">{step.label}</span>
                            <span className="step-desc">{step.description}</span>
                        </div>
                        {index < steps.length - 1 && <div className="step-line"></div>}
                    </div>
                );
            })}
        </div>
    );
};

// Note: I need to redefine helper functions inside component or pass t to them if I want to translate their output (e.g. Alive/Deceased).
// For now, let's just make the main component use t.

export const RegistrationFinalization = () => {
    const { t } = useTranslation();
    const [requests, setRequests] = useState(PLACEHOLDER_DATA);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

    // Table Columns Configuration
    const tableColumns = [
        {
            key: 'parentName',
            label: t('req.guardian_name'),
            visible: true,
            width: 200,
            render: (val) => (
                <div className="dt-cell-name">
                    <div className="dt-avatar" style={{ background: 'var(--color-primary)', color: 'white' }}>
                        <User size={16} />
                    </div>
                    <span>{val}</span>
                </div>
            )
        },
        {
            key: 'phone',
            label: t('phone'),
            visible: true,
            width: 140,
            render: (val) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} style={{ opacity: 0.7 }} />
                    <span dir="ltr">{val}</span>
                </div>
            )
        },
        {
            key: 'studentCount',
            label: t('req.students_count'),
            visible: true,
            width: 120,
            render: (val) => <span className="badge-pill">{val} {t('students')}</span>
        },
        {
            key: 'date',
            label: t('finalization.reg_date'),
            visible: true,
            width: 140
        },
        {
            key: 'financialStatus',
            label: t('finalization.financial_status'),
            visible: true,
            width: 140,
            render: (val, row) => (
                <span className="status-tag success"
                    style={{
                        padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--color-success)'
                    }}>
                    {t('finalization.approved_status')}
                </span>
            )
        },
        {
            key: 'actions',
            label: t('finalization.actions'),
            visible: true,
            width: 140,
            render: (_, row) => (
                <button
                    onClick={(e) => { e.stopPropagation(); openModal(row); }}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.85rem'
                    }}
                >
                    <CheckCircle size={14} /> {t('finalization.process')}
                </button>
            )
        }
    ];

    const openModal = (req) => {
        setSelectedRequest(req);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    const handleFinalize = async () => {
        setActionLoading(true);
        // Simulate API call
        setTimeout(() => {
            setActionLoading(false);
            alert(t('finalization.success_alert'));
            setRequests(requests.filter(r => r.id !== selectedRequest.id));
            closeModal();
        }, 1500);
    };

    return (
        <div className="registration-finalization">
            <div className="page-header">
                <div className="header-content">
                    <h1>{t('finalization.title')}</h1>
                    <p>{t('finalization.subtitle')}</p>
                </div>
            </div>

            {/* Main Panel Layout */}
            <div className="finalization-panel">
                <div className="panel-header">
                    <div className="header-title">
                        <CheckCircle size={20} />
                        <h3>{t('finalization.ready_requests')}</h3>
                        <span className="count-badge">{requests.length} {t('requests')}</span>
                    </div>

                    <div className="view-mode-switcher" style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '8px' }}>
                        <button
                            onClick={() => setViewMode('cards')}
                            style={{
                                padding: '6px',
                                border: 'none',
                                borderRadius: '6px',
                                background: viewMode === 'cards' ? 'var(--cards-color)' : 'transparent',
                                color: viewMode === 'cards' ? 'var(--color-primary)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                display: 'flex',
                                boxShadow: viewMode === 'cards' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                            }}
                            title="عرض البطاقات"
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            style={{
                                padding: '6px',
                                border: 'none',
                                borderRadius: '6px',
                                background: viewMode === 'table' ? 'var(--cards-color)' : 'transparent',
                                color: viewMode === 'table' ? 'var(--color-primary)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                display: 'flex',
                                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                            }}
                            title={t('finalization.view_table')}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                <div className="panel-body">
                    {requests.length > 0 ? (
                        <div className="requests-container">
                            {viewMode === 'cards' ? (
                                <div className="requests-grid">
                                    {requests.map(req => (
                                        <div key={req.id} className="request-card" onClick={() => openModal(req)}>
                                            <div className="card-top">
                                                <div className="parent-avatar">
                                                    <User size={20} />
                                                </div>
                                                <div className="parent-info">
                                                    <h4>{req.parentName}</h4>
                                                    <span className="role-badge">{req.studentCount} {t('students')}</span>
                                                </div>
                                                <div className="status-indicator">
                                                    <span className="dot green" title={t('finalization.approved_status')}></span>
                                                </div>
                                            </div>

                                            <div className="card-middle">
                                                <div className="detail-item">
                                                    <Calendar size={14} />
                                                    <span>{req.date}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="fin-approved"><CheckCircle size={14} /> {t('finalization.file_ready')}</span>
                                                </div>
                                            </div>

                                            <div className="card-footer">
                                                <button className="view-btn">
                                                    {t('finalization.process_file')}
                                                    <CheckCircle size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <DataTable
                                    data={requests}
                                    columns={tableColumns}
                                    defaultColumns={tableColumns}
                                    loading={false}
                                    onRowClick={openModal}
                                    emptyTitle="لا توجد طلبات"
                                    emptyMessage="جميع الطلبات تمت معالجتها"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <CheckCircle size={48} />
                            <h3>{t('finalization.no_pending_requests')}</h3>
                            <p>{t('finalization.all_processed_msg')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detailed Modal */}
            {isModalOpen && selectedRequest && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="finalization-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="header-left">
                                <FileText size={20} />
                                <div className="text">
                                    <h3>{t('finalization.final_approval_title')}</h3>
                                    <span>{t('finalization.file_number')}: {selectedRequest.applicationNumber}</span>
                                </div>
                            </div>
                            <button className="close-btn" onClick={closeModal}><X size={20} /></button>
                        </div>

                        <div className="modal-body custom-scrollbar">
                            <RegistrationSteps />

                            <div className="detail-grid">

                                {/* Parent Cards Grid */}
                                <div className="parents-section">
                                    <div className="section-title">
                                        <Users size={18} />
                                        {t('steps.family_info')}
                                    </div>
                                    <div className="cards-grid">
                                        {/* Father Card */}
                                        {selectedRequest.father?.firstNameAr && (
                                            <div className={`info-card ${selectedRequest.primaryRole === 'father' ? 'highlight primary' : ''}`}>
                                                <div className="card-header father">
                                                    <User size={18} />
                                                    <h4>{t('father')}</h4>
                                                    {selectedRequest.primaryRole === 'father' && <span className="primary-badge">{t('req.primary_registrant')}</span>}
                                                    {renderAliveStatus(selectedRequest.father.status, t)}
                                                </div>
                                                <div className="card-content">
                                                    <InfoRow label={t('full_name')} value={`${selectedRequest.father.firstNameAr} ${selectedRequest.father.lastNameAr}`} />
                                                    <InfoRow label={t('full_name_lat')} value={`${selectedRequest.father.firstNameLat} ${selectedRequest.father.lastNameLat}`} />
                                                    <InfoRow icon={Briefcase} label={t('job')} value={selectedRequest.father.job} />
                                                    <InfoRow icon={Phone} label={t('phone')} value={selectedRequest.father.phone} color="#3b82f6" />
                                                    <InfoRow icon={Mail} label={t('email')} value={selectedRequest.father.email} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Mother Card */}
                                        {selectedRequest.mother?.firstNameAr && (
                                            <div className={`info-card ${selectedRequest.primaryRole === 'mother' ? 'highlight primary' : ''}`}>
                                                <div className="card-header mother">
                                                    <User size={18} />
                                                    <h4>{t('mother')}</h4>
                                                    {selectedRequest.primaryRole === 'mother' && <span className="primary-badge">{t('req.primary_registrant')}</span>}
                                                    {renderAliveStatus(selectedRequest.mother.status, t)}
                                                </div>
                                                <div className="card-content">
                                                    <InfoRow label={t('full_name')} value={`${selectedRequest.mother.firstNameAr} ${selectedRequest.mother.lastNameAr}`} />
                                                    <InfoRow label={t('full_name_lat')} value={`${selectedRequest.mother.firstNameLat} ${selectedRequest.mother.lastNameLat}`} />
                                                    <InfoRow icon={Briefcase} label={t('job')} value={selectedRequest.mother.job} />
                                                    <InfoRow icon={Phone} label={t('phone')} value={selectedRequest.mother.phone} color="#ef4444" />
                                                    <InfoRow icon={Mail} label={t('email')} value={selectedRequest.mother.email} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Guardian Card */}
                                        {(selectedRequest.primaryRole === 'guardian' || selectedRequest.guardian?.firstNameAr) && (
                                            <div className={`info-card ${selectedRequest.primaryRole === 'guardian' ? 'highlight primary' : ''}`}>
                                                <div className="card-header guardian">
                                                    <Award size={18} />
                                                    <h4>{selectedRequest.guardian?.relation === 'other' ? t('other_guardian') : t('legal_guardian')}</h4>
                                                    {selectedRequest.primaryRole === 'guardian' && <span className="primary-badge">{t('req.primary_registrant')}</span>}

                                                </div>
                                                <div className="card-content">
                                                    <InfoRow label={t('full_name')} value={`${selectedRequest.guardian?.firstNameAr} ${selectedRequest.guardian?.lastNameAr}`} />
                                                    <InfoRow icon={Briefcase} label={t('job')} value={selectedRequest.guardian?.job} />
                                                    <InfoRow icon={Phone} label={t('phone')} value={selectedRequest.guardian?.phone} color="#8b5cf6" />
                                                </div>
                                            </div>
                                        )}


                                        {/* Family Info */}
                                        <div className="info-card">
                                            <div className="card-header family">
                                                <Home size={18} />
                                                <h4>{t('req.family_info')}</h4>
                                            </div>
                                            <div className="card-content">
                                                <InfoRow label={t('req.family_members')} value={selectedRequest.family.members} />
                                                <InfoRow label={t('req.marital_status')} value={selectedRequest.family.status === 'married' ? t('commissions.married') : t('commissions.divorced')} />
                                                <InfoRow icon={MapPin} label={t('address')} value={selectedRequest.family.address} color="#f59e0b" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Students Section */}
                                <div className="students-section">
                                    <div className="section-title">
                                        <Users size={18} />
                                        {t('req.registered_students')} ({selectedRequest.students.length})
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
                                                            <h6>{t('req.personal_info')}</h6>
                                                            <InfoRow icon={Calendar} label={t('req.dob')} value={student.birthday} />
                                                            <InfoRow icon={MapPin} label={t('req.pob')} value={t('algiers')} />
                                                            <InfoRow label={t('gender')} value={renderGender(student.gender, t)} />
                                                            <InfoRow label={t('nationality')} value={student.nationality} />
                                                        </div>
                                                        <div className="st-column">
                                                            <h6>{t('req.academic_path')}</h6>
                                                            <InfoRow label={t('req.current_level')} value={student.currentGrade} />
                                                            <InfoRow label={t('req.is_repeater')} value={student.repeater} />
                                                            <InfoRow label={t('req.prev_school')} value={student.previousSchool} />
                                                            <div className="results-row">
                                                                <span>{t('req.results')}:</span>
                                                                <div className="results">
                                                                    <span className="res">{t('term_1')}: {student.term1Result}</span>
                                                                    <span className="res">{t('term_2')}: {student.term2Result}</span>
                                                                    <span className="res">{t('term_3')}: {student.term3Result}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="st-column">
                                                            <h6>{t('req.health_transport')}</h6>
                                                            <InfoRow icon={Activity} label={t('req.medical_status')} value={student.medicalStatus} color="#ef4444" />
                                                            <InfoRow icon={Truck} label={t('req.school_bus')} value={student.needsBus === 'نعم' ? `نعم (${student.busLine})` : 'لا'} color="#3b82f6" />
                                                            <InfoRow label={t('req.blood_type')} value={student.bloodType} />
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

                                {/* Meeting & Commission & Financial */}
                                <div className="detail-section two-col">
                                    <div className="column">
                                        <div className="section-title">
                                            <Clock size={18} /> {t('finalization.interview_details')}
                                        </div>
                                        <div className="info-box blue">
                                            <InfoRow label={t('finalization.interview_date')} value={selectedRequest.meetingInfo.date} />
                                            <InfoRow label={t('finalization.interviewer')} value={selectedRequest.meetingInfo.interviewer} />
                                            <div className="notes-block">
                                                <strong>{t('notes')}:</strong> {selectedRequest.meetingInfo.notes}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column">
                                        <div className="section-title">
                                            <Award size={18} /> {t('finalization.commission_decision')}
                                        </div>
                                        <div className="info-box purple">
                                            <div className="decision-row">
                                                <span className="label">{t('finalization.decision')}:</span>
                                                <span className="decision-tag approved">{selectedRequest.commissionInfo.decision}</span>
                                            </div>
                                            <div className="notes-block">
                                                <strong>{t('finalization.recommendations')}:</strong> {selectedRequest.commissionInfo.notes}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <div className="section-title">
                                        <DollarSign size={18} /> {t('finalization.financial_file')}
                                    </div>
                                    <div className="info-box green">
                                        <div className="fin-grid">
                                            <div className="approval-status" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-success)' }}>
                                                <CheckCircle size={24} />
                                                {t('finalization.financial_approved')}
                                            </div>
                                            <InfoRow label={t('finalization.approval_date')} value={selectedRequest.financialInfo.date} />
                                        </div>
                                        {selectedRequest.financialInfo.notes && (
                                            <div className="notes-block mt-2">
                                                <strong>{t('finalization.accountant_notes')}:</strong> {selectedRequest.financialInfo.notes}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedRequest.parentNotes && (
                                    <div className="detail-section">
                                        <div className="section-title">
                                            <AlertCircle size={18} /> طلبات إضافية من الولي
                                        </div>
                                        <div className="info-box orange">
                                            {selectedRequest.parentNotes}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className="footer-note">
                                <Info size={14} />
                                <span>{t('finalization.finalize_hint')}</span>
                            </div>
                            <div className="footer-actions">
                                <button className="cancel-btn" onClick={closeModal}>{t('finalization.cancel_btn')}</button>
                                <button className="finalize-btn" onClick={handleFinalize} disabled={actionLoading}>
                                    {actionLoading ? t('finalization.processing') : t('finalization.finalize_btn')}
                                    <CheckCircle size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
