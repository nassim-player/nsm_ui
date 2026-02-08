
import React from 'react';
import { Users, FileText, Settings, TrendingUp } from 'react-feather';
import './StudentsHome.scss';

export const StudentsHome = () => {
    // Temp stats for display
    const stats = {
        total: 450,
        active: 420,
        absent: 15,
        new: 12
    };

    return (
        <div className="students-home">
            <div className="page-header">
                <h1>إدارة الطلاب</h1>
                <p>نظرة شاملة على إدارة الطلاب والتسجيلات</p>
            </div>

            {/* Bento Grid Layout */}
            <div className="bento-grid">
                {/* Large Stats Card */}
                <div className="bento-card bento-large stats-overview">
                    <div className="card-header">
                        <TrendingUp size={24} />
                        <h3>إحصائيات الطلاب</h3>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-item primary">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">إجمالي الطلاب</span>
                        </div>
                        <div className="stat-item success">
                            <span className="stat-value">{stats.active}</span>
                            <span className="stat-label">طلاب نشطين</span>
                        </div>
                        <div className="stat-item warning">
                            <span className="stat-value">{stats.absent}</span>
                            <span className="stat-label">غياب اليوم</span>
                        </div>
                        <div className="stat-item info">
                            <span className="stat-value">{stats.new}</span>
                            <span className="stat-label">تسجيلات جديدة</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bento-card quick-actions">
                    <div className="card-header">
                        <Settings size={20} />
                        <h3>إجراءات سريعة</h3>
                    </div>
                    <div className="actions-list">
                        <button className="action-btn">
                            <Users size={18} />
                            <span>إضافة طالب جديد</span>
                        </button>
                        <button className="action-btn">
                            <FileText size={18} />
                            <span>تصدير البيانات</span>
                        </button>
                    </div>
                </div>

                {/* Organization Preview */}
                <div className="bento-card organization-preview">
                    <div className="card-header">
                        <Users size={20} />
                        <h3>التنظيم</h3>
                    </div>
                    <div className="preview-content">
                        <p>عرض وإدارة تنظيم الطلاب حسب الأقسام والمستويات</p>
                        <a href="/students/organization" className="preview-link">
                            عرض التفاصيل ←
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
