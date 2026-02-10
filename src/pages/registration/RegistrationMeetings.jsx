import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, X, Plus, Check, RefreshCw, Trash2, AlertCircle, CheckCircle, XCircle, UserX } from 'react-feather';
import './RegistrationMeetings.scss';

// Arabic month names
const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

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

// Slot statuses
const SLOT_STATUS = {
    AVAILABLE: 'available',      // Green - Admin created, open for booking
    RESERVED: 'reserved',        // Yellow - Parent booked, awaiting approval
    APPROVED: 'approved',        // Blue - Admin confirmed meeting
    EXPIRED: 'expired',          // Gray - Time passed (empty slot)
    NEEDS_REVIEW: 'needs_review' // Orange - Past meeting needs admin action
};

export const RegistrationMeetings = () => {
    // Current time for the system (Feb 9, 2026, 3:18 PM)
    const now = new Date(2026, 1, 9, 15, 18, 0);
    const [currentMonth, setCurrentMonth] = useState(now.getMonth());
    const [currentYear, setCurrentYear] = useState(now.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [isSlotEditorOpen, setIsSlotEditorOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [slotToReview, setSlotToReview] = useState(null);

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

    // Get slots needing review
    const needsReviewSlots = slots.filter(s => s.status === SLOT_STATUS.NEEDS_REVIEW);

    // Get pending reservations (yellow)
    const pendingReservations = slots.filter(s => s.status === SLOT_STATUS.RESERVED && !isSlotPast(s.date, s.time));

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
        setIsReviewModalOpen(true);
    };

    // Handle review actions
    const handleReviewAction = (action) => {
        if (!slotToReview) return;

        switch (action) {
            case 'completed':
                // Mark as completed and remove from active list
                setSlots(slots.filter(s => s.id !== slotToReview.id));
                break;
            case 'noshow':
                // Parent didn't show, remove slot
                setSlots(slots.filter(s => s.id !== slotToReview.id));
                break;
            case 'canceled':
                // Meeting was canceled
                setSlots(slots.filter(s => s.id !== slotToReview.id));
                break;
            case 'reschedule':
                // Convert back to available? Or handle separately
                setSlots(slots.filter(s => s.id !== slotToReview.id));
                break;
        }
        setIsReviewModalOpen(false);
        setSlotToReview(null);
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
                        <h1>إدارة مواعيد المقابلات</h1>
                        <p>نظام إدارة الفترات الزمنية للمقابلات مع أولياء الأمور</p>
                    </div>
                    <button className="manage-btn" onClick={() => setIsManageModalOpen(true)}>
                        <Calendar size={18} />
                        إدارة الفترات
                    </button>
                </div>
            </div>

            {/* Alerts Section */}
            {needsReviewSlots.length > 0 && (
                <div className="alerts-banner">
                    <AlertCircle size={20} />
                    <span>يوجد <strong>{needsReviewSlots.length}</strong> موعد منتهي يحتاج مراجعة</span>
                    <button onClick={() => openReviewModal(needsReviewSlots[0])}>مراجعة الآن</button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="stats-row">
                <div className="stat-card available">
                    <div className="stat-icon"><Clock size={20} /></div>
                    <div className="stat-data">
                        <span className="num">{availableCount}</span>
                        <span className="label">فترة متاحة</span>
                    </div>
                </div>
                <div className="stat-card reserved">
                    <div className="stat-icon"><User size={20} /></div>
                    <div className="stat-data">
                        <span className="num">{reservedCount}</span>
                        <span className="label">بانتظار الموافقة</span>
                    </div>
                </div>
                <div className="stat-card approved">
                    <div className="stat-icon"><CheckCircle size={20} /></div>
                    <div className="stat-data">
                        <span className="num">{approvedCount}</span>
                        <span className="label">مواعيد مؤكدة</span>
                    </div>
                </div>
                <div className="stat-card review">
                    <div className="stat-icon"><AlertCircle size={20} /></div>
                    <div className="stat-data">
                        <span className="num">{needsReviewSlots.length}</span>
                        <span className="label">تحتاج مراجعة</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="content-grid">
                {/* Pending Reservations */}
                <div className="panel pending-panel">
                    <div className="panel-header">
                        <h3>طلبات الحجز الجديدة</h3>
                        <span className="badge yellow">{pendingReservations.length}</span>
                    </div>
                    <div className="panel-body">
                        {pendingReservations.length > 0 ? (
                            pendingReservations.map(slot => (
                                <div key={slot.id} className="reservation-card">
                                    <div className="card-header">
                                        <span className="date">{slot.date.split('-').reverse().join('/')}</span>
                                        <span className="time">{slot.time}</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="parent-info">
                                            <User size={14} />
                                            <span>{slot.parentName}</span>
                                        </div>
                                        <div className="phone">{slot.parentPhone}</div>
                                    </div>
                                    <div className="card-actions">
                                        <button className="approve-btn" onClick={() => approveSlot(slot.id)}>
                                            <Check size={14} /> موافقة
                                        </button>
                                        <button className="reschedule-btn" title="إعادة جدولة">
                                            <RefreshCw size={14} />
                                        </button>
                                        <button className="remove-btn" onClick={() => openCancelModal(slot, 'refuse')} title="رفض">
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <User size={32} />
                                <p>لا توجد طلبات حجز جديدة</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Approved */}
                <div className="panel approved-panel">
                    <div className="panel-header">
                        <h3>المواعيد المؤكدة القادمة</h3>
                        <span className="badge blue">{upcomingApproved.length}</span>
                    </div>
                    <div className="panel-body">
                        {upcomingApproved.length > 0 ? (
                            upcomingApproved.slice(0, 5).map(slot => (
                                <div key={slot.id} className="approved-item">
                                    <div className="item-date">
                                        <span className="day">{slot.date.split('-')[2]}</span>
                                        <span className="month">{arabicMonths[parseInt(slot.date.split('-')[1]) - 1]}</span>
                                    </div>
                                    <div className="item-info">
                                        <div className="time">{slot.time}</div>
                                        <div className="name">{slot.parentName}</div>
                                    </div>
                                    <div className="item-status">
                                        <CheckCircle size={16} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <Calendar size={32} />
                                <p>لا توجد مواعيد مؤكدة</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="status-legend">
                <div className="legend-title">دليل الألوان:</div>
                <div className="legend-items">
                    <div className="legend-item"><span className="dot available"></span> فترة متاحة</div>
                    <div className="legend-item"><span className="dot reserved"></span> محجوز (بانتظار الموافقة)</div>
                    <div className="legend-item"><span className="dot approved"></span> موعد مؤكد</div>
                    <div className="legend-item"><span className="dot expired"></span> منتهي</div>
                </div>
            </div>

            {/* Management Modal */}
            {isManageModalOpen && (
                <div className="modal-overlay" onClick={() => setIsManageModalOpen(false)}>
                    <div className="management-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="header-text">
                                <h2>إدارة الفترات الزمنية</h2>
                                <p>اضغط على أي يوم لإضافة أو تعديل الفترات المتاحة</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsManageModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* Calendar Navigation */}
                            <div className="calendar-nav">
                                <button onClick={goToPreviousMonth}><ChevronLeft size={20} /></button>
                                <h3>{arabicMonths[currentMonth]} {currentYear}</h3>
                                <button onClick={goToNextMonth}><ChevronRight size={20} /></button>
                                <button className="today-btn" onClick={goToToday}>اليوم</button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="calendar-grid">
                                <div className="weekdays">
                                    {arabicDays.map(d => <div key={d}>{d.substring(0, 2)}</div>)}
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
                                <div className="leg"><span className="dot available"></span> متاح</div>
                                <div className="leg"><span className="dot reserved"></span> محجوز</div>
                                <div className="leg"><span className="dot approved"></span> مؤكد</div>
                                <div className="leg"><span className="dot expired"></span> منتهي</div>
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
                                <span>{selectedDate.day} {arabicMonths[currentMonth]} {currentYear}</span>
                            </div>
                            <button onClick={() => setIsSlotEditorOpen(false)}><X size={20} /></button>
                        </div>

                        <div className="editor-body">
                            <div className="slots-section">
                                <h4>الفترات الحالية</h4>
                                <div className="current-slots">
                                    {selectedDate.slots.length > 0 ? (
                                        selectedDate.slots.map(slot => (
                                            <div key={slot.id} className={`slot-item ${slot.status}`}>
                                                <div className="slot-time">{slot.time}</div>
                                                <div className="slot-info">
                                                    {slot.parentName ? (
                                                        <span className="parent">{slot.parentName}</span>
                                                    ) : (
                                                        <span className="empty-label">فترة متاحة</span>
                                                    )}
                                                </div>
                                                <div className="slot-status">
                                                    {slot.status === 'available' && <span className="tag green">متاح</span>}
                                                    {slot.status === 'reserved' && <span className="tag yellow">محجوز</span>}
                                                    {slot.status === 'approved' && <span className="tag blue">مؤكد</span>}
                                                    {slot.status === 'expired' && <span className="tag gray">منتهي</span>}
                                                    {slot.status === 'needs_review' && <span className="tag orange">مراجعة</span>}
                                                </div>
                                                <div className="slot-actions">
                                                    {slot.status === 'reserved' && (
                                                        <button className="approve" onClick={() => approveSlot(slot.id)} title="موافقة">
                                                            <Check size={14} />
                                                        </button>
                                                    )}
                                                    {slot.status === 'needs_review' && (
                                                        <button className="review" onClick={() => openReviewModal(slot)} title="مراجعة">
                                                            <AlertCircle size={14} />
                                                        </button>
                                                    )}
                                                    {(slot.status === 'available' || slot.status === 'expired') && (
                                                        <button className="delete" onClick={() => removeSlot(slot.id)} title="حذف">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-slots">لا توجد فترات محددة لهذا اليوم</div>
                                    )}
                                </div>
                            </div>

                            {!selectedDate.isPast && (
                                <div className="add-slots-section">
                                    <div className="section-header-row">
                                        <h4>إضافة فترات متاحة</h4>
                                        <button
                                            className={`multi-select-toggle ${isMultiSelectMode ? 'active' : ''}`}
                                            onClick={() => {
                                                setIsMultiSelectMode(!isMultiSelectMode);
                                                setSelectedTimes([]);
                                            }}
                                        >
                                            {isMultiSelectMode ? 'إلغاء التحديد' : 'تحديد متعدد'}
                                        </button>
                                    </div>

                                    {isMultiSelectMode && (
                                        <div className="preset-buttons">
                                            <button onClick={() => selectPreset('morning')}>الصباح (8-12)</button>
                                            <button onClick={() => selectPreset('afternoon')}>المساء (12-17)</button>
                                            <button onClick={() => selectPreset('fullday')}>اليوم كامل</button>
                                            <button onClick={() => selectPreset('clear')} className="clear-btn">مسح</button>
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
                                                    {isPendingRemove ? 'تأكيد؟' : timeSlot.start}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {isMultiSelectMode && selectedTimes.length > 0 && (
                                        <button className="batch-add-btn" onClick={addSelectedSlots}>
                                            <Plus size={16} />
                                            إضافة {selectedTimes.length} فترة
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
                <div className="modal-overlay" onClick={() => setIsReviewModalOpen(false)}>
                    <div className="review-modal" onClick={e => e.stopPropagation()}>
                        <div className="review-header">
                            <AlertCircle size={24} />
                            <h3>مراجعة الموعد المنتهي</h3>
                            <button onClick={() => setIsReviewModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="review-body">
                            <div className="review-info">
                                <div className="info-row">
                                    <span className="label">التاريخ:</span>
                                    <span className="value">{slotToReview.date.split('-').reverse().join('/')}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">الوقت:</span>
                                    <span className="value">{slotToReview.time}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">ولي الأمر:</span>
                                    <span className="value">{slotToReview.parentName}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">الهاتف:</span>
                                    <span className="value">{slotToReview.parentPhone}</span>
                                </div>
                            </div>
                            <div className="review-question">ما حالة هذا الموعد؟</div>
                            <div className="review-actions">
                                <button className="action-btn completed" onClick={() => handleReviewAction('completed')}>
                                    <CheckCircle size={18} />
                                    <span>تم المقابلة</span>
                                </button>
                                <button className="action-btn noshow" onClick={() => handleReviewAction('noshow')}>
                                    <UserX size={18} />
                                    <span>لم يحضر</span>
                                </button>
                                <button className="action-btn canceled" onClick={() => handleReviewAction('canceled')}>
                                    <XCircle size={18} />
                                    <span>ألغيت</span>
                                </button>
                                <button className="action-btn reschedule" onClick={() => handleReviewAction('reschedule')}>
                                    <RefreshCw size={18} />
                                    <span>إعادة جدولة</span>
                                </button>
                            </div>
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
        </div>
    );
};
