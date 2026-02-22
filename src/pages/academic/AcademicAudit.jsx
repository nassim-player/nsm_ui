import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import {
    Clipboard, Calendar, User, Plus, Edit2, Download
} from 'react-feather';
import { Panel } from '../../components/common/Panel/Panel';
import './AcademicAudit.scss';

// Mock: audit events (created / modified) for diary entries
const MOCK_AUDIT = [
    { id: 'a1', type: 'created', entryId: 'e1', lessonTitle: 'الكسور العادية والكسور العشرية', className: '1 ابتدائي أ', teacher: 'محمد علي', timestamp: '2026-02-18T08:45:00', details: null },
    { id: 'a2', type: 'created', entryId: 'e2', lessonTitle: 'دورة حياة النبات', className: '1 ابتدائي أ', teacher: 'فاطمة الزهراء', timestamp: '2026-02-18T09:20:00', details: null },
    { id: 'a3', type: 'modified', entryId: 'e2', lessonTitle: 'دورة حياة النبات', className: '1 ابتدائي أ', teacher: 'فاطمة الزهراء', timestamp: '2026-02-18T10:00:00', details: 'تحديث ملخص المحتوى وإضافة رابط الفيديو' },
    { id: 'a4', type: 'created', entryId: 'e3', lessonTitle: 'قراءة: النص الوصفي', className: '2 ابتدائي أ', teacher: 'أحمد منصور', timestamp: '2026-02-18T10:15:00', details: null },
    { id: 'a5', type: 'created', entryId: 'e4', lessonTitle: 'المعادلات من الدرجة الأولى', className: '1 متوسط أ', teacher: 'محمد علي', timestamp: '2026-02-18T08:00:00', details: null },
    { id: 'a6', type: 'created', entryId: 'e5', lessonTitle: 'سورة الفاتحة ومعانيها', className: '1 ابتدائي أ', teacher: 'سارة بن عودة', timestamp: '2026-02-17T09:00:00', details: null },
    { id: 'a7', type: 'created', entryId: 'e6', lessonTitle: 'الخلية والأنسجة', className: '2 متوسط ب', teacher: 'فاطمة الزهراء', timestamp: '2026-02-17T11:30:00', details: null },
    { id: 'a8', type: 'modified', entryId: 'e6', lessonTitle: 'الخلية والأنسجة', className: '2 متوسط ب', teacher: 'فاطمة الزهراء', timestamp: '2026-02-17T14:00:00', details: 'إضافة واجب منزلي' },
];

export const AcademicAudit = () => {
    const { t } = useTranslation();
    const [dateFrom, setDateFrom] = useState('2026-02-17');
    const [dateTo, setDateTo] = useState('2026-02-18');
    const [teacherFilter, setTeacherFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState(''); // '' | 'created' | 'modified'

    const teachers = useMemo(() => {
        const set = new Set(MOCK_AUDIT.map((a) => a.teacher));
        return Array.from(set).sort();
    }, []);

    const classes = useMemo(() => {
        const set = new Set(MOCK_AUDIT.map((a) => a.className));
        return Array.from(set).sort();
    }, []);

    const filtered = useMemo(() => {
        return MOCK_AUDIT.filter((a) => {
            const ts = a.timestamp.slice(0, 10);
            if (dateFrom && ts < dateFrom) return false;
            if (dateTo && ts > dateTo) return false;
            if (teacherFilter && a.teacher !== teacherFilter) return false;
            if (classFilter && a.className !== classFilter) return false;
            if (typeFilter && a.type !== typeFilter) return false;
            return true;
        }).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    }, [dateFrom, dateTo, teacherFilter, classFilter, typeFilter]);

    return (
        <div className="academic-audit">
            <div className="page-header">
                <div className="header-content">
                    <h1>{t('academic.audit_title')}</h1>
                    <p>{t('academic.audit_desc')}</p>
                </div>
                <div className="header-actions">
                    <button type="button" className="action-btn">
                        <Download size={18} />
                        {t('academic.export_audit')}
                    </button>
                </div>
            </div>

            <Panel className="filters-panel" glass>
                <div className="filters-row">
                    <div className="filter-group">
                        <label><Calendar size={16} /> {t('academic.audit_date_from')}</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="filter-input"
                        />
                    </div>
                    <div className="filter-group">
                        <label>{t('academic.audit_date_to')}</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="filter-input"
                        />
                    </div>
                    <div className="filter-group">
                        <label><User size={16} /> {t('academic.filter_by_teacher')}</label>
                        <select value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)}>
                            <option value="">{t('academic.filter_all')}</option>
                            {teachers.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>{t('academic.filter_by_class')}</label>
                        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                            <option value="">{t('academic.filter_all')}</option>
                            {classes.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>{t('academic.audit_action_type')}</label>
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                            <option value="">{t('academic.filter_all')}</option>
                            <option value="created">{t('academic.audit_created')}</option>
                            <option value="modified">{t('academic.audit_modified')}</option>
                        </select>
                    </div>
                </div>
            </Panel>

            <Panel
                title={t('academic.audit_log_table_title')}
                icon={Clipboard}
                badge={filtered.length}
                badgeVariant="info"
                contentClassName="p-0"
                className="audit-panel"
                glass
            >
                <div className="audit-table-wrap">
                    <table className="audit-table">
                        <thead>
                            <tr>
                                <th>{t('academic.audit_timestamp')}</th>
                                <th>{t('academic.audit_action')}</th>
                                <th>{t('academic.lesson_title')}</th>
                                <th>{t('academic.class')}</th>
                                <th>{t('academic.teacher')}</th>
                                <th>{t('academic.audit_details')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((row) => (
                                <tr key={row.id} className={`action-${row.type}`}>
                                    <td className="time-cell">
                                        {new Date(row.timestamp).toLocaleString('ar-u-nu-latn', { dateStyle: 'short', timeStyle: 'short' })}
                                    </td>
                                    <td>
                                        {row.type === 'created' ? (
                                            <span className="badge created"><Plus size={14} /> {t('academic.audit_created')}</span>
                                        ) : (
                                            <span className="badge modified"><Edit2 size={14} /> {t('academic.audit_modified')}</span>
                                        )}
                                    </td>
                                    <td className="lesson-cell">{row.lessonTitle}</td>
                                    <td><span className="class-badge">{row.className}</span></td>
                                    <td>{row.teacher}</td>
                                    <td className="details-cell">{row.details || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Panel>
        </div>
    );
};
