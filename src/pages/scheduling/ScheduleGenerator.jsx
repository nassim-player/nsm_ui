import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import {
    Cpu, Play, CheckCircle, AlertTriangle, Clock, Users,
    BookOpen, Home, Zap, RotateCcw, ChevronRight, Settings,
    Shield, TrendingUp, XCircle, Loader
} from 'react-feather';
import './ScheduleGenerator.scss';

/* ─── Mock constraint data ─────────────────────────────────── */
const CONSTRAINTS = [
    {
        id: 'c1', icon: Users, color: 'primary',
        titleKey: 'scheduling.constraint_teacher_avail',
        descKey: 'scheduling.constraint_teacher_avail_desc',
        status: 'ok', count: 28,
    },
    {
        id: 'c2', icon: BookOpen, color: 'secondary',
        titleKey: 'scheduling.constraint_hour_quota',
        descKey: 'scheduling.constraint_hour_quota_desc',
        status: 'ok', count: 14,
    },
    {
        id: 'c3', icon: Home, color: 'success',
        titleKey: 'scheduling.constraint_room_cap',
        descKey: 'scheduling.constraint_room_cap_desc',
        status: 'warning', count: 3,
    },
    {
        id: 'c4', icon: Shield, color: 'warning',
        titleKey: 'scheduling.constraint_no_overlap',
        descKey: 'scheduling.constraint_no_overlap_desc',
        status: 'ok', count: 0,
    },
];

const GENERATION_STEPS = [
    { id: 's1', labelKey: 'scheduling.gen_step_parse', duration: 900 },
    { id: 's2', labelKey: 'scheduling.gen_step_teachers', duration: 1400 },
    { id: 's3', labelKey: 'scheduling.gen_step_quotas', duration: 1100 },
    { id: 's4', labelKey: 'scheduling.gen_step_rooms', duration: 800 },
    { id: 's5', labelKey: 'scheduling.gen_step_conflicts', duration: 1600 },
    { id: 's6', labelKey: 'scheduling.gen_step_optimize', duration: 1200 },
    { id: 's7', labelKey: 'scheduling.gen_step_finalize', duration: 700 },
];

const STATS_OVERVIEW = [
    { labelKey: 'scheduling.stats_classes', value: '18', icon: BookOpen, color: 'primary' },
    { labelKey: 'scheduling.stats_teachers', value: '28', icon: Users, color: 'secondary' },
    { labelKey: 'scheduling.stats_rooms', value: '22', icon: Home, color: 'success' },
    { labelKey: 'scheduling.stats_slots', value: '210', icon: Clock, color: 'warning' },
];

/* ─── Status badge ──────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const { t } = useTranslation();
    const map = {
        ok: { cls: 'ok', icon: CheckCircle, label: t('scheduling.status_ok') },
        warning: { cls: 'warning', icon: AlertTriangle, label: t('scheduling.status_warning') },
        error: { cls: 'error', icon: XCircle, label: t('scheduling.status_error') },
    };
    const { cls, icon: Icon, label } = map[status] || map.ok;
    return (
        <span className={`constraint-status ${cls}`}>
            <Icon size={12} />
            {label}
        </span>
    );
};

/* ─── Main Component ────────────────────────────────────────── */
export const ScheduleGenerator = () => {
    const { t } = useTranslation();

    const [genState, setGenState] = useState('idle'); // idle | running | done | error
    const [currentStep, setCurrentStep] = useState(-1);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [progress, setProgress] = useState(0);
    const [conflictsFound, setConflictsFound] = useState(0);
    const [resolvedConflicts, setResolvedConflicts] = useState(0);
    const [logLines, setLogLines] = useState([]);
    const logRef = useRef(null);
    const timeoutsRef = useRef([]);

    const clearAllTimeouts = () => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
    };

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [logLines]);

    const startGeneration = () => {
        clearAllTimeouts();
        setGenState('running');
        setCurrentStep(0);
        setCompletedSteps([]);
        setProgress(0);
        setConflictsFound(0);
        setResolvedConflicts(0);
        setLogLines([]);

        const mockLogs = [
            t('scheduling.log_start'),
            t('scheduling.log_parsing'),
            t('scheduling.log_teachers_loaded'),
            t('scheduling.log_quotas_check'),
            t('scheduling.log_rooms_check'),
            t('scheduling.log_conflict_detected'),
            t('scheduling.log_conflict_resolved'),
            t('scheduling.log_optimizing'),
            t('scheduling.log_done'),
        ];

        let elapsed = 0;
        GENERATION_STEPS.forEach((step, idx) => {
            // Mark step as running
            const t1 = setTimeout(() => {
                setCurrentStep(idx);
                const prog = Math.round(((idx) / GENERATION_STEPS.length) * 100);
                setProgress(prog);
                if (idx === 4) {
                    setConflictsFound(7);
                }
                if (idx === 5) {
                    setResolvedConflicts(7);
                }
                // Add a log line
                if (mockLogs[idx]) {
                    setLogLines(prev => [...prev, { id: Date.now() + idx, text: mockLogs[idx], type: idx === 5 ? 'warn' : 'info' }]);
                }
            }, elapsed);
            timeoutsRef.current.push(t1);

            // Mark step as complete
            const t2 = setTimeout(() => {
                setCompletedSteps(prev => [...prev, idx]);
            }, elapsed + step.duration - 100);
            timeoutsRef.current.push(t2);

            elapsed += step.duration;
        });

        // Finalize
        const tFinal = setTimeout(() => {
            setProgress(100);
            setCurrentStep(-1);
            setGenState('done');
            setLogLines(prev => [...prev, { id: Date.now() + 99, text: t('scheduling.log_done'), type: 'success' }]);
        }, elapsed);
        timeoutsRef.current.push(tFinal);
    };

    const resetGeneration = () => {
        clearAllTimeouts();
        setGenState('idle');
        setCurrentStep(-1);
        setCompletedSteps([]);
        setProgress(0);
        setConflictsFound(0);
        setResolvedConflicts(0);
        setLogLines([]);
    };

    useEffect(() => () => clearAllTimeouts(), []);

    return (
        <div className="schedule-generator">
            {/* ── Page Header ── */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <Cpu size={24} />
                    </div>
                    <div>
                        <h1>{t('scheduling.gen_title')}</h1>
                        <p>{t('scheduling.gen_desc')}</p>
                    </div>
                </div>
                <div className="header-badges">
                    <span className="unit-badge">
                        <Zap size={12} />
                        {t('scheduling.unit_badge')}
                    </span>
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="stats-row">
                {STATS_OVERVIEW.map((s, i) => (
                    <div key={i} className={`stat-chip color-${s.color}`}>
                        <s.icon size={18} />
                        <div>
                            <span className="stat-value">{s.value}</span>
                            <span className="stat-label">{t(s.labelKey)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Grid ── */}
            <div className="generator-grid">

                {/* ═══ LEFT: Control Panel ═══ */}
                <div className="control-panel">
                    <div className="panel-card engine-card">
                        <div className="panel-header">
                            <div className="panel-title">
                                <Settings size={18} />
                                <h3>{t('scheduling.engine_panel_title')}</h3>
                            </div>
                            <span className="engine-version">v2.4</span>
                        </div>

                        {/* Engine Status ── */}
                        <div className={`engine-status status-${genState}`}>
                            <div className="status-indicator">
                                {genState === 'running' && <span className="pulse-ring" />}
                                <div className="status-dot" />
                            </div>
                            <div className="status-text">
                                <strong>
                                    {genState === 'idle' && t('scheduling.engine_idle')}
                                    {genState === 'running' && t('scheduling.engine_running')}
                                    {genState === 'done' && t('scheduling.engine_done')}
                                    {genState === 'error' && t('scheduling.engine_error')}
                                </strong>
                                <span>
                                    {genState === 'idle' && t('scheduling.engine_idle_desc')}
                                    {genState === 'running' && `${t('scheduling.engine_running_desc')} ${progress}%`}
                                    {genState === 'done' && t('scheduling.engine_done_desc')}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar ── */}
                        {(genState === 'running' || genState === 'done') && (
                            <div className="progress-wrap">
                                <div className="progress-bar-track">
                                    <div
                                        className={`progress-bar-fill ${genState === 'done' ? 'done' : ''}`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="progress-meta">
                                    <span>{progress}%</span>
                                    {conflictsFound > 0 && (
                                        <span className="conflict-chip">
                                            <AlertTriangle size={11} />
                                            {conflictsFound} {t('scheduling.conflicts_found')}
                                            {resolvedConflicts > 0 && ` → ${resolvedConflicts} ${t('scheduling.conflicts_resolved')}`}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons ── */}
                        <div className="engine-actions">
                            {genState === 'idle' || genState === 'done' ? (
                                <button
                                    className="btn-generate"
                                    onClick={startGeneration}
                                >
                                    <Play size={16} />
                                    {genState === 'done' ? t('scheduling.btn_regenerate') : t('scheduling.btn_generate')}
                                </button>
                            ) : (
                                <button className="btn-generate running" disabled>
                                    <Loader size={16} className="spin" />
                                    {t('scheduling.btn_running')}
                                </button>
                            )}
                            {(genState !== 'idle') && (
                                <button className="btn-reset" onClick={resetGeneration}>
                                    <RotateCcw size={15} />
                                    {t('scheduling.btn_reset')}
                                </button>
                            )}
                        </div>

                        {/* Success Banner ── */}
                        {genState === 'done' && (
                            <div className="success-banner">
                                <CheckCircle size={20} />
                                <div>
                                    <strong>{t('scheduling.gen_success_title')}</strong>
                                    <span>{t('scheduling.gen_success_desc')}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Constraints Card ── */}
                    <div className="panel-card constraints-card">
                        <div className="panel-header">
                            <div className="panel-title">
                                <Shield size={18} />
                                <h3>{t('scheduling.constraints_title')}</h3>
                            </div>
                            <span className="constraints-tag">{CONSTRAINTS.length} {t('scheduling.constraints_active')}</span>
                        </div>
                        <div className="constraints-list">
                            {CONSTRAINTS.map((c) => (
                                <div key={c.id} className={`constraint-item color-${c.color}`}>
                                    <div className={`constraint-icon color-${c.color}`}>
                                        <c.icon size={16} />
                                    </div>
                                    <div className="constraint-body">
                                        <div className="constraint-top">
                                            <span className="constraint-title">{t(c.titleKey)}</span>
                                            <StatusBadge status={c.status} />
                                        </div>
                                        <span className="constraint-desc">{t(c.descKey)}</span>
                                    </div>
                                    <ChevronRight size={14} className="constraint-arrow" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══ RIGHT: Steps + Log ═══ */}
                <div className="right-panel">

                    {/* ── Generation Steps ── */}
                    <div className="panel-card steps-card">
                        <div className="panel-header">
                            <div className="panel-title">
                                <TrendingUp size={18} />
                                <h3>{t('scheduling.gen_steps_title')}</h3>
                            </div>
                        </div>
                        <div className="steps-list">
                            {GENERATION_STEPS.map((step, idx) => {
                                const isCompleted = completedSteps.includes(idx);
                                const isActive = currentStep === idx;
                                const isPending = !isCompleted && !isActive;
                                return (
                                    <div
                                        key={step.id}
                                        className={`step-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${isPending ? 'pending' : ''}`}
                                    >
                                        <div className="step-indicator">
                                            {isCompleted ? (
                                                <CheckCircle size={18} />
                                            ) : isActive ? (
                                                <Loader size={18} className="spin" />
                                            ) : (
                                                <span className="step-num">{idx + 1}</span>
                                            )}
                                        </div>
                                        <div className="step-body">
                                            <span className="step-label">{t(step.labelKey)}</span>
                                            {isActive && (
                                                <div className="step-progress-track">
                                                    <div className="step-progress-fill" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Engine Log ── */}
                    <div className="panel-card log-card">
                        <div className="panel-header">
                            <div className="panel-title">
                                <Cpu size={16} />
                                <h3>{t('scheduling.engine_log_title')}</h3>
                            </div>
                            {logLines.length > 0 && (
                                <button className="log-clear-btn" onClick={() => setLogLines([])}>
                                    {t('scheduling.log_clear')}
                                </button>
                            )}
                        </div>
                        <div className="engine-log" ref={logRef}>
                            {logLines.length === 0 ? (
                                <div className="log-empty">
                                    <Cpu size={24} />
                                    <span>{t('scheduling.log_empty')}</span>
                                </div>
                            ) : (
                                logLines.map((line) => (
                                    <div key={line.id} className={`log-line log-${line.type}`}>
                                        <span className="log-time">
                                            {new Date().toLocaleTimeString('ar-u-nu-latn', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </span>
                                        <span className="log-text">{line.text}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
