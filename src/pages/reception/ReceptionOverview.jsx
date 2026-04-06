import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import {
    Users, Clock, Activity, MessageCircle
} from 'react-feather';
import { Panel } from '../../components/common/Panel/Panel';
import './ReceptionOverview.scss';

export const ReceptionOverview = () => {
    const { t } = useTranslation();

    // Mock Data for Master Schedule & Traffic
    const masterSchedule = [
        { id: 'MS-01', visitor: 'ياسين بلحاج', time: '08:00 - 08:30', meetingWith: 'المدير' },
        { id: 'MS-02', visitor: 'فاطمة الزهراء', time: '09:00 - 09:30', meetingWith: 'مستشار التوجيه' },
        { id: 'MS-03', visitor: 'كريم بن مهيدي', time: '10:00 - 10:45', meetingWith: 'أستاذة اللغة العربية' },
        { id: 'MS-04', visitor: 'اجتماع داخلي', time: '11:00 - 12:00', meetingWith: 'الإدارة', blocked: true }
    ];

    const DailyTrafficStats = () => {
        const timeSlots = [
            { time: '08:00', value: 85, label: t?.('reception.peak_label') || 'أعلى ذروة' },
            { time: '10:00', value: 45 },
            { time: '12:00', value: 20 },
            { time: '14:00', value: 65 },
            { time: '16:00', value: 30 }
        ];

        const trafficPurposes = [
            { label: t?.('reception.purpose_inquiry') || 'استفسار عام', percentage: 45, color: '#3b82f6' },
            { label: t?.('reception.purpose_registration') || 'تسجيل تلميذ', percentage: 25, color: '#10b981' },
            { label: t?.('reception.purpose_documents') || 'استخراج وثائق', percentage: 20, color: '#f59e0b' },
            { label: t?.('reception.purpose_other') || 'أخرى', percentage: 10, color: '#64748b' }
        ];

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
                {/* Peak Hours Chart */}
                <div className="log-form-container" style={{ padding: '24px', background: 'var(--bg-primary)', borderRadius: '15px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px', color: 'var(--text-color)', fontSize: '16px', fontWeight: '800' }}>
                        <Activity size={18} color="var(--color-primary)" />
                        {t?.('reception.peak_hours') || 'ساعات الذروة لتوافد الزوار'}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingBottom: '10px', borderBottom: '1px dashed var(--border-color)', marginBottom: '10px' }}>
                        {timeSlots.map((slot, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '15%', height: '100%', justifyContent: 'flex-end' }}>
                                <div style={{
                                    width: '100%',
                                    background: slot.value > 70 ? 'var(--color-primary)' : 'var(--color-slate-200)',
                                    height: `${slot.value}%`,
                                    borderRadius: '6px 6px 0 0',
                                    transition: 'height 0.5s ease',
                                    position: 'relative'
                                }}>
                                    {slot.label && (
                                        <span style={{ position: 'absolute', top: '-28px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-primary)', color: 'white', fontSize: '10px', padding: '4px 8px', borderRadius: '6px', whiteSpace: 'nowrap', fontWeight: '700', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                            {slot.label}
                                        </span>
                                    )}
                                </div>
                                <span style={{ fontSize: '12px', color: 'var(--color-slate-500)', fontWeight: '600' }}>{slot.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Purposes Progress Bars */}
                <div className="log-form-container" style={{ padding: '24px', background: 'var(--bg-primary)', borderRadius: '15px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', flexGrow: 1 }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--text-color)', fontSize: '16px', fontWeight: '800' }}>
                        <MessageCircle size={18} color="var(--color-primary)" />
                        {t?.('reception.visits_breakdown') || 'أسباب الزيارة الشائعة'}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {trafficPurposes.map((purpose, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-color)' }}>
                                    <span>{purpose.label}</span>
                                    <span style={{ color: purpose.color }}>{purpose.percentage}%</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'var(--color-slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${purpose.percentage}%`, height: '100%', background: purpose.color, borderRadius: '4px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="reception-overview fade-in">
            <div className="page-header">
                <div className="header-content">
                    <h1>{t?.('reception.title')}</h1>
                    <p>{t?.('reception.dashboard_desc')}</p>
                </div>
            </div>

            {/* Top Stats - Two Simple Cards */}
            <div className="stats-grid-duo" style={{ marginBottom: '36px' }}>
                {/* Visitors Today */}
                <div className="stat-card-simple" style={{ '--accent': '#3b82f6' }}>
                    <div className="stat-icon-bubble" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>
                        <Users size={22} />
                    </div>
                    <div className="stat-card-body">
                        <span className="stat-number" style={{ color: '#3b82f6' }}>12</span>
                        <span className="stat-label">{t?.('reception.visitors_today') || 'زائر اليوم'}</span>
                    </div>
                </div>

                {/* Pending Requests */}
                <div className="stat-card-simple" style={{ '--accent': '#f59e0b' }}>
                    <div className="stat-icon-bubble" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                        <Clock size={22} />
                    </div>
                    <div className="stat-card-body">
                        <span className="stat-number" style={{ color: '#f59e0b' }}>5</span>
                        <span className="stat-label">{t?.('reception.pending_requests') || 'طلب معلق'}</span>
                    </div>
                </div>
            </div>

            <div className="overview-section" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '24px' }}>
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="section-title m-0">{t?.('reception.traffic_monitor')}</h3>
                    </div>
                    <br />
                    <Panel
                        title={null}
                        icon={Activity}
                        className="mb-4"
                    >
                        <div className="traffic-grid">
                            {masterSchedule.map(slot => (
                                <div className="traffic-card" key={slot.id} style={{ borderColor: slot.blocked ? '#fca5a5' : '' }}>
                                    <div className="time-slot" style={{ color: slot.blocked ? '#ef4444' : '' }}>
                                        <Clock size={16} />
                                        <span>{slot.time}</span>
                                    </div>
                                    <div className="visitor-details">
                                        <h4>{slot.visitor}</h4>
                                        {slot.blocked && <span className="status-badge rejected mt-1 d-inline-block" style={{ marginTop: '4px' }}>{t?.('reception.blocked_slots')}</span>}
                                    </div>
                                    <div className="meeting-target">
                                        <Users size={14} />
                                        <span>{t?.('reception.meeting_with')}:</span>
                                        <strong>{slot.meetingWith}</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Panel>
                </div>
                <div>
                    <DailyTrafficStats />
                </div>
            </div>
        </div>
    );
};
