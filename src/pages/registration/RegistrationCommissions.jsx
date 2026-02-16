import React, { useState, useEffect } from 'react';
import { Users, Calendar, Plus, Settings, Grid, Edit, Trash2, Eye, UserCheck, ChevronLeft, ChevronRight, X, Clock, Check, AlertCircle, CheckCircle, XCircle, UserX, RefreshCw, User, Save } from 'react-feather';
import './RegistrationCommissions.scss';

import { useTranslation } from '../../context/LanguageContext';

// Helper to get localized month/day
const getMonthName = (monthIndex, locale = 'ar-DZ') => {
    const date = new Date(2024, monthIndex, 1);
    return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
};

const getDayName = (dayIndex, locale = 'ar-DZ') => {
    // 2024-01-07 was a Sunday (index 0 if we start from Sunday) or we can just map 0-6
    // The original array was Sunday-Saturday.
    // simpler:
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

// Slot statuses
const SLOT_STATUS = {
    AVAILABLE: 'available',
    RESERVED: 'reserved',
    APPROVED: 'approved',
    EXPIRED: 'expired',
    NEEDS_REVIEW: 'needs_review'
};

export const RegistrationCommissions = () => {
    const { t, language } = useTranslation();
    // Current time for the system
    const now = new Date(2026, 1, 9, 15, 18, 0);

    const [commissions, setCommissions] = useState([
        {
            id: 1,
            name: 'اللجنة الأولى', // Keep user names as is or use placeholder keys? Let's assume these are user input.
            color: '#3b82f6',
            members: [
                { id: 1, name: 'د. فاطمة الزهراء', role: 'psychology', title: 'أخصائي نفسي' },
                { id: 2, name: 'أ. محمد العربي', role: 'teacher', title: 'أستاذ المتوسط' },
                { id: 3, name: 'السيد أحمد بن علي', role: 'admin', title: 'إدارة' }
            ],
            criteria: {
                parentStatus: 'divorced',
                stage: 'middle',
                healthcare: 'full_care',
                otherFilters: []
            },
            requestCount: 12,
            meetingSlots: 8
        },
        {
            id: 2,
            name: 'اللجنة الثانية',
            color: '#8b5cf6',
            members: [
                { id: 4, name: 'د. خديجة بنت الحسن', role: 'psychology', title: 'أخصائي نفسي' },
                { id: 5, name: 'أ. يوسف الحكيم', role: 'teacher', title: 'أستاذ الإبتدائي' },
                { id: 6, name: 'السيدة منى الصالح', role: 'admin', title: 'إدارة' }
            ],
            criteria: {
                parentStatus: 'married',
                stage: 'primary',
                healthcare: 'full_care',
                otherFilters: []
            },
            requestCount: 15,
            meetingSlots: 10
        },
        {
            id: 3,
            name: 'اللجنة الثالثة',
            color: '#f97316',
            members: [
                { id: 7, name: 'د. سارة المنصوري', role: 'psychology', title: 'أخصائي نفسي' },
                { id: 8, name: 'أ. كمال الدين', role: 'teacher', title: 'أستاذ التحضيري' },
                { id: 9, name: 'السيد عمر بن خالد', role: 'admin', title: 'إدارة' }
            ],
            criteria: {
                parentStatus: 'all_cases',
                stage: 'preparatory',
                healthcare: 'all_cases',
                otherFilters: []
            },
            requestCount: 8,
            meetingSlots: 6
        }
    ]);

    // Time slot management state
    const [currentMonth, setCurrentMonth] = useState(now.getMonth());
    const [currentYear, setCurrentYear] = useState(now.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
    const [selectedCommission, setSelectedCommission] = useState(null);
    const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [pendingRemoveTime, setPendingRemoveTime] = useState(null);

    // Slots data
    const [slots, setSlots] = useState([
        { id: 1, date: '2026-02-08', time: '10:00', status: 'needs_review', parentName: 'أحمد علي', parentPhone: '0555123456' },
        { id: 2, date: '2026-02-08', time: '10:15', status: 'expired' },
        { id: 3, date: '2026-02-08', time: '11:00', status: 'needs_review', parentName: 'سارة محمد', parentPhone: '0555789012' },
        { id: 4, date: '2026-02-09', time: '09:00', status: 'expired' },
        { id: 5, date: '2026-02-09', time: '09:15', status: 'needs_review', parentName: 'خالد أحمد', parentPhone: '0555111222' },
        { id: 6, date: '2026-02-09', time: '14:00', status: 'approved', parentName: 'منى حسن', parentPhone: '0555333444' },
        { id: 7, date: '2026-02-09', time: '16:00', status: 'reserved', parentName: 'فاطمة علي', parentPhone: '0555555666' },
        { id: 8, date: '2026-02-09', time: '16:15', status: 'available' },
        { id: 9, date: '2026-02-10', time: '09:00', status: 'available' }, // Green
        { id: 10, date: '2026-02-10', time: '09:15', status: 'reserved', parentName: 'يوسف كمال', parentPhone: '0555777888' }, // Yellow
        { id: 11, date: '2026-02-10', time: '10:00', status: 'approved', parentName: 'نور الدين', parentPhone: '0555999000' }, // Blue
        { id: 12, date: '2026-02-10', time: '14:00', status: 'available' },

        // Mock data for UI Testing (Current/Future Date)
        { id: 13, date: '2026-02-12', time: '08:00', status: 'available' }, // Green
        { id: 14, date: '2026-02-12', time: '08:15', status: 'reserved', parentName: 'Test Parent', parentPhone: '0000' }, // Yellow
        { id: 15, date: '2026-02-12', time: '08:30', status: 'approved', parentName: 'Confirmed Parent', parentPhone: '1111' }, // Blue
        { id: 16, date: '2026-02-12', time: '08:45', status: 'needs_review', parentName: 'Pending Parent', parentPhone: '2222' }, // Red/Orange
    ]);

    // Helper functions
    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const isSlotPast = (dateStr, timeStr) => {
        const [y, m, d] = dateStr.split('-').map(Number);
        const [h, min] = timeStr.split(':').map(Number);
        const slotEnd = new Date(y, m - 1, d, h, min + 15);
        return slotEnd < now;
    };

    const getSlotsForDate = (dateStr) => {
        return slots.filter(s => s.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));
    };

    // Calendar navigation
    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const goToToday = () => {
        setCurrentMonth(now.getMonth());
        setCurrentYear(now.getFullYear());
    };

    // Generate calendar days
    const calendarDays = (() => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push({ day: null });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = formatDate(new Date(currentYear, currentMonth, day));
            const daySlots = getSlotsForDate(dateStr);
            const isToday = dateStr === formatDate(now);
            const isPast = new Date(currentYear, currentMonth, day) < new Date(now.getFullYear(), now.getMonth(), now.getDate());

            days.push({
                day,
                dateStr,
                slots: daySlots,
                isToday,
                isPast
            });
        }

        return days;
    })();

    // Handle day click in calendar
    const handleDayClick = (day) => {
        if (!day.day) return;
        setSelectedDate(day);
        setIsMultiSelectMode(false);
        setSelectedTimes([]);
        setPendingRemoveTime(null);
    };

    // Time slot management
    const addSlot = (time, status = SLOT_STATUS.AVAILABLE) => {
        if (!selectedDate) return;
        const exists = slots.find(s => s.date === selectedDate.dateStr && s.time === time);
        if (exists) return;

        const newSlot = {
            id: Date.now(),
            date: selectedDate.dateStr,
            time,
            status: status || SLOT_STATUS.AVAILABLE
        };
        setSlots([...slots, newSlot]);
        setPendingRemoveTime(null);
    };

    const removeSlot = (time) => {
        setSlots(slots.filter(s => !(s.date === selectedDate.dateStr && s.time === time)));
    };

    const approveSlot = (slotId) => {
        setSlots(slots.map(s => s.id === slotId ? { ...s, status: SLOT_STATUS.APPROVED } : s));
    };

    const toggleTimeSelection = (time) => {
        if (selectedTimes.includes(time)) {
            setSelectedTimes(selectedTimes.filter(t => t !== time));
        } else {
            setSelectedTimes([...selectedTimes, time]);
        }
    };

    const handleTimeSlotClick = (timeSlot, exists, isPast) => {
        if (isPast) return;

        if (isMultiSelectMode) {
            if (!exists) {
                toggleTimeSelection(timeSlot.start);
            }
            return;
        }

        // 3-State Logic: Empty -> Available (Green) -> Pending Remove (Red) -> Empty
        if (!exists) {
            // State 1: Create Available (Green)
            addSlot(timeSlot.start, SLOT_STATUS.AVAILABLE);
        } else if (exists.status === SLOT_STATUS.AVAILABLE) {
            // State 2: Available -> Pending Remove (Red/Warning)
            // We use a temporary local state or a specific status for this?
            // The user requested: "clicking again it turns red warning... clicking again it turns normal"
            // Let's use a temporary status `pending_remove` on the slot itself or local state.
            // Local state `pendingRemoveTime` is already here, let's use it effectively or update slot status?
            // Existing logic uses `pendingRemoveTime`. Let's stick to that for visual feedback.

            if (pendingRemoveTime === timeSlot.start) {
                // State 3: Confirmed Remove -> Empty
                removeSlot(timeSlot.start);
                setPendingRemoveTime(null);
            } else {
                // Trigger Warning State
                setPendingRemoveTime(timeSlot.start);
            }
        } else if (exists.status === 'pending_remove_visual_only') {
            // If we were to store it in the slot, handled above via pendingRemoveTime
        }
    };

    const addSelectedSlots = () => {
        selectedTimes.forEach(time => addSlot(time));
        setSelectedTimes([]);
        setIsMultiSelectMode(false);
    };

    const selectPreset = (type) => {
        let times = [];
        if (type === 'morning') {
            times = TIME_SLOTS.filter(t => parseInt(t.start.split(':')[0]) < 12).map(t => t.start);
        } else if (type === 'afternoon') {
            times = TIME_SLOTS.filter(t => parseInt(t.start.split(':')[0]) >= 12).map(t => t.start);
        } else if (type === 'fullday') {
            times = TIME_SLOTS.map(t => t.start);
        } else if (type === 'clear') {
            times = [];
        }

        const availableTimes = times.filter(time => {
            const exists = selectedDate?.slots.find(s => s.time === time);
            return !exists;
        });

        setSelectedTimes(availableTimes);
    };

    // Commission modal handlers
    const openCommissionModal = (commission = null) => {
        setSelectedCommission(commission);
        setIsCommissionModalOpen(true);
    };

    const closeCommissionModal = () => {
        setIsCommissionModalOpen(false);
        setSelectedCommission(null);
    };

    // Get role icon
    const getRoleIcon = (role) => {
        switch (role) {
            case 'psychology':
                return <AlertCircle size={14} />;
            case 'teacher':
                return <Users size={14} />;
            case 'admin':
                return <Settings size={14} />;
            default:
                return <User size={14} />;
        }
    };

    return (
        <div className="registration-commissions">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <div className="title-section">
                        <h1>إدارة اللجان والمواعيد</h1>
                        <p>إنشاء وإدارة لجان التسجيل وتخصيص الفترات الزمنية للمقابلات</p>
                    </div>
                </div>
            </div>

            {/* Meeting Manager Section */}
            <div className="meeting-manager-section">
                <div className="section-header">
                    <h2>إدارة الفترات الزمنية</h2>
                    <p>اضغط على أي يوم لإضافة أو تعديل الفترات المتاحة</p>
                </div>

                <div className="manager-container">
                    {/* Left: Calendar */}
                    <div className="calendar-panel">
                        <div className="calendar-nav">
                            <button onClick={goToPreviousMonth}><ChevronLeft size={20} /></button>
                            <h3>{getMonthName(currentMonth, language)} {currentYear}</h3>
                            <button onClick={goToNextMonth}><ChevronRight size={20} /></button>
                            <button className="today-btn" onClick={goToToday}>{t('today')}</button>
                        </div>

                        <div className="calendar-grid">
                            <div className="weekdays">
                                {[0, 1, 2, 3, 4, 5, 6].map(d => <div key={d}>{getDayName(d, language).substring(0, 3)}</div>)}
                            </div>
                            <div className="days">
                                {calendarDays.map((day, idx) => (
                                    <div
                                        key={idx}
                                        className={`day-cell ${!day.day ? 'empty' : ''} ${day.isToday ? 'today' : ''} ${day.isPast ? 'past' : ''} ${selectedDate?.dateStr === day.dateStr ? 'selected' : ''}`}
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

                        <div className="calendar-legend">
                            <div className="leg"><span className="dot available"></span> متاح</div>
                            <div className="leg"><span className="dot reserved"></span> محجوز</div>
                            <div className="leg"><span className="dot approved"></span> مؤكد</div>
                            <div className="leg"><span className="dot expired"></span> منتهي</div>
                        </div>
                    </div>

                    {/* Right: Slot Editor */}
                    <div className="slot-editor-panel">
                        {selectedDate ? (
                            <>
                                <div className="editor-header">
                                    <div className="date-display">
                                        <Calendar size={18} />
                                        <span>{selectedDate.day} {getMonthName(currentMonth, language)} {currentYear}</span>
                                    </div>
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
                                                <h4>{t('meetings.add_slots')}</h4>
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
                                                    <button onClick={() => selectPreset('morning')}>
                                                        <Clock size={14} />
                                                        الصباح (8-12)
                                                    </button>
                                                    <button onClick={() => selectPreset('afternoon')}>
                                                        <Clock size={14} />
                                                        المساء (12-17)
                                                    </button>
                                                    <button onClick={() => selectPreset('fullday')}>
                                                        <Calendar size={14} />
                                                        اليوم كامل
                                                    </button>
                                                    <button onClick={() => selectPreset('clear')} className="clear-btn">
                                                        <X size={14} />
                                                        مسح
                                                    </button>
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
                            </>
                        ) : (
                            <div className="no-date-selected">
                                <Calendar size={48} />
                                <p>اختر يوماً من التقويم لإدارة الفترات الزمنية</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Commission Handler Section */}
            <div className="commissions-section">
                <div className="section-header">
                    <h2>إدارة اللجان</h2>
                    <button className="action-btn primary" onClick={() => openCommissionModal()}>
                        <Plus size={18} />
                        إنشاء لجنة جديدة
                    </button>
                </div>

                <div className="commissions-grid">
                    {commissions.map((commission) => (
                        <div key={commission.id} className="commission-card" style={{ '--commission-color': commission.color }}>
                            <div className="commission-header">
                                <div className="commission-title">
                                    <div className="commission-icon">
                                        <Grid size={20} />
                                    </div>
                                    <h3>{commission.name}</h3>
                                </div>
                                <div className="commission-actions">
                                    <button className="icon-btn" onClick={() => openCommissionModal(commission)} title="تعديل">
                                        <Edit size={16} />
                                    </button>
                                    <button className="icon-btn danger" title="حذف">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="commission-criteria-box">
                                <h4>{t('commissions.criteria')}</h4>
                                <div className="criteria-list">
                                    <div className="criteria-item">
                                        <span className="label">{t('commissions.parent_status')}:</span>
                                        <span className="value">{t(`commissions.${commission.criteria.parentStatus}`)}</span>
                                    </div>
                                    <div className="criteria-item">
                                        <span className="label">{t('commissions.educational_stage')}:</span>
                                        <span className="value">{t(`commissions.${commission.criteria.stage}`)}</span>
                                    </div>
                                    <div className="criteria-item">
                                        <span className="label">{t('commissions.healthcare')}:</span>
                                        <span className="value">{t(`commissions.${commission.criteria.healthcare}`)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="commission-members">
                                <h4>{t('commissions.members')}</h4>
                                <div className="members-list">
                                    {commission.members.map(member => (
                                        <div key={member.id} className="member-item">
                                            <div className="member-icon">{getRoleIcon(member.role)}</div>
                                            <div className="member-info">
                                                <span className="member-name">{member.name}</span>
                                                <span className="member-title">{member.title}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="commission-stats">
                                <div className="stat-item">
                                    <UserCheck size={16} />
                                    <span>{t('commissions.request_count', { count: commission.requestCount })}</span>
                                </div>
                                <div className="stat-item">
                                    <Calendar size={16} />
                                    <span>{t('commissions.slot_count', { count: commission.meetingSlots })}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Commission Modal */}
            {isCommissionModalOpen && (
                <div className="modal-overlay" onClick={closeCommissionModal}>
                    <div className="modal-content commission-modal large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedCommission ? t('commissions.edit_commission') : t('commissions.create_commission')}</h2>
                            <button className="close-btn" onClick={closeCommissionModal}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>{t('commissions.commission_name')}</label>
                                <input type="text" placeholder={t('commissions.example_name') || "مثال: اللجنة الأولى"} defaultValue={selectedCommission?.name} />
                            </div>
                            <div className="form-group">
                                <label>{t('commissions.color')}</label>
                                <input type="color" defaultValue={selectedCommission?.color || '#3b82f6'} />
                            </div>

                            <div className="form-section">
                                <h4>{t('commissions.criteria')}</h4>
                                <div className="criteria-grid">
                                    <div className="form-group">
                                        <label>{t('commissions.parent_status')}</label>
                                        <select defaultValue={selectedCommission?.criteria.parentStatus}>
                                            <option value="all_cases">{t('commissions.all_cases')}</option>
                                            <option value="married">{t('commissions.married')}</option>
                                            <option value="divorced">{t('commissions.divorced')}</option>
                                            <option value="widowed">{t('commissions.widowed')}</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>{t('commissions.educational_stage')}</label>
                                        <select defaultValue={selectedCommission?.criteria.stage}>
                                            <option value="all_stages">{t('commissions.all_stages')}</option>
                                            <option value="preparatory">{t('commissions.preparatory')}</option>
                                            <option value="primary">{t('commissions.primary')}</option>
                                            <option value="middle">{t('commissions.middle')}</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>{t('commissions.healthcare')}</label>
                                        <select defaultValue={selectedCommission?.criteria.healthcare}>
                                            <option value="all_cases">{t('commissions.all_cases')}</option>
                                            <option value="full_care">{t('commissions.full_care') || 'رعاية كاملة'}</option>
                                            <option value="partial_care">{t('commissions.partial_care') || 'رعاية جزئية'}</option>
                                            <option value="no_care">{t('commissions.no_care') || 'بدون رعاية'}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h4>أعضاء اللجنة (3 مطلوب)</h4>
                                <p className="section-description">يجب أن تحتوي كل لجنة على عضو من كل قسم</p>

                                {/* Psychology Member */}
                                <div className="member-role-section">
                                    <div className="role-header">
                                        <div className="role-icon psychology">
                                            <AlertCircle size={16} />
                                        </div>
                                        <h5>الأخصائي النفسي</h5>
                                    </div>
                                    {selectedCommission?.members.find(m => m.role === 'psychology') ? (
                                        <div className="member-display">
                                            <div className="member-info">
                                                <span className="member-name">
                                                    {selectedCommission.members.find(m => m.role === 'psychology').name}
                                                </span>
                                                <span className="member-title">
                                                    {selectedCommission.members.find(m => m.role === 'psychology').title}
                                                </span>
                                            </div>
                                            <button className="remove-member-btn" title="إزالة">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="form-group">
                                            <select>
                                                <option value="">اختر أخصائي نفسي...</option>
                                                <option value="1">د. فاطمة الزهراء - أخصائي نفسي</option>
                                                <option value="2">د. خديجة بنت الحسن - أخصائي نفسي</option>
                                                <option value="3">د. سارة المنصوري - أخصائي نفسي</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Teacher Member */}
                                <div className="member-role-section">
                                    <div className="role-header">
                                        <div className="role-icon teacher">
                                            <Users size={16} />
                                        </div>
                                        <h5>معلم المرحلة</h5>
                                    </div>
                                    {selectedCommission?.members.find(m => m.role === 'teacher') ? (
                                        <div className="member-display">
                                            <div className="member-info">
                                                <span className="member-name">
                                                    {selectedCommission.members.find(m => m.role === 'teacher').name}
                                                </span>
                                                <span className="member-title">
                                                    {selectedCommission.members.find(m => m.role === 'teacher').title}
                                                </span>
                                            </div>
                                            <button className="remove-member-btn" title="إزالة">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="form-group">
                                            <select>
                                                <option value="">اختر معلم...</option>
                                                <option value="1">أ. محمد العربي - أستاذ المتوسط</option>
                                                <option value="2">أ. يوسف الحكيم - أستاذ الإبتدائي</option>
                                                <option value="3">أ. كمال الدين - أستاذ التحضيري</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Admin Member */}
                                <div className="member-role-section">
                                    <div className="role-header">
                                        <div className="role-icon admin">
                                            <Settings size={16} />
                                        </div>
                                        <h5>عضو الإدارة</h5>
                                    </div>
                                    {selectedCommission?.members.find(m => m.role === 'admin') ? (
                                        <div className="member-display">
                                            <div className="member-info">
                                                <span className="member-name">
                                                    {selectedCommission.members.find(m => m.role === 'admin').name}
                                                </span>
                                                <span className="member-title">
                                                    {selectedCommission.members.find(m => m.role === 'admin').title}
                                                </span>
                                            </div>
                                            <button className="remove-member-btn" title="إزالة">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="form-group">
                                            <select>
                                                <option value="">اختر عضو إداري...</option>
                                                <option value="1">السيد أحمد بن علي - إدارة</option>
                                                <option value="2">السيدة منى الصالح - إدارة</option>
                                                <option value="3">السيد عمر بن خالد - إدارة</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn secondary" onClick={closeCommissionModal}>
                                <X size={16} />
                                {t('commissions.cancel')}
                            </button>
                            <button className="btn primary">
                                <Save size={16} />
                                {selectedCommission ? t('commissions.save_changes') : t('commissions.create')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
