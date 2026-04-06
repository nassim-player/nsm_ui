import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import {
    FileText, Save, Users, Clock, User, MessageCircle, AlertCircle, X, Activity, Plus, Edit3, Check
} from 'react-feather';
import { Modal } from '../../components/common/Modal/Modal';
import { Panel } from '../../components/common/Panel/Panel';
import { DataTable } from '../../components/common/DataTable/DataTable';
import './ReceptionOverview.scss';

export const ReceptionLog = () => {
    const { t } = useTranslation();
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    // Mock Data for All Year Logs
    const allYearLogs = [
        { id: 'YL-001', parent: 'سعيد بن علي', student: 'محمد بن علي', reason: 'سحب ملف', timeIn: '08:00', timeOut: '08:30', target: 'المدير', result: 'تم السحب وإغلاق الملف بتوقيع الولي.', date: '2026-01-15', status: 'completed' },
        { id: 'YL-002', parent: 'ليلى خليل', student: 'ياسين خليل', reason: 'استفسار مالية', timeIn: '09:15', timeOut: '10:00', target: 'الإدارة المالية', result: 'تم دفع القسط الثاني وإصدار وصل.', date: '2026-01-20', status: 'completed' },
        { id: 'YL-003', parent: 'كريم مرياح', student: 'سامي مرياح', reason: 'تسجيل جديد', timeIn: '10:30', timeOut: '11:15', target: 'مستشار التربية', result: 'تم استلام الملف واجتياز الفحص الطبي.', date: '2026-02-05', status: 'completed' },
        { id: 'YL-004', parent: 'رضا عماري', student: 'أمين عماري', reason: 'استلام شهادة', timeIn: '08:05', timeOut: '08:40', target: 'المدير', result: 'تم استلام الشهادة وتوقيع السجل الورقي بنجاح.', date: '2026-02-22', status: 'completed' },
        { id: 'YL-005', parent: 'حسناء بلحاج', student: 'لينا بلحاج', reason: 'تأخر متكرر', timeIn: '13:00', timeOut: '', target: 'مستشار التربية', result: 'قيد الاجتماع لمناقشة حلول عملية للتأخر الصباحي.', date: '2026-02-22', status: 'pending' },
        { id: 'YL-006', parent: 'رياض السلاوتي', student: 'مها السلاوتي', reason: 'شكوى سلوك', timeIn: '14:30', timeOut: '15:10', target: 'مستشار التربية', result: 'تم توقيع التزام بحسن السير والسلوك.', date: '2026-02-23', status: 'completed' },
    ];

    const yearColumns = useMemo(() => [
        {
            key: 'parent',
            label: t?.('reception.visitor_name') || 'الزائر',
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
            key: 'student',
            label: t?.('common.student') || 'التلميذ',
            visible: true,
            render: (value) => <div style={{ fontWeight: '600' }}>{value}</div>
        },
        {
            key: 'target',
            label: t?.('reception.meeting_with') || 'مع',
            visible: true,
            render: (value) => (
                <div className="with-cell">
                    <User size={14} />
                    <span>{value}</span>
                </div>
            )
        },
        {
            key: 'reason',
            label: t?.('reception.purpose') || 'السبب',
            visible: true,
            render: (value) => <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold' }}>{value}</span>
        },
        {
            key: 'date',
            label: t?.('reception.date') || 'التاريخ',
            visible: true,
            render: (value) => (
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{value}</div>
            )
        },
        {
            key: 'timeIn',
            label: t?.('reception.time_slot') || 'الوقت',
            visible: true,
            render: (value, row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold' }}>
                    <Clock size={13} />
                    {value} {row.timeOut ? `- ${row.timeOut}` : ''}
                </div>
            )
        },
        {
            key: 'status',
            label: t?.('reception.status') || 'الحالة',
            visible: true,
            render: (status) => {
                const isCompleted = status === 'completed';
                return (
                    <span className={`dt-badge ${isCompleted ? 'success' : 'warning'}`}>
                        {isCompleted ? (t?.('reception.status_completed') || 'منجز') : (t?.('reception.status_pending') || 'قيد الانتظار')}
                    </span>
                );
            }
        },
        {
            key: 'actions',
            label: t?.('reception.actions') || 'إجراءات',
            visible: true,
            render: (_, row) => (
                <div className="actions-cell">
                    <button className="btn-approve" title={t?.('reception.view_details') || 'عرض التفاصيل'} onClick={() => setSelectedMeeting(row)}>
                        <FileText size={16} />
                    </button>
                </div>
            )
        }
    ], [t]);

    return (
        <div className="reception-logger fade-in">
            <div className="page-header">
                <div className="header-content">
                    <h1>{t?.('reception.nav_log') || 'الأرشيف'}</h1>
                    <p>{t?.('reception.log_desc') || 'أرشيف استمارة الاستقبال'}</p>
                </div>
            </div>

            <div>
                <Panel
                    title={t?.('reception.all_year_logs') || 'سجل زيارات العام كامل'}
                    icon={FileText}
                    contentClassName="p-0"
                >
                    <DataTable
                        data={allYearLogs}
                        columns={yearColumns}
                        defaultColumns={yearColumns}
                        searchPlaceholder={t?.('common.search') || 'بحث...'}
                        onRowClick={(row) => setSelectedMeeting(row)}
                        headerActions={
                            <button className="btn-primary" onClick={() => setSelectedMeeting('new')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', background: 'var(--color-primary)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                                <Plus size={16} />
                                {t?.('reception.add_log') || 'إضافة سجل'}
                            </button>
                        }
                    />
                </Panel>
            </div>

            {/* Meeting Result Modal */}
            <Modal
                isOpen={!!selectedMeeting}
                onClose={() => setSelectedMeeting(null)}
                title={t?.('reception.meeting_details') || 'تفاصيل الاجتماع'}
                width="600px"
            >
                {selectedMeeting && selectedMeeting !== 'new' && (
                    <div className="meeting-result-view" style={{ padding: '10px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                            <div>
                                <h5 style={{ fontSize: '12px', color: 'var(--color-slate-400)', textTransform: 'uppercase', marginBottom: '8px' }}>{t?.('reception.visitor_name') || 'اسم الزائر'}</h5>
                                <p style={{ fontWeight: '750', fontSize: '16px' }}>{selectedMeeting.parent}</p>
                            </div>
                            <div>
                                <h5 style={{ fontSize: '12px', color: 'var(--color-slate-400)', textTransform: 'uppercase', marginBottom: '8px' }}>{t?.('common.student') || 'التلميذ'}</h5>
                                <p style={{ fontWeight: '750', fontSize: '16px' }}>{selectedMeeting.student}</p>
                            </div>
                            <div>
                                <h5 style={{ fontSize: '12px', color: 'var(--color-slate-400)', textTransform: 'uppercase', marginBottom: '8px' }}>{t?.('reception.meeting_with') || 'الاجتماع مع'}</h5>
                                <p style={{ fontWeight: '750', fontSize: '16px', color: 'var(--color-primary)' }}>{selectedMeeting.target}</p>
                            </div>
                            <div>
                                <h5 style={{ fontSize: '12px', color: 'var(--color-slate-400)', textTransform: 'uppercase', marginBottom: '8px' }}>{t?.('reception.time_slot') || 'الوقت'}</h5>
                                <p style={{ fontWeight: '750', fontSize: '16px' }}>{selectedMeeting.timeIn} - {selectedMeeting.timeOut || '...'}</p>
                            </div>
                        </div>

                        <div style={{ background: 'var(--color-slate-50)', padding: '20px', borderRadius: '15px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                            <h5 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={16} color="var(--color-primary)" />
                                {t?.('reception.meeting_outcomes') || 'مخرجات ونتائج المقابلة'}
                            </h5>
                            <p style={{ lineHeight: '1.7', color: 'var(--color-slate-700)', fontSize: '15px' }}>
                                {selectedMeeting.result}
                            </p>
                        </div>

                        <div style={{ background: '#fffbeb', padding: '20px', borderRadius: '15px', border: '1px solid #fde68a', marginBottom: '15px' }}>
                            <h5 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706' }}>
                                <Edit3 size={16} />
                                {t?.('reception.admin_notes') || 'ملاحظات إدارية'}
                            </h5>
                            <textarea
                                rows="2"
                                placeholder={t?.('reception.admin_notes_placeholder') || 'أضف ملاحظات إدارية...'}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #fde68a', outline: 'none', background: '#fff', color: '#92400e', fontFamily: 'inherit', resize: 'vertical', fontSize: '14px', transition: 'border-color 0.2s' }}
                                onFocus={(e) => e.target.style.borderColor = '#d97706'}
                                onBlur={(e) => e.target.style.borderColor = '#fde68a'}
                            ></textarea>
                        </div>

                        <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '15px', border: '1px solid #bbf7d0', marginBottom: '20px' }}>
                            <h5 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d' }}>
                                <Check size={16} />
                                {t?.('reception.admin_actions') || 'الإجرائات المتخذة'}
                            </h5>
                            <textarea
                                rows="2"
                                placeholder={t?.('reception.admin_actions_placeholder') || 'أضف الإجرائات التي تم اتخاذها...'}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', outline: 'none', background: '#fff', color: '#14532d', fontFamily: 'inherit', resize: 'vertical', fontSize: '14px', transition: 'border-color 0.2s' }}
                                onFocus={(e) => e.target.style.borderColor = '#15803d'}
                                onBlur={(e) => e.target.style.borderColor = '#bbf7d0'}
                            ></textarea>
                        </div>

                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setSelectedMeeting(null)}
                                style={{ padding: '10px 24px', borderRadius: '10px', background: 'var(--color-slate-100)', border: 'none', fontWeight: '700', cursor: 'pointer' }}
                            >
                                {t?.('common.close') || 'إغلاق'}
                            </button>
                        </div>
                    </div>
                )}

                {selectedMeeting === 'new' && (
                    <div className="new-meeting-form" style={{ padding: '20px 10px 10px' }}>
                        <form onSubmit={(e) => { e.preventDefault(); setSelectedMeeting(null); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-color)' }}>{t?.('reception.visitor_name') || 'اسم الزائر'}</label>
                                    <input type="text" placeholder={t?.('reception.visitor_name_placeholder') || 'John Doe'} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'inherit', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-color)' }}>{t?.('common.student') || 'التلميذ'}</label>
                                    <input type="text" placeholder={t?.('reception.student_name_placeholder') || 'Child First Name'} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'inherit', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-color)' }}>{t?.('reception.meeting_with') || 'الاجتماع مع'}</label>
                                <select style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'inherit', cursor: 'pointer', appearance: 'auto', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}>
                                    <option>{t?.('reception.principal') || 'المدير'}</option>
                                    <option>{t?.('reception.accounting') || 'المحاسبة'}</option>
                                    <option>{t?.('reception.teacher') || 'أستاذ(ة)'}</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-color)' }}>{t?.('reception.purpose') || 'سبب المقابلة'}</label>
                                <input type="text" placeholder={t?.('reception.reason_placeholder') || 'Reason...'} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'inherit', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-color)' }}>{t?.('reception.meeting_result') || 'مخرجات المقابلة'}</label>
                                <textarea rows="3" placeholder={t?.('reception.outcome_placeholder') || 'Briefly describe the outcome...'} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}></textarea>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-color)' }}>{t?.('reception.admin_notes') || 'ملاحظات إدارية'}</label>
                                <textarea rows="2" placeholder={t?.('reception.admin_notes_placeholder') || 'أضف ملاحظات إدارية...'} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}></textarea>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-color)' }}>{t?.('reception.admin_actions') || 'الإجرائات المتخذة'}</label>
                                <textarea rows="2" placeholder={t?.('reception.admin_actions_placeholder') || 'أضف الإجرائات التي تم اتخاذها...'} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}></textarea>
                            </div>

                            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedMeeting(null)}
                                    style={{ padding: '12px 24px', borderRadius: '10px', background: 'var(--color-slate-100)', color: 'var(--text-color)', border: 'none', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' }}
                                    onMouseOver={(e) => e.target.style.background = 'var(--color-slate-200)'}
                                    onMouseOut={(e) => e.target.style.background = 'var(--color-slate-100)'}
                                >
                                    {t?.('common.cancel') || 'إلغاء'}
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '12px 24px', borderRadius: '10px', background: 'var(--color-primary)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer', transition: 'opacity 0.2s, transform 0.2s' }}
                                    onMouseOver={(e) => e.target.style.opacity = '0.9'}
                                    onMouseOut={(e) => e.target.style.opacity = '1'}
                                >
                                    {t?.('common.save') || 'حفظ السجل'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>
        </div>
    );
};
