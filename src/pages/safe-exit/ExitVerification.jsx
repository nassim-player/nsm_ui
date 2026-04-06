import React, { useState, useRef } from 'react';
import {
    Search, Shield, User, Phone, CreditCard,
    CheckCircle, Maximize, AlertTriangle, ChevronDown,
    UserCheck, X, Lock, Camera
} from 'react-feather';
import { useTranslation } from '../../context/LanguageContext';
import './ExitVerification.scss';

// ─── Mock Student Roster ──────────────────────────────────────────────────────

const STUDENT_ROSTER = [
    {
        id: 'STU-001',
        name: 'آدم بن عمر',
        class: 'الفصل 4ب',
        photo: null,
        avatar: 'آ',
        avatarColor: '#8b5cf6',
        primaryGuardian: {
            name: 'فريدة بن عمر',
            relation: 'الأم',
            phone: '0550-123-456',
            nationalId: '99 12345678 901',
            photo: null,
            avatar: 'ف',
            avatarColor: '#8b5cf6',
        },
        proxies: [
            { id: 'px-1', name: 'يوسف بن عمر', relation: 'العم', phone: '0661-111-222', nationalId: '85 98765432 100', photo: null, avatar: 'ي', avatarColor: '#3b82f6' },
            { id: 'px-2', name: 'حميد الشوفالي (السائق)', relation: 'سائق مرخص', phone: '0771-333-444', nationalId: '72 11223344 200', photo: null, avatar: 'ح', avatarColor: '#10b981' },
        ],
    },
    {
        id: 'STU-002',
        name: 'ياسمين مصطفى',
        class: 'الفصل 2أ',
        photo: null,
        avatar: 'ي',
        avatarColor: '#10b981',
        primaryGuardian: {
            name: 'كريم مصطفى',
            relation: 'الأب',
            phone: '0661-789-012',
            nationalId: '88 55667788 300',
            photo: null,
            avatar: 'ك',
            avatarColor: '#10b981',
        },
        proxies: [
            { id: 'px-3', name: 'سوسن مصطفى', relation: 'العمة', phone: '0550-555-666', nationalId: '90 44556677 400', photo: null, avatar: 'س', avatarColor: '#f59e0b' },
        ],
    },
    {
        id: 'STU-003',
        name: 'بلال مصطفى',
        class: 'الفصل 5ج',
        photo: null,
        avatar: 'ب',
        avatarColor: '#6366f1',
        primaryGuardian: {
            name: 'كريم مصطفى',
            relation: 'الأب',
            phone: '0661-789-012',
            nationalId: '88 55667788 300',
            photo: null,
            avatar: 'ك',
            avatarColor: '#10b981',
        },
        proxies: [
            { id: 'px-4', name: 'نادية حسن', relation: 'الجدة', phone: '0550-777-888', nationalId: '65 99887766 500', photo: null, avatar: 'ن', avatarColor: '#ef4444' },
        ],
    },
    {
        id: 'STU-004',
        name: 'لينا لعمري',
        class: 'الفصل 1ج',
        photo: null,
        avatar: 'ل',
        avatarColor: '#f59e0b',
        primaryGuardian: {
            name: 'سميرة لعمري',
            relation: 'الأم',
            phone: '0770-345-678',
            nationalId: '92 12398765 600',
            photo: null,
            avatar: 'س',
            avatarColor: '#f59e0b',
        },
        proxies: [],
    },
    {
        id: 'STU-005',
        name: 'حمزة الغزالي',
        class: 'الفصل 3أ',
        photo: null,
        avatar: 'ح',
        avatarColor: '#ef4444',
        primaryGuardian: {
            name: 'محمد الغزالي',
            relation: 'الأب',
            phone: '0555-901-234',
            nationalId: '80 11122233 700',
            photo: null,
            avatar: 'م',
            avatarColor: '#ef4444',
        },
        proxies: [
            { id: 'px-5', name: 'رضا الغزالي', relation: 'الأخ الأكبر', phone: '0661-222-333', nationalId: '05 33344455 800', photo: null, avatar: 'ر', avatarColor: '#3b82f6' },
        ],
    },
];

// ─── Person Card (guardian / proxy) ──────────────────────────────────────────

const PersonCard = ({ person, isSelected, onSelect, isPrimary = false }) => {
    const { t } = useTranslation();
    return (
        <div
            className={`person-card ${isSelected ? 'person-card--selected' : ''} ${isPrimary ? 'person-card--primary' : ''}`}
            onClick={() => onSelect(person)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onSelect(person)}
        >
            {isSelected && <div className="person-card__selected-tick"><CheckCircle size={14} /></div>}

            <div className="person-card__avatar" style={{ background: person.avatarColor }}>
                {person.photo ? <img src={person.photo} alt={person.name} /> : person.avatar}
            </div>

            <div className="person-card__info">
                <span className="person-card__name">{person.name}</span>
                <span className="person-card__relation">{person.relation}</span>
            </div>

            <div className="person-card__details">
                <div className="person-card__detail">
                    <Phone size={12} />
                    <span dir="ltr">{person.phone}</span>
                </div>
                <div className="person-card__detail person-card__detail--id">
                    <CreditCard size={12} />
                    <span className="id-number">{person.nationalId}</span>
                </div>
            </div>

            {isPrimary && <div className="person-card__primary-tag">{t('safe_exit.primary_guardian') || 'ولي أمر رئيسي'}</div>}
        </div>
    )
};

// ─── Authorization Panel ──────────────────────────────────────────────────────

const AuthorizationPanel = ({ student, onConfirm, onClose }) => {
    const { t } = useTranslation();
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [confirmed, setConfirmed] = useState(false);

    const allPersons = [student.primaryGuardian, ...student.proxies];

    const handleConfirm = () => {
        if (!selectedPerson) return;
        setConfirmed(true);
        setTimeout(() => onConfirm(student, selectedPerson), 1500);
    };

    if (confirmed) {
        return (
            <div className="auth-panel auth-panel--confirmed">
                <div className="auth-panel__confirmed-icon">
                    <CheckCircle size={48} color="#10b981" />
                </div>
                <h2>{t('safe_exit.confirmed_success') || 'تم التأكيد بنجاح'}</h2>
                <p>
                    {t('safe_exit.handed_over') || 'تم تسليم'} <strong>{student.name}</strong> {t('safe_exit.to') || 'إلى'} <strong>{selectedPerson.name}</strong>
                </p>
                <div className="auth-panel__confirmed-id">
                    <CreditCard size={14} />
                    <span>{t('safe_exit.id_number') || 'رقم الهوية'}: {selectedPerson.nationalId}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-panel">
            {/* Student Header */}
            <div className="auth-panel__student-header">
                <div className="auth-panel__student-avatar" style={{ background: student.avatarColor }}>
                    {student.photo ? <img src={student.photo} alt={student.name} /> : student.avatar}
                </div>
                <div className="auth-panel__student-info">
                    <h2>{student.name}</h2>
                    <p>
                        <span className="tag-class">{student.class}</span>
                        <span className="tag-id">{student.id}</span>
                    </p>
                </div>
                <button className="auth-panel__close" onClick={onClose} aria-label="إغلاق">
                    <X size={20} />
                </button>
            </div>

            {/* Authorization List */}
            <div className="auth-panel__body">
                <div className="auth-section">
                    <div className="auth-section__title">
                        <Shield size={15} />
                        <span>{t('safe_exit.primary_guardian') || 'ولي الأمر الأساسي'}</span>
                    </div>
                    <PersonCard
                        person={student.primaryGuardian}
                        isSelected={selectedPerson?.name === student.primaryGuardian.name}
                        onSelect={setSelectedPerson}
                        isPrimary
                    />
                </div>

                {student.proxies.length > 0 && (
                    <div className="auth-section">
                        <div className="auth-section__title">
                            <User size={15} />
                            <span>{t('safe_exit.authorized_persons') || 'الأشخاص المرخص لهم'} ({student.proxies.length})</span>
                        </div>
                        <div className="proxy-list">
                            {student.proxies.map(proxy => (
                                <PersonCard
                                    key={proxy.id}
                                    person={proxy}
                                    isSelected={selectedPerson?.id === proxy.id}
                                    onSelect={setSelectedPerson}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Action Bar */}
            <div className="auth-panel__footer">
                {selectedPerson ? (
                    <div className="auth-selection-preview">
                        <div className="selection-avatar" style={{ background: selectedPerson.avatarColor }}>
                            {selectedPerson.avatar}
                        </div>
                        <div className="selection-info">
                            <span className="selection-name">{selectedPerson.name}</span>
                            <span className="selection-id">
                                <CreditCard size={11} /> {selectedPerson.nationalId}
                            </span>
                        </div>
                    </div>
                ) : (
                    <p className="auth-select-hint">
                        <AlertTriangle size={14} />
                        {t('safe_exit.select_pickup_person') || 'الرجاء تحديد الشخص الذي سيستلم التلميذ'}
                    </p>
                )}
                <button
                    className={`btn-confirm-pickup ${selectedPerson ? 'btn-confirm-pickup--ready' : ''}`}
                    onClick={handleConfirm}
                    disabled={!selectedPerson}
                >
                    <UserCheck size={16} />
                    {t('safe_exit.confirm_pickup_btn') || 'تأكيد الاستلام'}
                </button>
            </div>
        </div>
    );
};

// ─── QR / ID Scan Mock ───────────────────────────────────────────────────────

const ScanPlaceholder = ({ onScanResult }) => {
    const { t } = useTranslation();
    const [scanning, setScanning] = useState(false);

    const simulateScan = () => {
        setScanning(true);
        setTimeout(() => {
            setScanning(false);
            onScanResult(STUDENT_ROSTER[0]);
        }, 2000);
    };

    return (
        <div className="scan-placeholder" onClick={simulateScan}>
            <div className={`scan-frame ${scanning ? 'scan-frame--active' : ''}`}>
                <div className="scan-corner scan-corner--tl" />
                <div className="scan-corner scan-corner--tr" />
                <div className="scan-corner scan-corner--bl" />
                <div className="scan-corner scan-corner--br" />
                {scanning && <div className="scan-line" />}
                <div className="scan-icon">
                    {scanning ? <Loader size={32} className="spin" /> : <Maximize size={32} />}
                </div>
            </div>
            <p>{scanning ? (t('safe_exit.scanning') || 'جارٍ المسح...') : (t('safe_exit.click_to_scan') || 'انقر لمحاكاة مسح QR / الهوية')}</p>
        </div>
    );
};

// Fake Loader icon (reuse from Feather)
const Loader = ({ size, className }) => (
    <div style={{ width: size, height: size }} className={className}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
        </svg>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const ExitVerification = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [completedPickups, setCompletedPickups] = useState([]);

    const filteredStudents = STUDENT_ROSTER.filter(s =>
        s.name.includes(searchQuery) || s.id.includes(searchQuery) || s.class.includes(searchQuery)
    );

    const handleScanResult = (student) => {
        setSelectedStudent(student);
    };

    const handleConfirmPickup = (student, person) => {
        const record = {
            id: `pickup-${Date.now()}`,
            studentName: student.name,
            studentId: student.id,
            personName: person.name,
            personId: person.nationalId,
            timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            relation: person.relation,
        };
        setCompletedPickups(prev => [record, ...prev]);
        setTimeout(() => setSelectedStudent(null), 2000);
    };

    return (
        <div className="exit-verification fade-in">
            {/* Header */}
            <div className="exit-verification__header">
                <div className="exit-verification__title-group">
                    <div className="ev-title-icon">
                        <Shield size={20} />
                    </div>
                    <div>
                        <h1>{t('safe_exit.verify_point') || 'نقطة التحقق الفوري'}</h1>
                        <p>{t('safe_exit.verify_desc') || 'تحقق من هوية ولي الأمر قبل التأكيد على تسليم التلميذ'}</p>
                    </div>
                </div>
            </div>

            <div className="exit-verification__body">
                {/* Left Column: Search + Scan */}
                <div className="ev-left-col">
                    {/* Student Search */}
                    <div className="ev-card">
                        <div className="ev-card__title">
                            <Search size={16} />
                            <span>{t('safe_exit.search_roster') || 'البحث في قائمة الطلاب'}</span>
                        </div>
                        <div className="ev-search-wrap">
                            <Search size={16} className="ev-search-icon" />
                            <input
                                className="ev-search-input"
                                placeholder={t('safe_exit.search_placeholder') || 'اسم الطالب، رقمه، أو الفصل...'}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="ev-search-clear" onClick={() => setSearchQuery('')}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        <div className="student-roster">
                            {filteredStudents.length === 0 ? (
                                <div className="roster-empty">{t('safe_exit.no_results') || 'لا توجد نتائج'}</div>
                            ) : (
                                filteredStudents.map(student => (
                                    <div
                                        key={student.id}
                                        className={`roster-item ${selectedStudent?.id === student.id ? 'roster-item--active' : ''}`}
                                        onClick={() => setSelectedStudent(student)}
                                    >
                                        <div className="roster-item__avatar" style={{ background: student.avatarColor }}>
                                            {student.avatar}
                                        </div>
                                        <div className="roster-item__info">
                                            <span className="roster-item__name">{student.name}</span>
                                            <span className="roster-item__class">{student.class}</span>
                                        </div>
                                        <div className="roster-item__id">{student.id}</div>
                                        <ChevronDown size={16} className="roster-item__arrow" style={{ transform: 'rotate(-90deg)' }} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* QR / ID Scan */}
                    <div className="ev-card">
                        <div className="ev-card__title">
                            <Maximize size={16} />
                            <span>{t('safe_exit.immediate_scan') || 'المسح الفوري (QR / الهوية)'}</span>
                        </div>
                        <ScanPlaceholder onScanResult={handleScanResult} />
                    </div>

                    {/* Completed today */}
                    {completedPickups.length > 0 && (
                        <div className="ev-card">
                            <div className="ev-card__title">
                                <CheckCircle size={16} />
                                <span>{t('safe_exit.completed_today') || 'مكتمل اليوم'} ({completedPickups.length})</span>
                            </div>
                            <div className="completed-list">
                                {completedPickups.map(rec => (
                                    <div className="completed-item" key={rec.id}>
                                        <div className="completed-item__check">
                                            <CheckCircle size={14} color="#10b981" />
                                        </div>
                                        <div className="completed-item__info">
                                            <span className="completed-item__student">{rec.studentName}</span>
                                            <span className="completed-item__person">
                                                {rec.personName} ({rec.relation})
                                            </span>
                                        </div>
                                        <div className="completed-item__time">{rec.timestamp}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Auth Panel */}
                <div className="ev-right-col">
                    {selectedStudent ? (
                        <AuthorizationPanel
                            student={selectedStudent}
                            onConfirm={handleConfirmPickup}
                            onClose={() => setSelectedStudent(null)}
                        />
                    ) : (
                        <div className="ev-empty-panel">
                            <div className="ev-empty-panel__icon">
                                <Shield size={52} />
                            </div>
                            <h3>{t('safe_exit.no_student_selected') || 'لم يتم تحديد طالب'}</h3>
                            <p>{t('safe_exit.select_student_desc') || 'امسح رمز QR أو ابحث عن الطالب في القائمة لعرض لوحة التفويض والتحقق من هوية ولي الأمر.'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
