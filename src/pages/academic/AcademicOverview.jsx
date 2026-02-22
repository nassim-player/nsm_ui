import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import {
    BookOpen, TrendingUp, Users, Activity, FileText,
    CheckCircle, AlertCircle, Clock, Eye, Paperclip, Edit3
} from 'react-feather';
import { StatCard } from '../../components/common/Card/Card';
import { Panel } from '../../components/common/Panel/Panel';
import './AcademicOverview.scss';

// Mock: class-level diary status for today (has entry = true)
const classDiaryStatus = [
    { id: '1P-A', label: '1 ابتدائي أ', level: 'primary', logged: true, period: '08:00' },
    { id: '1P-B', label: '1 ابتدائي ب', level: 'primary', logged: true, period: '08:00' },
    { id: '2P-A', label: '2 ابتدائي أ', level: 'primary', logged: true, period: '08:00' },
    { id: '2P-B', label: '2 ابتدائي ب', level: 'primary', logged: false, period: null },
    { id: '3P-A', label: '3 ابتدائي أ', level: 'primary', logged: true, period: '09:30' },
    { id: '3P-B', label: '3 ابتدائي ب', level: 'primary', logged: false, period: null },
    { id: '1M-A', label: '1 متوسط أ', level: 'middle', logged: true, period: '08:00' },
    { id: '1M-B', label: '1 متوسط ب', level: 'middle', logged: true, period: '10:00' },
    { id: '2M-A', label: '2 متوسط أ', level: 'middle', logged: false, period: null },
    { id: '2M-B', label: '2 متوسط ب', level: 'middle', logged: true, period: '11:00' },
];

// Mock: lesson diary entries
const diaryEntries = [
    { id: 'e1', subject: 'رياضيات', teacher: 'محمد علي', lessonTitle: 'الكسور العادية والكسور العشرية', contentSummary: 'تم شرح تحويل الكسور العادية إلى عشرية والعكس، مع تمارين تطبيقية على السبورة.', resources: [{ type: 'pdf', label: 'ورقة_عمل_الكسور.pdf' }], homework: 'تمارين ص 24–25 أرقام 1 إلى 6', timestamp: '2026-02-18T08:45:00', modifiedAt: null },
    { id: 'e2', subject: 'علوم', teacher: 'فاطمة الزهراء', lessonTitle: 'دورة حياة النبات', contentSummary: 'شرح مراحل الإنبات والتمثيل الضوئي، مع تجربة عملية في الصف.', resources: [{ type: 'link', label: 'فيديو الإنبات' }, { type: 'pdf', label: 'ملخص_الدرس.pdf' }], homework: 'مراقبة نبتة لمدة أسبوع وتسجيل الملاحظات', timestamp: '2026-02-18T09:20:00', modifiedAt: '2026-02-18T10:00:00' },
    { id: 'e3', subject: 'لغة عربية', teacher: 'أحمد منصور', lessonTitle: 'قراءة: النص الوصفي', contentSummary: 'تحليل نص وصفي من الكتاب المقرر، واستخراج أدوات الوصف والأسلوب.', resources: [], homework: 'كتابة فقرة وصفية عن فصل الربيع', timestamp: '2026-02-18T10:15:00', modifiedAt: null },
];

// Mock: homework entries
const homeworkEntries = [
    { id: 'h1', date: '2026-02-18', className: '1 ابتدائي أ', subject: 'رياضيات', teacher: 'محمد علي', title: 'تمارين الكسور', description: 'تمارين ص 24–25 أرقام 1 إلى 6. إكمال التحويل بين كسر عادي وعشري.', resources: [{ type: 'pdf', label: 'ورقة_عمل_الكسور.pdf' }], inAppExercises: true, timestamp: '2026-02-18T08:50:00' },
    { id: 'h2', date: '2026-02-18', className: '1 ابتدائي أ', subject: 'علوم', teacher: 'فاطمة الزهراء', title: 'مراقبة النبتة', description: 'مراقبة نبتة لمدة أسبوع وتسجيل الملاحظات يومياً.', resources: [{ type: 'paragraph', label: 'تعليمات' }, { type: 'image', label: 'مخطط_الإنبات.jpg' }], inAppExercises: false, timestamp: '2026-02-18T09:25:00' },
    { id: 'h3', date: '2026-02-18', className: '2 ابتدائي أ', subject: 'لغة عربية', teacher: 'أحمد منصور', title: 'فقرة وصفية', description: 'كتابة فقرة وصفية عن فصل الربيع (من 5 إلى 8 أسطر).', resources: [], inAppExercises: true, timestamp: '2026-02-18T10:20:00' },
];

// Mock: summary entries (new type)
const summaryEntries = [
    { id: 's1', date: '2026-02-18', className: '1 ابتدائي أ', subject: 'رياضيات', teacher: 'محمد علي', title: 'ملخص الكسور', content: 'الكسور العادية: بسط ومقام. التحويل إلى كسر عشري بالقسمة. الكسور المتكافئة: ضرب أو قسمة البسط والمقام بنفس العدد.', resources: [{ type: 'pdf', label: 'ملخص_الكسور.pdf' }], timestamp: '2026-02-18T09:00:00' },
    { id: 's2', date: '2026-02-18', className: '1 ابتدائي أ', subject: 'علوم', teacher: 'فاطمة الزهراء', title: 'ملخص دورة حياة النبات', content: 'الإنبات: بذرة → جذر → ساق → أوراق. التمثيل الضوئي: ماء + ثاني أكسيد الكربون + ضوء = غذاء + أكسجين.', resources: [], timestamp: '2026-02-18T09:30:00' },
];

export const AcademicOverview = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('lessons');

    const completionRate = useMemo(() => {
        const logged = classDiaryStatus.filter((c) => c.logged).length;
        const total = classDiaryStatus.length;
        return total ? Math.round((logged / total) * 100) : 0;
    }, []);

    const recentUpdatesCount = diaryEntries.filter((e) => e.modifiedAt).length;
    const parentEngagementPercent = 78; // mock

    const stats = [
        {
            label: t('academic.kpi_diary_completion'),
            value: `${completionRate}%`,
            icon: BookOpen,
            color: '#10b981',
            badges: [{ label: t('academic.today'), variant: 'info' }],
        },
        {
            label: t('academic.kpi_recent_updates'),
            value: recentUpdatesCount,
            icon: Activity,
            color: '#3b82f6',
            badges: [{ label: t('academic.last_24h'), variant: 'info' }],
        },
        {
            label: t('academic.kpi_parent_engagement'),
            value: `${parentEngagementPercent}%`,
            icon: Users,
            color: '#8b5cf6',
            badges: [{ label: t('academic.views_this_week'), variant: 'info' }],
        },
    ];

    const primaryClasses = classDiaryStatus.filter((c) => c.level === 'primary');
    const middleClasses = classDiaryStatus.filter((c) => c.level === 'middle');

    const renderStatusCell = (logged) => (
        <span className={`status-dot ${logged ? 'logged' : 'empty'}`} title={logged ? t('academic.class_logged') : t('academic.class_empty')}>
            {logged ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
        </span>
    );

    const tabs = [
        { key: 'lessons', label: t('academic.tab_lessons'), icon: BookOpen, count: diaryEntries.length },
        { key: 'homeworks', label: t('academic.tab_homeworks'), icon: Edit3, count: homeworkEntries.length },
        { key: 'summaries', label: t('academic.tab_summaries'), icon: FileText, count: summaryEntries.length },
    ];

    return (
        <div className="academic-overview">
            <div className="page-header">
                <div className="header-content">
                    <h1>{t('academic.unit_title')}</h1>
                    <p>{t('academic.overview_desc')}</p>
                </div>
            </div>

            {/* KPI Stats */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        style={{ '--icon-bg': `${stat.color}15`, '--icon-color': stat.color }}
                        badges={stat.badges}
                    />
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="main-column">
                    {/* Status Grid / Heatmap */}
                    <Panel
                        title={t('academic.status_grid_title')}
                        icon={TrendingUp}
                        badge={t('academic.today')}
                        badgeVariant="info"
                        contentClassName="status-grid-wrap"
                        className="overview-panel"
                        glass
                    >
                        <div className="status-grid">
                            <div className="grid-section">
                                <h4>{t('academic.level_primary')}</h4>
                                <div className="grid-rows">
                                    {primaryClasses.map((row) => (
                                        <div key={row.id} className="grid-row">
                                            <span className="class-label">{row.label}</span>
                                            <span className="class-time">{row.period || '—'}</span>
                                            {renderStatusCell(row.logged)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid-section">
                                <h4>{t('academic.level_middle')}</h4>
                                <div className="grid-rows">
                                    {middleClasses.map((row) => (
                                        <div key={row.id} className="grid-row">
                                            <span className="class-label">{row.label}</span>
                                            <span className="class-time">{row.period || '—'}</span>
                                            {renderStatusCell(row.logged)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Panel>

                    {/* Tabbed feed: Lessons / Homeworks / Summaries */}
                    <div className="overview-panel tabbed-panel">
                        <div className="tabs-bar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    <tab.icon size={16} />
                                    <span className="tab-label">{tab.label}</span>
                                    <span className="tab-count">{tab.count}</span>
                                </button>
                            ))}
                        </div>

                        <div className="tab-content">
                            {/* Lessons tab */}
                            {activeTab === 'lessons' && (
                                <div className="diary-feed">
                                    {diaryEntries.map((entry) => (
                                        <article key={entry.id} className="diary-entry">
                                            <div className="entry-meta">
                                                <span className="entry-time">
                                                    <Clock size={14} />
                                                    {new Date(entry.timestamp).toLocaleTimeString('ar-u-nu-latn', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {entry.modifiedAt && (
                                                    <span className="entry-modified">
                                                        {t('academic.modified')} {new Date(entry.modifiedAt).toLocaleTimeString('ar-u-nu-latn', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="entry-subject-teacher">
                                                <span className="subject">{entry.subject}</span>
                                                <span className="teacher">{entry.teacher}</span>
                                            </div>
                                            <h4 className="entry-lesson-title">{entry.lessonTitle}</h4>
                                            <p className="entry-summary">{entry.contentSummary}</p>
                                            {(entry.resources?.length > 0 || entry.homework) && (
                                                <div className="entry-attachments">
                                                    {entry.resources?.map((r, i) => (
                                                        <span key={i} className="resource-tag">
                                                            <Paperclip size={12} />
                                                            {r.label}
                                                        </span>
                                                    ))}
                                                    {entry.homework && (
                                                        <span className="homework-tag">{t('academic.homework')}: {entry.homework}</span>
                                                    )}
                                                </div>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            )}

                            {/* Homeworks tab */}
                            {activeTab === 'homeworks' && (
                                <div className="diary-feed homeworks-feed">
                                    {homeworkEntries.map((entry) => (
                                        <article key={entry.id} className="diary-entry homework-entry">
                                            <div className="entry-meta">
                                                <span className="entry-time">
                                                    <Clock size={14} />
                                                    {new Date(entry.timestamp).toLocaleTimeString('ar-u-nu-latn', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="entry-class">{entry.className}</span>
                                            </div>
                                            <div className="entry-subject-teacher">
                                                <span className="subject">{entry.subject}</span>
                                                <span className="teacher">{entry.teacher}</span>
                                            </div>
                                            <h4 className="entry-lesson-title">{entry.title}</h4>
                                            <p className="entry-summary">{entry.description}</p>
                                            <div className="entry-attachments">
                                                {entry.resources?.map((r, i) => (
                                                    <span key={i} className={`resource-tag type-${r.type}`}>
                                                        <Paperclip size={12} />
                                                        {t(`academic.entry_type_${r.type}`)}: {r.label}
                                                    </span>
                                                ))}
                                                {entry.inAppExercises && (
                                                    <span className="homework-tag in-app">
                                                        <Edit3 size={12} />
                                                        {t('academic.in_app_exercises')}
                                                    </span>
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}

                            {/* Summaries tab */}
                            {activeTab === 'summaries' && (
                                <div className="diary-feed summaries-feed">
                                    {summaryEntries.map((entry) => (
                                        <article key={entry.id} className="diary-entry summary-entry">
                                            <div className="entry-meta">
                                                <span className="entry-time">
                                                    <Clock size={14} />
                                                    {new Date(entry.timestamp).toLocaleTimeString('ar-u-nu-latn', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="entry-class">{entry.className}</span>
                                            </div>
                                            <div className="entry-subject-teacher">
                                                <span className="subject">{entry.subject}</span>
                                                <span className="teacher">{entry.teacher}</span>
                                            </div>
                                            <h4 className="entry-lesson-title">{entry.title}</h4>
                                            <p className="entry-summary">{entry.content}</p>
                                            {entry.resources?.length > 0 && (
                                                <div className="entry-attachments">
                                                    {entry.resources.map((r, i) => (
                                                        <span key={i} className="resource-tag">
                                                            <Paperclip size={12} />
                                                            {r.label}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="side-column">
                    <div className="overview-card">
                        <div className="card-header">
                            <h3>{t('academic.quick_insight')}</h3>
                            <Activity size={16} />
                        </div>
                        <div className="insight-list">
                            <div className="insight-item success">
                                <CheckCircle size={18} />
                                <span>{primaryClasses.filter((c) => c.logged).length} {t('academic.classes_logged_primary')}</span>
                            </div>
                            <div className="insight-item warning">
                                <AlertCircle size={18} />
                                <span>{classDiaryStatus.filter((c) => !c.logged).length} {t('academic.classes_pending')}</span>
                            </div>
                            <div className="insight-item info">
                                <Users size={18} />
                                <span>{t('academic.parent_views_today')}: 142</span>
                            </div>
                        </div>
                    </div>

                    <div className="overview-card">
                        <div className="card-header">
                            <h3>{t('academic.legend')}</h3>
                        </div>
                        <div className="legend-list">
                            <div className="legend-item">
                                <span className="status-dot logged"><CheckCircle size={14} /></span>
                                <span>{t('academic.class_logged')}</span>
                            </div>
                            <div className="legend-item">
                                <span className="status-dot empty"><AlertCircle size={14} /></span>
                                <span>{t('academic.class_empty')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
