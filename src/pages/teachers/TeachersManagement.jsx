import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { DataTable } from '../../components/common/DataTable/DataTable';
import { Modal } from '../../components/common/Modal/Modal';
import {
    User, Settings, Briefcase, Mail, Phone, MapPin,
    Calendar, Award, Shield, Sun, Moon, Heart,
    Zap, BookOpen, Check, AlertCircle, Save,
    RefreshCw,
    Plus, RotateCcw, ChevronRight, ChevronDown
} from 'react-feather';
import './TeachersManagement.scss';

const mockTeachersData = [
    {
        id: "T001",
        full_name: "محمد علي",
        nick_name: "أبو علي",
        email: "m.ali@school.com",
        phone: "0550123456",
        stage: "middle",
        sub_stage: "3rd Middle",
        module: "",
        class: "",
        status: "Active",
        hire_date: "2015-09-01",
        education: "ماستر رياضيات",
        experience: 10,
        address: "حي 5 جويلية، الجزائر العاصمة"
    },
    {
        id: "T002",
        full_name: "فاطمة الزهراء",
        nick_name: "فطوم",
        email: "f.zahra@school.com",
        phone: "0661987654",
        stage: "primary",
        sub_stage: "2nd Primary",
        module: "Sciences",
        class: "E-02",
        status: "Active",
        hire_date: "2020-01-15",
        education: "دكتوراه فيزياء",
        experience: 5,
        address: "وسط المدينة، البليدة"
    },
    {
        id: "T003",
        full_name: "أحمد منصور",
        nick_name: "المنصور",
        email: "a.mansour@school.com",
        phone: "0770554433",
        stage: "middle",
        sub_stage: "1st Middle",
        module: "",
        class: "",
        status: "Active",
        hire_date: "2010-09-01",
        education: "ليسانس أدب عربي",
        experience: 15,
        address: "حي الوفاء، بومرداس"
    },
    {
        id: "T004",
        full_name: "سارة بن عودة",
        nick_name: "سوسو",
        email: "s.benaouda@school.com",
        phone: "0554221100",
        stage: "primary",
        sub_stage: "1st Primary",
        module: "English",
        class: "E-01",
        status: "On Leave",
        hire_date: "2022-09-01",
        education: "ماستر لغة إنجليزية",
        experience: 3,
        address: "شارع عبان رمضان، تيبازة"
    },
    {
        id: "T005",
        full_name: "ياسين ابراهيم",
        nick_name: "ياسو",
        email: "y.ibrahim@school.com",
        phone: "0559887766",
        stage: "middle",
        sub_stage: "2nd Middle",
        module: "Coding",
        class: "E-03",
        status: "Active",
        hire_date: "2018-09-01",
        education: "ماستر إعلام آلي",
        experience: 8,
        address: "حي الأمل، وهران"
    }
];

export const TeachersManagement = () => {
    const { t } = useTranslation();
    const [data, setData] = useState(mockTeachersData);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');

    // UI State for Popups
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [quickAssign, setQuickAssign] = useState(null); // { rowIndex, colKey, rect }
    const [activeFilters, setActiveFilters] = useState({
        stage: [],
        sub_stage: [],
        module: [],
        class: []
    });
    const [openSelectKey, setOpenSelectKey] = useState(null); // which multi-select is open

    // HR Approval Workflow State
    const [editableData, setEditableData] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
    const [isApprovalSent, setIsApprovalSent] = useState(false);

    const filterDropdownRef = useRef(null);

    const stageOptions = useMemo(() => [
        { id: 'pre-school', label: t('teachers.stage_pre_school') || 'ما قبل المدرسة', color: '#8b5cf6' },
        { id: 'primary', label: t('teachers.stage_primary') || 'الطور الابتدائي', color: '#10b981' },
        { id: 'middle', label: t('teachers.stage_middle') || 'الطور المتوسط', color: '#f59e0b' }
    ], [t]);

    const subStageOptions = useMemo(() => [
        { id: '1st Primary', label: '1st Primary' },
        { id: '2nd Primary', label: '2nd Primary' },
        { id: '1st Middle', label: '1st Middle' },
        { id: '2nd Middle', label: '2nd Middle' },
        { id: '3rd Middle', label: '3rd Middle' }
    ], [t]);

    const moduleOptions = useMemo(() => [
        { id: 'Maths', label: 'Maths' },
        { id: 'Physique', label: 'Physique' },
        { id: 'Sciences', label: 'Sciences' },
        { id: 'Arabe', label: 'Arabe' },
        { id: 'Français', label: 'Français' },
        { id: 'Anglais', label: 'Anglais' },
        { id: 'English', label: 'English' },
        { id: 'Informatique', label: 'Informatique' },
        { id: 'Coding', label: 'Coding' }
    ], [t]);

    const classOptions = useMemo(() => [
        { id: 'E-01', label: 'E-01' },
        { id: 'E-02', label: 'E-02' },
        { id: 'E-03', label: 'E-03' },
        { id: 'E-04', label: 'E-04' },
        { id: 'G-01', label: 'G-01' },
        { id: 'G-02', label: 'G-02' },
        { id: 'G-03', label: 'G-03' },
        { id: 'G-04', label: 'G-04' },
        { id: 'G-05', label: 'G-05' },
        { id: 'G-06', label: 'G-06' }
    ], [t]);

    const filterConfig = useMemo(() => [
        { key: 'stage', label: t('teachers.stage'), options: stageOptions },
        { key: 'sub_stage', label: t('teachers.sub_stage'), options: subStageOptions },
        { key: 'module', label: t('teachers.assigned_module'), options: moduleOptions },
        { key: 'class', label: t('teachers.class'), options: classOptions }
    ], [t, stageOptions, subStageOptions, moduleOptions, classOptions]);

    const activeFilterCount = useMemo(() => {
        return ['stage', 'sub_stage', 'module', 'class'].filter((k) => activeFilters[k].length > 0).length;
    }, [activeFilters]);

    const toggleFilterOption = (filterKey, optionId) => {
        setActiveFilters((prev) => {
            const arr = prev[filterKey];
            const next = arr.includes(optionId) ? arr.filter((id) => id !== optionId) : [...arr, optionId];
            return { ...prev, [filterKey]: next };
        });
    };

    // Filtered Data (row matches if, for each dimension, no selection OR value in selection)
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            if (activeFilters.stage.length > 0 && !activeFilters.stage.includes(item.stage)) return false;
            if (activeFilters.sub_stage.length > 0 && !activeFilters.sub_stage.includes(item.sub_stage)) return false;
            if (activeFilters.module.length > 0 && !activeFilters.module.includes(item.module)) return false;
            if (activeFilters.class.length > 0 && !activeFilters.class.includes(item.class)) return false;
            return true;
        });
    }, [data, activeFilters]);

    const handleQuickAssign = (rowIndex, colKey, value) => {
        const row = filteredData[rowIndex];
        if (!row) return;
        const dataIndex = data.findIndex((d) => d.id === row.id);
        if (dataIndex === -1) return;
        const newData = [...data];
        newData[dataIndex] = { ...newData[dataIndex], [colKey]: value };
        setData(newData);
        setQuickAssign(null);
    };

    const columns = useMemo(() => [
        {
            key: 'name_nick',
            label: `${t('req.full_name')} / ${t('teachers.nickname')}`,
            visible: true,
            width: 250,
            sortable: true,
            render: (_, row) => (
                <div className="name-nick-cell">
                    <span className="full-name">{row.full_name}</span>
                    <span className="nick-name">{row.nick_name}</span>
                </div>
            )
        },
        {
            key: 'stage',
            label: t('teachers.stage'),
            visible: true,
            width: 150,
            render: (val) => (
                <span className={`stage-badge ${val}`}>
                    {t(`teachers.stage_${val}`) || val}
                </span>
            )
        },
        { key: 'sub_stage', label: t('teachers.sub_stage'), visible: true, width: 180 },
        {
            key: 'module',
            label: t('teachers.assigned_module'),
            visible: true,
            width: 160,
            render: (val, row, idx) => (
                <div
                    className={`qa-cell ${!val ? 'is-empty' : ''}`}
                    data-quick-assign-cell={`module-${idx}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setQuickAssign({
                            rowIndex: idx,
                            colKey: 'module',
                            rect,
                            title: t('teachers.assign_module') || 'تعيين المادة'
                        });
                    }}
                >
                    <span className="qa-value">{val || '--'}</span>
                    <Plus size={14} className="qa-indicator" />
                </div>
            )
        },
        {
            key: 'class',
            label: t('teachers.class'),
            visible: true,
            width: 140,
            render: (val, row, idx) => (
                <div
                    className={`qa-cell ${!val ? 'is-empty' : ''}`}
                    data-quick-assign-cell={`class-${idx}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setQuickAssign({
                            rowIndex: idx,
                            colKey: 'class',
                            rect,
                            title: t('teachers.assign_class') || 'تعيين القسم'
                        });
                    }}
                >
                    <span className="qa-value">{val || '--'}</span>
                    <Plus size={14} className="qa-indicator" />
                </div>
            )
        }
    ], [t]);

    const handleRowClick = (teacher) => {
        setSelectedTeacher(teacher);
        setEditableData({
            email: teacher.email,
            phone: teacher.phone,
            address: teacher.address,
            education: teacher.education
        });
        setHasChanges(false);
        setIsApprovalSent(false);
        setActiveTab('personal');
        setIsModalOpen(true);
    };

    const handleInputChange = (field, value) => {
        setEditableData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSubmitForApproval = () => {
        setIsSubmittingApproval(true);
        setTimeout(() => {
            setIsSubmittingApproval(false);
            setIsApprovalSent(true);
            setHasChanges(false);
        }, 1500);
    };

    // Close stage filter dropdown on click outside (quick-assign closes via backdrop click)
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target)) setFilterDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keep quick-assign dropdown aligned with the cell on scroll/resize
    useEffect(() => {
        if (!quickAssign) return;
        const { colKey, rowIndex } = quickAssign;
        const selector = `[data-quick-assign-cell="${colKey}-${rowIndex}"]`;

        const updateRect = () => {
            const el = document.querySelector(selector);
            if (el) {
                setQuickAssign((prev) => (prev ? { ...prev, rect: el.getBoundingClientRect() } : null));
            }
        };

        const getScrollParents = (el) => {
            const parents = [];
            let node = el;
            while (node && node !== document.body) {
                const { overflow, overflowY, overflowX } = getComputedStyle(node);
                const isScrollable = /auto|scroll|overlay/.test(overflow + overflowY + overflowX) &&
                    (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth);
                if (isScrollable) parents.push(node);
                node = node.parentElement;
            }
            return parents;
        };

        updateRect();
        window.addEventListener('scroll', updateRect, true);
        window.addEventListener('resize', updateRect);
        const cellEl = document.querySelector(selector);
        const scrollParents = cellEl ? getScrollParents(cellEl) : [];
        scrollParents.forEach((parent) => parent.addEventListener('scroll', updateRect, true));

        return () => {
            window.removeEventListener('scroll', updateRect, true);
            window.removeEventListener('resize', updateRect);
            scrollParents.forEach((parent) => parent.removeEventListener('scroll', updateRect, true));
        };
    }, [quickAssign]);

    return (
        <div className="teachers-management">
            <header className="page-header">
                <div>
                    <h1>{t('nav.teachers') || 'إدارة الأساتذة'}</h1>
                    <p>قائمة الأساتذة المستوردة من قاعدة بيانات DRH</p>
                </div>
            </header>

            <div className={`table-card ${filterDropdownOpen ? 'filter-open' : ''}`}>
                <DataTable
                    data={filteredData}
                    columns={columns}
                    defaultColumns={columns}
                    onRowClick={handleRowClick}
                    searchPlaceholder="البحث عن أستاذ..."
                    footerText="إجمالي الأساتذة: {count}"
                    headerActions={
                        <div className="teachers-filters-popup" ref={filterDropdownRef}>
                            <button
                                type="button"
                                className={`filters-popup-trigger ${filterDropdownOpen ? 'open' : ''}`}
                                onClick={() => setFilterDropdownOpen((v) => !v)}
                                aria-haspopup="dialog"
                                aria-expanded={filterDropdownOpen}
                            >
                                <span className="trigger-label">{t('teachers.filter') || 'تصفية'}</span>
                                {activeFilterCount > 0 && (
                                    <span className="trigger-badge">{activeFilterCount}</span>
                                )}
                                <ChevronDown size={16} className="trigger-icon" />
                            </button>
                            {filterDropdownOpen && (
                                <div className="filters-popup-dropdown" onClick={() => setOpenSelectKey(null)}>
                                    {filterConfig.map(({ key: filterKey, label, options }) => {
                                        const selected = activeFilters[filterKey];
                                        const isOpen = openSelectKey === filterKey;
                                        const summary =
                                            selected.length === 0
                                                ? t('teachers.filter_all')
                                                : selected.length === 1
                                                    ? (options.find((o) => o.id === selected[0])?.label ?? selected[0])
                                                    : `${selected.length} ${t('teachers.selected') || 'محدد'}`;
                                        return (
                                            <div
                                                key={filterKey}
                                                className="filter-multiselect"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <label className="multiselect-label">{label}</label>
                                                <div
                                                    className={`multiselect-trigger ${isOpen ? 'open' : ''} ${selected.length > 0 ? 'has-value' : ''}`}
                                                    onClick={() => setOpenSelectKey(isOpen ? null : filterKey)}
                                                    role="combobox"
                                                    aria-expanded={isOpen}
                                                    aria-haspopup="listbox"
                                                >
                                                    <span className="multiselect-value">{summary}</span>
                                                    <ChevronDown size={16} className="multiselect-chevron" />
                                                </div>
                                                {isOpen && (
                                                    <div className="multiselect-dropdown" role="listbox">
                                                        {options.map((opt) => {
                                                            const checked = selected.includes(opt.id);
                                                            return (
                                                                <label
                                                                    key={opt.id}
                                                                    className={`multiselect-option ${checked ? 'checked' : ''}`}
                                                                    style={opt.color && checked ? { '--option-accent': opt.color } : undefined}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={checked}
                                                                        onChange={() => toggleFilterOption(filterKey, opt.id)}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                    <span className="multiselect-option-check">
                                                                        {checked && <Check size={14} />}
                                                                    </span>
                                                                    {opt.color && <span className="option-dot" style={{ backgroundColor: opt.color }} />}
                                                                    <span className="multiselect-option-label">{opt.label}</span>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {activeFilterCount > 0 && (
                                        <button
                                            type="button"
                                            className="filters-popup-reset"
                                            onClick={() =>
                                                setActiveFilters({ stage: [], sub_stage: [], module: [], class: [] })
                                            }
                                        >
                                            <RotateCcw size={14} />
                                            <span>{t('common.reset') || 'إعادة ضبط'}</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    }
                />
            </div>

            {/* Quick Assign: blur backdrop + simple dropdown */}
            {quickAssign && (
                <>
                    <div
                        className="quick-assign-backdrop"
                        onClick={() => setQuickAssign(null)}
                        aria-hidden
                    />
                    <div
                        className="quick-assign-dropdown"
                        style={{
                            top: quickAssign.rect.bottom + 6,
                            left: quickAssign.rect.left,
                            width: Math.max(200, quickAssign.rect.width),
                            position: 'fixed'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="quick-assign-title">{quickAssign.title}</div>
                        <div className="quick-assign-options">
                            {(quickAssign.colKey === 'module'
                                ? ['Maths', 'Physique', 'Arabe', 'Français', 'Anglais', 'Informatique']
                                : ['G-01', 'G-02', 'G-03', 'G-04', 'G-05', 'G-06']
                            ).map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    className="quick-assign-option"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleQuickAssign(quickAssign.rowIndex, quickAssign.colKey, opt);
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedTeacher?.full_name}
                subtitle={`معرف الأستاذ: ${selectedTeacher?.id}`}
                icon={User}
                size="large"
                headerActions={
                    <div className="modal-header-tabs">
                        <button
                            className={`header-tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                            onClick={() => setActiveTab('personal')}
                        >
                            <Briefcase size={16} />
                            <span>{t('teachers.drh_info')}</span>
                        </button>
                        <button
                            className={`header-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
                            onClick={() => setActiveTab('admin')}
                        >
                            <Settings size={16} />
                            <span>{t('teachers.admin_control')}</span>
                        </button>
                    </div>
                }
            >
                <div className="teacher-modal-content">
                    <div className="tab-content">
                        {activeTab === 'personal' ? (
                            <div className="personal-info-container">
                                {isApprovalSent && (
                                    <div className="approval-status-banner success">
                                        <Check size={18} />
                                        <span>{t('teachers.pending_hr_approval')}</span>
                                    </div>
                                )}

                                {hasChanges && (
                                    <div className="approval-status-banner warning">
                                        <AlertCircle size={18} />
                                        <span>{t('teachers.draft_mode_active')}</span>
                                        <button
                                            className="approve-submission-btn"
                                            onClick={handleSubmitForApproval}
                                            disabled={isSubmittingApproval}
                                        >
                                            {isSubmittingApproval ? <RefreshCw className="spin" size={14} /> : <Save size={14} />}
                                            {t('teachers.submit_for_approval')}
                                        </button>
                                    </div>
                                )}

                                <div className="personal-info-edit-notice">
                                    <AlertCircle size={16} />
                                    <p>{t('teachers.personal_info_edit_notice')}</p>
                                </div>

                                <div className="personal-info-grid">
                                    <div className="info-section">
                                        <h4>{t('teachers.contact_data')}</h4>
                                        <div className="info-item-editable">
                                            <div className="icon-box"><Mail size={16} /></div>
                                            <div className="input-field">
                                                <label>{t('req.email')}</label>
                                                <input
                                                    type="email"
                                                    value={editableData.email || ''}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="info-item-editable">
                                            <div className="icon-box"><Phone size={16} /></div>
                                            <div className="input-field">
                                                <label>{t('req.phone')}</label>
                                                <input
                                                    type="text"
                                                    value={editableData.phone || ''}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="info-item-editable">
                                            <div className="icon-box"><MapPin size={16} /></div>
                                            <div className="input-field">
                                                <label>{t('req.address')}</label>
                                                <input
                                                    type="text"
                                                    value={editableData.address || ''}
                                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="info-section">
                                        <h4>{t('teachers.career_path')}</h4>
                                        <div className="info-item-editable">
                                            <div className="icon-box"><Award size={16} /></div>
                                            <div className="input-field">
                                                <label>{t('teachers.education_level')}</label>
                                                <input
                                                    type="text"
                                                    value={editableData.education || ''}
                                                    onChange={(e) => handleInputChange('education', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <Calendar size={16} />
                                            <div>
                                                <label>{t('req.submission_date') || 'تاريخ التوظيف'}</label>
                                                <span>{selectedTeacher?.hire_date}</span>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <Briefcase size={16} />
                                            <div>
                                                <label>{t('teachers.experience_years') || 'سنوات الخبرة'}</label>
                                                <span>{selectedTeacher?.experience} سنة</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="admin-control-grid">
                                <div className="config-form">
                                    <div className="form-group mb-4">
                                        <label className="section-label">{t('teachers.assigned_department')}</label>
                                        <div className="visual-choice-grid">
                                            {['الرياضيات', 'العلوم', 'اللغات', 'الترميز'].map(dept => (
                                                <button
                                                    key={dept}
                                                    type="button"
                                                    className={`choice-card ${selectedTeacher?.department === dept ? 'active' : ''}`}
                                                >
                                                    <Award size={18} />
                                                    <span>{dept}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group mb-4">
                                        <label className="section-label">{t('teachers.assigned_module')}</label>
                                        <div className="visual-choice-grid">
                                            {['Math', 'Sciences', 'Arabic'].map(mod => (
                                                <button
                                                    key={mod}
                                                    type="button"
                                                    className={`choice-card ${selectedTeacher?.module === mod ? 'active' : ''}`}
                                                >
                                                    <BookOpen size={18} />
                                                    <span>{mod}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group mb-4">
                                        <label className="section-label">{t('teachers.assigned_classes')}</label>
                                        <div className="multi-select-chips">
                                            {['E-01', 'E-02', 'E-03', 'E-04'].map(cls => (
                                                <label key={cls} className="chip-checkbox">
                                                    <input type="checkbox" defaultChecked={selectedTeacher?.class === cls} />
                                                    <span>{cls}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-row mb-4">
                                        <div className="form-group">
                                            <label className="section-label">{t('teachers.working_hours')}</label>
                                            <div className="time-range-group">
                                                <input type="time" defaultValue="08:00" />
                                                <span className="separator">→</span>
                                                <input type="time" defaultValue="16:30" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="section-label">{t('teachers.break_times')}</label>
                                            <div className="time-range-group">
                                                <input type="time" defaultValue="12:00" />
                                                <span className="separator">→</span>
                                                <input type="time" defaultValue="13:00" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group mb-4">
                                        <label className="section-label">{t('teachers.teaching_preferences')}</label>
                                        <div className="premium-prefs-grid">
                                            {[
                                                { id: 'calm', label: t('teachers.pref_calm_class'), icon: Shield, checked: false },
                                                { id: 'morning', label: t('teachers.pref_morning'), icon: Sun, checked: true },
                                                { id: 'afternoon', label: t('teachers.pref_afternoon'), icon: Moon, checked: false },
                                                { id: 'special', label: t('teachers.pref_special_needs'), icon: Heart, checked: true }
                                            ].map(pref => (
                                                <label key={pref.id} className="pref-toggle-card">
                                                    <input type="checkbox" defaultChecked={pref.checked} />
                                                    <div className="card-inner">
                                                        <pref.icon size={20} className="pref-icon" />
                                                        <span className="pref-label">{pref.label}</span>
                                                        <div className="check-indicator">
                                                            <Check size={12} />
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="section-label">{t('teachers.admin_notes')}</label>
                                        <textarea
                                            placeholder="أضف ملاحظات حول أداء الأستاذ..."
                                            rows={4}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};
