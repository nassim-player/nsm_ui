import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { Cpu, UserCheck, Edit3, Check, Users, BookOpen } from 'react-feather';
import { DataTable } from '../components/common/DataTable/DataTable';
import { MOCK_CLASSES } from '../pages/distribution/DistributionMockData';
import './DistributionLayout.scss';

export const DistributionLayout = () => {
    const { t } = useTranslation();
    const [stageFilter, setStageFilter] = useState('all');
    const [selectedClassForTable, setSelectedClassForTable] = useState('');

    const subLinks = [
        { to: '/distribution', icon: Cpu, label: t('dist.tab_engine'), exact: true },
        { to: '/distribution/assignment', icon: UserCheck, label: t('dist.tab_assignment') },
        { to: '/distribution/manual', icon: Edit3, label: t('dist.tab_manual') },
    ];

    const filteredClasses = MOCK_CLASSES.filter(cls => {
        if (stageFilter === 'all') return true;
        return cls.stage === stageFilter;
    });

    return (
        <div className="distribution-layout">
            <div className="page-header">
                <div className="header-content">
                    <h1>{t('dist.title')}</h1>
                    <p>{t('dist.subtitle')}</p>
                </div>
                <div className="header-actions">
                    <button className="btn-draft">
                        <Edit3 size={16} />
                        {t('dist.simulate')}
                    </button>
                    <button className="btn-save">
                        <Check size={16} />
                        {t('dist.approve')}
                    </button>
                </div>
            </div>

            {/* Global Distribution Filters */}
            <div className="distribution-global-filters">
                <div className="filter-group">
                    <span className="filter-label">{t('dist.stage_label')}:</span>
                    <div className="stage-filters">
                        {['all', 'p', 'm', 'pr'].map(st => (
                            <button
                                key={st}
                                className={`filter-chip ${stageFilter === st ? 'active' : ''}`}
                                onClick={() => {
                                    setStageFilter(st);
                                    setSelectedClassForTable(''); // Reset class selector when stage changes
                                }}
                            >
                                {st === 'all' ? t('dist.assign_all') :
                                    st === 'p' ? t('dist.stage_p') :
                                        st === 'm' ? t('dist.stage_m') : t('dist.stage_k')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <nav className="distribution-subnav">
                {subLinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.to}
                        end={link.exact}
                        className={({ isActive }) =>
                            `subnav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <link.icon size={18} />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="distribution-content">
                <Outlet context={{ stageFilter, setStageFilter }} />
            </div>

            {/* Persistent Student Roster Section */}
            <div className="student-roster-section">
                <div className="roster-header">
                    <div className="roster-title">
                        <Users size={20} className="title-icon" />
                        <h4>{t('dist.assign_student_roster')}</h4>
                    </div>
                    <div className="class-selector">
                        <select
                            value={selectedClassForTable}
                            onChange={e => setSelectedClassForTable(e.target.value)}
                            className="class-select"
                        >
                            <option value="">{t('dist.assign_select_class_view')}</option>
                            {filteredClasses.map(cls => (
                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedClassForTable ? (
                    (() => {
                        const cls = MOCK_CLASSES.find(c => c.id === selectedClassForTable);
                        if (!cls || !cls.students || cls.students.length === 0) {
                            return (
                                <div className="roster-empty">
                                    <Users size={40} />
                                    <p>{t('dist.no_students_registered')}</p>
                                </div>
                            );
                        }

                        const studentColumns = [
                            { key: 'index', label: '#', visible: true, width: 60, render: (_, __, idx) => idx + 1 },
                            { key: 'name', label: t('dist.assign_student_name'), visible: true, width: 300 },
                            { key: 'id', label: t('dist.assign_student_id'), visible: true, width: 150 },
                        ];

                        return (
                            <DataTable
                                data={cls.students}
                                columns={studentColumns}
                                searchPlaceholder={t('dist.assign_search_student')}
                                footerText={`${t('dist.assign_total_students')}: {count}`}
                            />
                        );
                    })()
                ) : (
                    <div className="roster-empty">
                        <BookOpen size={40} />
                        <p>{t('dist.assign_select_class_prompt')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
