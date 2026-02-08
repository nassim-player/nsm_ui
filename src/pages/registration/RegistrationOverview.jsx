
import React from 'react';
import { Users, Calendar, CheckCircle, Clock, AlertCircle } from 'react-feather';
import './RegistrationOverview.scss';

export const RegistrationOverview = () => {
    // Placeholder stats - will be dynamic later
    const stats = [
        {
            label: 'طلبات جديدة',
            value: 0,
            icon: Users,
            color: '#3b82f6',
            description: 'طلبات تنتظر المراجعة'
        },
        {
            label: 'اجتماعات اليوم',
            value: 0,
            icon: Calendar,
            color: '#f97316',
            description: 'مواعيد مجدولة لليوم'
        },
        {
            label: 'قيد المراجعة',
            value: 0,
            icon: Clock,
            color: '#eab308',
            description: 'طلبات تحت الدراسة'
        },
        {
            label: 'تم القبول',
            value: 0,
            icon: CheckCircle,
            color: '#22c55e',
            description: 'طلبات مقبولة هذا الشهر'
        },
    ];

    return (
        <div className="registration-overview">
            <div className="page-header">
                <div className="header-content">
                    <h1>إدارة التسجيلات</h1>
                    <p>متابعة عمليات التسجيل والمواعيد والطلبات الجديدة</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card" style={{ '--stat-color': stat.color }}>
                        <div className="stat-icon">
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-description">{stat.description}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pipeline Overview */}
            <div className="pipeline-section">
                <h2>مراحل التسجيل</h2>
                <div className="pipeline-container">
                    <div className="pipeline-step">
                        <div className="step-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                            <Users size={20} />
                        </div>
                        <div className="step-info">
                            <span className="step-label">طلب جديد</span>
                            <span className="step-count">0 طلب</span>
                        </div>
                    </div>
                    <div className="pipeline-arrow">→</div>
                    <div className="pipeline-step">
                        <div className="step-icon" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
                            <Calendar size={20} />
                        </div>
                        <div className="step-info">
                            <span className="step-label">موعد محدد</span>
                            <span className="step-count">0 موعد</span>
                        </div>
                    </div>
                    <div className="pipeline-arrow">→</div>
                    <div className="pipeline-step">
                        <div className="step-icon" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}>
                            <Clock size={20} />
                        </div>
                        <div className="step-info">
                            <span className="step-label">قيد التقييم</span>
                            <span className="step-count">0 طلب</span>
                        </div>
                    </div>
                    <div className="pipeline-arrow">→</div>
                    <div className="pipeline-step">
                        <div className="step-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
                            <CheckCircle size={20} />
                        </div>
                        <div className="step-info">
                            <span className="step-label">مقبول</span>
                            <span className="step-count">0 طالب</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Meetings */}
            <div className="upcoming-section">
                <h2>المواعيد القادمة</h2>
                <div className="empty-state">
                    <Calendar size={48} />
                    <p>لا توجد مواعيد قادمة</p>
                    <span>ستظهر هنا المواعيد المجدولة مع أولياء الأمور</span>
                </div>
            </div>
        </div>
    );
};
