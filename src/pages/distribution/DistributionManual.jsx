import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { ArrowLeft, AlertTriangle, Info, Layout as GridLayout, AlignJustify as ListLayout } from 'react-feather';
import { MOCK_CLASSES, getTeachersFromAssignments } from './DistributionMockData';
import { DataTable } from '../../components/common/DataTable/DataTable';
import './DistributionManual.scss';

export const DistributionManual = () => {
    const { t } = useTranslation();
    const { stageFilter } = useOutletContext(); // Get global stage filter
    const [viewMode, setViewMode] = useState('table');
    const [transferModalOpen, setTransferModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [fromClass, setFromClass] = useState('');
    const [toClass, setToClass] = useState('');
    const [selectedClass, setSelectedClass] = useState(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [activeDetailTab, setActiveDetailTab] = useState('stats');

    // Filter classes based on global stage filter
    const filteredClasses = MOCK_CLASSES.filter(cls => {
        if (stageFilter === 'all') return true;
        return cls.stage === stageFilter;
    });

    const handleRowClick = (cls) => {
        if (!cls) return;
        setSelectedClass(cls);
        setDetailsModalOpen(true);
    };

    const columns = React.useMemo(() => [
        { key: 'name', label: t('dist.crit_academic'), visible: true, width: 250 },
        {
            key: 'stage',
            label: t('dist.stage_label'),
            visible: true,
            render: (val) => val === 'p' ? t('dist.stage_p') : val === 'm' ? t('dist.stage_m') : t('dist.stage_k')
        },
        {
            key: 'enrolled',
            label: t('dist.max_capacity_label'),
            visible: true,
            render: (val, row) => (
                <div className={`table-capacity ${val > row.maxCapacity ? 'danger-text' : ''}`}>
                    {val} / {row.maxCapacity}
                </div>
            )
        },
        {
            key: 'gender_balance',
            label: t('dist.crit_gender'),
            visible: true,
            render: (_, row) => {
                const total = row.male + row.female;
                const mP = total > 0 ? Math.round((row.male / total) * 100) : 0;
                const fP = total > 0 ? Math.round((row.female / total) * 100) : 0;
                return (
                    <div className="table-balance-bar">
                        <div className="m-part" style={{ width: `${mP}%` }} title={`${t('dist.males')}: ${row.male}`}></div>
                        <div className="f-part" style={{ width: `${fP}%` }} title={`${t('dist.females')}: ${row.female}`}></div>
                    </div>
                );
            }
        },
        {
            key: 'assignments',
            label: t('dist.assigned_teacher_label'),
            visible: true,
            render: (val) => {
                const teachers = getTeachersFromAssignments(val);
                if (teachers.length === 0) return <span className="unassigned-text">{t('dist.unassigned')}</span>;
                if (teachers.length === 1) return teachers[0].name;
                return `${teachers.length} ${t('dist.teachers_plural')}`;
            }
        }
    ], [t]);

    return (
        <div className="tab-pane manual-override fade-in">
            <div className="manual-tools">
                <div className="view-mode-toggle">
                    <button
                        className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title={t('dist.view_grid')}
                    >
                        <GridLayout size={20} color={viewMode === 'grid' ? '#ffffff' : '#64748b'} />
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setViewMode('table')}
                        title={t('dist.view_table')}
                    >
                        <ListLayout size={20} color={viewMode === 'table' ? '#ffffff' : '#64748b'} />
                    </button>
                </div>
                <button className="btn-secondary transfer-student-btn" onClick={() => setTransferModalOpen(true)}>
                    <ArrowLeft size={16} className="rt-arrow" />
                    {t('dist.btn_transfer')}
                </button>
            </div>

            {viewMode === 'grid' ? (
                <div className="bento-classes-grid">
                    {filteredClasses.length > 0 ? (
                        filteredClasses.map(cls => {
                            const capacityPercent = Math.round((cls.enrolled / cls.maxCapacity) * 100);
                            const isOvercrowded = capacityPercent > 100;

                            const totalGender = cls.male + cls.female;
                            const malePercent = totalGender > 0 ? (cls.male / totalGender) * 100 : 0;
                            const femalePercent = totalGender > 0 ? (cls.female / totalGender) * 100 : 0;

                            return (
                                <div
                                    key={cls.id}
                                    className={`bento-card class-summary clickable ${isOvercrowded ? 'danger-state' : ''}`}
                                    onClick={() => handleRowClick(cls)}
                                >
                                    <div className="bento-header">
                                        <h3 className="class-name">{cls.name}</h3>
                                        {isOvercrowded && <AlertTriangle className="alert-icon" size={18} />}
                                    </div>

                                    <div className="bento-body">
                                        <div className="capacity-section">
                                            <div className="cap-labels">
                                                <span className="label">{t('dist.max_capacity_label')}</span>
                                                <span className={`value ${isOvercrowded ? 'danger-text' : ''}`}>
                                                    {cls.enrolled} / {cls.maxCapacity}
                                                </span>
                                            </div>
                                            <div className="progress-bar-container mini">
                                                <div
                                                    className={`progress-bar-fill ${isOvercrowded ? 'danger-fill' : 'normal-fill'}`}
                                                    style={{ width: `${Math.min(capacityPercent, 100)}%` }}>
                                                </div>
                                            </div>
                                            {isOvercrowded && <div className="overcrowded-warning">{t('dist.overcrowded_warn')}</div>}
                                        </div>

                                        <div className="gender-balance-section">
                                            <span className="label">{t('dist.crit_gender')}</span>
                                            <div className="balance-bar">
                                                <div className="male-segment" style={{ width: `${malePercent}%` }}>
                                                    {malePercent >= 15 && `${Math.round(malePercent)}%`}
                                                </div>
                                                <div className="female-segment" style={{ width: `${femalePercent}%` }}>
                                                    {femalePercent >= 15 && `${Math.round(femalePercent)}%`}
                                                </div>
                                            </div>
                                            <div className="balance-legend">
                                                <span className="male-dot">{t('dist.males')} ({cls.male})</span>
                                                <span className="female-dot">{t('dist.females')} ({cls.female})</span>
                                            </div>
                                        </div>

                                        {(() => {
                                            const clsTeachers = getTeachersFromAssignments(cls.assignments);
                                            return (
                                                <div className="teacher-section multiple">
                                                    <span className="label">
                                                        {t('dist.assigned_teacher_label')}
                                                        <span className="count-badge">({clsTeachers.length})</span>
                                                    </span>
                                                    <div className="teachers-stack">
                                                        {clsTeachers.length > 0 ? (
                                                            clsTeachers.slice(0, 3).map((tc, i) => (
                                                                <div key={i} className="teacher-mini-item" title={`${tc.name} - ${tc.subject}`}>
                                                                    <div className="mini-avatar">{tc.name.charAt(0)}</div>
                                                                    {clsTeachers.length <= 2 && <span className="mini-name">{tc.name}</span>}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span className="unassigned">{t('dist.unassigned')}</span>
                                                        )}
                                                        {clsTeachers.length > 3 && (
                                                            <div className="more-badge">+{clsTeachers.length - 3}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {cls.maxAgeGap && (
                                            <div className="age-gap-section">
                                                <Info size={14} /> {t('dist.max_age_gap')} <strong>{cls.maxAgeGap}</strong>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="empty-results-fallback">
                            <Info size={40} />
                            <p>{t('dist.no_classes_in_this_stage') || 'No classes found for the selected stage filter.'}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="manual-table-view">
                    <DataTable
                        data={filteredClasses}
                        columns={columns}
                        searchPlaceholder={t('dist.search_class')}
                        onRowClick={handleRowClick}
                    />
                </div>
            )}

            {/* Modals remain the same */}
            {transferModalOpen && (
                <div className="dist-modal-overlay" onClick={() => setTransferModalOpen(false)}>
                    <div className="dist-modal-content transfer-tool" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{t('dist.transfer_title')}</h3>
                            <button className="close-btn" onClick={() => setTransferModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>{t('dist.search_student_label')}</label>
                                <input
                                    type="text"
                                    placeholder={t('dist.search_student_placeholder')}
                                    value={selectedStudent}
                                    onChange={e => setSelectedStudent(e.target.value)}
                                    className="fancy-input"
                                />
                            </div>

                            <div className="transfer-direction">
                                <div className="form-group from-group">
                                    <label>{t('dist.from_class_label')}</label>
                                    <select value={fromClass} onChange={e => setFromClass(e.target.value)} className="fancy-select">
                                        <option value="">{t('dist.select_class')}</option>
                                        {MOCK_CLASSES.map(c => <option key={`from_${c.id}`} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="transfer-icon-wrapper">
                                    <ArrowLeft size={24} className="dir-icon" />
                                </div>
                                <div className="form-group to-group">
                                    <label>{t('dist.to_class_label')}</label>
                                    <select value={toClass} onChange={e => setToClass(e.target.value)} className="fancy-select">
                                        <option value="">{t('dist.select_class')}</option>
                                        {MOCK_CLASSES.map(c => <option key={`to_${c.id}`} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {(fromClass && toClass) && (
                                <div className="transfer-impact-warning">
                                    <Info size={16} />
                                    <span>{t('dist.transfer_warning')}</span>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setTransferModalOpen(false)}>{t('dist.btn_cancel')}</button>
                            <button className="btn-primary" onClick={() => {
                                alert(t('dist.transfer_success_msg'));
                                setTransferModalOpen(false);
                            }}>{t('dist.btn_confirm')}</button>
                        </div>
                    </div>
                </div>
            )}
            {detailsModalOpen && selectedClass && (
                <div className="dist-modal-overlay" onClick={() => setDetailsModalOpen(false)}>
                    <div className="dist-modal-content class-details-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="title-area">
                                <h3>{selectedClass.name}</h3>
                                <span className="stage-badge">
                                    {selectedClass.stage === 'p' ? t('dist.stage_p') : selectedClass.stage === 'm' ? t('dist.stage_m') : t('dist.stage_k')}
                                </span>
                            </div>
                            <button className="close-btn" onClick={() => setDetailsModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-tabs">
                                <button
                                    className={`tab-btn ${activeDetailTab === 'stats' ? 'active' : ''}`}
                                    onClick={() => setActiveDetailTab('stats')}
                                >
                                    <GridLayout size={16} /> {t('dist.tab_stats')}
                                </button>
                                <button
                                    className={`tab-btn ${activeDetailTab === 'teachers' ? 'active' : ''}`}
                                    onClick={() => setActiveDetailTab('teachers')}
                                >
                                    <Info size={16} /> {t('dist.tab_teachers')}
                                </button>
                                <button
                                    className={`tab-btn ${activeDetailTab === 'students' ? 'active' : ''}`}
                                    onClick={() => setActiveDetailTab('students')}
                                >
                                    <ListLayout size={16} /> {t('dist.tab_students')}
                                </button>
                            </div>

                            <div className="tab-content-wrapper">
                                {activeDetailTab === 'stats' && (
                                    <div className="tab-pane-details stats-tab fade-in">
                                        <div className="details-grid">
                                            <div className="detail-item main-stat">
                                                <span className="label text-right">{t('dist.max_capacity_label')}</span>
                                                <div className="stat-value">
                                                    <span className="current">{selectedClass.enrolled}</span>
                                                    <span className="total">/ {selectedClass.maxCapacity}</span>
                                                </div>
                                                <div className="mini-progress">
                                                    <div
                                                        className={`fill ${selectedClass.enrolled > selectedClass.maxCapacity ? 'danger' : ''}`}
                                                        style={{ width: `${Math.min(100, (selectedClass.enrolled / selectedClass.maxCapacity) * 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="detail-item gender-stats">
                                                <span className="label">{t('dist.crit_gender')}</span>
                                                <div className="gender-split">
                                                    <div className="gender-box male">
                                                        <span className="count">{selectedClass.male}</span>
                                                        <span className="txt">{t('dist.males')}</span>
                                                    </div>
                                                    <div className="gender-box female">
                                                        <span className="count">{selectedClass.female}</span>
                                                        <span className="txt">{t('dist.females')}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="detail-item extra-info">
                                                <span className="label">{t('dist.additional_info')}</span>
                                                <ul className="info-list">
                                                    <li>
                                                        <Info size={14} />
                                                        <span>{t('dist.max_age_gap_val')} {selectedClass.maxAgeGap || '6 أشهر'}</span>
                                                    </li>
                                                    <li>
                                                        <AlertTriangle size={14} />
                                                        <span>{t('dist.occupancy_status')} {selectedClass.enrolled > selectedClass.maxCapacity ? t('dist.overcrowding_critical') : t('dist.overcrowding_normal')}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeDetailTab === 'teachers' && (
                                    <div className="tab-pane-details teachers-tab fade-in">
                                        <div className="teacher-header-info">
                                            <h4>{t('dist.tab_teachers')}</h4>
                                            <span className="max-tag">
                                                {t('dist.stage_max_teachers')} {selectedClass.stage === 'p' ? '3' : '9'}
                                            </span>
                                        </div>
                                        <div className="teachers-detailed-list large-view">
                                            {(() => {
                                                const selTeachers = getTeachersFromAssignments(selectedClass.assignments);
                                                return selTeachers.length > 0 ? (
                                                    selTeachers.map((tc, i) => (
                                                        <div key={i} className="teacher-card-detailed large">
                                                            <div className="avatar-side">
                                                                <div className="main-avatar">{tc.name.charAt(0)}</div>
                                                            </div>
                                                            <div className="info-side">
                                                                <div className="name">{tc.name}</div>
                                                                <div className="subject">{tc.subject}</div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="empty-state">
                                                        <Info size={48} />
                                                        <p>{t('dist.unassigned')}</p>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                )}

                                {activeDetailTab === 'students' && (
                                    <div className="tab-pane-details students-tab fade-in">
                                        <h4>{t('dist.tab_students_list_title')} ({selectedClass.students?.length || 0})</h4>
                                        <div className="students-list-view">
                                            {selectedClass.students && selectedClass.students.length > 0 ? (
                                                <div className="students-simple-list">
                                                    {selectedClass.students.map((st, i) => (
                                                        <div key={st.id} className="student-list-item">
                                                            <span className="index">{i + 1}</span>
                                                            <span className="name">{st.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="empty-state">
                                                    <Info size={48} />
                                                    <p>{t('dist.no_students_registered')}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setDetailsModalOpen(false)}>
                                {t('common.close')}
                            </button>
                            <button className="btn-primary" onClick={() => {
                                setDetailsModalOpen(false);
                                setTransferModalOpen(true);
                                setFromClass(selectedClass.id);
                            }}>
                                {t('dist.btn_transfer')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
