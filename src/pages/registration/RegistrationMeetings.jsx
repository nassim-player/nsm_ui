
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, X, Edit2, Trash2 } from 'react-feather';
import './RegistrationMeetings.scss';

// Arabic month names
const arabicMonths = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

// Arabic day names
const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export const RegistrationMeetings = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    // Placeholder meetings data - will be dynamic later
    const [meetings, setMeetings] = useState([]);

    // Navigate to previous month
    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    // Navigate to next month
    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Go to today
    const goToToday = () => {
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    };

    // Get calendar days for current month
    const getCalendarDays = () => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            days.push({ day: null, isCurrentMonth: false });
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const isToday =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

            const dayMeetings = meetings.filter(m => {
                const meetingDate = new Date(m.date);
                return meetingDate.getDate() === day &&
                    meetingDate.getMonth() === currentMonth &&
                    meetingDate.getFullYear() === currentYear;
            });

            days.push({
                day,
                date,
                isCurrentMonth: true,
                isToday,
                meetings: dayMeetings
            });
        }

        return days;
    };

    // Handle day click
    const handleDayClick = (dayInfo) => {
        if (dayInfo.day) {
            setSelectedDate(dayInfo);
            if (dayInfo.meetings && dayInfo.meetings.length > 0) {
                setSelectedMeeting(dayInfo.meetings[0]);
            } else {
                setSelectedMeeting(null);
            }
        }
    };

    // Handle cancel meeting
    const handleCancelMeeting = (meetingId) => {
        // Placeholder - will connect to API later
        console.log('Cancel meeting:', meetingId);
        setSelectedMeeting(null);
    };

    // Handle reschedule meeting
    const handleRescheduleMeeting = (meetingId) => {
        // Placeholder - will connect to API later
        console.log('Reschedule meeting:', meetingId);
    };

    const calendarDays = getCalendarDays();

    return (
        <div className="registration-meetings">
            <div className="page-header">
                <div className="header-content">
                    <h1>جدول الاجتماعات</h1>
                    <p>عرض وإدارة مواعيد الاجتماعات مع أولياء الأمور</p>
                </div>
            </div>

            <div className="meetings-layout">
                {/* Calendar Section - Left Half */}
                <div className="calendar-section">
                    <div className="calendar-container">
                        {/* Calendar Header */}
                        <div className="calendar-header">
                            <div className="month-navigation">
                                <button className="nav-btn" onClick={goToNextMonth} title="الشهر التالي">
                                    <ChevronRight size={18} />
                                </button>
                                <h2>{arabicMonths[currentMonth]} {currentYear}</h2>
                                <button className="nav-btn" onClick={goToPreviousMonth} title="الشهر السابق">
                                    <ChevronLeft size={18} />
                                </button>
                            </div>
                            <button className="today-btn" onClick={goToToday}>
                                <Calendar size={14} />
                                اليوم
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="calendar-grid">
                            {/* Day Headers */}
                            <div className="calendar-weekdays">
                                {arabicDays.map((day, index) => (
                                    <div key={index} className="weekday">{day}</div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="calendar-days">
                                {calendarDays.map((dayInfo, index) => (
                                    <div
                                        key={index}
                                        className={`calendar-day ${!dayInfo.day ? 'empty' : ''} ${dayInfo.isToday ? 'today' : ''} ${dayInfo.meetings?.length > 0 ? 'has-meetings' : ''} ${selectedDate?.day === dayInfo.day ? 'selected' : ''}`}
                                        onClick={() => handleDayClick(dayInfo)}
                                    >
                                        {dayInfo.day && (
                                            <>
                                                <span className="day-number">{dayInfo.day}</span>
                                                {dayInfo.meetings?.length > 0 && (
                                                    <div className="meeting-dots">
                                                        {dayInfo.meetings.slice(0, 3).map((_, i) => (
                                                            <span key={i} className="meeting-dot" />
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="calendar-legend">
                            <div className="legend-item">
                                <span className="legend-dot today"></span>
                                <span>اليوم</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-dot has-meeting"></span>
                                <span>يوم به مواعيد</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Meetings Panel - Right Half */}
                <div className="meetings-section">
                    <div className="meetings-panel">
                        <div className="panel-header">
                            <h3>
                                <Calendar size={18} />
                                {selectedDate
                                    ? `${selectedDate.day} ${arabicMonths[currentMonth]} ${currentYear}`
                                    : 'المواعيد القادمة'
                                }
                            </h3>
                        </div>

                        <div className="panel-content">
                            {selectedDate ? (
                                // Show selected day's meetings
                                selectedDate.meetings?.length > 0 ? (
                                    <div className="meetings-list">
                                        {selectedDate.meetings.map((meeting, index) => (
                                            <div key={index} className="meeting-card">
                                                <div className="meeting-info">
                                                    <div className="meeting-time">
                                                        <Clock size={14} />
                                                        <span>{meeting.time}</span>
                                                    </div>
                                                    <div className="meeting-parent">
                                                        <User size={14} />
                                                        <span>{meeting.parentName}</span>
                                                    </div>
                                                    {meeting.notes && (
                                                        <p className="meeting-notes">{meeting.notes}</p>
                                                    )}
                                                </div>
                                                <div className="meeting-actions">
                                                    <button
                                                        className="action-btn reschedule"
                                                        onClick={() => handleRescheduleMeeting(meeting.id)}
                                                        title="إعادة الجدولة"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        className="action-btn cancel"
                                                        onClick={() => handleCancelMeeting(meeting.id)}
                                                        title="إلغاء الموعد"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-meetings">
                                        <Calendar size={40} />
                                        <p>لا توجد مواعيد في هذا اليوم</p>
                                        <span>اختر يوماً آخر من التقويم</span>
                                    </div>
                                )
                            ) : (
                                // Default state - no day selected
                                <div className="no-meetings">
                                    <Calendar size={40} />
                                    <p>اختر يوماً من التقويم</p>
                                    <span>ستظهر هنا تفاصيل المواعيد المجدولة</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
