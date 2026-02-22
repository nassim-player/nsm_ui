import React, { useMemo } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import {
    Calendar, Check, X, User, Clock, Bookmark, MoreVertical
} from 'react-feather';
import { Panel } from '../../components/common/Panel/Panel';
import { DataTable } from '../../components/common/DataTable/DataTable';
import './ReceptionOverview.scss';

export const ReceptionRequests = () => {
    const { t } = useTranslation();

    // Mock Data for Queue (Appointment Requests)
    const requestsQueue = [
        { id: 'RQ-101', parent: 'أحمد الإبراهيمي', purpose: 'تسجيل جديد', target: 'مدير المدرسة', date: '2026-02-23', time: '09:00', status: 'pending' },
        { id: 'RQ-102', parent: 'سارة العلي', purpose: 'استفسار مالي', target: 'المحاسبة', date: '2026-02-23', time: '10:30', status: 'pending' },
        { id: 'RQ-103', parent: 'ليلى بن يوسف', purpose: 'متابعة مستوى التلميذ', target: 'أستاذ الرياضيات', date: '2026-02-24', time: '11:00', status: 'approved' }
    ];

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
            render: () => (
                <div className="actions-cell">
                    <button className="btn-approve" title={t?.('reception.approve')}><Check size={18} /></button>
                    <button className="btn-reject" title={t?.('reception.reject')}><X size={18} /></button>
                    <button className="btn-reschedule" title={t?.('reception.reschedule')}><Calendar size={18} /></button>
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
                    searchPlaceholder={t?.('common.search')}
                    emptyTitle={t?.('reception.no_requests')}
                />
            </Panel>
        </div>
    );
};
