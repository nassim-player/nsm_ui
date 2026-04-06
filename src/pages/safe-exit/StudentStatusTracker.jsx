import React, { useState, useMemo } from 'react';
import {
    Users, Truck, Clock, Home, CheckCircle, AlertTriangle,
    Search, Filter, X, ChevronDown, Download, RefreshCw,
    MapPin, User, BookOpen
} from 'react-feather';
import { useTranslation } from '../../context/LanguageContext';
import './StudentStatusTracker.scss';

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUSES = [
    {
        key: 'in_building',
        icon: Home,
        colorVar: 'primary',
        dotColor: '#3b82f6',
        bg: 'rgba(59,130,246,0.1)',
        border: 'rgba(59,130,246,0.25)',
    },
    {
        key: 'waiting',
        icon: Clock,
        colorVar: 'warning',
        dotColor: '#f59e0b',
        bg: 'rgba(245,158,11,0.1)',
        border: 'rgba(245,158,11,0.25)',
    },
    {
        key: 'in_transport',
        icon: Truck,
        colorVar: 'secondary',
        dotColor: '#8b5cf6',
        bg: 'rgba(139,92,246,0.1)',
        border: 'rgba(139,92,246,0.25)',
    },
    {
        key: 'left',
        icon: CheckCircle,
        colorVar: 'success',
        dotColor: '#10b981',
        bg: 'rgba(16,185,129,0.1)',
        border: 'rgba(16,185,129,0.25)',
    },
    {
        key: 'missing',
        icon: AlertTriangle,
        colorVar: 'error',
        dotColor: '#ef4444',
        bg: 'rgba(239,68,68,0.1)',
        border: 'rgba(239,68,68,0.25)',
    },
];

const STATUS_MAP = Object.fromEntries(STATUSES.map(s => [s.key, s]));

// ─── Mock student data ──────────────────────────────────────────────────────────
const MOCK_STUDENTS = [
    { id: 's001', name: 'آدم بن عمر', class: '4ب', level: 'middle', transport: true, guardian: 'فريدة بن عمر', phone: '0550-123-456', status: 'waiting', location: 'قاعة الانتظار', updatedAt: '13:40' },
    { id: 's002', name: 'ياسمين مصطفى', class: '2أ', level: 'primary', transport: false, guardian: 'كريم مصطفى', phone: '0661-789-012', status: 'left', location: 'المدخل الرئيسي', updatedAt: '13:38' },
    { id: 's003', name: 'بلال مصطفى', class: '5ج', level: 'primary', transport: false, guardian: 'كريم مصطفى', phone: '0661-789-012', status: 'waiting', location: 'قاعة الانتظار', updatedAt: '13:38' },
    { id: 's004', name: 'لينا لعمري', class: '1ج', level: 'primary', transport: true, guardian: 'سميرة لعمري', phone: '0770-345-678', status: 'in_transport', location: 'الحافلة 3', updatedAt: '13:25' },
    { id: 's005', name: 'حمزة الغزالي', class: '3أ', level: 'middle', transport: false, guardian: 'محمد الغزالي', phone: '0555-901-234', status: 'waiting', location: 'قاعة الانتظار', updatedAt: '13:42' },
    { id: 's006', name: 'نور بن صالح', class: '3ب', level: 'middle', transport: false, guardian: 'أحمد بن صالح', phone: '0661-000-111', status: 'in_building', location: 'الفصل 3ب', updatedAt: '13:00' },
    { id: 's007', name: 'ريم بوزيد', class: '2ب', level: 'primary', transport: true, guardian: 'سامي بوزيد', phone: '0770-222-333', status: 'in_transport', location: 'الحافلة 1', updatedAt: '13:20' },
    { id: 's008', name: 'عمر حداد', class: '4أ', level: 'middle', transport: false, guardian: 'زينة حداد', phone: '0550-444-555', status: 'in_building', location: 'الفصل 4أ', updatedAt: '13:00' },
    { id: 's009', name: 'سلمى قشي', class: '1أ', level: 'primary', transport: false, guardian: 'ليلى قشي', phone: '0660-666-777', status: 'missing', location: '—', updatedAt: '—' },
    { id: 's010', name: 'مالك بن خالد', class: '5أ', level: 'primary', transport: true, guardian: 'عبد الله بن خالد', phone: '0770-888-999', status: 'in_transport', location: 'الحافلة 2', updatedAt: '13:22' },
    { id: 's011', name: 'إيمان رايس', class: '2ج', level: 'primary', transport: false, guardian: 'حسان رايس', phone: '0550-100-200', status: 'left', location: 'المدخل الرئيسي', updatedAt: '13:35' },
    { id: 's012', name: 'يوسف مزياني', class: '3ج', level: 'middle', transport: false, guardian: 'نوال مزياني', phone: '0661-300-400', status: 'in_building', location: 'الفصل 3ج', updatedAt: '13:00' },
    { id: 's013', name: 'أميرة بلقاضي', class: '1ب', level: 'primary', transport: true, guardian: 'ناصر بلقاضي', phone: '0550-500-600', status: 'in_transport', location: 'الحافلة 1', updatedAt: '13:20' },
    { id: 's014', name: 'طارق زروال', class: '4ج', level: 'middle', transport: false, guardian: 'فاطمة زروال', phone: '0770-700-800', status: 'left', location: 'المدخل الرئيسي', updatedAt: '13:50' },
    { id: 's015', name: 'حفصة بن عيسى', class: '5ب', level: 'primary', transport: false, guardian: 'رابح بن عيسى', phone: '0661-900-010', status: 'missing', location: '—', updatedAt: '—' },
    { id: 's016', name: 'إدريس معلوف', class: '2أ', level: 'primary', transport: true, guardian: 'نادية معلوف', phone: '0550-020-030', status: 'left', location: 'المدخل الرئيسي', updatedAt: '13:30' },
    { id: 's017', name: 'خديجة بن ناصر', class: '3أ', level: 'middle', transport: false, guardian: 'أمال بن ناصر', phone: '0770-040-050', status: 'in_building', location: 'الفصل 3أ', updatedAt: '13:00' },
    { id: 's018', name: 'زيد بوعلام', class: '1ج', level: 'primary', transport: true, guardian: 'وفاء بوعلام', phone: '0661-060-070', status: 'in_transport', location: 'الحافلة 3', updatedAt: '13:25' },
];

const CLASSES = [...new Set(MOCK_STUDENTS.map(s => s.class))].sort();
const LEVELS = ['primary', 'middle'];

// ─── Status Badge ───────────────────────────────────────────────────────────────
const StatusBadge = ({ statusKey }) => {
    const { t } = useTranslation();
    const cfg = STATUS_MAP[statusKey];
    if (!cfg) return null;
    const Icon = cfg.icon;
    return (
        <span
            className="student-status-badge"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.dotColor }}
        >
            <Icon size={12} />
            {t(`safe_exit.status_${statusKey}`)}
        </span>
    );
};

// ─── Summary Card ───────────────────────────────────────────────────────────────
const SummaryCard = ({ status, count, isActive, onClick }) => {
    const { t } = useTranslation();
    const cfg = STATUS_MAP[status];
    const Icon = cfg.icon;
    return (
        <button
            className={`tracker-summary-card ${isActive ? 'active' : ''} color-${cfg.colorVar}`}
            onClick={onClick}
            style={isActive ? { borderColor: cfg.dotColor, background: cfg.bg } : {}}
        >
            <div className="summary-icon" style={{ background: cfg.bg, color: cfg.dotColor }}>
                <Icon size={20} />
            </div>
            <div className="summary-body">
                <span className="summary-count" style={{ color: cfg.dotColor }}>{count}</span>
                <span className="summary-label">{t(`safe_exit.status_${status}`)}</span>
            </div>
            {isActive && <span className="summary-active-dot" style={{ background: cfg.dotColor }} />}
        </button>
    );
};

// ─── Row Detail Drawer ──────────────────────────────────────────────────────────
const RowDrawer = ({ student, onClose, onStatusChange }) => {
    const { t } = useTranslation();
    if (!student) return null;
    return (
        <div className="row-drawer-overlay" onClick={onClose}>
            <div className="row-drawer" onClick={e => e.stopPropagation()}>
                <div className="drawer-header">
                    <div className="drawer-avatar">
                        {student.name.charAt(0)}
                    </div>
                    <div className="drawer-title-group">
                        <h3>{student.name}</h3>
                        <span className="drawer-class">
                            <BookOpen size={13} />
                            {t('safe_exit.tracker_class')} {student.class}
                        </span>
                    </div>
                    <button className="drawer-close" onClick={onClose}><X size={18} /></button>
                </div>

                <div className="drawer-body">
                    <div className="drawer-info-grid">
                        <div className="drawer-info-item">
                            <span className="info-label"><User size={13} />{t('safe_exit.tracker_guardian')}</span>
                            <span className="info-value">{student.guardian}</span>
                        </div>
                        <div className="drawer-info-item">
                            <span className="info-label"><MapPin size={13} />{t('safe_exit.tracker_location')}</span>
                            <span className="info-value">{student.location}</span>
                        </div>
                        <div className="drawer-info-item">
                            <span className="info-label"><Clock size={13} />{t('safe_exit.tracker_updated')}</span>
                            <span className="info-value">{student.updatedAt !== '—' ? student.updatedAt : '—'}</span>
                        </div>
                        <div className="drawer-info-item">
                            <span className="info-label"><Truck size={13} />{t('safe_exit.tracker_transport')}</span>
                            <span className="info-value">{student.transport ? t('safe_exit.tracker_yes') : t('safe_exit.tracker_no')}</span>
                        </div>
                    </div>

                    <div className="drawer-current-status">
                        <span className="section-mini-title">{t('safe_exit.tracker_current_status')}</span>
                        <StatusBadge statusKey={student.status} />
                    </div>

                    <div className="drawer-status-change">
                        <span className="section-mini-title">{t('safe_exit.tracker_change_status')}</span>
                        <div className="status-change-grid">
                            {STATUSES.map(s => {
                                const Icon = s.icon;
                                const isSelected = s.key === student.status;
                                return (
                                    <button
                                        key={s.key}
                                        className={`status-change-btn ${isSelected ? 'selected' : ''}`}
                                        style={isSelected ? { background: s.bg, borderColor: s.dotColor, color: s.dotColor } : {}}
                                        onClick={() => onStatusChange(student.id, s.key)}
                                    >
                                        <Icon size={14} />
                                        {t(`safe_exit.status_${s.key}`)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ─────────────────────────────────────────────────────────────
export const StudentStatusTracker = () => {
    const { t } = useTranslation();

    const [students, setStudents] = useState(MOCK_STUDENTS);
    const [search, setSearch] = useState('');
    const [activeStatus, setActiveStatus] = useState('all');
    const [activeClass, setActiveClass] = useState('all');
    const [activeLevel, setActiveLevel] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    // Counts per status
    const counts = useMemo(() => {
        const c = { all: students.length };
        STATUSES.forEach(s => { c[s.key] = students.filter(st => st.status === s.key).length; });
        return c;
    }, [students]);

    // Filtered list
    const filtered = useMemo(() => {
        return students.filter(s => {
            const matchStatus = activeStatus === 'all' || s.status === activeStatus;
            const matchClass = activeClass === 'all' || s.class === activeClass;
            const matchLevel = activeLevel === 'all' || s.level === activeLevel;
            const matchSearch = !search || s.name.includes(search) || s.guardian.includes(search) || s.class.includes(search);
            return matchStatus && matchClass && matchLevel && matchSearch;
        });
    }, [students, activeStatus, activeClass, activeLevel, search]);

    const handleStatusChange = (studentId, newStatus) => {
        setStudents(prev => prev.map(s =>
            s.id === studentId
                ? { ...s, status: newStatus, updatedAt: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }) }
                : s
        ));
        setSelectedStudent(prev => prev && prev.id === studentId
            ? { ...prev, status: newStatus }
            : prev
        );
    };

    const handleRefresh = () => setLastRefresh(new Date());

    const clearFilters = () => {
        setActiveStatus('all');
        setActiveClass('all');
        setActiveLevel('all');
        setSearch('');
    };
    const hasActiveFilters = activeStatus !== 'all' || activeClass !== 'all' || activeLevel !== 'all' || search;

    return (
        <div className="student-status-tracker">

            {/* ── Header ── */}
            <div className="tracker-header">
                <div className="tracker-title-group">
                    <div className="tracker-live-dot" />
                    <div>
                        <h1>{t('safe_exit.tracker_title')}</h1>
                        <p>
                            {t('safe_exit.tracker_subtitle')} ·{' '}
                            <span className="refresh-time">
                                {t('safe_exit.last_update')}: {lastRefresh.toLocaleTimeString('ar-DZ')}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="tracker-header-actions">
                    <button className="tracker-btn" onClick={handleRefresh}>
                        <RefreshCw size={15} />
                        {t('safe_exit.refresh')}
                    </button>
                    <button className="tracker-btn" onClick={() => window.print()}>
                        <Download size={15} />
                        {t('safe_exit.tracker_export')}
                    </button>
                </div>
            </div>

            {/* ── Summary Cards ── */}
            <div className="tracker-summary-row">
                {/* "All" card */}
                <button
                    className={`tracker-summary-card all-card ${activeStatus === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveStatus('all')}
                >
                    <div className="summary-icon all-icon">
                        <Users size={20} />
                    </div>
                    <div className="summary-body">
                        <span className="summary-count">{counts.all}</span>
                        <span className="summary-label">{t('safe_exit.tracker_all')}</span>
                    </div>
                    {activeStatus === 'all' && <span className="summary-active-dot" />}
                </button>

                {STATUSES.map(s => (
                    <SummaryCard
                        key={s.key}
                        status={s.key}
                        count={counts[s.key]}
                        isActive={activeStatus === s.key}
                        onClick={() => setActiveStatus(prev => prev === s.key ? 'all' : s.key)}
                    />
                ))}
            </div>

            {/* ── Search & Filters Bar ── */}
            <div className="tracker-controls">
                <div className="tracker-search-wrap">
                    <Search size={16} className="search-icon" />
                    <input
                        className="tracker-search"
                        placeholder={t('safe_exit.tracker_search_placeholder')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button className="search-clear" onClick={() => setSearch('')}>
                            <X size={14} />
                        </button>
                    )}
                </div>

                <button
                    className={`tracker-btn filter-toggle ${showFilters ? 'active' : ''}`}
                    onClick={() => setShowFilters(p => !p)}
                >
                    <Filter size={15} />
                    {t('safe_exit.tracker_filters')}
                    <ChevronDown size={14} className={`chevron ${showFilters ? 'open' : ''}`} />
                </button>

                {hasActiveFilters && (
                    <button className="tracker-btn clear-btn" onClick={clearFilters}>
                        <X size={14} />
                        {t('safe_exit.tracker_clear_filters')}
                    </button>
                )}

                <span className="tracker-count-chip">
                    {filtered.length} / {students.length} {t('safe_exit.tracker_student_label')}
                </span>
            </div>

            {/* ── Expanded Filters ── */}
            {showFilters && (
                <div className="tracker-filter-panel">
                    <div className="filter-group">
                        <label>
                            <BookOpen size={13} />
                            {t('safe_exit.tracker_filter_class')}
                        </label>
                        <div className="filter-pills">
                            <button
                                className={`filter-pill ${activeClass === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveClass('all')}
                            >
                                {t('safe_exit.tracker_all')}
                            </button>
                            {CLASSES.map(cls => (
                                <button
                                    key={cls}
                                    className={`filter-pill ${activeClass === cls ? 'active' : ''}`}
                                    onClick={() => setActiveClass(cls)}
                                >
                                    {t('safe_exit.tracker_class')} {cls}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="filter-group">
                        <label>
                            <Users size={13} />
                            {t('safe_exit.tracker_filter_level')}
                        </label>
                        <div className="filter-pills">
                            <button
                                className={`filter-pill ${activeLevel === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveLevel('all')}
                            >
                                {t('safe_exit.tracker_all')}
                            </button>
                            {LEVELS.map(lv => (
                                <button
                                    key={lv}
                                    className={`filter-pill ${activeLevel === lv ? 'active' : ''}`}
                                    onClick={() => setActiveLevel(lv)}
                                >
                                    {t(`safe_exit.tracker_level_${lv}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Missing Alert Banner ── */}
            {counts.missing > 0 && (
                <div className="missing-alert-banner">
                    <AlertTriangle size={18} />
                    <span>
                        <strong>{counts.missing}</strong> {t('safe_exit.tracker_missing_alert')}
                    </span>
                    <button
                        className="missing-focus-btn"
                        onClick={() => setActiveStatus('missing')}
                    >
                        {t('safe_exit.tracker_show_missing')}
                    </button>
                </div>
            )}

            {/* ── Table ── */}
            <div className="tracker-table-wrap">
                <table className="tracker-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th><User size={13} /> {t('safe_exit.tracker_col_name')}</th>
                            <th><BookOpen size={13} /> {t('safe_exit.tracker_col_class')}</th>
                            <th><Users size={13} /> {t('safe_exit.tracker_col_guardian')}</th>
                            <th><MapPin size={13} /> {t('safe_exit.tracker_col_location')}</th>
                            <th><Truck size={13} /> {t('safe_exit.tracker_col_transport')}</th>
                            <th>{t('safe_exit.tracker_col_status')}</th>
                            <th><Clock size={13} /> {t('safe_exit.tracker_col_updated')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="table-empty">
                                    <Users size={32} />
                                    <p>{t('safe_exit.tracker_no_results')}</p>
                                </td>
                            </tr>
                        ) : (
                            filtered.map((student, idx) => {
                                const cfg = STATUS_MAP[student.status];
                                const isMissing = student.status === 'missing';
                                return (
                                    <tr
                                        key={student.id}
                                        className={`tracker-row ${isMissing ? 'row-missing' : ''}`}
                                        onClick={() => setSelectedStudent(student)}
                                        title={t('safe_exit.tracker_click_details')}
                                    >
                                        <td className="col-idx">{idx + 1}</td>
                                        <td className="col-name">
                                            <div className="student-name-cell">
                                                <div
                                                    className="student-mini-avatar"
                                                    style={{ background: cfg.bg, color: cfg.dotColor }}
                                                >
                                                    {student.name.charAt(0)}
                                                </div>
                                                <span>{student.name}</span>
                                                {isMissing && <AlertTriangle size={13} className="missing-icon" />}
                                            </div>
                                        </td>
                                        <td className="col-class">
                                            <span className="class-chip">
                                                {t('safe_exit.tracker_class')} {student.class}
                                            </span>
                                        </td>
                                        <td className="col-guardian">{student.guardian}</td>
                                        <td className="col-location">
                                            <span className="location-cell">
                                                <MapPin size={12} />
                                                {student.location}
                                            </span>
                                        </td>
                                        <td className="col-transport">
                                            {student.transport ? (
                                                <span className="transport-chip yes">
                                                    <Truck size={12} />
                                                    {t('safe_exit.tracker_yes')}
                                                </span>
                                            ) : (
                                                <span className="transport-chip no">
                                                    {t('safe_exit.tracker_no')}
                                                </span>
                                            )}
                                        </td>
                                        <td className="col-status">
                                            <StatusBadge statusKey={student.status} />
                                        </td>
                                        <td className="col-updated">
                                            <span className={`updated-time ${student.updatedAt === '—' ? 'no-update' : ''}`}>
                                                {student.updatedAt}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Row Detail Drawer ── */}
            {selectedStudent && (
                <RowDrawer
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
};
