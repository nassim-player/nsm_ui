import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import {
    FileText, Save, Users, Clock, User, MessageCircle, AlertCircle, X
} from 'react-feather';
import { Modal } from '../../components/common/Modal/Modal';
import './ReceptionOverview.scss';

export const ReceptionLog = () => {
    const { t } = useTranslation();
    const [selectedMeeting, setSelectedMeeting] = useState(null);

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

    // Check if time has passed
    const isMeetingLate = (timeIn) => {
        if (!timeIn) return false;
        const now = new Date();
        const [hours, minutes] = timeIn.split(':').map(Number);
        const meetingTime = new Date();
        meetingTime.setHours(hours, minutes, 0);

        // If current time is 15 minutes past the 'Time In', mark it
        return now > new Date(meetingTime.getTime() + 15 * 60000);
    };

    return (
        <div className="reception-logger fade-in">
            <div className="page-header">
                <div className="header-content">
                    <h1>{t?.('reception.nav_log')}</h1>
                    <p>{t?.('reception.log_desc')}</p>
                </div>
            </div>

            <div className="log-container-wrapper">
                <div className="log-form-container">
                    <h3>
                        <FileText size={22} />
                        {t?.('reception.reception_log_form')}
                    </h3>

                    <form onSubmit={(e) => e.preventDefault()} className="glass-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>{t?.('reception.visitor_name')}</label>
                                <input type="text" placeholder={t?.('reception.visitor_name')} />
                            </div>
                            <div className="form-group">
                                <label>{t?.('reception.meeting_with')}</label>
                                <select defaultValue="">
                                    <option value="" disabled>{t?.('reception.meeting_with')}...</option>
                                    <option value="director">مدير المدرسة</option>
                                    <option value="finance">المحاسبة</option>
                                    <option value="teacher">أستاذ(ة)</option>
                                    <option value="hr">الموارد البشرية</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{t?.('reception.arrival_time')}</label>
                                <input type="time" defaultValue="08:00" />
                            </div>
                            <div className="form-group">
                                <label>{t?.('reception.departure_time')}</label>
                                <input type="time" />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label>{t?.('reception.purpose')}</label>
                                <input type="text" placeholder={t?.('reception.purpose')} />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label>{t?.('reception.outcome_documentation')}</label>
                                <textarea placeholder={t?.('reception.outcome_documentation')}></textarea>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit">
                                <Save size={18} />
                                {t?.('reception.save_log')}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="recent-logs-panel">
                    <h3>{t?.('reception.log_history')}</h3>
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
                                            <small style={{ color: 'var(--color-slate-400)', fontWeight: '600' }}>{t?.('common.student')}: {log.student}</small>
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
                                <h5 style={{ fontSize: '12px', color: 'var(--color-slate-400)', textTransform: 'uppercase', marginBottom: '8px' }}>{t?.('reception.visitor_name')}</h5>
                                <p style={{ fontWeight: '750', fontSize: '16px' }}>{selectedMeeting.parent}</p>
                            </div>
                            <div>
                                <h5 style={{ fontSize: '12px', color: 'var(--color-slate-400)', textTransform: 'uppercase', marginBottom: '8px' }}>{t?.('common.student')}</h5>
                                <p style={{ fontWeight: '750', fontSize: '16px' }}>{selectedMeeting.student}</p>
                            </div>
                            <div>
                                <h5 style={{ fontSize: '12px', color: 'var(--color-slate-400)', textTransform: 'uppercase', marginBottom: '8px' }}>{t?.('reception.meeting_with')}</h5>
                                <p style={{ fontWeight: '750', fontSize: '16px', color: 'var(--color-primary)' }}>{selectedMeeting.target}</p>
                            </div>
                            <div>
                                <h5 style={{ fontSize: '12px', color: 'var(--color-slate-400)', textTransform: 'uppercase', marginBottom: '8px' }}>{t?.('reception.time_slot')}</h5>
                                <p style={{ fontWeight: '750', fontSize: '16px' }}>{selectedMeeting.timeIn} - {selectedMeeting.timeOut || '...'}</p>
                            </div>
                        </div>

                        <div style={{ background: 'var(--color-slate-50)', padding: '20px', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                            <h5 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={16} color="var(--color-primary)" />
                                {t?.('reception.meeting_result') || 'مخرجات ونتائج المقابلة'}
                            </h5>
                            <p style={{ lineHeight: '1.7', color: 'var(--color-slate-700)', fontSize: '15px' }}>
                                {selectedMeeting.result}
                            </p>
                        </div>

                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setSelectedMeeting(null)}
                                style={{ padding: '10px 24px', borderRadius: '10px', background: 'var(--color-slate-100)', border: 'none', fontWeight: '700', cursor: 'pointer' }}
                            >
                                {t?.('common.close')}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
