
import React, { useState, useMemo } from 'react';
import { User, Phone, Check } from 'react-feather';
import { DataTable } from '../../components/common/DataTable';
import './RegistrationRequests.scss';

// Status options with colors
const statusOptions = [
    { value: 'pending', label: 'في الانتظار', color: '#eab308' },
    { value: 'scheduled', label: 'موعد محدد', color: '#3b82f6' },
    { value: 'in_review', label: 'قيد المراجعة', color: '#f97316' },
    { value: 'approved', label: 'مقبول', color: '#22c55e' },
    { value: 'rejected', label: 'مرفوض', color: '#ef4444' },
];

// Render status badge
const renderStatus = (status) => {
    const statusInfo = statusOptions.find(s => s.value === status);
    if (!statusInfo) return '-';
    return (
        <span
            className="dt-badge"
            style={{
                background: `${statusInfo.color}20`,
                color: statusInfo.color
            }}
        >
            {statusInfo.label}
        </span>
    );
};

// Render name with avatar
const renderParentName = (value) => (
    <div className="dt-cell-name">
        <div className="dt-avatar">
            <User size={16} />
        </div>
        <span>{value || '-'}</span>
    </div>
);

// Render phone with icon
const renderPhone = (value) => {
    if (!value) return '-';
    return (
        <span className="dt-cell-phone">
            <Phone size={14} />
            {value}
        </span>
    );
};

// Column configuration
const columns = [
    { key: 'id', label: 'الرقم', visible: true, width: 80 },
    { key: 'parentName', label: 'اسم الولي', visible: true, width: 200, render: renderParentName },
    { key: 'studentName', label: 'اسم الطالب', visible: true, width: 200 },
    { key: 'phone', label: 'الهاتف', visible: true, width: 150, render: renderPhone },
    { key: 'submissionDate', label: 'تاريخ الطلب', visible: true, width: 130 },
    { key: 'status', label: 'الحالة', visible: true, width: 120, render: renderStatus },
];

export const RegistrationRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Custom search filter
    const searchFilter = (row, query) => {
        return (
            (row.parentName && row.parentName.includes(query)) ||
            (row.studentName && row.studentName.includes(query)) ||
            (row.phone && row.phone.includes(query))
        );
    };

    return (
        <div className="registration-requests">
            <div className="page-header">
                <div className="header-content">
                    <h1>الطلبات الجديدة</h1>
                    <p>طلبات التسجيل الواردة من الموقع الإلكتروني</p>
                </div>
            </div>

            <DataTable
                data={requests}
                columns={columns}
                loading={loading}
                error={error}
                searchPlaceholder="البحث ..."
                searchFilter={searchFilter}
                emptyIcon={User}
                emptyTitle="لا توجد طلبات تسجيل"
                emptyMessage="ستظهر هنا الطلبات الواردة من الموقع الإلكتروني"
                footerText="إجمالي الطلبات: {count} طلب"
            />
        </div>
    );
};
