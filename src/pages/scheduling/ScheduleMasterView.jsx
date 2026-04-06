import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import {
    Grid, Filter, Download, AlertTriangle, CheckCircle, Zap,
    User, BookOpen, Home, Clock, X, Eye, Users, ChevronDown, Search, Trash2, Save, Edit2, Settings
} from 'react-feather';
import { Modal } from '../../components/common/Modal/Modal';
import './ScheduleMasterView.scss';

/* ─── Static Data ──────────────────────────────────────────── */
const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const TIME_SLOTS = [
    '08:00 - 08:55',
    '09:00 - 09:55',
    '10:10 - 11:05',
    '11:10 - 12:05',
    '13:00 - 13:55',
    '14:00 - 14:55',
];

const CLASSES = [
    { id: '1PA', label: '1 ابتدائي أ', level: 'primary', capacity: 28 },
    { id: '1PB', label: '1 ابتدائي ب', level: 'primary', capacity: 30 },
    { id: '2PA', label: '2 ابتدائي أ', level: 'primary', capacity: 26 },
    { id: '1MA', label: '1 متوسط أ', level: 'middle', capacity: 32 },
    { id: '1MB', label: '1 متوسط ب', level: 'middle', capacity: 30 },
    { id: '2MA', label: '2 متوسط أ', level: 'middle', capacity: 28 },
];

const TEACHERS = [
    { id: 'T1', name: 'محمد علي', subject: 'رياضيات', restDay: 'الخميس', pref: 'صباحي', color: 'primary' },
    { id: 'T2', name: 'فاطمة الزهراء', subject: 'علوم', restDay: null, pref: 'مسائي', color: 'secondary' },
    { id: 'T3', name: 'أحمد منصور', subject: 'لغة عربية', restDay: 'الأحد', pref: 'صباحي', color: 'success' },
    { id: 'T4', name: 'سارة بن عودة', subject: 'تربية إسلامية', restDay: null, pref: 'صباحي', color: 'warning' },
    { id: 'T5', name: 'كريم بوزيد', subject: 'فرنسية', restDay: 'الأربعاء', pref: 'مسائي', color: 'info' },
    { id: 'T6', name: 'نور الدين', subject: 'تاريخ', restDay: null, pref: 'صباحي', color: 'primary' },
];

const SUBJECTS_BY_CLASS = {
    '1PA': ['رياضيات', 'علوم', 'لغة عربية', 'تربية إسلامية', 'فرنسية'],
    '1PB': ['رياضيات', 'علوم', 'لغة عربية', 'تربية إسلامية', 'تاريخ'],
    '2PA': ['رياضيات', 'علوم', 'لغة عربية', 'فرنسية', 'تاريخ'],
    '1MA': ['رياضيات', 'علوم', 'لغة عربية', 'تربية إسلامية', 'فرنسية'],
    '1MB': ['رياضيات', 'علوم', 'تاريخ', 'لغة عربية', 'فرنسية'],
    '2MA': ['رياضيات', 'علوم', 'لغة عربية', 'تربية إسلامية', 'تاريخ'],
};

const ROOMS = [
    { id: 'R01', name: 'قاعة 01', capacity: 32, type: 'class' },
    { id: 'R02', name: 'قاعة 02', capacity: 30, type: 'class' },
    { id: 'R03', name: 'مختبر علوم', capacity: 24, type: 'lab' },
    { id: 'R04', name: 'قاعة 04', capacity: 28, type: 'class' },
];

// Pre-built timetable data: [classId][dayIdx][slotIdx] = session
const subjectColors = {
    'رياضيات': { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.4)', text: '#2563eb', dot: '#3b82f6' },
    'علوم': { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.4)', text: '#059669', dot: '#10b981' },
    'لغة عربية': { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.4)', text: '#7c3aed', dot: '#8b5cf6' },
    'تربية إسلامية': { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.4)', text: '#d97706', dot: '#f59e0b' },
    'فرنسية': { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.4)', text: '#dc2626', dot: '#ef4444' },
    'تاريخ': { bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.4)', text: '#0369a1', dot: '#0ea5e9' },
};

const buildInitialTimetable = () => {
    const tbl = {};
    CLASSES.forEach(cls => {
        tbl[cls.id] = {};
        DAYS.forEach((day, di) => {
            tbl[cls.id][di] = {};
            const subjects = SUBJECTS_BY_CLASS[cls.id] || [];
            TIME_SLOTS.forEach((slot, si) => {
                const subj = subjects[si % subjects.length];
                const teacher = TEACHERS.find(t =>
                    t.subject === subj && t.restDay !== day
                ) || TEACHERS[0];
                tbl[cls.id][di][si] = {
                    id: `${cls.id}-${di}-${si}`,
                    subject: subj,
                    teacher: teacher.name,
                    teacherId: teacher.id,
                    room: ROOMS[si % ROOMS.length].name,
                    roomId: ROOMS[si % ROOMS.length].id,
                    duration: 55,
                };
            });
        });
    });
    // Inject a deliberate conflict: T1 (محمد علي) in 2 classes at same time on Monday slot 0
    tbl['1PA'][1][0].conflict = true;
    tbl['1MB'][1][0].conflict = true;
    tbl['1MB'][1][0].teacher = 'محمد علي';
    tbl['1MB'][1][0].teacherId = 'T1';
    return tbl;
};

const INITIAL_TIMETABLE = buildInitialTimetable();

/* ─── Tooltip Component ─────────────────────────────────────── */
const SlotTooltip = ({ session, cls, day, slotLabel }) => {
    const { t } = useTranslation();
    if (!session) return null;
    const teacher = TEACHERS.find(t => t.name === session.teacher);
    const room = ROOMS.find(r => r.id === session.roomId);
    return (
        <div className="slot-tooltip">
            <div className="tooltip-header">
                <span className="tooltip-subject">{session.subject}</span>
                {session.conflict && (
                    <span className="tooltip-conflict-badge">
                        <AlertTriangle size={11} />
                        {t('scheduling.conflict')}
                    </span>
                )}
            </div>
            <div className="tooltip-row"><User size={12} />{session.teacher}</div>
            <div className="tooltip-row"><Home size={12} />{session.room}</div>
            <div className="tooltip-row"><Clock size={12} />{slotLabel}</div>
            {teacher && (
                <div className="tooltip-prefs">
                    <span className="pref-tag"><Eye size={10} />{t('scheduling.pref_label')}: {teacher.pref}</span>
                    {teacher.restDay && (
                        <span className="pref-tag warn"><CheckCircle size={10} />{t('scheduling.rest_day')}: {teacher.restDay}</span>
                    )}
                </div>
            )}
            {room && (
                <div className="tooltip-room-info">
                    <Home size={10} />
                    {t('scheduling.room_capacity')}: {room.capacity} | {room.type === 'lab' ? t('scheduling.room_lab') : t('scheduling.room_class')}
                </div>
            )}
        </div>
    );
};

/* ─── Session Cell ─────────────────────────────────────────── */
const SessionCell = ({
    session, classId, dayIdx, slotIdx, slotLabel,
    isDragging, isDropLegal, isDropIllegal, isDropTarget,
    onDragStart, onDragEnd, onDrop, onDragOver, onResolutionClick, onSlotClick, isEditMode
}) => {
    const { t } = useTranslation();
    const [hovered, setHovered] = useState(false);

    const colors = session ? subjectColors[session.subject] || subjectColors['رياضيات'] : null;

    const handleDragStart = (e) => {
        if (session && isEditMode) onDragStart(e, session, classId, dayIdx, slotIdx);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (isEditMode) onDrop(e, classId, dayIdx, slotIdx);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (isEditMode) onDragOver(classId, dayIdx, slotIdx);
    };

    let cellClass = 'timetable-cell';
    if (!session) cellClass += ' empty-cell';
    if (session?.conflict) cellClass += ' conflict-cell';
    if (isDropTarget && isDropLegal) cellClass += ' drop-legal';
    if (isDropTarget && isDropIllegal) cellClass += ' drop-illegal';
    if (isDragging) cellClass += ' being-dragged';
    if (isEditMode) cellClass += ' edit-mode-active';

    return (
        <div
            className={cellClass}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {session ? (
                <div
                    className="session-pill"
                    draggable={isEditMode}
                    onDragStart={handleDragStart}
                    onDragEnd={onDragEnd}
                    style={{
                        background: colors.bg,
                        borderColor: colors.border,
                        color: colors.text,
                    }}
                >
                    {session.conflict && (
                        <div className="conflict-pulse-border" />
                    )}
                    <div className="session-dot" style={{ background: colors.dot }} />
                    <div className="session-content">
                        <span className="session-subject">{session.subject}</span>
                        <span className="session-teacher">{session.teacher}</span>
                        <span className="session-room">{session.room}</span>
                    </div>
                    {session.conflict && (
                        <button
                            className="conflict-resolve-btn"
                            onClick={(e) => { e.stopPropagation(); onResolutionClick(classId, dayIdx, slotIdx); }}
                            title={t('scheduling.instant_resolution')}
                        >
                            <Zap size={11} />
                        </button>
                    )}
                    {isEditMode && (
                        <button
                            className="edit-gear-btn"
                            onClick={(e) => { e.stopPropagation(); onSlotClick(classId, dayIdx, slotIdx, session); }}
                            title={t('scheduling.edit_session')}
                        >
                            <Settings size={12} />
                        </button>
                    )}
                    {hovered && (
                        <SlotTooltip
                            session={session}
                            cls={classId}
                            day={DAYS[dayIdx]}
                            slotLabel={slotLabel}
                        />
                    )}
                </div>
            ) : (
                <div
                    className="empty-slot"
                    onClick={(e) => {
                        if (isEditMode) {
                            e.stopPropagation();
                            onSlotClick(classId, dayIdx, slotIdx, session);
                        }
                    }}
                >
                    <span>+</span>
                </div>
            )}
        </div>
    );
};

/* ─── Edit Modal Component ───────────────────────────────────── */
const EditSessionModal = ({ slotData, onClose, onSave, onDelete }) => {
    const { t } = useTranslation();
    const isNew = !slotData.session;

    const classLabel = CLASSES.find(c => c.id === slotData.classId)?.label || slotData.classId;
    const dayLabel = DAYS[slotData.dayIdx];
    const timeLabel = TIME_SLOTS[slotData.slotIdx];

    const [form, setForm] = useState({
        subject: slotData.session?.subject || SUBJECTS_BY_CLASS[slotData.classId]?.[0] || 'رياضيات',
        teacherId: slotData.session?.teacherId || TEACHERS[0].id,
        roomId: slotData.session?.roomId || ROOMS[0].id
    });

    const handleSave = () => {
        const teacher = TEACHERS.find(t => t.id === form.teacherId);
        const room = ROOMS.find(r => r.id === form.roomId);
        onSave({
            id: slotData.session?.id || `${slotData.classId}-${slotData.dayIdx}-${slotData.slotIdx}`,
            subject: form.subject,
            teacher: teacher.name,
            teacherId: teacher.id,
            room: room.name,
            roomId: room.id,
            duration: 55,
            conflict: false, // will re-check outside
        });
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={isNew ? 'إضافة حصة' : 'تعديل حصة'}
            className="edit-session-modal premium-modal"
        >
            <div className="edit-session-body">
                <div className="slot-meta-banner">
                    <div className="meta-item"><BookOpen size={14} /> {classLabel}</div>
                    <div className="meta-item"><Clock size={14} /> {dayLabel} · {timeLabel}</div>
                </div>

                <div className="form-group row">
                    <label>المادة</label>
                    <select
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        className="modal-input"
                    >
                        {SUBJECTS_BY_CLASS[slotData.classId]?.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group row">
                    <label>الأستاذ</label>
                    <select
                        value={form.teacherId}
                        onChange={e => setForm({ ...form, teacherId: e.target.value })}
                        className="modal-input"
                    >
                        {TEACHERS.map(t => (
                            <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                        ))}
                    </select>
                </div>

                <div className="form-group row">
                    <label>القاعة</label>
                    <select
                        value={form.roomId}
                        onChange={e => setForm({ ...form, roomId: e.target.value })}
                        className="modal-input"
                    >
                        {ROOMS.map(r => (
                            <option key={r.id} value={r.id}>{r.name} ({r.capacity})</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="modal-footer premium-footer">
                {!isNew && (
                    <button className="btn btn-danger" onClick={onDelete}>
                        <Trash2 size={16} />
                        حذف الحصة
                    </button>
                )}
                <div style={{ flex: 1 }} />
                <button className="btn btn-secondary" onClick={onClose}>
                    إلغاء
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                    <Save size={16} />
                    حفظ التعديلات
                </button>
            </div>
        </Modal>
    );
};

/* ─── Main Component ────────────────────────────────────────── */
export const ScheduleMasterView = () => {
    const { t } = useTranslation();

    const [timetable, setTimetable] = useState(INITIAL_TIMETABLE);
    const [viewMode, setViewMode] = useState('class'); // class | teacher
    const [selectedStage, setSelectedStage] = useState('all'); // all | primary | middle
    const [selectedClass, setSelectedClass] = useState('1PA');
    const [selectedTeacher, setSelectedTeacher] = useState('T1');
    const [showConflictsOnly, setShowConflictsOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingSlot, setEditingSlot] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Classes filtered by selected stage
    const stageFilteredClasses = useMemo(() => {
        if (selectedStage === 'all') return CLASSES;
        return CLASSES.filter(c => c.level === selectedStage);
    }, [selectedStage]);

    // When stage changes, reset selectedClass to the first of that stage
    const handleStageChange = (newStage) => {
        setSelectedStage(newStage);
        const list = newStage === 'all' ? CLASSES : CLASSES.filter(c => c.level === newStage);
        if (list.length > 0) setSelectedClass(list[0].id);
    };

    // Drag state
    const [dragging, setDragging] = useState(null); // { session, fromClassId, fromDayIdx, fromSlotIdx }
    const [dropTarget, setDropTarget] = useState(null); // { classId, dayIdx, slotIdx }

    // Conflict count
    const conflictCount = useMemo(() => {
        let count = 0;
        Object.values(timetable).forEach(days =>
            Object.values(days).forEach(slots =>
                Object.values(slots).forEach(s => { if (s?.conflict) count++; })
            )
        );
        return count;
    }, [timetable]);

    /* ── Drag & Drop Logic ── */
    const isLegalDrop = useCallback((fromSession, toClassId, toDayIdx, toSlotIdx) => {
        if (!fromSession) return false;
        const teacher = TEACHERS.find(t => t.name === fromSession.teacher);
        const targetDay = DAYS[toDayIdx];
        // Illegal if teacher's rest day
        if (teacher?.restDay === targetDay) return false;
        // Illegal if teacher already has a session at same day+slot in any class
        for (const cls of CLASSES) {
            if (cls.id === toClassId) continue;
            const existing = timetable[cls.id]?.[toDayIdx]?.[toSlotIdx];
            if (existing?.teacherId === fromSession.teacherId) return false;
        }
        return true;
    }, [timetable]);

    const handleDragStart = (e, session, classId, dayIdx, slotIdx) => {
        setDragging({ session, fromClassId: classId, fromDayIdx: dayIdx, fromSlotIdx: slotIdx });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
        setDragging(null);
        setDropTarget(null);
    };

    const handleDragOver = (classId, dayIdx, slotIdx) => {
        setDropTarget({ classId, dayIdx, slotIdx });
    };

    const handleDrop = (e, toClassId, toDayIdx, toSlotIdx) => {
        e.preventDefault();
        if (!dragging) return;
        const { fromClassId, fromDayIdx, fromSlotIdx, session } = dragging;

        if (fromClassId === toClassId && fromDayIdx === toDayIdx && fromSlotIdx === toSlotIdx) {
            setDragging(null);
            setDropTarget(null);
            return;
        }

        const legal = isLegalDrop(session, toClassId, toDayIdx, toSlotIdx);

        setTimetable(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            const displaced = next[toClassId]?.[toDayIdx]?.[toSlotIdx];
            // Move session
            next[toClassId][toDayIdx][toSlotIdx] = {
                ...session,
                id: `${toClassId}-${toDayIdx}-${toSlotIdx}`,
                conflict: !legal,
            };
            // Put displaced in origin
            next[fromClassId][fromDayIdx][fromSlotIdx] = displaced ? {
                ...displaced,
                id: `${fromClassId}-${fromDayIdx}-${fromSlotIdx}`,
                conflict: false,
            } : null;
            return next;
        });

        setDragging(null);
        setDropTarget(null);
    };

    const handleResolutionClick = (classId, dayIdx, slotIdx) => {
        // Find next available slot for this session's teacher
        setTimetable(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            const session = next[classId]?.[dayIdx]?.[slotIdx];
            if (!session) return prev;

            // Find first empty slot where teacher is free
            for (let d = 0; d < DAYS.length; d++) {
                for (let s = 0; s < TIME_SLOTS.length; s++) {
                    if (d === dayIdx && s === slotIdx) continue;
                    const teacher = TEACHERS.find(t => t.name === session.teacher);
                    if (teacher?.restDay === DAYS[d]) continue;
                    const targetSlot = next[classId]?.[d]?.[s];
                    if (!targetSlot) {
                        // Move here
                        next[classId][d][s] = { ...session, id: `${classId}-${d}-${s}`, conflict: false };
                        next[classId][dayIdx][slotIdx] = null;
                        return next;
                    }
                }
            }
            return prev;
        });
    };

    const handleSaveSession = (newSession) => {
        if (!editingSlot) return;
        const { classId, dayIdx, slotIdx } = editingSlot;

        // Re-check legality
        const legal = isLegalDrop(newSession, classId, dayIdx, slotIdx);
        newSession.conflict = !legal;

        setTimetable(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            next[classId][dayIdx][slotIdx] = newSession;
            return next;
        });
        setEditingSlot(null);
    };

    const handleDeleteSession = () => {
        if (!editingSlot) return;
        const { classId, dayIdx, slotIdx } = editingSlot;
        setTimetable(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            next[classId][dayIdx][slotIdx] = null;
            return next;
        });
        setEditingSlot(null);
    };

    /* ── Export PDF stub ── */
    const handleExportPDF = () => {
        window.print();
    };

    /* ── Render Grid ── */
    const currentClasses = viewMode === 'class'
        ? CLASSES.filter(c => c.id === selectedClass)
        : CLASSES;

    const filteredDays = DAYS;

    return (
        <div className="schedule-master-view">

            {/* ── Toolbar ── */}
            <div className="master-toolbar">
                <div className="toolbar-left">
                    <div className="toolbar-title">
                        <Grid size={20} />
                        <div>
                            <h1>{t('scheduling.master_title')}</h1>
                            <p>{t('scheduling.master_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="toolbar-right">
                    {conflictCount > 0 && (
                        <div className="conflict-alert-chip">
                            <AlertTriangle size={14} />
                            <span>{conflictCount} {t('scheduling.conflicts_detected')}</span>
                        </div>
                    )}
                    <button
                        className={`toolbar-btn ${showConflictsOnly ? 'active' : ''}`}
                        onClick={() => setShowConflictsOnly(!showConflictsOnly)}
                    >
                        <Filter size={15} />
                        {t('scheduling.show_conflicts_only')}
                    </button>
                    <button className="toolbar-btn export" onClick={handleExportPDF}>
                        <Download size={15} />
                        {t('scheduling.export_pdf')}
                    </button>
                </div>
            </div>

            {/* ── View Mode Toggle ── */}
            <div className="view-controls">
                <div className="view-toggle">
                    <button
                        className={`toggle-btn ${viewMode === 'class' ? 'active' : ''}`}
                        onClick={() => setViewMode('class')}
                    >
                        <BookOpen size={15} />
                        {t('scheduling.view_class')}
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'teacher' ? 'active' : ''}`}
                        onClick={() => setViewMode('teacher')}
                    >
                        <User size={15} />
                        {t('scheduling.view_teacher')}
                    </button>
                </div>

                {viewMode === 'class' && (
                    <>
                        {/* Stage filter */}
                        <div className="filter-select-wrap">
                            <Users size={15} />
                            <select
                                value={selectedStage}
                                onChange={e => handleStageChange(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">{t('scheduling.stage_all') || 'كل المراحل'}</option>
                                <option value="primary">{t('scheduling.stage_primary') || 'ابتدائي'}</option>
                                <option value="middle">{t('scheduling.stage_middle') || 'متوسط'}</option>
                            </select>
                            <ChevronDown size={14} className="select-arrow" />
                        </div>

                        {/* Class filter */}
                        <div className="filter-select-wrap">
                            <BookOpen size={15} />
                            <select
                                value={selectedClass}
                                onChange={e => setSelectedClass(e.target.value)}
                                className="filter-select"
                            >
                                {stageFilteredClasses.map(c => (
                                    <option key={c.id} value={c.id}>{c.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="select-arrow" />
                        </div>
                    </>
                )}

                {viewMode === 'teacher' && (
                    <div className="filter-select-wrap">
                        <User size={15} />
                        <select
                            value={selectedTeacher}
                            onChange={e => setSelectedTeacher(e.target.value)}
                            className="filter-select"
                        >
                            {TEACHERS.map(t => (
                                <option key={t.id} value={t.id}>{t.name} — {t.subject}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="select-arrow" />
                    </div>
                )}

                {/* Search Bar */}
                <div className="filter-search-wrap">
                    <Search size={15} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder={t('scheduling.search_placeholder') || 'البحث عن أستاذ أو مادة...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="search-clear" onClick={() => setSearchQuery('')}>
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Edit Mode Toggle */}
                <button
                    className={`toolbar-btn edit-mode-btn ${isEditMode ? 'active' : ''}`}
                    onClick={() => setIsEditMode(!isEditMode)}
                >
                    <Edit2 size={15} />
                    {isEditMode ? (t('scheduling.disable_edit_mode') || 'تعطيل التعديل') : (t('scheduling.enable_edit_mode') || 'تفعيل التعديل')}
                </button>
            </div>

            {/* ── Timetable Grid Wrapper ── */}
            <div className="timetable-wrap">
                <div className="timetable-grid" style={{ gridTemplateColumns: `160px repeat(${DAYS.length}, 1fr)` }}>

                    {/* Header: Days */}
                    <div className="grid-corner">
                        <Clock size={16} />
                        <span>{t('scheduling.grid_time')}</span>
                    </div>
                    {DAYS.map((day, di) => (
                        <div key={day} className="grid-day-header">
                            <span>{day}</span>
                        </div>
                    ))}

                    {/* Rows: Time Slots */}
                    {TIME_SLOTS.map((slot, si) => (
                        <React.Fragment key={slot}>
                            <div className="grid-time-label">
                                <Clock size={12} />
                                <span>{slot}</span>
                            </div>
                            {DAYS.map((day, di) => {
                                let session = null;
                                if (viewMode === 'class') {
                                    session = timetable[selectedClass]?.[di]?.[si] || null;
                                } else {
                                    // Teacher view: find session taught by selectedTeacher
                                    for (const cls of CLASSES) {
                                        const s = timetable[cls.id]?.[di]?.[si];
                                        if (s?.teacherId === selectedTeacher) {
                                            session = { ...s, _cls: cls.label };
                                            break;
                                        }
                                    }
                                }

                                if (showConflictsOnly && session && !session.conflict) {
                                    session = null;
                                }

                                if (session && searchQuery) {
                                    const q = searchQuery.toLowerCase();
                                    const tName = session.teacher.toLowerCase();
                                    const sName = session.subject.toLowerCase();
                                    if (!tName.includes(q) && !sName.includes(q)) {
                                        session = null;
                                    }
                                }

                                const isDropTarget = dropTarget?.classId === selectedClass && dropTarget?.dayIdx === di && dropTarget?.slotIdx === si;
                                const isDropLegal = dragging ? isLegalDrop(dragging.session, selectedClass, di, si) : false;

                                return (
                                    <SessionCell
                                        key={`${di}-${si}`}
                                        session={session}
                                        classId={selectedClass}
                                        dayIdx={di}
                                        slotIdx={si}
                                        slotLabel={slot}
                                        isDragging={dragging?.fromClassId === selectedClass && dragging?.fromDayIdx === di && dragging?.fromSlotIdx === si}
                                        isDropTarget={isDropTarget}
                                        isDropLegal={isDropLegal}
                                        isDropIllegal={isDropTarget && !isDropLegal}
                                        onDragStart={handleDragStart}
                                        onDragEnd={handleDragEnd}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onResolutionClick={handleResolutionClick}
                                        onSlotClick={(cId, dIdx, sIdx, s) => {
                                            setEditingSlot({ classId: cId, dayIdx: dIdx, slotIdx: sIdx, session: s });
                                        }}
                                        isEditMode={isEditMode}
                                    />
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* ── Legend ── */}
            <div className="legend-strip">
                <div className="legend-section">
                    <span className="legend-label">{t('scheduling.legend_subjects')}:</span>
                    {Object.entries(subjectColors).map(([subj, clr]) => (
                        <span key={subj} className="legend-item" style={{ background: clr.bg, border: `1px solid ${clr.border}`, color: clr.text }}>
                            <span className="legend-dot" style={{ background: clr.dot }} />
                            {subj}
                        </span>
                    ))}
                </div>
                <div className="legend-section">
                    <span className="legend-item conflict-legend">
                        <AlertTriangle size={11} />
                        {t('scheduling.legend_conflict')}
                    </span>
                    <span className="legend-item legal-legend">
                        <CheckCircle size={11} />
                        {t('scheduling.legend_legal_slot')}
                    </span>
                    <span className="legend-item illegal-legend">
                        <X size={11} />
                        {t('scheduling.legend_illegal_slot')}
                    </span>
                </div>
            </div>

            {/* ── Teachers Quick Reference ── */}
            <div className="teacher-reference-strip">
                <h3 className="strip-title">{t('scheduling.teacher_reference')}</h3>
                <div className="teachers-grid">
                    {TEACHERS.map(teacher => (
                        <div key={teacher.id} className={`teacher-ref-card color-${teacher.color}`}>
                            <div className={`teacher-avatar color-${teacher.color}`}>
                                {teacher.name.charAt(0)}
                            </div>
                            <div className="teacher-info">
                                <span className="teacher-name">{teacher.name}</span>
                                <span className="teacher-subject">{teacher.subject}</span>
                            </div>
                            <div className="teacher-tags">
                                <span className={`tag pref-${teacher.pref === 'صباحي' ? 'morning' : 'evening'}`}>
                                    {teacher.pref}
                                </span>
                                {teacher.restDay && (
                                    <span className="tag rest">
                                        🚫 {teacher.restDay}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Edit Modal ── */}
            {editingSlot && (
                <EditSessionModal
                    slotData={editingSlot}
                    onClose={() => setEditingSlot(null)}
                    onSave={handleSaveSession}
                    onDelete={handleDeleteSession}
                />
            )}
        </div>
    );
};
