import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import {
    Calendar, Star, Clock, ChevronLeft, ChevronRight,
    Sun, BookOpen, Award, AlertTriangle, Bell, CheckCircle,
    ArrowRight, Activity, Zap, MessageSquare, Monitor,
    TrendingUp, Filter, MoreHorizontal, FileText, Check,
    Heart, Flag, Music, Users, Briefcase, Globe
} from 'react-feather';
import { Panel } from '../../components/common/Panel/Panel';
import { Modal } from '../../components/common/Modal/Modal';
import './HubOverview.scss';

// ─── Shared Mock Data (Events & Periods) ───
const ACADEMIC_EVENTS = [
    // Vacations / Holidays
    { id: 'h1', type: 'vacation', title: 'عطلة الشتاء', titleEn: 'Winter Break', startDate: '2026-02-22', endDate: '2026-03-01', color: '#f59e0b' },
    { id: 'h2', type: 'vacation', title: 'عطلة الربيع', titleEn: 'Spring Break', startDate: '2026-03-22', endDate: '2026-03-29', color: '#f59e0b' },
    { id: 'h3', type: 'celebration', title: 'عيد الاستقلال', titleEn: 'Independence Day', startDate: '2026-03-19', endDate: '2026-03-19', color: '#10b981' },
    // Exam Periods (week-long, not individual days)
    { id: 'e1', type: 'exam_period', title: 'أسبوع الامتحانات الفصلية', titleEn: 'Quarterly Exam Week', startDate: '2026-02-20', endDate: '2026-02-27', color: '#ef4444' },
    { id: 'e2', type: 'exam_period', title: 'فترة التقييم المستمر', titleEn: 'Continuous Assessment Period', startDate: '2026-03-05', endDate: '2026-03-12', color: '#ef4444' },
    // Celebrations & Activities
    { id: 'c1', type: 'celebration', title: 'حفل التفوق الدراسي', titleEn: 'Academic Excellence Ceremony', startDate: '2026-02-26', endDate: '2026-02-26', color: '#10b981' },
    { id: 'a1', type: 'activity', title: 'أسبوع العلوم والاكتشاف', titleEn: 'Science & Discovery Week', startDate: '2026-03-10', endDate: '2026-03-14', color: '#8b5cf6' },
    { id: 'a2', type: 'activity', title: 'مسابقة القرآن الكريم', titleEn: 'Quran Competition', startDate: '2026-03-15', endDate: '2026-03-16', color: '#8b5cf6' },
];

// Removed Announcements data since they are not part of an Academic Year Event Manager.

const ARABIC_MONTHS = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const ARABIC_DAYS = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
const TODAY = new Date(2026, 1, 19); // Feb 19, 2026

// ─── Helpers ───
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

function daysBetween(d1, d2) {
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.ceil((d2.getTime() - d1.getTime()) / oneDay);
}

// Custom simple icon component for empty state
const Coffee = ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
);

export const HubOverview = () => {
    const { t, language } = useTranslation();
    const [currentMonth, setCurrentMonth] = useState(TODAY.getMonth());
    const [currentYear, setCurrentYear] = useState(TODAY.getFullYear());
    const [selectedDate, setSelectedDate] = useState(TODAY.getDate()); // Default to today
    const [selectionRange, setSelectionRange] = useState({ start: null, end: null, isSelecting: false });
    const [showRangeModal, setShowRangeModal] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');

    const ICON_OPTIONS = [
        { key: 'star', Icon: Star, label: t('hub.icon_star') || 'نجمة' },
        { key: 'sun', Icon: Sun, label: t('hub.icon_sun') || 'شمس' },
        { key: 'book-open', Icon: BookOpen, label: t('hub.icon_book') || 'كتاب' },
        { key: 'award', Icon: Award, label: t('hub.icon_award') || 'جائزة' },
        { key: 'bell', Icon: Bell, label: t('hub.icon_bell') || 'جرس' },
        { key: 'heart', Icon: Heart, label: t('hub.icon_heart') || 'قلب' },
        { key: 'flag', Icon: Flag, label: t('hub.icon_flag') || 'علم' },
        { key: 'music', Icon: Music, label: t('hub.icon_music') || 'موسيقى' },
        { key: 'users', Icon: Users, label: t('hub.icon_users') || 'مجموعة' },
        { key: 'briefcase', Icon: Briefcase, label: t('hub.icon_briefcase') || 'حقيبة' },
        { key: 'globe', Icon: Globe, label: t('hub.icon_globe') || 'عالم' },
        { key: 'zap', Icon: Zap, label: t('hub.icon_zap') || 'برق' },
    ];

    const resetEventForm = () => {
        setSelectedIcon(null);
        setEventTitle('');
        setEventDescription('');
    };

    // ── Calendar Logic ──
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const getEventsForDay = (day) => {
        if (!day) return [];
        const date = new Date(currentYear, currentMonth, day);
        return ACADEMIC_EVENTS.filter(event => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            const dStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const dEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());
            return date >= dStart && date <= dEnd;
        });
    };

    // ── Metrics ──
    const stats = useMemo(() => {
        const examPeriods = ACADEMIC_EVENTS.filter(e => e.type === 'exam_period').length;
        const vacations = ACADEMIC_EVENTS.filter(e => e.type === 'vacation').length;
        const celebrations = ACADEMIC_EVENTS.filter(e => e.type === 'celebration' || e.type === 'activity').length;
        return { examPeriods, vacations, celebrations };
    }, []);

    const nextMajorEvent = useMemo(() => {
        const upcoming = ACADEMIC_EVENTS
            .map(event => ({
                ...event,
                daysUntil: daysBetween(TODAY, new Date(event.startDate))
            }))
            .filter(event => event.daysUntil >= 0)
            .sort((a, b) => a.daysUntil - b.daysUntil);
        return upcoming[0] || null;
    }, []);

    // ── Selection Logic ──
    const handleMouseDown = (day) => {
        if (!day) return;
        setSelectionRange({ start: day, end: day, isSelecting: true });
        setSelectedDate(day);
    };

    const handleMouseEnter = (day) => {
        if (selectionRange.isSelecting && day) {
            setSelectionRange(prev => ({ ...prev, end: day }));
        }
    };

    const handleMouseUp = () => {
        if (selectionRange.isSelecting) {
            if (selectionRange.start !== selectionRange.end) {
                setShowRangeModal(true);
            }
            setSelectionRange(prev => ({ ...prev, isSelecting: false }));
        }
    };

    const isInRange = (day) => {
        if (!day || !selectionRange.start || !selectionRange.end) return false;
        const min = Math.min(selectionRange.start, selectionRange.end);
        const max = Math.max(selectionRange.start, selectionRange.end);
        return day >= min && day <= max;
    };

    const selectedDayEvents = useMemo(() => {
        if (!selectedDate) return [];
        return getEventsForDay(selectedDate);
    }, [selectedDate, currentMonth, currentYear]);

    // ── Render Helpers ──
    const isToday = (day) => {
        return day && TODAY.getFullYear() === currentYear && TODAY.getMonth() === currentMonth && TODAY.getDate() === day;
    };

    const calendarDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push({ day: null, events: [] });
        for (let d = 1; d <= daysInMonth; d++) days.push({ day: d, events: getEventsForDay(d) });
        return days;
    }, [currentMonth, currentYear, daysInMonth, firstDay]);

    const monthLabel = language === 'ar'
        ? `${ARABIC_MONTHS[currentMonth]} ${currentYear}`
        : new Date(currentYear, currentMonth).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' });

    const getEventTypeIcon = (type) => {
        switch (type) {
            case 'vacation': return Sun;
            case 'exam_period': return BookOpen;
            case 'celebration': return Award;
            case 'activity': return Zap;
            default: return Calendar;
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString(language === 'ar' ? 'ar-u-nu-latn' : 'en-US', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="hub-overview-v2">
            {/* ── Page Header ── */}
            <div className="hub-header">
                <div className="header-titles">
                    <h1>{t('hub.page_title')}</h1>
                    <p>{t('hub.page_desc')}</p>
                </div>
                <div className="header-actions">
                    <button className="action-btn secondary">
                        <Filter size={18} />
                        <span>{t('hub.filter_view')}</span>
                    </button>
                    <button className="action-btn primary" onClick={() => {
                        if (!selectionRange.start) {
                            setSelectionRange({ start: selectedDate, end: selectedDate, isSelecting: false });
                        }
                        setShowRangeModal(true);
                    }}>
                        <Calendar size={18} />
                        <span>{t('hub.add_event')}</span>
                    </button>
                </div>
            </div>

            {/* ── Top Section: Hero & Stats ── */}
            <div className="top-section">
                {/* Hero Card */}
                <div className="hero-card">
                    {nextMajorEvent ? (
                        <>
                            <div className="hero-content">
                                <span className="hero-label">
                                    <Star size={14} className="spin-slow" />
                                    {t('hub.upcoming_highlight')}
                                </span>
                                <h2 className="hero-title">{nextMajorEvent.title}</h2>
                                <div className="hero-meta">
                                    <span className="meta-item">
                                        <Clock size={16} />
                                        {formatDate(nextMajorEvent.startDate)}
                                    </span>
                                    <span className="meta-sep">•</span>
                                    <span className="meta-item badge" style={{ backgroundColor: `${nextMajorEvent.color}20`, color: nextMajorEvent.color }}>
                                        {t(`hub.event_${nextMajorEvent.type}`)}
                                    </span>
                                </div>
                            </div>
                            <div className="hero-visual">
                                <div className="countdown-circle">
                                    <span className="count-val">{nextMajorEvent.daysUntil}</span>
                                    <span className="count-lbl">{t('hub.days_left')}</span>
                                    <svg viewBox="0 0 100 100" className="progress-ring">
                                        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.2" />
                                        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" fill="none"
                                            strokeDasharray="283" strokeDashoffset={283 - (283 * Math.max(0, 10 - nextMajorEvent.daysUntil) / 10)}
                                            className="progress-arc" />
                                    </svg>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="hero-empty">
                            <Activity size={40} />
                            <p>{t('hub.no_upcoming_events')}</p>
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card" style={{ '--accent': '#ef4444' }}>
                        <div className="stat-icon-wrap"><BookOpen size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-val">{stats.examPeriods}</span>
                            <span className="stat-lbl">{t('hub.exam_periods') || 'فترات الامتحانات'}</span>
                        </div>
                    </div>
                    <div className="stat-card" style={{ '--accent': '#f59e0b' }}>
                        <div className="stat-icon-wrap"><Sun size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-val">{stats.vacations}</span>
                            <span className="stat-lbl">{t('hub.vacations_upcoming') || 'عطل قادمة'}</span>
                        </div>
                    </div>
                    <div className="stat-card" style={{ '--accent': '#10b981' }}>
                        <div className="stat-icon-wrap"><Award size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-val">{stats.celebrations}</span>
                            <span className="stat-lbl">{t('hub.celebrations_activities') || 'احتفالات وأنشطة'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Content: Calendar & Agenda ── */}
            <div className="main-grid">
                {/* Left: Calendar */}
                <div className="calendar-section glass-panel">
                    <div className="calendar-header">
                        <h3 className="section-title">{monthLabel}</h3>
                        <div className="cal-nav-group">
                            <button onClick={language === 'ar' ? nextMonth : prevMonth}><ChevronRight size={20} /></button>
                            <button className="today-btn" onClick={() => { setCurrentMonth(TODAY.getMonth()); setCurrentYear(TODAY.getFullYear()); }}>{t('hub.today')}</button>
                            <button onClick={language === 'ar' ? prevMonth : nextMonth}><ChevronLeft size={20} /></button>
                        </div>
                    </div>

                    <div className="calendar-body">
                        <div className="days-row">
                            {ARABIC_DAYS.map((d, i) => (
                                <span key={i} className="day-name">{d}</span>
                            ))}
                        </div>
                        <div className="dates-grid">
                            {calendarDays.map((cell, i) => (
                                <div
                                    key={i}
                                    className={`
                                        date-cell 
                                        ${!cell.day ? 'empty' : ''} 
                                        ${isToday(cell.day) ? 'today' : ''} 
                                        ${selectedDate === cell.day ? 'selected' : ''} 
                                        ${isInRange(cell.day) ? 'in-range' : ''}
                                    `}
                                    onMouseDown={() => handleMouseDown(cell.day)}
                                    onMouseEnter={() => handleMouseEnter(cell.day)}
                                    onMouseUp={handleMouseUp}
                                    onClick={() => cell.day && setSelectedDate(cell.day)}
                                >
                                    {cell.day && (
                                        <>
                                            <span className="date-num">{cell.day}</span>
                                            {cell.events.length > 0 && (
                                                <div className="date-dots">
                                                    {cell.events.map((ev, k) => (
                                                        <span key={k} className="dot" style={{ backgroundColor: ev.color }} title={ev.title} />
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Selected Day Agenda */}
                <div className="agenda-section glass-panel">
                    <div className="agenda-header">
                        <div className="agenda-date">
                            <span className="big-day">{selectedDate || '-'}</span>
                            <div className="date-details">
                                <span className="month-name">{ARABIC_MONTHS[currentMonth]}</span>
                                <span className="day-name">{selectedDate ? ARABIC_DAYS[new Date(currentYear, currentMonth, selectedDate).getDay()] : ''}</span>
                            </div>
                        </div>
                        <div className="agenda-actions">
                            <button className="icon-btn"><MoreHorizontal size={18} /></button>
                        </div>
                    </div>

                    <div className="agenda-list">
                        {selectedDayEvents.length > 0 ? (
                            selectedDayEvents.map(event => {
                                const Icon = getEventTypeIcon(event.type);
                                return (
                                    <div key={event.id} className="agenda-item" style={{ borderRightColor: event.color }}>
                                        <div className="item-time">
                                            <span>09:00</span>
                                            <span className="u-text-muted">11:00</span>
                                        </div>
                                        <div className="item-card" style={{ backgroundColor: `${event.color}08`, borderRight: `2px solid ${event.color}` }}>
                                            <div className="item-icon" style={{ backgroundColor: event.color, color: '#fff' }}>
                                                <Icon size={14} />
                                            </div>
                                            <div className="item-content">
                                                <h4>{event.title}</h4>
                                                <span className="item-sub">{event.subject || event.titleEn}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon"><Coffee size={32} /></div>
                                <p>{t('hub.no_events_this_day')}</p>
                                <button className="btn-text" onClick={() => {
                                    setSelectionRange({ start: selectedDate, end: selectedDate, isSelecting: false });
                                    setShowRangeModal(true);
                                }}>{t('hub.add_event')}</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Row: Defined Periods */}
                <div className="updates-section glass-panel">
                    <div className="updates-header">
                        <h4 className="updates-title">
                            <Calendar size={18} />
                            {t('hub.defined_periods')}
                        </h4>
                        <button className="view-all-btn">
                            {t('hub.manage_all_periods')} <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="updates-grid">
                        {ACADEMIC_EVENTS.map(period => (
                            <div key={period.id} className="update-card" style={{ borderTop: `4px solid ${period.color}` }}>
                                <div className="update-meta">
                                    <span className="cat-badge" style={{ backgroundColor: `${period.color}20`, color: period.color }}>
                                        {t(`hub.event_${period.type}`)}
                                    </span>
                                </div>
                                <h4 className="update-title" style={{ marginTop: '0.5rem' }}>{period.title}</h4>
                                <p className="update-excerpt" style={{ margin: '0.5rem 0' }}>
                                    <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                    {formatDate(period.startDate)} {period.startDate !== period.endDate && ` - ${formatDate(period.endDate)}`}
                                </p>
                                <div className="update-footer">
                                    <span className="read-more">{t('hub.edit_period')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Add Event Modal ── */}
            <Modal
                isOpen={showRangeModal}
                onClose={() => { setShowRangeModal(false); resetEventForm(); }}
                title={t('hub.define_period') || 'إضافة حدث جديد'}
                subtitle={t('hub.define_period_subtitle') || 'حدد نوع الحدث والتفاصيل والتواريخ'}
                icon={Calendar}
                size="medium"
            >
                <div className="range-modal-content">
                    {/* Section 1: Event Name & Icon */}
                    <div className="modal-section">
                        <div className="section-label">
                            <span className="section-number">1</span>
                            <div>
                                <h4>{t('hub.event_name_icon') || 'اسم الحدث والرمز'}</h4>
                                <p className="section-hint">{t('hub.event_name_icon_hint') || 'أدخل اسم الحدث واختر رمزاً مناسباً'}</p>
                            </div>
                        </div>

                        <div className="form-field">
                            <label className="field-label">
                                <FileText size={14} />
                                {t('hub.event_name') || 'اسم الحدث'}
                            </label>
                            <input
                                type="text"
                                className="field-input"
                                placeholder={t('hub.event_name_placeholder') || 'مثال: عطلة الشتاء، أسبوع العلوم...'}
                                value={eventTitle}
                                onChange={(e) => setEventTitle(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="icon-picker-section">
                            <label className="field-label">
                                <Star size={14} />
                                {t('hub.choose_icon') || 'اختر رمزاً'}
                            </label>
                            <div className="icon-picker-grid">
                                {ICON_OPTIONS.map(opt => {
                                    const IconComp = opt.Icon;
                                    return (
                                        <button
                                            key={opt.key}
                                            type="button"
                                            className={`icon-picker-item ${selectedIcon === opt.key ? 'active' : ''}`}
                                            onClick={() => setSelectedIcon(opt.key)}
                                            title={opt.label}
                                        >
                                            <IconComp size={20} />
                                            <span className="icon-label">{opt.label}</span>
                                            {selectedIcon === opt.key && (
                                                <div className="icon-check">
                                                    <Check size={10} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Event Description */}
                    <div className="modal-section">
                        <div className="section-label">
                            <span className="section-number">2</span>
                            <div>
                                <h4>{t('hub.event_details') || 'تفاصيل الحدث'}</h4>
                                <p className="section-hint">{t('hub.event_details_hint') || 'أضف وصفاً اختيارياً للحدث'}</p>
                            </div>
                        </div>

                        <div className="form-field">
                            <label className="field-label">
                                <MessageSquare size={14} />
                                {t('hub.event_description') || 'وصف الحدث (اختياري)'}
                            </label>
                            <textarea
                                className="field-textarea"
                                rows="3"
                                placeholder={t('hub.event_description_placeholder') || 'أضف وصفاً مختصراً للحدث...'}
                                value={eventDescription}
                                onChange={(e) => setEventDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Section 3: Date Range */}
                    <div className="modal-section">
                        <div className="section-label">
                            <span className="section-number">3</span>
                            <div>
                                <h4>{t('hub.event_dates') || 'تاريخ الحدث'}</h4>
                                <p className="section-hint">{t('hub.event_dates_hint') || 'التواريخ المحددة من التقويم'}</p>
                            </div>
                        </div>

                        <div className="date-range-display">
                            <div className="date-card">
                                <span className="date-card-label">{t('hub.start_date') || 'من'}</span>
                                <div className="date-card-value">
                                    <Calendar size={16} />
                                    <span>{Math.min(selectionRange.start || 0, selectionRange.end || 0)} {language === 'ar' ? ARABIC_MONTHS[currentMonth] : ''} {currentYear}</span>
                                </div>
                            </div>
                            <div className="date-connector">
                                <ArrowRight size={18} />
                            </div>
                            <div className="date-card">
                                <span className="date-card-label">{t('hub.end_date') || 'إلى'}</span>
                                <div className="date-card-value">
                                    <Calendar size={16} />
                                    <span>
                                        {selectionRange.end !== selectionRange.start
                                            ? `${Math.max(selectionRange.start || 0, selectionRange.end || 0)} ${language === 'ar' ? ARABIC_MONTHS[currentMonth] : ''} ${currentYear}`
                                            : t('hub.same_day') || 'نفس اليوم'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {(eventTitle.trim() || selectedIcon) && (() => {
                            const iconObj = ICON_OPTIONS.find(o => o.key === selectedIcon);
                            const PreviewIcon = iconObj?.Icon || Calendar;
                            return (
                                <div className="event-preview" style={{ '--preview-color': 'var(--color-primary)' }}>
                                    <div className="preview-icon-wrap">
                                        <PreviewIcon size={18} />
                                    </div>
                                    <div className="preview-info">
                                        <span className="preview-title">{eventTitle || (t('hub.untitled_event') || 'حدث بدون عنوان')}</span>
                                        <span className="preview-type">{iconObj?.label || (t('hub.no_icon_selected') || 'بدون رمز')}</span>
                                    </div>
                                    <div className="preview-color-bar" />
                                </div>
                            );
                        })()}
                    </div>

                    {/* Footer */}
                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={() => { setShowRangeModal(false); resetEventForm(); }}>
                            {t('hub.modal_cancel') || 'إلغاء'}
                        </button>
                        <button
                            className="btn-save"
                            disabled={!eventTitle.trim() || !selectedIcon}
                            onClick={() => { setShowRangeModal(false); resetEventForm(); }}
                        >
                            <Check size={16} />
                            {t('hub.save_period') || 'حفظ الحدث'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
