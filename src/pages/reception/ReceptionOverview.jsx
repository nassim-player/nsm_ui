import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import {
    Users, Clock, CheckCircle, Bookmark, Activity
} from 'react-feather';
import { StatCard } from '../../components/common/Card/Card';
import { Panel } from '../../components/common/Panel/Panel';
import './ReceptionOverview.scss';

export const ReceptionOverview = () => {
    const { t } = useTranslation();

    // Mock Data for KPI Stats
    const stats = [
        { label: t?.('reception.expected_visitors') || 'Expected Visitors Today', value: 12, icon: Users, color: '#3b82f6' },
        { label: t?.('reception.pending_requests') || 'Pending Requests', value: 5, icon: Clock, color: '#f59e0b' },
        { label: t?.('reception.completed_meetings') || 'Completed Meetings', value: 8, icon: CheckCircle, color: '#10b981' },
        { label: t?.('reception.blocked_slots') || 'Blocked Slots', value: 3, icon: Bookmark, color: '#ef4444' }
    ];

    // Mock Data for Master Schedule & Traffic
    const masterSchedule = [
        { id: 'MS-01', visitor: 'ياسين بلحاج', time: '08:00 - 08:30', meetingWith: 'المدير' },
        { id: 'MS-02', visitor: 'فاطمة الزهراء', time: '09:00 - 09:30', meetingWith: 'مستشار التوجيه' },
        { id: 'MS-03', visitor: 'كريم بن مهيدي', time: '10:00 - 10:45', meetingWith: 'أستاذة اللغة العربية' },
        { id: 'MS-04', visitor: 'اجتماع داخلي', time: '11:00 - 12:00', meetingWith: 'الإدارة', blocked: true }
    ];

    return (
        <div className="reception-overview fade-in">
            <div className="page-header">
                <div className="header-content">
                    <h1>{t?.('reception.title')}</h1>
                    <p>{t?.('reception.dashboard_desc')}</p>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        style={{ '--icon-bg': `${stat.color}15`, '--icon-color': stat.color }}
                    />
                ))}
            </div>

            <div className="overview-section">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="section-title m-0">{t?.('reception.traffic_monitor')}</h3>
                    <button className="btn-primary-outline" style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--primary-color)',
                        color: 'var(--primary-color)',
                        background: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <Clock size={16} />
                        {t?.('reception.block_slot')}
                    </button>
                </div>
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
        </div>
    );
};
