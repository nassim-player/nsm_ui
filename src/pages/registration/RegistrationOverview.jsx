import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, CheckCircle, Clock, AlertCircle, TrendingUp, ArrowRight, DollarSign, FileText, Activity } from 'react-feather';
import { StatCard } from '../../components/common/Card/Card';
import { Panel } from '../../components/common/Panel/Panel';
import './RegistrationOverview.scss';

import { useTranslation } from '../../context/LanguageContext';

export const RegistrationOverview = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const meetingsToRate = 3; // Mock count for alerts

    // Mock Data for Dashboard
    const stats = [
        { label: t('total_requests'), value: 142, icon: Users, color: '#3b82f6', trend: t('trend_this_week') },
        { label: t('scheduled_interviews'), value: 8, icon: Calendar, color: '#f97316', trend: t('met_with_3_today') },
        { label: t('finance_department'), value: 5, icon: DollarSign, color: '#10b981', trend: t('needs_payment') },
        { label: t('final_registration'), value: 89, icon: CheckCircle, color: '#8b5cf6', trend: t('completed') },
    ];

    const recentRequests = [
        { id: 1, name: 'أحمد الإبراهيمي', date: '2026-02-12', status: 'pending', children: 2 },
        { id: 2, name: 'سارة العلي', date: '2026-02-12', status: 'scheduled', children: 1 },
        { id: 3, name: 'محمد المنصور', date: '2026-02-11', status: 'in_review', children: 3 },
        { id: 4, name: 'ليلى بن يوسف', date: '2026-02-10', status: 'approved', children: 1 },
    ];

    const upcomingInterviews = [
        { id: 101, parent: 'ياسين بلحاج', time: '09:00', date: t('today'), commission: t('preparatory_committee') },
        { id: 102, parent: 'كريم بن مهيدي', time: '10:30', date: t('today'), commission: t('primary_committee') },
        { id: 103, parent: 'فاطمة الزهراء', time: '14:00', date: t('tomorrow'), commission: t('middle_school_committee') },
    ];

    const renderStatusBadge = (status) => {
        const statuses = {
            pending: { label: t('status_new'), color: 'orange' },
            scheduled: { label: t('status_scheduled'), color: 'blue' },
            in_review: { label: t('status_review'), color: 'purple' },
            approved: { label: t('status_approved'), color: 'green' },
            rejected: { label: t('status_rejected'), color: 'red' }
        };
        const s = statuses[status] || statuses.pending;
        return <span className={`status-badge ${s.color}`}>{s.label}</span>;
    };

    return (
        <div className="registration-overview">
            <div className="page-header">
                <div className="header-content">
                    <h1>{t('registration_dashboard')}</h1>
                    <p>{t('registration_overview_desc')}</p>
                </div>
                <div className="header-actions">
                    <button className="action-btn">
                        <FileText size={18} />
                        {t('daily_report')}
                    </button>
                </div>
            </div>

            {/* Alerts Banner */}
            {meetingsToRate > 0 && (
                <div className="alerts-banner">
                    <AlertCircle size={20} />
                    <div className="alert-content">
                        <span>{t('there_are')} <strong>{meetingsToRate}</strong> {t('expired_appointments_review')}</span>
                    </div>
                    <button onClick={() => navigate('/registration/meetings')}>{t('review_now')}</button>
                </div>
            )}

            {/* Top Stats Cards */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        style={{ '--icon-bg': `${stat.color}15`, '--icon-color': stat.color }}
                        badges={[{ label: stat.trend, variant: 'info' }]}
                    />
                ))}
            </div>

            <div className="dashboard-grid">
                {/* Main Content Column */}
                <div className="main-column">
                    {/* Recent Requests Panel */}
                    <Panel
                        title={t('latest_registration_requests')}
                        icon={Activity}
                        actions={<button className="view-all-link">{t('view_all')}</button>}
                        contentClassName="p-0"
                        className="overview-panel"
                        glass
                    >
                        <div className="table-wrapper">
                            <table className="simple-table">
                                <thead>
                                    <tr>
                                        <th>{t('guardian')}</th>
                                        <th>{t('request_date')}</th>
                                        <th>{t('children_count')}</th>
                                        <th>{t('status')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentRequests.map(req => (
                                        <tr key={req.id}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="avatar">{req.name.charAt(0)}</div>
                                                    <span>{req.name}</span>
                                                </div>
                                            </td>
                                            <td>{req.date}</td>
                                            <td>{req.children}</td>
                                            <td>{renderStatusBadge(req.status)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Panel>

                    {/* Registration Pipeline Visual */}
                    <Panel
                        title={t('registration_funnel')}
                        icon={TrendingUp}
                        className="pipeline-panel"
                        glass
                    >
                        <div className="funnel-container">
                            <div className="funnel-step">
                                <div className="step-bar" style={{ height: '100%', background: '#3b82f6' }}></div>
                                <span className="count">142</span>
                                <span className="label">{t('requests')}</span>
                            </div>
                            <div className="funnel-step">
                                <div className="step-bar" style={{ height: '75%', background: '#f97316' }}></div>
                                <span className="count">98</span>
                                <span className="label">{t('interviews')}</span>
                            </div>
                            <div className="funnel-step">
                                <div className="step-bar" style={{ height: '60%', background: '#10b981' }}></div>
                                <span className="count">94</span>
                                <span className="label">{t('accepted')}</span>
                            </div>
                            <div className="funnel-step">
                                <div className="step-bar" style={{ height: '55%', background: '#8b5cf6' }}></div>
                                <span className="count">89</span>
                                <span className="label">{t('registered')}</span>
                            </div>
                            <div className="funnel-step">
                                <div className="step-bar" style={{ height: '20%', background: '#ef4444' }}></div>
                                <span className="count">4</span>
                                <span className="label">{t('rejected')}</span>
                            </div>
                        </div>
                    </Panel>
                </div>

                <div className="side-column">
                    {/* Upcoming Interviews */}
                    <div className="overview-card">
                        <div className="card-header">
                            <h3>{t('upcoming_interviews')}</h3>
                            <Calendar size={16} />
                        </div>
                        <div className="card-list">
                            {upcomingInterviews.map(interview => (
                                <div key={interview.id} className="list-item">
                                    <div className="time-box">
                                        <span className="time">{interview.time}</span>
                                        <span className="date">{interview.date}</span>
                                    </div>
                                    <div className="details">
                                        <h4>{interview.parent}</h4>
                                        <span>{interview.commission}</span>
                                    </div>
                                    <button className="action-icon">
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="card-footer-btn">{t('interviews_schedule')}</button>
                    </div>

                    {/* Quick Shortcuts */}
                    <div className="overview-card stats-mini">
                        <div className="card-header">
                            <h3>{t('quick_actions')}</h3>
                            <Clock size={16} />
                        </div>
                        <div className="shortcuts-grid">
                            <button className="shortcut-btn blue">
                                <Users size={20} />
                                <span>{t('new_request')}</span>
                            </button>
                            <button className="shortcut-btn orange">
                                <Calendar size={20} />
                                <span>{t('book_appointment')}</span>
                            </button>
                            <button className="shortcut-btn green">
                                <DollarSign size={20} />
                                <span>{t('pay_dues')}</span>
                            </button>
                            <button className="shortcut-btn purple">
                                <FileText size={20} />
                                <span>{t('export_report')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
