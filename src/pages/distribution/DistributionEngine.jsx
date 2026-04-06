import React, { useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { Cpu, Users, Settings, UserCheck, AlertTriangle } from 'react-feather';
import './DistributionEngine.scss';

export const DistributionEngine = () => {
    const { t } = useTranslation();
    const [algoRunning, setAlgoRunning] = useState(false);
    const [algoProgress, setAlgoProgress] = useState(0);

    const runDistributionEngine = () => {
        setAlgoRunning(true);
        setAlgoProgress(0);

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setAlgoProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => setAlgoRunning(false), 500);
            }
        }, 300);
    };

    return (
        <div className="tab-pane distribution-engine fade-in">
            <div className="engine-header">
                <div className="engine-info">
                    <h3>{t('dist.engine_title')}</h3>
                    <p>{t('dist.engine_desc')}</p>
                </div>
                <button
                    className={`btn-primary engine-btn ${algoRunning ? 'running' : ''}`}
                    onClick={runDistributionEngine}
                    disabled={algoRunning}
                >
                    <Cpu size={18} />
                    {algoRunning ? t('dist.btn_processing') : t('dist.btn_start_dist')}
                </button>
            </div>

            {algoRunning && (
                <div className="engine-progress">
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${algoProgress}%` }}></div>
                    </div>
                    <div className="progress-status">
                        {algoProgress < 30 ? t('dist.prog_parsing') :
                            algoProgress < 60 ? t('dist.prog_balancing') :
                                algoProgress < 90 ? t('dist.prog_age') : t('dist.prog_done')}
                    </div>
                </div>
            )}

            <div className="engine-criteria-grid">
                <div className="criteria-card">
                    <div className="c-icon gender"><Users size={20} /></div>
                    <h4>{t('dist.crit_gender')}</h4>
                    <p>{t('dist.crit_gender_desc')}</p>
                    <div className="demo-bar">
                        <div className="male-part" style={{ width: '50%' }}>50%</div>
                        <div className="female-part" style={{ width: '50%' }}>50%</div>
                    </div>
                </div>
                <div className="criteria-card">
                    <div className="c-icon level"><Settings size={20} /></div>
                    <h4>{t('dist.crit_academic')}</h4>
                    <p>{t('dist.crit_academic_desc')}</p>
                </div>
                <div className="criteria-card">
                    <div className="c-icon age"><UserCheck size={20} /></div>
                    <h4>{t('dist.crit_age')}</h4>
                    <p>{t('dist.crit_age_desc')}</p>
                </div>
                <div className="criteria-card">
                    <div className="c-icon capacity"><AlertTriangle size={20} /></div>
                    <h4>{t('dist.crit_capacity')}</h4>
                    <p>{t('dist.crit_capacity_desc')}</p>
                </div>
            </div>
        </div>
    );
};
