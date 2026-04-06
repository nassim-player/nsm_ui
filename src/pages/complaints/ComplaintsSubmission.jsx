import React, { useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { Panel } from '../../components/common/Panel/Panel';
import {
    MessageSquare, PlusCircle, Search,
    User, Users, Briefcase, Send, Calendar, Paperclip,
    Tag, AlertCircle, FileText, Shield, Eye, EyeOff,
    AlertTriangle, AlertOctagon, Info, CheckCircle, X, Upload
} from 'react-feather';
import { useToast } from '../../context/ToastContext';
import './ComplaintsSuggestions.scss';

// ─── Complaint Types from DB (hr.complaint_types) ───
const COMPLAINT_TYPES = [
    { id: 'ct-1', code: 'academic', name: 'بيداغوجي', icon: '📚', color: '#3b82f6' },
    { id: 'ct-2', code: 'behavioral', name: 'سلوكي وانضباط', icon: '⚠️', color: '#f59e0b' },
    { id: 'ct-3', code: 'facilities', name: 'مرافق وخدمات', icon: '🏗️', color: '#64748b' },
    { id: 'ct-4', code: 'administrative', name: 'إداري', icon: '📋', color: '#8b5cf6' },
    { id: 'ct-5', code: 'financial', name: 'مالي', icon: '💰', color: '#10b981' },
    { id: 'ct-6', code: 'suggestion', name: 'اقتراح عام', icon: '💡', color: '#06b6d4' },
];

// ─── Priority Levels from DB (complaints.priority CHECK) ───
const PRIORITY_LEVELS = [
    { key: 'low', label: 'منخفضة', desc: 'اقتراح أو ملاحظة بسيطة', icon: Info, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
    { key: 'medium', label: 'متوسطة', desc: 'شكوى تحتاج معالجة', icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    { key: 'high', label: 'عالية', desc: 'مستعجل ويحتاج تدخل فوري', icon: AlertOctagon, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
];

// ─── Departments (from complaints.department_id FK) ───
const DEPARTMENTS = [
    { id: 'dep-1', name: 'الإدارة العامة' },
    { id: 'dep-2', name: 'المستشار التربوي' },
    { id: 'dep-3', name: 'المصلحة المالية' },
    { id: 'dep-4', name: 'قسم الصيانة والخدمات' },
    { id: 'dep-5', name: 'أمن المؤسسة' },
];

export const ComplaintsSubmission = () => {
    const { t } = useTranslation();
    const { success, error } = useToast();

    // Source selection
    const [sourceType, setSourceType] = useState('student');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEntity, setSelectedEntity] = useState(null);

    // Form state (mirrors complaints table)
    const [formData, setFormData] = useState({
        type_id: '',
        title: '',
        description: '',
        priority: 'medium',
        is_anonymous: false,
        department_id: '',
        due_date: '',
        attachments: [],
    });

    // Mock search entities
    const mockEntities = {
        student: [
            { id: 'ST-01', name: 'أحمد محمود', grade: 'السنة الثالثة ثانوي' },
            { id: 'ST-02', name: 'سارة خالد', grade: 'السنة الأولى متوسط' }
        ],
        parent: [
            { id: 'PR-01', name: 'محمد محمود', relation: 'أب', linkedStudent: 'أحمد محمود' },
            { id: 'PR-02', name: 'فاطمة علي', relation: 'أم', linkedStudent: 'سارة خالد' }
        ],
        staff: [
            { id: 'SF-01', name: 'كمال حسن', role: 'أستاذ رياضيات' },
            { id: 'SF-02', name: 'عمر بوزيد', role: 'حارس أمن' }
        ]
    };

    const updateField = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedEntity && !formData.is_anonymous) {
            error('الرجاء اختيار المعني أولاً.');
            return;
        }
        if (!formData.type_id || !formData.title || !formData.description) {
            error('الرجاء تعبئة جميع الحقول المطلوبة.', 'خطأ في النموذج');
            return;
        }
        success('تم تسجيل الشكوى/الاقتراح بنجاح!');
        setSelectedEntity(null);
        setFormData({
            type_id: '', title: '', description: '', priority: 'medium',
            is_anonymous: false, department_id: '', due_date: '', attachments: [],
        });
    };

    const selectedType = COMPLAINT_TYPES.find(ct => ct.id === formData.type_id);

    return (
        <div className="complaints-suggestions-page fade-in">
            <div className="page-header">
                <div className="header-content">
                    <h1>{t?.('complaints.nav_submission') || 'تسجيل شكوى جديدة'}</h1>
                    <p>{t?.('complaints.subtitle') || 'إدارة ومتابعة الشكاوي والاقتراحات الخاصة بالمدرسة بشكل مركزي.'}</p>
                </div>
            </div>

            <div className="submission-tab">
                <form onSubmit={handleSubmit} className="complaint-form-v2">

                    {/* ─── Section 1: Source & Identity ─── */}
                    <div className="form-section-v2">
                        <div className="section-header-v2">
                            <div className="section-icon-v2"><Users size={20} /></div>
                            <div>
                                <h4>المصدر والمعني</h4>
                                <span className="section-hint-v2">حدد الشخص المعني بالشكوى أو الاقتراح</span>
                            </div>
                        </div>

                        {/* Anonymous Toggle */}
                        <div className="anonymous-toggle" onClick={() => updateField('is_anonymous', !formData.is_anonymous)}>
                            <div className={`anon-switch ${formData.is_anonymous ? 'active' : ''}`}>
                                {formData.is_anonymous ? <EyeOff size={16} /> : <Eye size={16} />}
                            </div>
                            <div className="anon-info">
                                <span className="anon-title">{formData.is_anonymous ? 'شكوى مجهولة المصدر' : 'شكوى باسم معروف'}</span>
                                <span className="anon-desc">{formData.is_anonymous ? 'لن يظهر اسم المشتكي' : 'سيتم تسجيل اسم المشتكي'}</span>
                            </div>
                        </div>

                        {!formData.is_anonymous && (
                            <>
                                <div className="source-type-chips">
                                    {[
                                        { key: 'student', icon: User, label: 'تلميذ' },
                                        { key: 'parent', icon: Users, label: 'ولي أمر' },
                                        { key: 'staff', icon: Briefcase, label: 'موظف/أستاذ' },
                                    ].map(src => (
                                        <button
                                            key={src.key}
                                            type="button"
                                            className={`source-chip ${sourceType === src.key ? 'active' : ''}`}
                                            onClick={() => { setSourceType(src.key); setSelectedEntity(null); }}
                                        >
                                            <src.icon size={16} />
                                            <span>{src.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {!selectedEntity ? (
                                    <div className="entity-search-container">
                                        <div className="search-input-wrapper">
                                            <Search size={18} />
                                            <input
                                                type="text"
                                                placeholder="ابحث بالاسم أو الرقم التعريفي..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="entity-search-input"
                                            />
                                        </div>
                                        {searchQuery && (
                                            <div className="search-results">
                                                {mockEntities[sourceType]
                                                    .filter(e => e.name.includes(searchQuery))
                                                    .map(entity => (
                                                        <div key={entity.id} className="result-item"
                                                            onClick={() => { setSelectedEntity(entity); setSearchQuery(''); }}>
                                                            <div className="result-name">{entity.name}</div>
                                                            <div className="result-meta">
                                                                {entity.grade || entity.relation || entity.role}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="selected-entity-card">
                                        <div className="entity-details">
                                            <strong>{selectedEntity.name}</strong>
                                            <span>{selectedEntity.grade || selectedEntity.role || `ولي أمر ${selectedEntity.linkedStudent}`}</span>
                                        </div>
                                        <button type="button" onClick={() => setSelectedEntity(null)} className="btn-change">
                                            تغيير
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* ─── Section 2: Complaint Type (from complaint_types table) ─── */}
                    <div className="form-section-v2">
                        <div className="section-header-v2">
                            <div className="section-icon-v2"><Tag size={20} /></div>
                            <div>
                                <h4>نوع الشكوى أو الاقتراح</h4>
                                <span className="section-hint-v2">اختر التصنيف المناسب من القائمة</span>
                            </div>
                        </div>

                        <div className="complaint-type-grid">
                            {COMPLAINT_TYPES.map(ct => (
                                <button
                                    key={ct.id}
                                    type="button"
                                    className={`type-card ${formData.type_id === ct.id ? 'active' : ''}`}
                                    onClick={() => updateField('type_id', ct.id)}
                                    style={{
                                        '--type-color': ct.color,
                                        borderColor: formData.type_id === ct.id ? ct.color : undefined,
                                        background: formData.type_id === ct.id ? `${ct.color}08` : undefined,
                                    }}
                                >
                                    <span className="type-emoji">{ct.icon}</span>
                                    <span className="type-name">{ct.name}</span>
                                    {formData.type_id === ct.id && <CheckCircle size={16} className="type-check" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ─── Section 3: Priority (from complaints.priority) ─── */}
                    <div className="form-section-v2">
                        <div className="section-header-v2">
                            <div className="section-icon-v2"><AlertCircle size={20} /></div>
                            <div>
                                <h4>مستوى الأهمية</h4>
                                <span className="section-hint-v2">حدد مدى استعجال المعالجة</span>
                            </div>
                        </div>

                        <div className="priority-selector">
                            {PRIORITY_LEVELS.map(p => (
                                <button
                                    key={p.key}
                                    type="button"
                                    className={`priority-card ${formData.priority === p.key ? 'active' : ''}`}
                                    onClick={() => updateField('priority', p.key)}
                                    style={{
                                        '--p-color': p.color,
                                        background: formData.priority === p.key ? p.bg : undefined,
                                        borderColor: formData.priority === p.key ? p.color : undefined,
                                    }}
                                >
                                    <p.icon size={20} style={{ color: p.color }} />
                                    <div className="priority-info">
                                        <span className="priority-label" style={{ color: formData.priority === p.key ? p.color : undefined }}>{p.label}</span>
                                        <span className="priority-desc">{p.desc}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ─── Section 4: Details (title, description, department, date) ─── */}
                    <div className="form-section-v2">
                        <div className="section-header-v2">
                            <div className="section-icon-v2"><MessageSquare size={20} /></div>
                            <div>
                                <h4>تفاصيل الشكوى</h4>
                                <span className="section-hint-v2">اكتب عنوان ووصف تفصيلي للشكوى أو الاقتراح</span>
                            </div>
                        </div>

                        <div className="details-form-grid">
                            <div className="form-field full">
                                <label><FileText size={14} /> عنوان الشكوى</label>
                                <input
                                    type="text"
                                    className="field-input"
                                    placeholder="اكتب عنواناً واضحاً ومختصراً..."
                                    value={formData.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-field half">
                                <label><Shield size={14} /> القسم المسؤول</label>
                                <select
                                    className="field-input"
                                    value={formData.department_id}
                                    onChange={(e) => updateField('department_id', e.target.value)}
                                >
                                    <option value="" disabled>اختر القسم المختص...</option>
                                    {DEPARTMENTS.map(dep => (
                                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field half">
                                <label><Calendar size={14} /> تاريخ الواقعة</label>
                                <input
                                    type="date"
                                    className="field-input"
                                    value={formData.due_date}
                                    onChange={(e) => updateField('due_date', e.target.value)}
                                />
                            </div>

                            <div className="form-field full">
                                <label><MessageSquare size={14} /> الوصف والتفاصيل</label>
                                <textarea
                                    className="field-input field-textarea"
                                    rows="5"
                                    placeholder="يرجى كتابة تفاصيل الشكوى أو الاقتراح بدقة وبشكل واضح..."
                                    value={formData.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* ─── Section 5: Attachments (complaint_attachments table) ─── */}
                    <div className="form-section-v2">
                        <div className="section-header-v2">
                            <div className="section-icon-v2"><Paperclip size={20} /></div>
                            <div>
                                <h4>المرفقات والوثائق</h4>
                                <span className="section-hint-v2">أضف صور أو مستندات داعمة إن وجدت</span>
                            </div>
                        </div>

                        <div className="attachment-zone-v2">
                            <Upload size={28} />
                            <span className="zone-title">اضغط هنا أو اسحب الملفات لرفعها</span>
                            <span className="zone-hint">الحد الأقصى لكل ملف: 5 ميجابايت (JPG, PNG, PDF)</span>
                        </div>
                    </div>

                    {/* ─── Submit ─── */}
                    <div className="form-submit-row">
                        <div className="submit-preview">
                            {selectedType && (
                                <span className="preview-badge" style={{ background: `${selectedType.color}15`, color: selectedType.color }}>
                                    {selectedType.icon} {selectedType.name}
                                </span>
                            )}
                            {formData.priority && (
                                <span className="preview-badge" style={{ background: PRIORITY_LEVELS.find(p => p.key === formData.priority)?.bg, color: PRIORITY_LEVELS.find(p => p.key === formData.priority)?.color }}>
                                    {PRIORITY_LEVELS.find(p => p.key === formData.priority)?.label}
                                </span>
                            )}
                            {formData.is_anonymous && (
                                <span className="preview-badge anon-badge">
                                    <EyeOff size={12} /> مجهول
                                </span>
                            )}
                        </div>
                        <button type="submit" className="btn-submit-v2">
                            <Send size={18} />
                            تسجيل في النظام
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
