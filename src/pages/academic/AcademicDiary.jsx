import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import {
    BookOpen, Filter, Calendar, Clock, Eye, Paperclip, Download, X, Edit3, User, Layers, FileText
} from 'react-feather';
import './AcademicDiary.scss';

// Mock: extended diary entries (multiple days/classes for filtering)
const MOCK_ENTRIES = [
    { id: 'e1', date: '2026-02-18', classId: '1P-A', className: '1 ابتدائي أ', subject: 'رياضيات', teacher: 'محمد علي', lessonTitle: 'الكسور العادية والكسور العشرية', contentSummary: 'تم شرح تحويل الكسور العادية إلى عشرية والعكس، مع تمارين تطبيقية على السبورة.', resources: [{ type: 'pdf', label: 'ورقة_عمل_الكسور.pdf' }], homework: 'تمارين ص 24–25 أرقام 1 إلى 6', timestamp: '2026-02-18T08:45:00', modifiedAt: null, level: 'primary' },
    { id: 'e2', date: '2026-02-18', classId: '1P-A', className: '1 ابتدائي أ', subject: 'علوم', teacher: 'فاطمة الزهراء', lessonTitle: 'دورة حياة النبات', contentSummary: 'شرح مراحل الإنبات والتمثيل الضوئي، مع تجربة عملية في الصف.', resources: [{ type: 'link', label: 'فيديو الإنبات' }], homework: 'مراقبة نبتة لمدة أسبوع', timestamp: '2026-02-18T09:20:00', modifiedAt: '2026-02-18T10:00:00', level: 'primary' },
    { id: 'e3', date: '2026-02-18', classId: '2P-A', className: '2 ابتدائي أ', subject: 'لغة عربية', teacher: 'أحمد منصور', lessonTitle: 'قراءة: النص الوصفي', contentSummary: 'تحليل نص وصفي من الكتاب المقرر، واستخراج أدوات الوصف.', resources: [], homework: 'كتابة فقرة وصفية عن فصل الربيع', timestamp: '2026-02-18T10:15:00', modifiedAt: null, level: 'primary' },
    { id: 'e4', date: '2026-02-18', classId: '1M-A', className: '1 متوسط أ', subject: 'رياضيات', teacher: 'محمد علي', lessonTitle: 'المعادلات من الدرجة الأولى', contentSummary: 'حل معادلات من الشكل ax + b = c مع تمارين تطبيقية.', resources: [{ type: 'pdf', label: 'تمارين_المعادلات.pdf' }], homework: 'ص 42 أرقام 1–10', timestamp: '2026-02-18T08:00:00', modifiedAt: null, level: 'middle' },
    { id: 'e5', date: '2026-02-17', classId: '1P-A', className: '1 ابتدائي أ', subject: 'تربية إسلامية', teacher: 'سارة بن عودة', lessonTitle: 'سورة الفاتحة ومعانيها', contentSummary: 'تلاوة وشرح معاني السورة مع التركيز على الأدب مع الله.', resources: [], homework: 'حفظ السورة مع المعاني', timestamp: '2026-02-17T09:00:00', modifiedAt: null, level: 'primary' },
    { id: 'e6', date: '2026-02-17', classId: '2M-B', className: '2 متوسط ب', subject: 'علوم', teacher: 'فاطمة الزهراء', lessonTitle: 'الخلية والأنسجة', contentSummary: 'تعريف الخلية وتركيبها، والعلاقة بين الخلايا والأنسجة.', resources: [{ type: 'link', label: 'شرح الخلية' }], homework: 'رسم مخطط خلوي', timestamp: '2026-02-17T11:30:00', modifiedAt: '2026-02-17T14:00:00', level: 'middle' },
];

// Mock: homework entries
const MOCK_HOMEWORKS = [
    { id: 'h1', date: '2026-02-18', classId: '1P-A', className: '1 ابتدائي أ', subject: 'رياضيات', teacher: 'محمد علي', title: 'تمارين الكسور', description: 'تمارين ص 24–25 أرقام 1 إلى 6.', resources: [{ type: 'pdf', label: 'ورقة_عمل_الكسور.pdf' }], inAppExercises: true, timestamp: '2026-02-18T08:50:00', level: 'primary' },
    { id: 'h2', date: '2026-02-18', classId: '1P-A', className: '1 ابتدائي أ', subject: 'علوم', teacher: 'فاطمة الزهراء', title: 'مراقبة النبتة', description: 'مراقبة نبتة لمدة أسبوع وتسجيل الملاحظات.', resources: [{ type: 'image', label: 'مخطط_الإنبات.jpg' }], inAppExercises: false, timestamp: '2026-02-18T09:25:00', level: 'primary' },
    { id: 'h3', date: '2026-02-18', classId: '2P-A', className: '2 ابتدائي أ', subject: 'لغة عربية', teacher: 'أحمد منصور', title: 'فقرة وصفية', description: 'كتابة فقرة وصفية عن فصل الربيع (5–8 أسطر).', resources: [], inAppExercises: true, timestamp: '2026-02-18T10:20:00', level: 'primary' },
    { id: 'h4', date: '2026-02-18', classId: '1M-A', className: '1 متوسط أ', subject: 'رياضيات', teacher: 'محمد علي', title: 'المعادلات', description: 'ص 42 أرقام 1–10. حل المعادلات من الدرجة الأولى.', resources: [{ type: 'pdf', label: 'تمارين_المعادلات.pdf' }], inAppExercises: true, timestamp: '2026-02-18T08:10:00', level: 'middle' },
];

// Mock: summary entries
const MOCK_SUMMARIES = [
    { id: 's1', date: '2026-02-18', classId: '1P-A', className: '1 ابتدائي أ', subject: 'رياضيات', teacher: 'محمد علي', title: 'ملخص الكسور', content: 'الكسور العادية: بسط ومقام. التحويل إلى كسر عشري بالقسمة. الكسور المتكافئة: ضرب أو قسمة البسط والمقام بنفس العدد.', resources: [{ type: 'pdf', label: 'ملخص_الكسور.pdf' }], timestamp: '2026-02-18T09:00:00', level: 'primary' },
    { id: 's2', date: '2026-02-18', classId: '1P-A', className: '1 ابتدائي أ', subject: 'علوم', teacher: 'فاطمة الزهراء', title: 'ملخص دورة حياة النبات', content: 'الإنبات: بذرة → جذر → ساق → أوراق. التمثيل الضوئي: ماء + ثاني أكسيد الكربون + ضوء = غذاء + أكسجين.', resources: [], timestamp: '2026-02-18T09:30:00', level: 'primary' },
    { id: 's3', date: '2026-02-18', classId: '1M-A', className: '1 متوسط أ', subject: 'رياضيات', teacher: 'محمد علي', title: 'ملخص المعادلات', content: 'المعادلة من الدرجة الأولى: ax + b = 0 → x = -b/a. خطوات الحل: 1) تبسيط الطرفين، 2) عزل المجهول، 3) التحقق.', resources: [{ type: 'pdf', label: 'ملخص_المعادلات.pdf' }], timestamp: '2026-02-18T08:15:00', level: 'middle' },
    { id: 's4', date: '2026-02-17', classId: '2M-B', className: '2 متوسط ب', subject: 'علوم', teacher: 'فاطمة الزهراء', title: 'ملخص الخلية', content: 'الخلية: وحدة بناء الكائن الحي. الغشاء الخلوي → السيتوبلازم → النواة. الأنسجة: مجموعة خلايا متشابهة في الوظيفة.', resources: [{ type: 'link', label: 'ملخص مرئي' }], timestamp: '2026-02-17T12:00:00', level: 'middle' },
];

const LEVEL_OPTIONS = [
    { value: '', labelKey: 'academic.filter_all_levels' },
    { value: 'primary', labelKey: 'academic.level_primary' },
    { value: 'middle', labelKey: 'academic.level_middle' },
];

export const AcademicDiary = () => {
    const { t } = useTranslation();
    const [levelFilter, setLevelFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [teacherFilter, setTeacherFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [showFilters, setShowFilters] = useState(true);
    const [activeTab, setActiveTab] = useState('lessons');

    // Build filter options from all data sources combined
    const allEntries = useMemo(() => [...MOCK_ENTRIES, ...MOCK_HOMEWORKS, ...MOCK_SUMMARIES], []);

    const classes = useMemo(() => {
        const set = new Set(allEntries.map((e) => e.classId));
        return Array.from(set).map((id) => {
            const e = allEntries.find((x) => x.classId === id);
            return { id, label: e?.className || id };
        }).sort((a, b) => a.label.localeCompare(b.label));
    }, [allEntries]);

    const teachers = useMemo(() => {
        const set = new Set(allEntries.map((e) => e.teacher));
        return Array.from(set).sort();
    }, [allEntries]);

    const dates = useMemo(() => {
        const set = new Set(allEntries.map((e) => e.date));
        return Array.from(set).sort().reverse();
    }, [allEntries]);

    const applyFilters = (items) => items.filter((e) => {
        if (levelFilter && e.level !== levelFilter) return false;
        if (classFilter && e.classId !== classFilter) return false;
        if (teacherFilter && e.teacher !== teacherFilter) return false;
        if (dateFilter && e.date !== dateFilter) return false;
        return true;
    }).sort((a, b) => (b.date + b.timestamp).localeCompare(a.date + a.timestamp));

    const filteredEntries = useMemo(() => applyFilters(MOCK_ENTRIES), [levelFilter, classFilter, teacherFilter, dateFilter]);
    const filteredHomeworks = useMemo(() => applyFilters(MOCK_HOMEWORKS), [levelFilter, classFilter, teacherFilter, dateFilter]);
    const filteredSummaries = useMemo(() => applyFilters(MOCK_SUMMARIES), [levelFilter, classFilter, teacherFilter, dateFilter]);

    const clearFilters = () => {
        setLevelFilter('');
        setClassFilter('');
        setTeacherFilter('');
        setDateFilter('');
    };

    const hasActiveFilters = levelFilter || classFilter || teacherFilter || dateFilter;

    const tabs = [
        { key: 'lessons', label: t('academic.tab_lessons'), icon: BookOpen, count: filteredEntries.length },
        { key: 'homeworks', label: t('academic.tab_homeworks'), icon: Edit3, count: filteredHomeworks.length },
        { key: 'summaries', label: t('academic.tab_summaries'), icon: FileText, count: filteredSummaries.length },
    ];

    return (
        <div className="academic-diary">
            {/* Page Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1>{t('academic.diary_page_title')}</h1>
                    <p>{t('academic.diary_page_desc')}</p>
                </div>
                <div className="header-actions">
                    <button type="button" className="action-btn secondary" onClick={() => setShowFilters(!showFilters)}>
                        <Filter size={16} />
                        {showFilters ? t('academic.hide_filters') : t('academic.show_filters')}
                    </button>
                    <button type="button" className="action-btn primary">
                        <Download size={16} />
                        {t('academic.export_diary')}
                    </button>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="filters-bar">
                    <div className="filter-group">
                        <label><Layers size={14} /> {t('academic.filter_by_level')}</label>
                        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                            {LEVEL_OPTIONS.map((opt) => (
                                <option key={opt.value || 'all'} value={opt.value}>{t(opt.labelKey)}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label><BookOpen size={14} /> {t('academic.filter_by_class')}</label>
                        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                            <option value="">{t('academic.filter_all')}</option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label><User size={14} /> {t('academic.filter_by_teacher')}</label>
                        <select value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)}>
                            <option value="">{t('academic.filter_all')}</option>
                            {teachers.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label><Calendar size={14} /> {t('academic.filter_by_date')}</label>
                        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                            <option value="">{t('academic.filter_all')}</option>
                            {dates.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                    {hasActiveFilters && (
                        <button type="button" className="clear-filters" onClick={clearFilters}>
                            <X size={14} />
                            {t('academic.clear_filters')}
                        </button>
                    )}
                </div>
            )}

            {/* Tabbed Feed Panel */}
            <div className="diary-tabbed-panel">
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
                        <div className="diary-feed-list">
                            {filteredEntries.length === 0 ? (
                                <div className="empty-state">
                                    <BookOpen size={48} />
                                    <p>{t('academic.no_entries_match')}</p>
                                </div>
                            ) : (
                                filteredEntries.map((entry) => (
                                    <article key={entry.id} className="diary-entry">
                                        <div className="entry-meta">
                                            <span className="entry-date">
                                                <Calendar size={13} />
                                                {entry.date}
                                            </span>
                                            <span className="entry-class">{entry.className}</span>
                                            <span className="entry-time">
                                                <Clock size={13} />
                                                {new Date(entry.timestamp).toLocaleTimeString('ar-u-nu-latn', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {entry.modifiedAt && (
                                                <span className="entry-modified">
                                                    <Edit3 size={12} />
                                                    {t('academic.modified')}
                                                </span>
                                            )}
                                        </div>
                                        <div className="entry-subject-teacher">
                                            <span className="subject">{entry.subject}</span>
                                            <span className="separator">·</span>
                                            <span className="teacher">{entry.teacher}</span>
                                        </div>
                                        <h4 className="entry-lesson-title">{entry.lessonTitle}</h4>
                                        <p className="entry-summary">{entry.contentSummary}</p>
                                        {(entry.resources?.length > 0 || entry.homework) && (
                                            <div className="entry-attachments">
                                                {entry.resources?.map((r, i) => (
                                                    <span key={i} className="resource-tag"><Paperclip size={12} /> {r.label}</span>
                                                ))}
                                                {entry.homework && <span className="homework-tag">{t('academic.homework')}: {entry.homework}</span>}
                                            </div>
                                        )}
                                    </article>
                                ))
                            )}
                        </div>
                    )}

                    {/* Homeworks tab */}
                    {activeTab === 'homeworks' && (
                        <div className="diary-feed-list">
                            {filteredHomeworks.length === 0 ? (
                                <div className="empty-state">
                                    <Edit3 size={48} />
                                    <p>{t('academic.no_entries_match')}</p>
                                </div>
                            ) : (
                                filteredHomeworks.map((entry) => (
                                    <article key={entry.id} className="diary-entry homework-entry">
                                        <div className="entry-meta">
                                            <span className="entry-date">
                                                <Calendar size={13} />
                                                {entry.date}
                                            </span>
                                            <span className="entry-class">{entry.className}</span>
                                            <span className="entry-time">
                                                <Clock size={13} />
                                                {new Date(entry.timestamp).toLocaleTimeString('ar-u-nu-latn', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="entry-subject-teacher">
                                            <span className="subject">{entry.subject}</span>
                                            <span className="separator">·</span>
                                            <span className="teacher">{entry.teacher}</span>
                                        </div>
                                        <h4 className="entry-lesson-title">{entry.title}</h4>
                                        <p className="entry-summary">{entry.description}</p>
                                        <div className="entry-attachments">
                                            {entry.resources?.map((r, i) => (
                                                <span key={i} className={`resource-tag type-${r.type}`}>
                                                    <Paperclip size={12} /> {t(`academic.entry_type_${r.type}`)}: {r.label}
                                                </span>
                                            ))}
                                            {entry.inAppExercises && (
                                                <span className="homework-tag in-app">
                                                    <Edit3 size={12} /> {t('academic.in_app_exercises')}
                                                </span>
                                            )}
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    )}

                    {/* Summaries tab */}
                    {activeTab === 'summaries' && (
                        <div className="diary-feed-list">
                            {filteredSummaries.length === 0 ? (
                                <div className="empty-state">
                                    <FileText size={48} />
                                    <p>{t('academic.no_entries_match')}</p>
                                </div>
                            ) : (
                                filteredSummaries.map((entry) => (
                                    <article key={entry.id} className="diary-entry summary-entry">
                                        <div className="entry-meta">
                                            <span className="entry-date">
                                                <Calendar size={13} />
                                                {entry.date}
                                            </span>
                                            <span className="entry-class">{entry.className}</span>
                                            <span className="entry-time">
                                                <Clock size={13} />
                                                {new Date(entry.timestamp).toLocaleTimeString('ar-u-nu-latn', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="entry-subject-teacher">
                                            <span className="subject">{entry.subject}</span>
                                            <span className="separator">·</span>
                                            <span className="teacher">{entry.teacher}</span>
                                        </div>
                                        <h4 className="entry-lesson-title">{entry.title}</h4>
                                        <p className="entry-summary">{entry.content}</p>
                                        {entry.resources?.length > 0 && (
                                            <div className="entry-attachments">
                                                {entry.resources.map((r, i) => (
                                                    <span key={i} className="resource-tag">
                                                        <Paperclip size={12} /> {r.label}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </article>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
