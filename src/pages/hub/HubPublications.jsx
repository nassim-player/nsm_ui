import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import {
    MessageSquare, AlertTriangle, AlertOctagon, Info, Clock,
    User, Tag, ChevronDown, Plus, Send, Filter, Search,
    CheckCircle, Eye, Users, BookOpen, Paperclip, Calendar,
    Globe, Link2, Mail, Smartphone, Share2, Image, FileText,
    X, Upload, Bell, Award, MapPin, Zap, Hash,
    ToggleLeft, ToggleRight, Edit2, Settings
} from 'react-feather';
import { Panel } from '../../components/common/Panel/Panel';
import { Modal } from '../../components/common/Modal/Modal';
import './HubPublications.scss';

// ─── Mock announcements data ───
const MOCK_ANNOUNCEMENTS = [
    {
        id: 'ann-1',
        title: 'تسديد الأقساط الشهرية',
        titleEn: 'Monthly Payment Due',
        content: 'يُرجى من جميع أولياء الأمور تسديد الأقساط الشهرية قبل نهاية شهر فبراير. يمكنكم الدفع عبر التطبيق أو مباشرة في إدارة المدرسة.',
        urgency: 'mandatory',
        author: 'إدارة المدرسة',
        date: '2026-02-19T08:00:00',
        category: 'finance',
        readCount: 312,
        totalTargeted: 350,
        pinned: true,
    },
    {
        id: 'ann-2',
        title: 'تغيير مواعيد الدوام في رمضان',
        titleEn: 'Ramadan Schedule Change',
        content: 'اعتباراً من أول أيام شهر رمضان المبارك، سيتم تعديل مواعيد الدوام المدرسي. الدخول الساعة 8:30 صباحاً والخروج الساعة 1:00 ظهراً. سيتم إرسال الجدول المحدث قريباً.',
        urgency: 'urgent',
        author: 'المدير العام',
        date: '2026-02-18T14:30:00',
        category: 'schedule',
        readCount: 287,
        totalTargeted: 350,
        pinned: true,
    },
    {
        id: 'ann-3',
        title: 'رحلة مدرسية إلى حديقة التجارب',
        titleEn: 'School Trip to Botanical Garden',
        content: 'سيتم تنظيم رحلة مدرسية لطلاب السنة الثالثة ابتدائي إلى حديقة التجارب يوم الأربعاء 25 فبراير. يرجى التوقيع على استمارة الموافقة.',
        urgency: 'normal',
        author: 'قسم الأنشطة',
        date: '2026-02-17T10:00:00',
        category: 'activity',
        readCount: 89,
        totalTargeted: 120,
        pinned: false,
    },
    {
        id: 'ann-4',
        title: 'إغلاق بوابة الدخول الشرقية',
        titleEn: 'East Gate Closure',
        content: 'بسبب أعمال الصيانة، سيتم إغلاق بوابة الدخول الشرقية لمدة أسبوع ابتداءً من 22 فبراير. يُرجى استخدام البوابة الرئيسية.',
        urgency: 'urgent',
        author: 'قسم الصيانة',
        date: '2026-02-16T16:00:00',
        category: 'facility',
        readCount: 198,
        totalTargeted: 350,
        pinned: false,
    },
    {
        id: 'ann-5',
        title: 'مسابقة القرآن الكريم',
        titleEn: 'Quran Competition',
        content: 'تنظم المدرسة مسابقة في حفظ وتلاوة القرآن الكريم. آخر أجل للتسجيل هو 28 فبراير. للتسجيل يرجى التواصل مع أستاذ التربية الإسلامية.',
        urgency: 'normal',
        author: 'قسم الأنشطة الدينية',
        date: '2026-02-15T09:00:00',
        category: 'activity',
        readCount: 145,
        totalTargeted: 350,
        pinned: false,
    },
];

const INITIAL_URGENCY_CONFIG = {
    mandatory: { icon: AlertOctagon, color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
    urgent: { icon: AlertTriangle, color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
    normal: { icon: Info, color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
};

const INITIAL_CATEGORY_CONFIG = {
    finance: { color: '#10b981' },
    schedule: { color: '#f59e0b' },
    activity: { color: '#8b5cf6' },
    facility: { color: '#64748b' },
    health: { color: '#ef4444' },
    regulation: { color: '#6366f1' },
    instruction: { color: '#f43f5e' },
};

// ─── Mock class data for targeting ───
const MOCK_CLASSES = [
    { id: 'c1', name: '1 ابتدائي أ', count: 30 },
    { id: 'c2', name: '1 ابتدائي ب', count: 28 },
    { id: 'c3', name: '2 ابتدائي أ', count: 32 },
    { id: 'c4', name: '2 ابتدائي ب', count: 29 },
    { id: 'c5', name: '3 ابتدائي أ', count: 30 },
];

// ─── Default form state ───
const DEFAULT_FORM = {
    pubType: 'public', // 'public' | 'administrative'
    title: '',
    content: '',
    urgency: 'normal',
    category: 'schedule',
    audiences: ['parents'],
    targetClasses: [],
    targetAllClasses: true,
    pinned: false,
    linkedExams: [],
    attachments: [],
    scheduleType: 'now',
    scheduledDate: '',
    scheduledTime: '',
    channels: { push: true, sms: false, email: true, inApp: true },
    socialShare: { facebook: false, website: false },
    requireConfirmation: false,
};

export const HubPublications = () => {
    const { t, language } = useTranslation();
    const [activeTab, setActiveTab] = useState('main'); // 'main' or 'staff'
    const [urgencyFilter, setUrgencyFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [categories] = useState(INITIAL_CATEGORY_CONFIG);
    const [urgencies] = useState(INITIAL_URGENCY_CONFIG);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    // ── Modal state ──
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ ...DEFAULT_FORM });
    const [dragOver, setDragOver] = useState(false);

    const updateForm = useCallback((key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    }, []);

    const toggleArrayItem = useCallback((key, item) => {
        setForm(prev => {
            const arr = prev[key];
            return { ...prev, [key]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item] };
        });
    }, []);

    const toggleChannel = useCallback((channel) => {
        setForm(prev => ({
            ...prev,
            channels: { ...prev.channels, [channel]: !prev.channels[channel] }
        }));
    }, []);

    const toggleSocial = useCallback((platform) => {
        setForm(prev => ({
            ...prev,
            socialShare: { ...prev.socialShare, [platform]: !prev.socialShare[platform] }
        }));
    }, []);

    const removeAttachment = useCallback((index) => {
        setForm(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    }, []);

    const handleFileDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer?.files || e.target?.files || []);
        const newAttachments = files.map(f => ({
            name: f.name,
            size: f.size,
            type: f.type,
            preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
        }));
        setForm(prev => ({ ...prev, attachments: [...prev.attachments, ...newAttachments] }));
    }, []);

    const openModal = () => {
        setForm({ ...DEFAULT_FORM });
        setShowModal(true);
    };

    const handleSubmit = () => {
        setShowModal(false);
    };

    const handleFilterAction = (action, type, item = null) => {
        alert(`[API Placeholder]\nAction: ${action}\nType: ${type}\n${item ? `Target: ${item}` : ''}\n\nThis functionality will be connected to the API later.`);
    };

    // ── Audience count ──
    const estimatedReach = useMemo(() => {
        let total = 0;
        if (form.audiences.includes('parents')) total += 350;
        if (form.audiences.includes('teachers')) total += 24;
        if (form.audiences.includes('students')) total += 280;
        if (!form.targetAllClasses && form.targetClasses.length > 0) {
            const classTotal = form.targetClasses.reduce((sum, cId) => {
                const cls = MOCK_CLASSES.find(c => c.id === cId);
                return sum + (cls ? cls.count : 0);
            }, 0);
            total = Math.min(total, classTotal * form.audiences.length);
        }
        return total;
    }, [form.audiences, form.targetAllClasses, form.targetClasses]);

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1048576).toFixed(1)} MB`;
    };

    // Filter announcements
    const filteredAnnouncements = useMemo(() => {
        let result = [...MOCK_ANNOUNCEMENTS];
        if (activeTab === 'staff') {
            result = result.filter(a => ['regulation', 'instruction'].includes(a.category));
        } else {
            result = result.filter(a => !['regulation', 'instruction'].includes(a.category));
        }

        if (urgencyFilter !== 'all') {
            result = result.filter(a => a.urgency === urgencyFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            result = result.filter(a =>
                a.title.toLowerCase().includes(q) ||
                a.content.toLowerCase().includes(q) ||
                a.author.toLowerCase().includes(q)
            );
        }

        result.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
        return result;
    }, [urgencyFilter, searchQuery, activeTab]);

    const stats = useMemo(() => {
        const total = MOCK_ANNOUNCEMENTS.length;
        const mandatory = MOCK_ANNOUNCEMENTS.filter(a => a.urgency === 'mandatory').length;
        const urgent = MOCK_ANNOUNCEMENTS.filter(a => a.urgency === 'urgent').length;
        const normal = MOCK_ANNOUNCEMENTS.filter(a => a.urgency === 'normal').length;
        return { total, mandatory, urgent, normal };
    }, []);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        if (language === 'ar') {
            return d.toLocaleDateString('ar-u-nu-latn', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
        return d.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getReadPercentage = (ann) => {
        return ann.totalTargeted > 0 ? Math.round((ann.readCount / ann.totalTargeted) * 100) : 0;
    };

    const renderModalContent = () => (
        <div className="schedule-modal-content">
            <div className="pub-type-switcher">
                <button
                    className={`type-btn ${form.pubType === 'public' ? 'active' : ''}`}
                    onClick={() => updateForm('pubType', 'public')}
                >
                    <Globe size={18} />
                    <span>{t('hub.public_publication') || 'منشور عام'}</span>
                </button>
                <button
                    className={`type-btn ${form.pubType === 'administrative' ? 'active' : ''}`}
                    onClick={() => updateForm('pubType', 'administrative')}
                >
                    <Users size={18} />
                    <span>{t('hub.administrative_order') || 'أمر إداري'}</span>
                </button>
            </div>

            {form.pubType === 'public' && (
                <section className="modal-section">
                    <div className="section-header">
                        <div className="section-icon"><Users size={18} /></div>
                        <div>
                            <h4>{t('hub.modal_audience')}</h4>
                            <span className="section-hint">{t('hub.modal_audience_hint')}</span>
                        </div>
                    </div>

                    <div className="audience-chips">
                        {[
                            { key: 'parents', icon: User, label: t('hub.modal_parents'), count: 350 },
                            { key: 'teachers', icon: BookOpen, label: t('hub.modal_teachers'), count: 24 },
                            { key: 'students', icon: Award, label: t('hub.modal_students'), count: 280 },
                        ].map(aud => (
                            <button
                                key={aud.key}
                                className={`audience-chip ${form.audiences.includes(aud.key) ? 'active' : ''}`}
                                onClick={() => toggleArrayItem('audiences', aud.key)}
                            >
                                <aud.icon size={16} />
                                <span className="chip-label">{aud.label}</span>
                                <span className="chip-count">{aud.count}</span>
                                {form.audiences.includes(aud.key) && <CheckCircle size={14} className="chip-check" />}
                            </button>
                        ))}
                    </div>

                    <div className="class-targeting">
                        <div className="class-toggle-row">
                            <label className="class-toggle-label">{t('hub.modal_target_classes')}</label>
                            <button
                                className={`toggle-btn ${form.targetAllClasses ? 'active' : ''}`}
                                onClick={() => updateForm('targetAllClasses', !form.targetAllClasses)}
                            >
                                {form.targetAllClasses ?
                                    <><ToggleRight size={20} /> <span>{t('hub.modal_all_classes')}</span></> :
                                    <><ToggleLeft size={20} /> <span>{t('hub.modal_specific_classes')}</span></>
                                }
                            </button>
                        </div>
                        {!form.targetAllClasses && (
                            <div className="class-grid">
                                {MOCK_CLASSES.map(cls => (
                                    <button
                                        key={cls.id}
                                        className={`class-chip ${form.targetClasses.includes(cls.id) ? 'active' : ''}`}
                                        onClick={() => toggleArrayItem('targetClasses', cls.id)}
                                    >
                                        <Hash size={13} />
                                        <span>{cls.name}</span>
                                        <span className="class-count">{cls.count}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="reach-estimate">
                        <Zap size={15} />
                        <span>{t('hub.modal_estimated_reach')}: <strong>{estimatedReach}</strong> {t('hub.modal_recipients')}</span>
                    </div>
                </section>
            )}

            <section className="modal-section">
                <div className="section-header">
                    <div className="section-icon"><MessageSquare size={18} /></div>
                    <div>
                        <h4>{t('hub.modal_content')}</h4>
                        <span className="section-hint">{t('hub.modal_content_hint')}</span>
                    </div>
                </div>

                <div className="form-row">
                    <label className="form-label">{t('hub.modal_title')}</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder={t('hub.modal_title_placeholder')}
                        value={form.title}
                        onChange={e => updateForm('title', e.target.value)}
                    />
                </div>

                <div className="form-row">
                    <label className="form-label">{t('hub.modal_body')}</label>
                    <textarea
                        className="form-textarea"
                        placeholder={t('hub.modal_body_placeholder')}
                        rows={4}
                        value={form.content}
                        onChange={e => updateForm('content', e.target.value)}
                    />
                </div>

                <div className="form-inline-group">
                    <div className="form-row form-row--half">
                        <label className="form-label">{t('hub.modal_urgency')}</label>
                        <div className="urgency-select">
                            {['normal', 'urgent', 'mandatory'].map(level => (
                                <button
                                    key={level}
                                    className={`urgency-option ${form.urgency === level ? 'active' : ''}`}
                                    onClick={() => updateForm('urgency', level)}
                                    style={form.urgency === level ? {
                                        background: urgencies[level].bgColor,
                                        color: urgencies[level].color,
                                        borderColor: urgencies[level].color,
                                    } : {}}
                                >
                                    {React.createElement(urgencies[level].icon, { size: 14 })}
                                    <span>{t(`hub.urgency_${level}`)}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="form-row form-row--half">
                        <label className="form-label">{t('hub.modal_category')}</label>
                        <div className="category-select">
                            {Object.keys(categories)
                                .filter(cat => activeTab === 'staff' ? ['regulation', 'instruction'].includes(cat) : !['regulation', 'instruction'].includes(cat))
                                .map(cat => (
                                    <button
                                        key={cat}
                                        className={`category-option ${form.category === cat ? 'active' : ''}`}
                                        onClick={() => updateForm('category', cat)}
                                        style={form.category === cat ? { color: categories[cat].color, borderColor: categories[cat].color } : {}}
                                    >
                                        <span className="cat-dot" style={{ background: categories[cat].color }} />
                                        <span>{t(`hub.category_${cat}`)}</span>
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <label className="form-check-label">
                        <input
                            type="checkbox"
                            checked={form.pinned}
                            onChange={() => updateForm('pinned', !form.pinned)}
                        />
                        <span>📌 {t('hub.modal_pin_announcement')}</span>
                    </label>
                </div>
            </section>

            <section className="modal-section">
                <div className="section-header">
                    <div className="section-icon"><Paperclip size={18} /></div>
                    <div>
                        <h4>{t('hub.modal_attachments')}</h4>
                        <span className="section-hint">{t('hub.modal_attachments_hint')}</span>
                    </div>
                </div>

                <div
                    className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => document.getElementById('file-upload-input')?.click()}
                >
                    <Upload size={24} />
                    <span className="drop-text">{t('hub.modal_drop_files')}</span>
                    <span className="drop-hint">{t('hub.modal_drop_hint')}</span>
                    <input
                        id="file-upload-input"
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                        onChange={handleFileDrop}
                        style={{ display: 'none' }}
                    />
                </div>

                {form.attachments.length > 0 && (
                    <div className="attachment-list">
                        {form.attachments.map((file, i) => (
                            <div key={i} className="attachment-item">
                                <div className="attach-icon">
                                    {file.preview ? <img src={file.preview} alt="" /> : <FileText size={18} />}
                                </div>
                                <div className="attach-info">
                                    <span className="attach-name">{file.name}</span>
                                    <span className="attach-size">{formatFileSize(file.size)}</span>
                                </div>
                                <button className="attach-remove" onClick={() => removeAttachment(i)}>
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="modal-section">
                <div className="section-header">
                    <div className="section-icon"><Calendar size={18} /></div>
                    <div>
                        <h4>{t('hub.modal_scheduling')}</h4>
                        <span className="section-hint">{t('hub.modal_scheduling_hint')}</span>
                    </div>
                </div>

                <div className="schedule-options">
                    <button
                        className={`schedule-option ${form.scheduleType === 'now' ? 'active' : ''}`}
                        onClick={() => updateForm('scheduleType', 'now')}
                    >
                        <Zap size={18} />
                        <div>
                            <span className="opt-title">{t('hub.modal_send_now')}</span>
                            <span className="opt-desc">{t('hub.modal_send_now_desc')}</span>
                        </div>
                    </button>
                    <button
                        className={`schedule-option ${form.scheduleType === 'later' ? 'active' : ''}`}
                        onClick={() => updateForm('scheduleType', 'later')}
                    >
                        <Clock size={18} />
                        <div>
                            <span className="opt-title">{t('hub.modal_schedule_later')}</span>
                            <span className="opt-desc">{t('hub.modal_schedule_later_desc')}</span>
                        </div>
                    </button>
                </div>

                {form.scheduleType === 'later' && (
                    <div className="schedule-datetime">
                        <div className="form-row form-row--half">
                            <label className="form-label">{t('hub.modal_date')}</label>
                            <input type="date" className="form-input" value={form.scheduledDate} onChange={e => updateForm('scheduledDate', e.target.value)} />
                        </div>
                        <div className="form-row form-row--half">
                            <label className="form-label">{t('hub.modal_time')}</label>
                            <input type="time" className="form-input" value={form.scheduledTime} onChange={e => updateForm('scheduledTime', e.target.value)} />
                        </div>
                    </div>
                )}
            </section>

            <section className="modal-section">
                <div className="section-header">
                    <div className="section-icon"><Share2 size={18} /></div>
                    <div>
                        <h4>{t('hub.modal_distribution')}</h4>
                        <span className="section-hint">{t('hub.modal_distribution_hint')}</span>
                    </div>
                </div>

                <div className="channel-grid">
                    {[
                        { key: 'push', icon: Bell, label: t('hub.modal_push_notif'), desc: t('hub.modal_push_desc') },
                        { key: 'sms', icon: Smartphone, label: t('hub.modal_sms'), desc: t('hub.modal_sms_desc') },
                        { key: 'email', icon: Mail, label: t('hub.modal_email'), desc: t('hub.modal_email_desc') },
                        { key: 'inApp', icon: MessageSquare, label: t('hub.modal_in_app'), desc: t('hub.modal_in_app_desc') },
                    ].map(ch => (
                        <button
                            key={ch.key}
                            className={`channel-card ${form.channels[ch.key] ? 'active' : ''}`}
                            onClick={() => toggleChannel(ch.key)}
                        >
                            <div className="channel-top">
                                <ch.icon size={20} />
                                {form.channels[ch.key] ? <ToggleRight size={20} className="channel-toggle on" /> : <ToggleLeft size={20} className="channel-toggle" />}
                            </div>
                            <span className="channel-label">{ch.label}</span>
                            <span className="channel-desc">{ch.desc}</span>
                        </button>
                    ))}
                </div>

                <div className="social-row">
                    <span className="social-title">{t('hub.modal_social_share')}</span>
                    <div className="social-toggles">
                        <button className={`social-btn ${form.socialShare.facebook ? 'active facebook' : ''}`} onClick={() => toggleSocial('facebook')}>
                            <Globe size={15} /><span>Facebook</span>
                        </button>
                        <button className={`social-btn ${form.socialShare.website ? 'active website' : ''}`} onClick={() => toggleSocial('website')}>
                            <Link2 size={15} /><span>{t('hub.modal_school_website')}</span>
                        </button>
                    </div>
                </div>

                <div className="form-row">
                    <label className="form-check-label">
                        <input
                            type="checkbox"
                            checked={form.requireConfirmation}
                            onChange={() => updateForm('requireConfirmation', !form.requireConfirmation)}
                        />
                        <span>{t('hub.modal_require_confirmation')}</span>
                    </label>
                </div>
            </section>
        </div>
    );

    const renderModalFooter = () => {
        const currentReach = form.pubType === 'administrative' ? 50 : estimatedReach;
        return (
            <div className="schedule-modal-footer">
                <div className="footer-preview">
                    <div className="preview-stat">
                        <Users size={14} />
                        <span>{currentReach} {t('hub.modal_recipients')}</span>
                    </div>
                    <div className="preview-stat">
                        <Send size={14} />
                        <span>{Object.values(form.channels).filter(Boolean).length} {t('hub.modal_channels')}</span>
                    </div>
                    {form.attachments.length > 0 && (
                        <div className="preview-stat">
                            <Paperclip size={14} />
                            <span>{form.attachments.length} {t('hub.modal_files')}</span>
                        </div>
                    )}
                </div>
                <div className="footer-actions">
                    <button className="btn-cancel" onClick={() => setShowModal(false)}>{t('hub.modal_cancel')}</button>
                    <button
                        className="btn-submit"
                        onClick={handleSubmit}
                        disabled={!form.title.trim() || !form.content.trim() || (form.pubType === 'public' && form.audiences.length === 0)}
                    >
                        {form.scheduleType === 'now' ? <><Send size={16} /> <span>{t('hub.modal_publish_now')}</span></> : <><Clock size={16} /> <span>{t('hub.modal_schedule')}</span></>}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="hub-announcements">
            <div className="page-header">
                <div className="header-content">
                    <h1>{t('hub.publications_title') || t('hub.announcements_title')}</h1>
                    <p>{t('hub.publications_desc') || t('hub.announcements_desc')}</p>
                </div>
                <div className="header-actions">
                    <button className="settings-btn" onClick={() => setShowSettingsModal(true)}>
                        <Settings size={22} />
                    </button>
                    <button className="schedule-btn" onClick={openModal}>
                        <Plus size={16} />
                        <span>{t('hub.schedule_publication') || t('hub.schedule_announcement')}</span>
                    </button>
                </div>
            </div>

            <div className="hub-tabs">
                <button className={`tab-btn ${activeTab === 'main' ? 'active' : ''}`} onClick={() => setActiveTab('main')}>
                    <Globe size={18} /><span>{t('hub.tab_main')}</span>
                </button>
                <button className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}>
                    <Users size={18} /><span>{t('hub.tab_staff')}</span>
                </button>
            </div>

            <div className="ann-stats-row">
                <div className="ann-stat" onClick={() => setUrgencyFilter('all')}>
                    <div className="ann-stat-icon" style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)' }}><MessageSquare size={18} /></div>
                    <div className="ann-stat-info"><span className="ann-stat-value">{stats.total}</span><span className="ann-stat-label">{t('hub.total_announcements')}</span></div>
                </div>
                <div className="ann-stat" onClick={() => setUrgencyFilter('mandatory')}>
                    <div className="ann-stat-icon" style={{ background: urgencies.mandatory.bgColor, color: urgencies.mandatory.color }}><AlertOctagon size={18} /></div>
                    <div className="ann-stat-info"><span className="ann-stat-value">{stats.mandatory}</span><span className="ann-stat-label">{t('hub.urgency_mandatory')}</span></div>
                </div>
                <div className="ann-stat" onClick={() => setUrgencyFilter('urgent')}>
                    <div className="ann-stat-icon" style={{ background: urgencies.urgent.bgColor, color: urgencies.urgent.color }}><AlertTriangle size={18} /></div>
                    <div className="ann-stat-info"><span className="ann-stat-value">{stats.urgent}</span><span className="ann-stat-label">{t('hub.urgency_urgent')}</span></div>
                </div>
                <div className="ann-stat" onClick={() => setUrgencyFilter('normal')}>
                    <div className="ann-stat-icon" style={{ background: urgencies.normal.bgColor, color: urgencies.normal.color }}><Info size={18} /></div>
                    <div className="ann-stat-info"><span className="ann-stat-value">{stats.normal}</span><span className="ann-stat-label">{t('hub.urgency_normal')}</span></div>
                </div>
            </div>

            <div className="ann-filters">
                <div className="search-wrap">
                    <Search size={16} />
                    <input type="text" placeholder={t('hub.search_announcements')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="urgency-chips">
                    {['all', 'mandatory', 'urgent', 'normal'].map(level => (
                        <button
                            key={level}
                            className={`urgency-chip ${urgencyFilter === level ? 'active' : ''}`}
                            onClick={() => setUrgencyFilter(level)}
                            style={level !== 'all' && urgencyFilter === level ? { background: urgencies[level].bgColor, color: urgencies[level].color, borderColor: urgencies[level].color } : {}}
                        >
                            {level !== 'all' && React.createElement(urgencies[level].icon, { size: 14 })}
                            <span>{t(`hub.filter_${level}`)}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="ann-feed">
                {filteredAnnouncements.length === 0 ? (
                    <div className="empty-state">
                        <Info size={40} />
                        <p>{t('hub.no_announcements') || 'لا توجد إعلانات'}</p>
                    </div>
                ) : (
                    filteredAnnouncements.map((ann, idx) => (
                        <div key={ann.id || idx} className="update-card" style={{ borderLeft: `4px solid ${categories[ann.category]?.color || '#ccc'}` }}>
                            <div className="update-meta">
                                <span className="cat-badge" style={{ backgroundColor: `${categories[ann.category]?.color}20`, color: categories[ann.category]?.color }}>
                                    {t(`hub.category_${ann.category}`)}
                                </span>
                                {ann.pinned && <span className="badge-pinned">📌</span>}
                                <span className="date">{formatDate(ann.date)}</span>
                            </div>
                            <h4 className="update-title" style={{ marginTop: '0.75rem', marginBottom: '0.5rem', fontWeight: 800 }}>{ann.title}</h4>
                            <p className="update-excerpt" style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)' }}>
                                {ann.content}
                            </p>
                            <div className="update-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={12} /> {ann.author}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={12} /> {ann.readCount} / {ann.totalTargeted} ({getReadPercentage(ann)}%)</span>
                                </div>
                                <span className="read-more" style={{ color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>{t('hub.read_more') || 'اقرأ المزيد'}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={t('hub.schedule_publication') || t('hub.schedule_announcement')}
                icon={MessageSquare}
                size="large"
                footer={renderModalFooter()}
            >
                {renderModalContent()}
            </Modal>
            <Modal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                title={t('hub.settings') || 'الإعدادات'}
                icon={Settings}
                size="medium"
            >
                <div className="filter-management-panel">
                    <div className="fm-section">
                        <div className="fm-header">
                            <h4>{t('hub.manage_categories')}</h4>
                            <button className="add-cat-btn" onClick={() => handleFilterAction('add', 'category')}><Plus size={14} /><span>{t('hub.add_category')}</span></button>
                        </div>
                        <div className="fm-grid">
                            {Object.entries(categories).map(([key, config]) => (
                                <div key={key} className="fm-item">
                                    <span className="cat-dot" style={{ background: config.color }} />
                                    <span className="cat-name">{t(`hub.category_${key}`)}</span>
                                    <div className="fm-actions">
                                        <button className="fm-btn edit" onClick={() => handleFilterAction('edit', 'category', key)}><Edit2 size={12} /></button>
                                        <button className="fm-btn delete" onClick={() => handleFilterAction('delete', 'category', key)}><X size={12} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fm-section">
                        <div className="fm-header">
                            <h4>{t('hub.manage_urgencies') || 'إدارة مستويات الأهمية'}</h4>
                            <button className="add-cat-btn" onClick={() => handleFilterAction('add', 'urgency')}><Plus size={14} /><span>{t('hub.add_urgency') || 'إضافة مستوى أهمية'}</span></button>
                        </div>
                        <div className="fm-grid">
                            {Object.entries(urgencies).map(([key, config]) => (
                                <div key={key} className="fm-item" style={{ borderColor: config.color, background: config.bgColor }}>
                                    {React.createElement(config.icon, { size: 14, style: { color: config.color } })}
                                    <span className="cat-name" style={{ color: config.color, fontWeight: 700 }}>{t(`hub.urgency_${key}`)}</span>
                                    <div className="fm-actions">
                                        <button className="fm-btn edit" style={{ color: config.color }} onClick={() => handleFilterAction('edit', 'urgency', key)}><Edit2 size={12} /></button>
                                        <button className="fm-btn delete" style={{ color: config.color }} onClick={() => handleFilterAction('delete', 'urgency', key)}><X size={12} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </div >
    );
};
