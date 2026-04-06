import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import {
    Calendar, Check, X, User, Clock, Bookmark, MoreVertical, MessageCircle, AlertCircle, FileText, Edit3
} from 'react-feather';
import { Panel } from '../../components/common/Panel/Panel';
import { Modal } from '../../components/common/Modal/Modal';
import { DataTable } from '../../components/common/DataTable/DataTable';
import './ReceptionOverview.scss';

export const ReceptionRequests = () => {
    const { t } = useTranslation();
    const [selectedRescheduleRequest, setSelectedRescheduleRequest] = useState(null);
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    // Mock Data for Queue (Appointment Requests)
    const requestsQueue = [
        { id: 'RQ-101', parent: 'أحمد الإبراهيمي', purpose: 'تسجيل جديد', target: 'مدير المدرسة', date: '2026-02-23', time: '09:00', status: 'pending' },
        { id: 'RQ-102', parent: 'سارة العلي', purpose: 'استفسار مالي', target: 'المحاسبة', date: '2026-02-23', time: '10:30', status: 'pending' },
        { id: 'RQ-103', parent: 'ليلى بن يوسف', purpose: 'متابعة مستوى التلميذ', target: 'أستاذ الرياضيات', date: '2026-02-24', time: '11:00', status: 'approved' }
    ];

    // Mock Data for Recent Logs
    const recentLogs = [
        {
            id: 'RL-1',
            parent: 'رضا عماري',
            student: 'أمين عماري',
            reason: 'استلام شهادة مدرسية',
            timeIn: '08:05',
            timeOut: '08:40',
            target: 'المدير',
            result: 'تم استلام الشهادة وتوقيع السجل الورقي بنجاح.',
            date: '2026-02-22'
        },
        {
            id: 'RL-2',
            parent: 'سمير خليل',
            student: 'ياسين خليل',
            reason: 'تحويل قسم',
            timeIn: '09:10',
            timeOut: '09:50',
            target: 'الإدارة المالية',
            result: 'تمت الموافقة على التحويل وسيتم تحديث القوائم غداً.',
            date: '2026-02-22'
        },
        {
            id: 'RL-3',
            parent: 'حسناء بلحاج',
            student: 'لينا بلحاج',
            reason: 'تأخر متكرر',
            timeIn: '13:00',
            timeOut: '',
            target: 'مستشار التربية',
            result: 'قيد الاجتماع لمناقشة حلول عملية للتأخر الصباحي.',
            date: '2026-02-22'
        }
    ];

    const isMeetingLate = (timeIn) => {
        if (!timeIn) return false;
        const now = new Date();
        const [hours, minutes] = timeIn.split(':').map(Number);
        const meetingTime = new Date();
        meetingTime.setHours(hours, minutes, 0);

        return now > new Date(meetingTime.getTime() + 15 * 60000);
    };

    const columns = useMemo(() => [
        {
            key: 'parent',
            label: t?.('reception.visitor_name'),
            visible: true,
            width: 250,
            render: (value, row) => (
                <div className="visitor-cell">
                    <div className="avatar">{value.charAt(0)}</div>
                    <div className="info">
                        <span>{value}</span>
                        <small>{row.id}</small>
                    </div>
                </div>
            )
        },
        {
            key: 'purpose',
            label: t?.('reception.purpose'),
            visible: true,
            render: (value) => (
                <div style={{ fontWeight: '600' }}>{value}</div>
            )
        },
        {
            key: 'target',
            label: t?.('reception.meeting_with'),
            visible: true,
            render: (value) => (
                <div className="with-cell">
                    <User size={14} />
                    <span>{value}</span>
                </div>
            )
        },
        {
            key: 'time_slot',
            label: t?.('reception.time_slot'),
            visible: true,
            render: (_, row) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700' }}>
                        <Calendar size={13} />
                        {row.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-slate-400)' }}>
                        <Clock size={13} />
                        {row.time}
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            label: t?.('reception.status'),
            visible: true,
            render: (status) => {
                const statuses = {
                    pending: { label: t?.('reception.status_new') || 'جديد', color: 'warning' },
                    approved: { label: t?.('reception.status_approved') || 'مقبول', color: 'success' },
                    rejected: { label: t?.('reception.status_rejected') || 'مرفوض', color: 'danger' }
                };
                const s = statuses[status] || statuses.pending;
                return <span className={`dt-badge ${s.color}`}>{s.label}</span>;
            }
        },
        {
            key: 'actions',
            label: t?.('reception.actions'),
            visible: true,
            render: (_, row) => (
                <div className="actions-cell">
                    <button
                        className="btn-reschedule"
                        title={t?.('reception.reschedule') || 'إعادة جدولة'}
                        onClick={(e) => { e.stopPropagation(); setSelectedRescheduleRequest(row); }}
                    >
                        <Calendar size={18} />
                    </button>
                </div>
            )
        }
    ], [t]);

    return (
        <div className="requests-section fade-in">
            <div className="page-header">
                <div className="header-content">
                    <h1>{t?.('reception.nav_requests')}</h1>
                    <p>{t?.('reception.requests_desc')}</p>
                </div>
            </div>

            <Panel
                title={t?.('reception.centralized_queue')}
                icon={Calendar}
                contentClassName="p-0"
            >
                <DataTable
                    data={requestsQueue}
                    columns={columns}
                    defaultColumns={columns}
                    searchPlaceholder={t?.('common.search') || 'بحث...'}
                    emptyTitle={t?.('reception.no_requests')}
                />
            </Panel>

            <div className="log-container-wrapper" style={{ marginTop: '30px' }}>
                <div className="recent-logs-panel">
                    <h3>{t?.('reception.log_history') || 'أرشيف اليوم'}</h3>
                    <div className="logs-list">
                        {recentLogs.map(log => {
                            const isLate = isMeetingLate(log.timeIn) && !log.timeOut;
                            return (
                                <div
                                    className={`log-item ${isLate ? 'late-warning' : ''}`}
                                    key={log.id}
                                    onClick={() => setSelectedMeeting(log)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="log-header">
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="log-name">{log.parent}</span>
                                            <small style={{ color: 'var(--color-slate-400)', fontWeight: '600' }}>{t?.('common.student') || 'التلميذ'}: {log.student}</small>
                                        </div>
                                        <span className="log-time">
                                            <Clock size={12} style={{ marginLeft: '4px' }} />
                                            {log.timeIn} {log.timeOut ? `- ${log.timeOut}` : ''}
                                        </span>
                                    </div>
                                    <div className="log-reason" style={{ fontSize: '13px', color: 'var(--color-slate-600)', margin: '8px 0' }}>
                                        <MessageCircle size={14} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
                                        {log.reason}
                                    </div>
                                    <div className="log-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div className="log-with">
                                            <User size={14} />
                                            <span>{log.target}</span>
                                        </div>
                                        {isLate && (
                                            <div style={{ color: '#d97706', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <AlertCircle size={12} />
                                                {t?.('reception.overdue') || 'تجاوز الوقت'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* Reschedule Modal */}
            <Modal
                isOpen={!!selectedRescheduleRequest}
                onClose={() => setSelectedRescheduleRequest(null)}
                title={t?.('reception.reschedule') || 'إعادة جدولة الموعد'}
                width="400px"
            >
                {selectedRescheduleRequest && (
                    <div style={{ padding: '10px' }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px', lineHeight: '1.6' }}>
                            {t?.('reception.reschedule_desc') || 'تحديد الوقت الجديد للمركز مع'} <strong>{selectedRescheduleRequest.target}</strong> {t?.('reception.reschedule_regarding') || 'بخصوص'} <strong>{selectedRescheduleRequest.purpose}</strong>.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-color)' }}>{t?.('reception.new_time') || 'الوقت الجديد'}</label>
                            <input type="time" defaultValue={selectedRescheduleRequest.time} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'inherit', transition: 'border-color 0.2s', width: '100%' }} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                            <button
                                type="button"
                                onClick={() => setSelectedRescheduleRequest(null)}
                                style={{ padding: '10px 20px', borderRadius: '10px', background: 'var(--color-slate-100)', color: 'var(--text-color)', border: 'none', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' }}
                            >
                                {t?.('common.cancel') || 'إلغاء'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRescheduleRequest(null)}
                                style={{ padding: '10px 20px', borderRadius: '10px', background: 'var(--color-primary)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer', transition: 'opacity 0.2s' }}
                            >
                                {t?.('common.save') || 'حفظ'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Meeting Result Modal */}
            <Modal
                isOpen={!!selectedMeeting}
                onClose={() => setSelectedMeeting(null)}
                title={t?.('reception.meeting_details') || 'تفاصيل الاجتماع'}
                width="600px"
            >
                {selectedMeeting && (
                    <div className="meeting-result-view" style={{ padding: '10px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                            <div>
                                <h5 style={{ fontSize: '12px', color: 'var(--color-slate-400)', textTransform: 'uppercase', marginBottom: '8px' }}>{t?.('reception.visitor_name') || 'اسم الزائر'}</h5>
                                <p style={{ fontWeight: '750', fontSize: '16px' }}>{selectedMeeting.parent}</p>
                            </div>
                            <div>
                                <h5 style={{ fontSize: '12px', color: 'var(--color-slate-400)', textTransform: 'uppercase', marginBottom: '8px' }}>{t?.('common.student') || 'التلميذ'}</h5>
                                <p style={{ fontWeight: '750', fontSize: '16px' }}>{selectedMeeting.student}</p>
                            </div>
                            <div>
                                <h5 style={{ fontSize: '12px', color: 'var(--color-slate-400)', textTransform: 'uppercase', marginBottom: '8px' }}>{t?.('reception.meeting_with') || 'الاجتماع مع'}</h5>
                                <p style={{ fontWeight: '750', fontSize: '16px', color: 'var(--color-primary)' }}>{selectedMeeting.target}</p>
                            </div>
                            <div>
                                <h5 style={{ fontSize: '12px', color: 'var(--color-slate-400)', textTransform: 'uppercase', marginBottom: '8px' }}>{t?.('reception.time_slot') || 'الوقت'}</h5>
                                <p style={{ fontWeight: '750', fontSize: '16px' }}>{selectedMeeting.timeIn} - {selectedMeeting.timeOut || '...'}</p>
                            </div>
                        </div>

                        <div style={{ background: 'var(--color-slate-50)', padding: '20px', borderRadius: '15px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                            <h5 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={16} color="var(--color-primary)" />
                                {t?.('reception.meeting_result') || 'مخرجات ونتائج المقابلة'}
                            </h5>
                            <p style={{ lineHeight: '1.7', color: 'var(--color-slate-700)', fontSize: '15px' }}>
                                {selectedMeeting.result}
                            </p>
                        </div>

                        <div style={{ background: '#fffbeb', padding: '20px', borderRadius: '15px', border: '1px solid #fde68a', marginBottom: '15px' }}>
                            <h5 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706' }}>
                                <Edit3 size={16} />
                                {t?.('reception.admin_notes') || 'ملاحظات إدارية'}
                            </h5>
                            <textarea
                                rows="2"
                                placeholder={t?.('reception.admin_notes_placeholder') || 'أضف ملاحظات إدارية...'}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #fde68a', outline: 'none', background: '#fff', color: '#92400e', fontFamily: 'inherit', resize: 'vertical', fontSize: '14px', transition: 'border-color 0.2s' }}
                                onFocus={(e) => e.target.style.borderColor = '#d97706'}
                                onBlur={(e) => e.target.style.borderColor = '#fde68a'}
                            ></textarea>
                        </div>

                        <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '15px', border: '1px solid #bbf7d0' }}>
                            <h5 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d' }}>
                                <Check size={16} />
                                {t?.('reception.admin_actions') || 'الإجرائات المتخذة'}
                            </h5>
                            <textarea
                                rows="2"
                                placeholder={t?.('reception.admin_actions_placeholder') || 'أضف الإجرائات التي تم اتخاذها...'}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', outline: 'none', background: '#fff', color: '#14532d', fontFamily: 'inherit', resize: 'vertical', fontSize: '14px', transition: 'border-color 0.2s' }}
                                onFocus={(e) => e.target.style.borderColor = '#15803d'}
                                onBlur={(e) => e.target.style.borderColor = '#bbf7d0'}
                            ></textarea>
                        </div>

                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setSelectedMeeting(null)}
                                style={{ padding: '10px 24px', borderRadius: '10px', background: 'var(--color-slate-100)', border: 'none', fontWeight: '700', cursor: 'pointer' }}
                            >
                                {t?.('common.close') || 'إغلاق'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
