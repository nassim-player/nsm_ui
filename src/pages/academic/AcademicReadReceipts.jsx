import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import {
    Eye, CheckCircle, AlertCircle, Users, Calendar, MessageSquare, Bell, TrendingUp
} from 'react-feather';


import { Panel } from '../../components/common/Panel/Panel';
import { DataTable } from '../../components/common/DataTable/DataTable';
import './AcademicReadReceipts.scss';

// Mock: by date and class, which parents have viewed the daily note
const MOCK_VIEWS = [
    { id: 1, date: '2026-02-18', classId: '1P-A', className: '1 ابتدائي أ', guardianName: 'أحمد الإبراهيمي', studentName: 'ياسين', viewed: true, viewedAt: '2026-02-18T14:22:00' },
    { id: 2, date: '2026-02-18', classId: '1P-A', className: '1 ابتدائي أ', guardianName: 'سارة العلي', studentName: 'نور', viewed: true, viewedAt: '2026-02-18T15:10:00' },
    { id: 3, date: '2026-02-18', classId: '1P-A', className: '1 ابتدائي أ', guardianName: 'محمد المنصور', studentName: 'كريم', viewed: false, viewedAt: null },
    { id: 4, date: '2026-02-18', classId: '1P-A', className: '1 ابتدائي أ', guardianName: 'فاطمة بلحاج', studentName: 'أمين', viewed: true, viewedAt: '2026-02-18T16:45:00' },
    { id: 5, date: '2026-02-18', classId: '1P-A', className: '1 ابتدائي أ', guardianName: 'ليلى بن يوسف', studentName: 'سلمى', viewed: false, viewedAt: null },
    { id: 6, date: '2026-02-18', classId: '2P-A', className: '2 ابتدائي أ', guardianName: 'ياسين قاسم', studentName: 'هند', viewed: true, viewedAt: '2026-02-18T13:00:00' },
    { id: 7, date: '2026-02-18', classId: '2P-A', className: '2 ابتدائي أ', guardianName: 'منى حسن', studentName: 'عمر', viewed: false, viewedAt: null },
    { id: 8, date: '2026-02-18', classId: '2P-A', className: '2 ابتدائي أ', guardianName: 'خالد أحمد', studentName: 'لينا', viewed: true, viewedAt: '2026-02-18T17:20:00' },
    { id: 9, date: '2026-02-17', classId: '1P-A', className: '1 ابتدائي أ', guardianName: 'أحمد الإبراهيمي', studentName: 'ياسين', viewed: true, viewedAt: '2026-02-17T18:00:00' },
    { id: 10, date: '2026-02-17', classId: '1P-A', className: '1 ابتدائي أ', guardianName: 'سارة العلي', studentName: 'نور', viewed: false, viewedAt: null },
];

export const AcademicReadReceipts = () => {
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState('2026-02-18');
    const [selectedClass, setSelectedClass] = useState('');

    const dates = useMemo(() => {
        const set = new Set(MOCK_VIEWS.map((v) => v.date));
        return Array.from(set).sort().reverse();
    }, []);

    const classes = useMemo(() => {
        const set = new Set(MOCK_VIEWS.filter((v) => v.date === selectedDate).map((v) => v.classId));
        return Array.from(set).map((id) => {
            const v = MOCK_VIEWS.find((x) => x.classId === id);
            return { id, label: v?.className || id };
        }).sort((a, b) => a.label.localeCompare(b.label));
    }, [selectedDate]);

    const filtered = useMemo(() => {
        return MOCK_VIEWS.filter((v) => {
            if (v.date !== selectedDate) return false;
            if (selectedClass && v.classId !== selectedClass) return false;
            return true;
        });
    }, [selectedDate, selectedClass]);

    const stats = useMemo(() => {
        const total = filtered.length;
        const viewed = filtered.filter((v) => v.viewed).length;
        const notViewed = total - viewed;
        const rate = total ? Math.round((viewed / total) * 100) : 0;
        return { total, viewed, notViewed, rate };
    }, [filtered]);

    const notViewedList = useMemo(() => filtered.filter((v) => !v.viewed), [filtered]);

    const columns = useMemo(() => [
        { key: 'guardianName', label: t('academic.guardian'), visible: true, width: 180, sortable: true },
        { key: 'studentName', label: t('academic.student_name'), visible: true, width: 120, sortable: true },
        {
            key: 'className',
            label: t('academic.class'),
            visible: true,
            width: 120,
            render: (val) => <span className="receipts-class-badge">{val}</span>,
        },
        {
            key: 'viewed',
            label: t('academic.status'),
            visible: true,
            width: 140,
            sortable: true,
            render: (val, row) =>
                val ? (
                    <span className="receipts-badge viewed">
                        <CheckCircle size={14} /> {t('academic.viewed')}
                    </span>
                ) : (
                    <span className="receipts-badge not-viewed">
                        <AlertCircle size={14} /> {t('academic.not_viewed')}
                    </span>
                ),
        },
        {
            key: 'viewedAt',
            label: t('academic.viewed_at'),
            visible: true,
            width: 160,
            render: (val) =>
                val
                    ? new Date(val).toLocaleString('ar-u-nu-latn', { dateStyle: 'short', timeStyle: 'short' })
                    : '—',
        },
    ], [t]);

    return (
        <div className="academic-read-receipts">
            <div className="page-header">
                <div className="header-content">
                    <h1>{t('academic.read_receipts_title')}</h1>
                    <p>{t('academic.read_receipts_desc')}</p>
                </div>
            </div>

            <div className="filters-row">
                <div className="filter-group">
                    <label><Calendar size={16} /> {t('academic.filter_by_date')}</label>
                    <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                        {dates.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-group">
                    <label><Users size={16} /> {t('academic.filter_by_class')}</label>
                    <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                        <option value="">{t('academic.filter_all')}</option>
                        {classes.map((c) => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="stats-row">
                {/* ── Rate Card with Radial Progress ── */}
                <article className="rr-stat-card rr-stat-card--rate">
                    <div className="rr-stat-card__shimmer" />
                    <div className="rr-stat-card__body">
                        <div className="rr-stat-card__ring-wrap">
                            <svg className="rr-stat-card__ring" viewBox="0 0 80 80">
                                <circle className="rr-stat-card__ring-track" cx="40" cy="40" r="34" />
                                <circle
                                    className="rr-stat-card__ring-fill"
                                    cx="40" cy="40" r="34"
                                    style={{
                                        strokeDasharray: `${2 * Math.PI * 34}`,
                                        strokeDashoffset: `${2 * Math.PI * 34 * (1 - stats.rate / 100)}`
                                    }}
                                />
                            </svg>
                            <span className="rr-stat-card__ring-value">{stats.rate}%</span>
                        </div>
                        <div className="rr-stat-card__info">
                            <span className="rr-stat-card__label">{t('academic.receipts_view_rate')}</span>
                            <span className="rr-stat-card__sub">
                                <TrendingUp size={14} />
                                {stats.viewed} / {stats.total}
                            </span>
                        </div>
                    </div>
                </article>

                {/* ── Viewed Card ── */}
                <article className="rr-stat-card rr-stat-card--viewed">
                    <div className="rr-stat-card__shimmer" />
                    <div className="rr-stat-card__body">
                        <div className="rr-stat-card__icon-box rr-stat-card__icon-box--viewed">
                            <CheckCircle size={22} />
                        </div>
                        <div className="rr-stat-card__info">
                            <span className="rr-stat-card__label">{t('academic.receipts_viewed_count')}</span>
                            <span className="rr-stat-card__value">{stats.viewed}</span>
                            <span className="rr-stat-card__sub rr-stat-card__sub--success">
                                <Eye size={13} /> {t('academic.viewed')}
                            </span>
                        </div>
                    </div>
                </article>

                {/* ── Not Viewed Card ── */}
                <article className="rr-stat-card rr-stat-card--pending">
                    <div className="rr-stat-card__shimmer" />
                    <div className="rr-stat-card__body">
                        <div className="rr-stat-card__icon-box rr-stat-card__icon-box--pending">
                            <AlertCircle size={22} />
                        </div>
                        <div className="rr-stat-card__info">
                            <span className="rr-stat-card__label">{t('academic.receipts_not_viewed_count')}</span>
                            <span className="rr-stat-card__value">{stats.notViewed}</span>
                            <span className="rr-stat-card__sub rr-stat-card__sub--warning">
                                <AlertCircle size={13} /> {t('academic.not_viewed')}
                            </span>
                        </div>
                    </div>
                </article>
            </div>

            <div className="content-grid">
                <Panel
                    title={t('academic.receipts_by_guardian')}
                    icon={Users}
                    contentClassName="p-0"
                    className="list-panel"
                    glass
                >
                    <DataTable
                        data={filtered}
                        columns={columns}
                        defaultColumns={columns}
                        selectable={false}
                        searchPlaceholder={t('academic.search_guardian')}
                        emptyTitle={t('academic.no_receipts_data')}
                        footerText={t('academic.receipts_footer')}
                        className="receipts-datatable"
                    />
                </Panel>

                <div className="side-panel">
                    <Panel
                        title={t('academic.follow_up_title')}
                        icon={AlertCircle}
                        contentClassName="follow-up-content"
                        glass
                    >
                        <p className="follow-up-desc">{t('academic.follow_up_desc')}</p>
                        {notViewedList.length === 0 ? (
                            <p className="all-viewed">{t('academic.all_parents_viewed')}</p>
                        ) : (
                            <ul className="follow-up-list">
                                {notViewedList.map((row) => (
                                    <li key={row.id}>
                                        <strong>{row.guardianName}</strong>
                                        <span>{row.studentName} — {row.className}</span>
                                        <div className="actions">
                                            <button type="button" className="icon-btn" title={t('academic.send_message')}>
                                                <MessageSquare size={14} />
                                            </button>
                                            <button type="button" className="icon-btn" title={t('academic.send_notification')}>
                                                <Bell size={14} />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Panel>
                </div>
            </div>
        </div>
    );
};
