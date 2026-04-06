import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { UserCheck, Users, Search, ChevronDown, ChevronUp, Check, X, AlertTriangle, Clock, BookOpen } from 'react-feather';
import { MOCK_CLASSES, MOCK_ALL_TEACHERS, STAGE_MODULES } from './DistributionMockData';
import './DistributionAssignment.scss';

export const DistributionAssignment = () => {
    const { t } = useTranslation();
    const { stageFilter } = useOutletContext(); // Get global stage filter
    const [expandedClass, setExpandedClass] = useState(null);
    const [activeModule, setActiveModule] = useState(null); // module currently being assigned
    const [assignmentMap, setAssignmentMap] = useState({}); // { classId: { module: teacher } }
    const [teacherSearch, setTeacherSearch] = useState('');

    const filteredClasses = MOCK_CLASSES.filter(cls => {
        if (stageFilter === 'all') return true;
        return cls.stage === stageFilter;
    });

    const getStageLabel = (stage) => {
        if (stage === 'p') return t('dist.stage_p');
        if (stage === 'm') return t('dist.stage_m');
        return t('dist.stage_k');
    };

    const getStageColor = (stage) => {
        if (stage === 'p') return '#3b82f6';
        if (stage === 'm') return '#8b5cf6';
        return '#f59e0b';
    };

    const getCapacityStatus = (cls) => {
        const pct = (cls.enrolled / cls.maxCapacity) * 100;
        if (pct > 100) return 'danger';
        if (pct > 85) return 'warning';
        return 'safe';
    };

    // Get the effective teacher for a module (pending or original)
    const getModuleTeacher = (cls, mod) => {
        const pending = assignmentMap[cls.id]?.[mod];
        if (pending) return { ...pending, isPending: true };
        const original = cls.assignments[mod];
        if (original) return { ...original, isPending: false };
        return null;
    };

    // Get all teachers effectively assigned (original + pending)
    const getEffectiveTeachers = (cls) => {
        const modules = STAGE_MODULES[cls.stage] || [];
        return modules.filter(mod => getModuleTeacher(cls, mod) !== null);
    };

    // Get available teachers for a specific module in a specific stage
    const getAvailableTeachersForModule = (cls, mod) => {
        let available = MOCK_ALL_TEACHERS.filter(tc =>
            tc.subject === mod && tc.stages.includes(cls.stage)
        );

        // Filter out teachers already assigned to this class (any module)
        const modules = STAGE_MODULES[cls.stage] || [];
        const assignedIds = modules
            .map(m => getModuleTeacher(cls, m))
            .filter(Boolean)
            .map(tc => tc.id);

        available = available.filter(tc => !assignedIds.includes(tc.id));

        if (teacherSearch) {
            available = available.filter(tc =>
                tc.name.includes(teacherSearch)
            );
        }

        return available;
    };

    const handleAssignTeacher = (classId, mod, teacher) => {
        setAssignmentMap(prev => ({
            ...prev,
            [classId]: {
                ...(prev[classId] || {}),
                [mod]: { id: teacher.id, name: teacher.name }
            }
        }));
        setActiveModule(null);
        setTeacherSearch('');
    };

    const handleRemoveAssignment = (classId, mod) => {
        setAssignmentMap(prev => {
            const updated = { ...(prev[classId] || {}) };
            delete updated[mod];
            return { ...prev, [classId]: updated };
        });
    };

    const handleToggleClass = (classId) => {
        if (expandedClass === classId) {
            setExpandedClass(null);
            setActiveModule(null);
        } else {
            setExpandedClass(classId);
            setActiveModule(null);
            setTeacherSearch('');
        }
    };

    // Stats
    const totalModules = MOCK_CLASSES.reduce((sum, cls) => sum + (STAGE_MODULES[cls.stage]?.length || 0), 0);
    const assignedModules = MOCK_CLASSES.reduce((sum, cls) => sum + getEffectiveTeachers(cls).length, 0);
    const unassignedModules = totalModules - assignedModules;

    return (
        <div className="tab-pane assignment-page fade-in">
            {/* Summary Stats */}
            <div className="assignment-stats-bar">
                <div className="stat-chip assigned">
                    <Check size={16} />
                    <span className="val">{assignedModules}</span>
                    <span className="lbl">{t('dist.assign_modules_filled')}</span>
                </div>
                <div className="stat-chip pending">
                    <Clock size={16} />
                    <span className="val">{unassignedModules}</span>
                    <span className="lbl">{t('dist.assign_modules_empty')}</span>
                </div>
                <div className="stat-chip teachers">
                    <Users size={16} />
                    <span className="val">{MOCK_ALL_TEACHERS.length}</span>
                    <span className="lbl">{t('dist.assign_total_teachers')}</span>
                </div>
                <div className="stat-chip available">
                    <BookOpen size={16} />
                    <span className="val">{totalModules}</span>
                    <span className="lbl">{t('dist.assign_total_slots')}</span>
                </div>
            </div>

            {/* Panel Title */}
            <div className="assignment-panel-title">
                <h4>{t('dist.tab_assignment')}</h4>
                <p>{t('dist.assign_desc_small') || 'Assign teachers to each module available for your selected classes.'}</p>
            </div>

            {/* Classes List */}
            <div className="assignment-classes-list">
                {filteredClasses.length > 0 ? (
                    filteredClasses.map(cls => {
                        const isExpanded = expandedClass === cls.id;
                        const capStatus = getCapacityStatus(cls);
                        const stageColor = getStageColor(cls.stage);
                        const modules = STAGE_MODULES[cls.stage] || [];
                        const filledCount = getEffectiveTeachers(cls).length;
                        const totalCount = modules.length;
                        const isFullyAssigned = filledCount === totalCount;

                        return (
                            <div key={cls.id} className={`assign-class-card ${isExpanded ? 'expanded' : ''} ${!isFullyAssigned ? 'needs-assignment' : 'fully-assigned'}`}>
                                {/* Header */}
                                <div className="card-main" onClick={() => handleToggleClass(cls.id)}>
                                    <div className="card-left">
                                        <div className="stage-indicator" style={{ background: stageColor }}>{cls.name.charAt(0)}</div>
                                        <div className="card-text">
                                            <h5>{cls.name}</h5>
                                            <div className="card-meta">
                                                <span className="stage-tag" style={{ color: stageColor, background: `${stageColor}15` }}>
                                                    {getStageLabel(cls.stage)}
                                                </span>
                                                <span className={`cap-tag ${capStatus}`}>{cls.enrolled}/{cls.maxCapacity}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-right">
                                        <div className={`module-progress-badge ${isFullyAssigned ? 'complete' : ''}`}>
                                            <span>{filledCount}/{totalCount}</span>
                                            <span className="badge-label">{t('dist.assign_modules_label')}</span>
                                        </div>
                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </div>
                                </div>

                                {/* Expanded: Module Slots */}
                                {isExpanded && (
                                    <div className="card-expanded-content">
                                        <div className="modules-grid">
                                            {modules.map(mod => {
                                                const teacher = getModuleTeacher(cls, mod);
                                                const isActive = activeModule === mod;

                                                return (
                                                    <div key={mod} className={`module-slot ${teacher ? 'filled' : 'empty'} ${teacher?.isPending ? 'pending' : ''} ${isActive ? 'active-slot' : ''}`}>
                                                        <div className="slot-header">
                                                            <div className="module-name">
                                                                <BookOpen size={14} />
                                                                <span>{mod}</span>
                                                            </div>
                                                            {teacher?.isPending && (
                                                                <button className="slot-remove" onClick={() => handleRemoveAssignment(cls.id, mod)}>
                                                                    <X size={13} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        {teacher ? (
                                                            <div className="slot-teacher">
                                                                <div className="slot-av" style={{ background: stageColor }}>
                                                                    {teacher.name.charAt(teacher.name.indexOf('.') + 2)}
                                                                </div>
                                                                <span className="slot-teacher-name">{teacher.name}</span>
                                                                {teacher.isPending && <span className="new-badge">{t('dist.assign_new')}</span>}
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="slot-assign-btn"
                                                                onClick={() => {
                                                                    setActiveModule(isActive ? null : mod);
                                                                    setTeacherSearch('');
                                                                }}
                                                            >
                                                                <UserCheck size={14} />
                                                                <span>{t('dist.assign_pick_teacher')}</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Teacher picker for active module */}
                                        {activeModule && (
                                            <div className="teacher-picker-panel">
                                                <div className="picker-header">
                                                    <h5>
                                                        <BookOpen size={15} />
                                                        {t('dist.assign_picking_for')} <strong>{activeModule}</strong>
                                                    </h5>
                                                    <button className="close-picker" onClick={() => setActiveModule(null)}>
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <div className="picker-search">
                                                    <Search size={14} className="s-icon" />
                                                    <input
                                                        type="text"
                                                        placeholder={t('dist.search_teacher')}
                                                        value={teacherSearch}
                                                        onChange={e => setTeacherSearch(e.target.value)}
                                                    />
                                                </div>
                                                <div className="picker-results">
                                                    {getAvailableTeachersForModule(cls, activeModule).length > 0 ? (
                                                        getAvailableTeachersForModule(cls, activeModule).map(tc => (
                                                            <div
                                                                key={tc.id}
                                                                className="picker-teacher-card"
                                                                onClick={() => handleAssignTeacher(cls.id, activeModule, tc)}
                                                            >
                                                                <div className="ptc-avatar" style={{ background: stageColor }}>
                                                                    {tc.name.charAt(tc.name.indexOf('.') + 2)}
                                                                </div>
                                                                <div className="ptc-body">
                                                                    <span className="ptc-name">{tc.name}</span>
                                                                    <span className="ptc-exp">{tc.exp}</span>
                                                                </div>
                                                                <div className="ptc-action">
                                                                    <Check size={16} />
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="no-teachers-msg">
                                                            <Users size={28} />
                                                            <span>{t('dist.assign_no_teachers')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-results">
                        <Users size={40} />
                        <p>{t('dist.no_classes_in_this_stage') || 'No classes found for the selected stage filter.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
