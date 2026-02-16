import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, X, Plus, Check, RefreshCw, Trash2, AlertCircle, CheckCircle, XCircle, UserX, Award, Activity, DollarSign, Download, Filter, Phone, Mail, Edit2, Zap, Loader, ChevronDown, Save, MapPin, Briefcase } from 'react-feather';
import { Modal } from '../../components/common/Modal/Modal';
import { Panel } from '../../components/common/Panel/Panel';
import './RegistrationMeetings.scss';
import { useTranslation } from '../../context/LanguageContext';

// Helper to get localized month/day
const getMonthName = (monthIndex, locale = 'ar-DZ') => {
    const date = new Date(2024, monthIndex, 1);
    return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
};

const getDayName = (dayIndex, locale = 'ar-DZ') => {
    const date = new Date(2024, 0, 7 + dayIndex); // Jan 7 2024 is Sunday
    return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
};

// Time slots for a day (15-min intervals from 8:00 to 17:00)
const generateTimeSlots = () => {
    const slots = [];
    for (let h = 8; h < 17; h++) {
        for (let m = 0; m < 60; m += 15) {
            const start = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            const endM = m + 15;
            const endH = endM >= 60 ? h + 1 : h;
            const end = `${endH.toString().padStart(2, '0')}:${(endM % 60).toString().padStart(2, '0')}`;
            slots.push({ start, end, label: `${start} - ${end}` });
        }
    }
    return slots;
};

const TIME_SLOTS = generateTimeSlots();

// Arabic month names - moved inside or kept if we only want Arabic calendar context for now, but cleaner to translate
// For now, let's keep hardcoded Arabic months/days as the request implies these might be specific, 
// OR better, use Intl.DateTimeFormat in the component. 
// I will stick to the provided translation pattern for UI elements.

// Slot statuses - Labels are hardcoded in the original logic, need to be careful
const SLOT_STATUS = {
    AVAILABLE: 'available',
    RESERVED: 'reserved',
    APPROVED: 'approved',
    EXPIRED: 'expired',
    NEEDS_REVIEW: 'needs_review'
};

export const RegistrationMeetings = () => {
    const { t } = useTranslation();
    // Current time for the system (Feb 9, 2026, 3:18 PM)
    const now = new Date(2026, 1, 9, 15, 18, 0);
    const [currentMonth, setCurrentMonth] = useState(now.getMonth());
    const [currentYear, setCurrentYear] = useState(now.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [isSlotEditorOpen, setIsSlotEditorOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [slotToReview, setSlotToReview] = useState(null);
    const [slotToEdit, setSlotToEdit] = useState(null);

    // Review Modal State
    const [reviewStep, setReviewStep] = useState('initial'); // initial, success, refuse_form, noshow_form
    const [reviewReason, setReviewReason] = useState('');

    // Slots data: { date: 'YYYY-MM-DD', time: '09:00', status, parentName?, parentPhone?, notes? }
    const [slots, setSlots] = useState([
        // Past slots for testing
        { id: 1, date: '2026-02-08', time: '10:00', status: 'needs_review', parentName: 'أحمد علي', parentPhone: '0555123456' },
        { id: 2, date: '2026-02-08', time: '10:15', status: 'expired' },
        { id: 3, date: '2026-02-08', time: '11:00', status: 'needs_review', parentName: 'سارة محمد', parentPhone: '0555789012' },
        // Today's slots
        { id: 4, date: '2026-02-09', time: '09:00', status: 'expired' },
        { id: 5, date: '2026-02-09', time: '09:15', status: 'needs_review', parentName: 'خالد أحمد', parentPhone: '0555111222' },
        { id: 6, date: '2026-02-09', time: '14:00', status: 'approved', parentName: 'منى حسن', parentPhone: '0555333444' },
        { id: 7, date: '2026-02-09', time: '16:00', status: 'reserved', parentName: 'فاطمة علي', parentPhone: '0555555666' },
        { id: 8, date: '2026-02-09', time: '16:15', status: 'available' },
        // Future slots
        { id: 9, date: '2026-02-10', time: '09:00', status: 'available' },
        { id: 10, date: '2026-02-10', time: '09:15', status: 'reserved', parentName: 'يوسف كمال', parentPhone: '0555777888' },
        { id: 11, date: '2026-02-10', time: '10:00', status: 'approved', parentName: 'نور الدين', parentPhone: '0555999000' },
        { id: 12, date: '2026-02-10', time: '14:00', status: 'available' },
        { id: 13, date: '2026-02-12', time: '11:00', status: 'available' },
        { id: 14, date: '2026-02-12', time: '11:15', status: 'available' },
        { id: 15, date: '2026-02-15', time: '09:00', status: 'reserved', parentName: 'ليلى عبدالله', parentPhone: '0555222333' },
    ]);

    // Mock commissions
    const COMMISSIONS = ['اللجنة أ (إدارة)', 'اللجنة ب (تربوي)', 'اللجنة ج (نفسي)'];

    // Helper: format date to string
    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // Helper: check if slot is in the past
    const isSlotPast = (dateStr, timeStr) => {
        const [y, m, d] = dateStr.split('-').map(Number);
        const [h, min] = timeStr.split(':').map(Number);
        const slotEnd = new Date(y, m - 1, d, h, min + 15);
        return slotEnd < now;
    };

    // Get slots for a specific date
    const getSlotsForDate = (dateStr) => {
        return slots.filter(s => s.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));
    };

    // Get meetings that passed and need rating/review
    const meetingsToRate = slots.filter(s =>
        (s.status === SLOT_STATUS.APPROVED && isSlotPast(s.date, s.time)) ||
        s.status === SLOT_STATUS.NEEDS_REVIEW
    ).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

    // Get upcoming approved meetings
    const upcomingApproved = slots.filter(s => s.status === SLOT_STATUS.APPROVED && !isSlotPast(s.date, s.time))
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

    // Calendar navigation
    const goToPreviousMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
        else { setCurrentMonth(currentMonth - 1); }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
        else { setCurrentMonth(currentMonth + 1); }
    };

    const goToToday = () => {
        setCurrentMonth(now.getMonth());
        setCurrentYear(now.getFullYear());
    };

    // Generate calendar days
    const getCalendarDays = () => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        const days = [];

        for (let i = 0; i < startingDay; i++) {
            days.push({ day: null });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateStr = formatDate(date);
            const isToday = dateStr === formatDate(now);
            const isPast = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const daySlots = getSlotsForDate(dateStr);

            days.push({ day, date, dateStr, isToday, isPast, slots: daySlots });
        }
        return days;
    };

    // Handle day click in management modal
    const handleDayClick = (dayInfo) => {
        if (dayInfo.day) {
            setSelectedDate(dayInfo);
            setIsSlotEditorOpen(true);
        }
    };

    // Cancel/Refuse modal state
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [slotToCancel, setSlotToCancel] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelType, setCancelType] = useState(''); // 'refuse' or 'cancel'

    // Predefined cancel reasons
    const cancelReasons = [
        'تعارض في المواعيد',
        'طلب ولي الأمر',
        'ظروف طارئة',
        'عدم توفر المسؤول',
        'سبب آخر'
    ];

    // Open cancel confirmation modal
    const openCancelModal = (slot, type = 'cancel') => {
        setSlotToCancel(slot);
        setCancelType(type);
        setCancelReason('');
        setIsCancelModalOpen(true);
    };

    // Confirm cancellation with reason
    const confirmCancel = () => {
        if (!slotToCancel) return;

        // Here you would send the reason to backend
        console.log(`${cancelType === 'refuse' ? 'Refused' : 'Canceled'} slot:`, slotToCancel.id, 'Reason:', cancelReason);

        // Remove the slot
        setSlots(slots.filter(s => s.id !== slotToCancel.id));

        // Close modal and reset
        setIsCancelModalOpen(false);
        setSlotToCancel(null);
        setCancelReason('');
    };

    // Track which slot is pending removal confirmation in the time grid
    const [pendingRemoveTime, setPendingRemoveTime] = useState(null);

    // Multi-select mode for batch adding slots
    const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
    const [selectedTimes, setSelectedTimes] = useState([]);

    // Toggle time selection in multi-select mode
    const toggleTimeSelection = (time) => {
        if (selectedTimes.includes(time)) {
            setSelectedTimes(selectedTimes.filter(t => t !== time));
        } else {
            setSelectedTimes([...selectedTimes, time]);
        }
    };

    // Add all selected slots at once
    const addSelectedSlots = () => {
        if (!selectedDate || selectedTimes.length === 0) return;

        const newSlots = selectedTimes
            .filter(time => !slots.find(s => s.date === selectedDate.dateStr && s.time === time))
            .map(time => ({
                id: Date.now() + Math.random(),
                date: selectedDate.dateStr,
                time,
                status: SLOT_STATUS.AVAILABLE
            }));

        setSlots([...slots, ...newSlots]);
        setSelectedTimes([]);
        setIsMultiSelectMode(false);
    };

    // Quick select presets
    const selectPreset = (preset) => {
        const morningSlots = TIME_SLOTS.filter(t => {
            const hour = parseInt(t.start.split(':')[0]);
            return hour >= 8 && hour < 12;
        }).map(t => t.start);

        const afternoonSlots = TIME_SLOTS.filter(t => {
            const hour = parseInt(t.start.split(':')[0]);
            return hour >= 12 && hour < 17;
        }).map(t => t.start);

        // Filter out already existing and past slots
        const filterAvailable = (times) => times.filter(time => {
            const exists = selectedDate?.slots.find(s => s.time === time);
            const isPast = selectedDate ? isSlotPast(selectedDate.dateStr, time) : true;
            return !exists && !isPast;
        });

        switch (preset) {
            case 'morning':
                setSelectedTimes(filterAvailable(morningSlots));
                break;
            case 'afternoon':
                setSelectedTimes(filterAvailable(afternoonSlots));
                break;
            case 'fullday':
                setSelectedTimes(filterAvailable([...morningSlots, ...afternoonSlots]));
                break;
            case 'clear':
                setSelectedTimes([]);
                break;
        }
    };

    // Add available slot
    const addSlot = (time) => {
        if (!selectedDate) return;
        const exists = slots.find(s => s.date === selectedDate.dateStr && s.time === time);
        if (exists) return;

        const newSlot = {
            id: Date.now(),
            date: selectedDate.dateStr,
            time,
            status: SLOT_STATUS.AVAILABLE
        };
        setSlots([...slots, newSlot]);
        setPendingRemoveTime(null);
    };

    // Handle click on existing slot in time grid
    const handleTimeSlotClick = (timeSlot, exists, isPast) => {
        if (isPast) return;

        // Multi-select mode
        if (isMultiSelectMode && !exists) {
            toggleTimeSelection(timeSlot.start);
            return;
        }

        if (!exists) {
            // Add new slot
            addSlot(timeSlot.start);
        } else if (exists.status === 'available') {
            // Toggle pending removal state
            if (pendingRemoveTime === timeSlot.start) {
                // Confirm removal
                removeSlot(exists.id);
                setPendingRemoveTime(null);
            } else {
                // Show confirmation
                setPendingRemoveTime(timeSlot.start);
            }
        }
    };

    // Remove slot (for available/expired slots - no reason needed)
    const removeSlot = (slotId) => {
        setSlots(slots.filter(s => s.id !== slotId));
    };


    // Approve reservation
    const approveSlot = (slotId) => {
        setSlots(slots.map(s => s.id === slotId ? { ...s, status: SLOT_STATUS.APPROVED } : s));
    };

    // Open review modal for past meetings
    const openReviewModal = (slot) => {
        setSlotToReview(slot);
        setReviewStep('initial');
        setReviewReason('');
        setIsReviewModalOpen(true);
    };

    // Handle review actions (Final Execution)
    const executeReviewAction = (action, finalStatus) => {
        if (!slotToReview) return;

        // Common cleanup logic
        const cleanup = () => {
            setSlots(slots.filter(s => s.id !== slotToReview.id));
            if (action === 'reschedule') {
                // Logic to reopen slot or notify for reschedule
                console.log('Rescheduling slot:', slotToReview.id, 'Reason:', reviewReason);
            }
        };

        if (action === 'completed') {
            // Show success message first, then cleanup when modal closes or after delay?
            // For now, we update the UI to success step.
            setReviewStep('success');
            // In a real app, you'd trigger the API call here.
            setTimeout(() => {
                cleanup();
                // We keep the modal open on success step so user sees the message
            }, 500); // Small delay to simulate processing if needed, or just cleanup immediately
        } else {
            cleanup();
            setIsReviewModalOpen(false);
            setSlotToReview(null);
        }
    };

    const closeReviewModal = () => {
        if (reviewStep === 'success') {
            // Already cleaned up in executeReviewAction
            setIsReviewModalOpen(false);
            setSlotToReview(null);
        } else {
            setIsReviewModalOpen(false);
            setSlotToReview(null);
        }
    }

    // Open edit modal for confirmed meetings
    const openEditModal = (slot) => {
        setSlotToEdit({
            ...slot,
            commission: slot.commission || COMMISSIONS[Math.floor(Math.random() * COMMISSIONS.length)]
        });
        setIsEditModalOpen(true);
    };

    // Handle updating confirmed meeting details
    const handleUpdateSlot = (id, updates) => {
        setSlots(slots.map(s => s.id === id ? { ...s, ...updates } : s));
        setIsEditModalOpen(false);
        setSlotToEdit(null);
    };

    // Refresh selected date slots after changes
    useEffect(() => {
        if (selectedDate) {
            const updatedSlots = getSlotsForDate(selectedDate.dateStr);
            setSelectedDate({ ...selectedDate, slots: updatedSlots });
        }
    }, [slots]);

    const calendarDays = getCalendarDays();

    // Get status counts for stats
    const availableCount = slots.filter(s => s.status === SLOT_STATUS.AVAILABLE && !isSlotPast(s.date, s.time)).length;
    const reservedCount = slots.filter(s => s.status === SLOT_STATUS.RESERVED).length;
    const approvedCount = slots.filter(s => s.status === SLOT_STATUS.APPROVED && !isSlotPast(s.date, s.time)).length;

    return (
        <div className="registration-meetings">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <div className="title-section">
                        <h1>{t('meetings.title')}</h1>
                        <p>{t('meetings.subtitle')}</p>
                    </div>
                </div>
            </div>

            {/* Alerts Section */}


            {/* Stats Cards */}
            <div className="stats-row">
                <div className="stat-card available">
                    <div className="stat-icon"><Clock size={20} /></div>
                    <div className="stat-data">
                        <span className="num">{availableCount}</span>
                        <span className="label">{t('meetings.stat_available')}</span>
                    </div>
                </div>
                <div className="stat-card approved">
                    <div className="stat-icon"><CheckCircle size={20} /></div>
                    <div className="stat-data">
                        <span className="num">{approvedCount}</span>
                        <span className="label">{t('meetings.stat_confirmed')}</span>
                    </div>
                </div>
                <div className="stat-card review">
                    <div className="stat-icon"><AlertCircle size={20} /></div>
                    <div className="stat-data">
                        <span className="num">{meetingsToRate.length}</span>
                        <span className="label">{t('meetings.stat_needs_review')}</span>
                    </div>
                </div>
                <div className="stat-card financial">
                    <div className="stat-icon"><DollarSign size={20} /></div>
                    <div className="stat-data">
                        <span className="num">--</span>
                        <span className="label">{t('finance_department')}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="content-grid">
                {/* Upcoming Approved (The Meeting Stage) */}
                <Panel
                    title={t('upcoming_interviews')}
                    icon={Calendar}
                    badge={upcomingApproved.length}
                    badgeVariant="blue"
                    className="meetings-panel"
                    glass
                >
                    {upcomingApproved.length > 0 ? (
                        upcomingApproved.slice(0, 5).map(slot => {
                            const commission = slot.commission || COMMISSIONS[Math.floor(Math.random() * COMMISSIONS.length)];
                            return (
                                <div key={slot.id} className="approved-item" onClick={() => openEditModal({ ...slot, commission })}>
                                    <div className="item-date">
                                        <span className="day">{slot.date.split('-')[2]}</span>
                                        <span className="month">{getMonthName(parseInt(slot.date.split('-')[1]) - 1, t('locale') || 'ar-DZ')}</span>
                                    </div>
                                    <div className="item-info">
                                        <div className="time">{slot.time}</div>
                                        <div className="name">{slot.parentName}</div>
                                        <div className="commission-tag">{commission}</div>
                                    </div>
                                    <div className="item-status">
                                        <CheckCircle size={16} />
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="empty-state">
                            <Calendar size={32} />
                            <p>{t('meetings.no_confirmed')}</p>
                        </div>
                    )}
                </Panel>

                {/* Meetings to Rate (The Review Stage) */}
                <Panel
                    title={t('meetings.review_stage')}
                    icon={Award}
                    badge={meetingsToRate.length}
                    badgeVariant="orange"
                    className="review-panel"
                    glass
                >
                    {meetingsToRate.length > 0 ? (
                        meetingsToRate.map(slot => (
                            <div key={slot.id} className="review-item" onClick={() => openReviewModal(slot)}>
                                <div className="item-date">
                                    <span className="day">{slot.date.split('-')[2]}</span>
                                    <span className="month">{getMonthName(parseInt(slot.date.split('-')[1]) - 1, t('locale') || 'ar-DZ')}</span>
                                </div>
                                <div className="item-info">
                                    <div className="time">{slot.time}</div>
                                    <div className="name">{slot.parentName}</div>
                                </div>
                                <div className="item-action">
                                    <AlertCircle size={16} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <Check size={32} />
                            <p>{t('meetings.all_reviewed')}</p>
                        </div>
                    )}
                </Panel>
            </div>
            <div className="content-grid">
                {/* Upcoming Approved (The Meeting Stage) */}
                <Panel
                    title={t('meetings.next_stage')}
                    icon={DollarSign}
                    badge={0}
                    badgeVariant="green"
                    fullWidth
                    className="financial-panel"
                    glass
                >
                    <div className="empty-state">
                        <DollarSign size={32} />
                        <p>{t('meetings.no_finance_files')}</p>
                        <span style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem', display: 'block' }}>{t('meetings.finance_hint')}</span>
                    </div>
                </Panel>

            </div>

            {/* Management Modal */}
            {isManageModalOpen && (
                <div className="modal-overlay" onClick={() => setIsManageModalOpen(false)}>
                    <div className="management-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="header-text">
                                <h2>{t('meetings.manage_slots_modal')}</h2>
                                <p>{t('meetings.manage_slots_hint')}</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsManageModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* Calendar Navigation */}
                            <div className="calendar-nav">
                                <button onClick={goToPreviousMonth}><ChevronLeft size={20} /></button>
                                <h3>{getMonthName(currentMonth, t('locale') || 'ar-DZ')} {currentYear}</h3>
                                <button onClick={goToNextMonth}><ChevronRight size={20} /></button>
                                <button className="today-btn" onClick={goToToday}>{t('today')}</button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="calendar-grid">
                                <div className="weekdays">
                                    {[0, 1, 2, 3, 4, 5, 6].map(d => <div key={d}>{getDayName(d, t('locale') || 'ar-DZ').substring(0, 2)}</div>)}
                                </div>
                                <div className="days">
                                    {calendarDays.map((day, idx) => (
                                        <div
                                            key={idx}
                                            className={`day-cell ${!day.day ? 'empty' : ''} ${day.isToday ? 'today' : ''} ${day.isPast ? 'past' : ''}`}
                                            onClick={() => day.day && handleDayClick(day)}
                                        >
                                            {day.day && (
                                                <>
                                                    <span className="day-num">{day.day}</span>
                                                    {day.slots.length > 0 && (
                                                        <div className="slot-indicators">
                                                            {day.slots.slice(0, 4).map((s, i) => (
                                                                <span key={i} className={`indicator ${s.status}`}></span>
                                                            ))}
                                                            {day.slots.length > 4 && <span className="more">+{day.slots.length - 4}</span>}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Modal Legend */}
                            <div className="modal-legend">
                                <div className="leg"><span className="dot available"></span> {t('meetings.available')}</div>
                                <div className="leg"><span className="dot reserved"></span> {t('meetings.reserved')}</div>
                                <div className="leg"><span className="dot approved"></span> {t('meetings.approved')}</div>
                                <div className="leg"><span className="dot expired"></span> {t('meetings.expired')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Slot Editor Modal */}
            {isSlotEditorOpen && selectedDate && (
                <div className="modal-overlay" onClick={() => setIsSlotEditorOpen(false)}>
                    <div className="slot-editor-modal" onClick={e => e.stopPropagation()}>
                        <div className="editor-header">
                            <div className="date-display">
                                <Calendar size={18} />
                                <span>{selectedDate.day} {getMonthName(currentMonth, t('locale') || 'ar-DZ')} {currentYear}</span>
                            </div>
                            <button onClick={() => setIsSlotEditorOpen(false)}><X size={20} /></button>
                        </div>

                        <div className="editor-body">
                            <div className="slots-section">
                                <h4>{t('meetings.current_slots') || "الفترات الحالية"}</h4>
                                <div className="current-slots">
                                    {selectedDate.slots.length > 0 ? (
                                        selectedDate.slots.map(slot => (
                                            <div key={slot.id} className={`slot-item ${slot.status}`}>
                                                <div className="slot-time">{slot.time}</div>
                                                <div className="slot-info">
                                                    {slot.parentName ? (
                                                        <span className="parent">{slot.parentName}</span>
                                                    ) : (
                                                        <span className="empty-label">{t('meetings.available')}</span>
                                                    )}
                                                </div>
                                                <div className="slot-status">
                                                    {slot.status === 'available' && <span className="tag green">{t('meetings.available')}</span>}
                                                    {slot.status === 'reserved' && <span className="tag yellow">{t('meetings.reserved')}</span>}
                                                    {slot.status === 'approved' && <span className="tag blue">{t('meetings.approved')}</span>}
                                                    {slot.status === 'expired' && <span className="tag gray">{t('meetings.expired')}</span>}
                                                    {slot.status === 'needs_review' && <span className="tag orange">{t('meetings.review')}</span>}
                                                </div>
                                                <div className="slot-actions">
                                                    {slot.status === 'reserved' && (
                                                        <button className="approve" onClick={() => approveSlot(slot.id)} title={t('commissions.approve') || "موافقة"}>
                                                            <Check size={14} />
                                                        </button>
                                                    )}
                                                    {slot.status === 'needs_review' && (
                                                        <button className="review" onClick={() => openReviewModal(slot)} title={t('commissions.review') || "مراجعة"}>
                                                            <AlertCircle size={14} />
                                                        </button>
                                                    )}
                                                    {(slot.status === 'available' || slot.status === 'expired') && (
                                                        <button className="delete" onClick={() => removeSlot(slot.id)} title={t('commissions.delete') || "حذف"}>
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-slots">{t('meetings.no_slots_day')}</div>
                                    )}
                                </div>
                            </div>

                            {!selectedDate.isPast && (
                                <div className="add-slots-section">
                                    <div className="section-header-row">
                                        <h4>{t('meetings.add_slots')}</h4>
                                        <button
                                            className={`multi-select-toggle ${isMultiSelectMode ? 'active' : ''}`}
                                            onClick={() => {
                                                setIsMultiSelectMode(!isMultiSelectMode);
                                                setSelectedTimes([]);
                                            }}
                                        >
                                            {isMultiSelectMode ? t('meetings.cancel_select') : t('meetings.multi_select')}
                                        </button>
                                    </div>

                                    {isMultiSelectMode && (
                                        <div className="preset-buttons">
                                            <button onClick={() => selectPreset('morning')}>{t('meetings.morning')}</button>
                                            <button onClick={() => selectPreset('afternoon')}>{t('meetings.afternoon')}</button>
                                            <button onClick={() => selectPreset('fullday')}>{t('meetings.full_day')}</button>
                                            <button onClick={() => selectPreset('clear')} className="clear-btn">{t('meetings.clear')}</button>
                                        </div>
                                    )}

                                    <p className="section-hint">
                                        {isMultiSelectMode
                                            ? `حدد الفترات المطلوبة ثم اضغط إضافة (${selectedTimes.length} محدد)`
                                            : 'اضغط لإضافة • اضغط على المتاح للإزالة'}
                                    </p>

                                    <div className="time-grid">
                                        {TIME_SLOTS.map(timeSlot => {
                                            const exists = selectedDate.slots.find(s => s.time === timeSlot.start);
                                            const isPast = isSlotPast(selectedDate.dateStr, timeSlot.start);
                                            const isPendingRemove = pendingRemoveTime === timeSlot.start;
                                            const isSelected = selectedTimes.includes(timeSlot.start);
                                            const canInteract = !isPast && (!exists || exists.status === 'available');

                                            return (
                                                <button
                                                    key={timeSlot.start}
                                                    className={`time-btn ${exists ? 'exists ' + exists.status : ''} ${isPast ? 'past' : ''} ${isPendingRemove ? 'pending-remove' : ''} ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => handleTimeSlotClick(timeSlot, exists, isPast)}
                                                    disabled={!canInteract && !isMultiSelectMode}
                                                >
                                                    {isPendingRemove ? (t('commissions.confirm') || 'تأكيد؟') : timeSlot.start}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {isMultiSelectMode && selectedTimes.length > 0 && (
                                        <button className="batch-add-btn" onClick={addSelectedSlots}>
                                            <Plus size={16} />
                                            {t('meetings.add_count_slots').replace('{count}', selectedTimes.length)}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {isReviewModalOpen && slotToReview && (
                <div className="modal-overlay" onClick={closeReviewModal}>
                    <div className="review-modal" onClick={e => e.stopPropagation()}>
                        <div className="review-header">
                            {reviewStep === 'success' ? <CheckCircle size={24} color="var(--color-success)" /> : <AlertCircle size={24} />}
                            <h3>
                                {reviewStep === 'success' && t('meetings.processed_success')}
                                {reviewStep === 'initial' && t('meetings.review_expired')}
                                {reviewStep === 'refuse_form' && t('meetings.refusal_reason')}
                                {reviewStep === 'noshow_form' && t('meetings.noshow_record')}
                            </h3>
                            <button onClick={closeReviewModal}><X size={20} /></button>
                        </div>

                        <div className="review-body">
                            {reviewStep === 'initial' && (
                                <>
                                    <div className="review-info">
                                        <div className="info-row">
                                            <span className="label">{t('guardian')}:</span>
                                            <span className="value">{slotToReview.parentName}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">{t('request_date')}:</span>
                                            <span className="value">{slotToReview.date} - {slotToReview.time}</span>
                                        </div>
                                    </div>
                                    <div className="review-question">{t('meetings.what_status')}</div>
                                    <div className="review-actions-grid">
                                        <button className="action-btn completed full-width" onClick={() => executeReviewAction('completed')}>
                                            <CheckCircle size={18} />
                                            <span>{t('meetings.accept_finance')}</span>
                                        </button>

                                        <div className="secondary-actions">
                                            <button className="action-btn canceled" onClick={() => setReviewStep('refuse_form')}>
                                                <XCircle size={18} />
                                                <span>{t('meetings.reject')}</span>
                                            </button>
                                            <button className="action-btn noshow" onClick={() => setReviewStep('noshow_form')}>
                                                <UserX size={18} />
                                                <span>{t('meetings.did_not_attend')}</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {reviewStep === 'success' && (
                                <div className="success-step">
                                    <div className="success-icon">
                                        <div className="ring"></div>
                                        <CheckCircle size={48} />
                                    </div>
                                    <h4>{t('meetings.file_sent_finance')}</h4>
                                    <p>{t('meetings.success_msg')}</p>
                                    <button className="close-action-btn" onClick={closeReviewModal}>{t('meetings.close')}</button>
                                </div>
                            )}

                            {reviewStep === 'refuse_form' && (
                                <div className="form-step">
                                    <label>{t('meetings.select_refusal_reason')}</label>
                                    <textarea
                                        placeholder={t('meetings.enter_reason')}
                                        value={reviewReason}
                                        onChange={(e) => setReviewReason(e.target.value)}
                                        rows={3}
                                    />
                                    <div className="form-actions">
                                        <button className="back-btn" onClick={() => setReviewStep('initial')}>{t('meetings.back')}</button>
                                        <button
                                            className="confirm-btn danger"
                                            onClick={() => executeReviewAction('canceled')}
                                            disabled={!reviewReason.trim()}
                                        >
                                            تأكيد الرفض
                                        </button>
                                    </div>
                                </div>
                            )}

                            {reviewStep === 'noshow_form' && (
                                <div className="form-step">
                                    <label>سبب عدم الحضور / ملاحظات:</label>
                                    <textarea
                                        placeholder="مثال: لم يجيب على الهاتف، طلب تأجيل، سبام..."
                                        value={reviewReason}
                                        onChange={(e) => setReviewReason(e.target.value)}
                                        rows={3}
                                    />
                                    <div className="noshow-options">
                                        <button
                                            className="option-btn reschedule"
                                            onClick={() => executeReviewAction('reschedule')}
                                            disabled={!reviewReason.trim()}
                                        >
                                            <RefreshCw size={16} />
                                            إعادة جدولة
                                        </button>
                                        <button
                                            className="option-btn reject"
                                            onClick={() => executeReviewAction('noshow')} // Treat as reject/noshow final
                                            disabled={!reviewReason.trim()}
                                        >
                                            <XCircle size={16} />
                                            رفض نهائي
                                        </button>
                                    </div>
                                    <button className="back-btn-text" onClick={() => setReviewStep('initial')}>إلغاء والعودة</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel/Refuse Confirmation Modal */}
            {isCancelModalOpen && slotToCancel && (
                <div className="modal-overlay" onClick={() => setIsCancelModalOpen(false)}>
                    <div className="cancel-modal" onClick={e => e.stopPropagation()}>
                        <div className="cancel-header">
                            <XCircle size={22} />
                            <h3>{cancelType === 'refuse' ? 'رفض الطلب' : 'إلغاء الموعد'}</h3>
                            <button onClick={() => setIsCancelModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="cancel-body">
                            <div className="cancel-info">
                                <div className="info-row">
                                    <span className="label">التاريخ:</span>
                                    <span className="value">{slotToCancel.date.split('-').reverse().join('/')}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">الوقت:</span>
                                    <span className="value">{slotToCancel.time}</span>
                                </div>
                                {slotToCancel.parentName && (
                                    <div className="info-row">
                                        <span className="label">ولي الأمر:</span>
                                        <span className="value">{slotToCancel.parentName}</span>
                                    </div>
                                )}
                            </div>

                            <div className="reason-section">
                                <label>سبب {cancelType === 'refuse' ? 'الرفض' : 'الإلغاء'}:</label>
                                <div className="reason-chips">
                                    {cancelReasons.map((reason, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className={`reason-chip ${cancelReason === reason ? 'active' : ''}`}
                                            onClick={() => setCancelReason(reason)}
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    placeholder="أو اكتب سبباً مخصصاً..."
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div className="cancel-actions">
                                <button className="back-btn" onClick={() => setIsCancelModalOpen(false)}>
                                    تراجع
                                </button>
                                <button
                                    className="confirm-btn"
                                    onClick={confirmCancel}
                                    disabled={!cancelReason.trim()}
                                >
                                    <XCircle size={16} />
                                    تأكيد {cancelType === 'refuse' ? 'الرفض' : 'الإلغاء'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Update/Edit Confirmed Meeting Modal */}
            {isEditModalOpen && slotToEdit && (
                <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
                    <div className="modal-content edit-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="header-title">
                                <Activity size={20} className="text-primary" />
                                <h3>تعديل تفاصيل الموعد</h3>
                            </div>
                            <button className="close-btn" onClick={() => setIsEditModalOpen(false)}><X size={20} /></button>
                        </div>

                        <div className="modal-body">
                            {/* Parent Info Card */}
                            <div className="info-card">
                                <div className="info-icon">
                                    <User size={20} />
                                </div>
                                <div className="info-content">
                                    <span className="label">ولي الأمر</span>
                                    <span className="value">{slotToEdit.parentName}</span>
                                    <span className="sub-value">{slotToEdit.parentPhone}</span>
                                </div>
                            </div>

                            <div className="form-section">
                                <div className="form-group">
                                    <label>اللجنة المسؤولة</label>
                                    <div className="select-wrapper">
                                        <select
                                            value={slotToEdit.commission}
                                            onChange={(e) => setSlotToEdit({ ...slotToEdit, commission: e.target.value })}
                                        >
                                            {COMMISSIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>توقيت الموعد ({slotToEdit.date})</label>
                                    <div className="time-grid-mini box-scroll">
                                        {TIME_SLOTS.slice(0, 32).map(t => (
                                            <button
                                                key={t.start}
                                                className={`time-chip ${slotToEdit.time === t.start ? 'active' : ''}`}
                                                onClick={() => setSlotToEdit({ ...slotToEdit, time: t.start })}
                                                type="button"
                                            >
                                                {t.start}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn secondary" onClick={() => setIsEditModalOpen(false)}>إلغاء</button>
                            <button
                                className="btn primary"
                                onClick={() => handleUpdateSlot(slotToEdit.id, {
                                    commission: slotToEdit.commission,
                                    time: slotToEdit.time
                                })}
                            >
                                حفظ التغييرات
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
