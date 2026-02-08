
import React from 'react';
import { useToast } from '../context/ToastContext';
import { StatCard, TaskCard, MetricCard } from '../components/common/Card/Card';
import { Button } from '../components/common/Button/Button';
import {
    Download, Users, CheckCircle, TrendingUp,
    Info, UserPlus
} from 'react-feather';
import './DashboardHome.scss';

export const DashboardHome = () => {
    const { info } = useToast();

    return (
        <div className="dashboard-home">
            {/* Greeting Section */}
            <div className="welcome-section">
                <div>
                    <h1 className="welcome-title">صباح الخير، المدير العام 👋</h1>
                    <p className="welcome-subtitle">إليك ملخص لما يحدث في المدرسة اليوم.</p>
                </div>
                <Button onClick={() => info('جاري إنشاء تقرير...')}>
                    <Download size={18} style={{ marginLeft: '8px' }} /> تصدير التقرير اليومي
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    label="الموظفين الحاضرين"
                    value="42/50"
                    icon={Users}
                    badges={[{ label: '84%', variant: 'success' }]}
                />
                <StatCard
                    label="المهام المكتملة"
                    value="12"
                    icon={CheckCircle}
                    badges={[{ label: '+3 اليوم', variant: 'info' }]}
                />
                <MetricCard
                    label="معدل الأداء"
                    value="94%"
                    icon={TrendingUp}
                    trend="up"
                    trendValue="2.5%"
                    style={{ borderRight: '4px solid #10b981' }}
                />
            </div>

            {/* Content Grid */}
            <div className="content-grid">

                {/* Recent Tasks */}
                <div className="content-column">
                    <div className="section-header">
                        <h2 className="section-title">المهام العاجلة</h2>
                        <button className="btn-text">عرض الكل</button>
                    </div>
                    <div className="tasks-list">
                        <TaskCard
                            title="مراجعة تقارير الحضور"
                            description="مراجعة التقارير الشهرية لقسم الموارد البشرية."
                            priority="high"
                            status="pending"
                            date="اليوم، 10:00 ص"
                            user="سارة أحمد"
                        />
                        <TaskCard
                            title="اجتماع مجلس الإدارة"
                            description="تحضير العرض التقديمي للاجتماع."
                            priority="medium"
                            status="inprogress"
                            date="غداً، 09:00 ص"
                            user="أنت"
                        />
                    </div>
                </div>

                {/* Notifications / Announcements placeholder */}
                <div className="content-column">
                    <div className="section-header">
                        <h2 className="section-title">آخر الإشعارات</h2>
                        <button className="btn-text">عرض الكل</button>
                    </div>
                    <div className="notifications-panel">
                        <div className="notification-item">
                            <div className="notif-icon bg-blue"><Info size={20} /></div>
                            <div className="notif-content">
                                <h4>تحديث النظام</h4>
                                <p>تم تحديث النظام إلى النسخة 2.0</p>
                                <span className="notif-time">منذ ساعة</span>
                            </div>
                        </div>
                        <div className="notification-item">
                            <div className="notif-icon bg-green"><UserPlus size={20} /></div>
                            <div className="notif-content">
                                <h4>موظف جديد</h4>
                                <p>تم تسجيل موظف جديد في قسم المحاسبة</p>
                                <span className="notif-time">منذ 3 ساعات</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
