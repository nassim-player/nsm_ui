import React, { useState, useEffect, useCallback } from 'react';
import {
    Users, Clock, CheckCircle, AlertCircle, TrendingUp,
    MapPin, Phone, Loader, Lock, Unlock, AlertTriangle,
    PlusCircle, RefreshCw, Radio
} from 'react-feather';
import { useTranslation } from '../../context/LanguageContext';
import './GateMonitor.scss';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_ARRIVALS = [
    {
        id: 'arr-001',
        parentName: 'فريدة بن عمر',
        phone: '0550-123-456',
        avatar: 'ف',
        avatarColor: '#8b5cf6',
        students: [
            { name: 'آدم بن عمر', class: 'الفصل 4ب', location: 'قاعة الانتظار', locationKey: 'waiting' },
        ],
        status: 'approaching',   // approaching | at_gate | confirmed
        etaSeconds: 180,
        arrivalTime: null,
    },
    {
        id: 'arr-002',
        parentName: 'كريم مصطفى',
        phone: '0661-789-012',
        avatar: 'ك',
        avatarColor: '#10b981',
        students: [
            { name: 'ياسمين مصطفى', class: 'الفصل 2أ', location: 'الفصل 2أ', locationKey: 'class' },
            { name: 'بلال مصطفى', class: 'الفصل 5ج', location: 'قاعة الانتظار', locationKey: 'waiting' },
        ],
        status: 'at_gate',
        etaSeconds: 0,
        arrivalTime: '13:38',
    },
    {
        id: 'arr-003',
        parentName: 'سميرة لعمري',
        phone: '0770-345-678',
        avatar: 'س',
        avatarColor: '#f59e0b',
        students: [
            { name: 'لينا لعمري', class: 'الفصل 1ج', location: 'الفصل 1ج', locationKey: 'class' },
        ],
        status: 'approaching',
        etaSeconds: 420,
        arrivalTime: null,
    },
    {
        id: 'arr-004',
        parentName: 'محمد الغزالي',
        phone: '0555-901-234',
        avatar: 'م',
        avatarColor: '#ef4444',
        students: [
            { name: 'حمزة الغزالي', class: 'الفصل 3أ', location: 'قاعة الانتظار', locationKey: 'waiting' },
        ],
        status: 'at_gate',
        etaSeconds: 0,
        arrivalTime: '13:42',
    },
];

const STATS = {
    totalPresent: 247,
    readyForPickup: 18,
    dismissed: 89,
    pendingSignal: 4,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatEta = (seconds) => {
    if (seconds <= 0) return 'وصل';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}د ${s}ث` : `${s}ث`;
};

const LOCATION_ICONS = {
    class: { icon: '📚', label: 'الفصل الدراسي', color: '#3b82f6' },
    waiting: { icon: '🏛️', label: 'قاعة الانتظار', color: '#f59e0b' },
    gate: { icon: '🚪', label: 'البوابة', color: '#10b981' },
};

const StatusBadge = ({ status }) => {
    const { t } = useTranslation();
    const config = {
        approaching: { label: t('safe_exit.approaching') || 'في الطريق', className: 'badge-approaching' },
        at_gate: { label: t('safe_exit.at_gate') || 'عند البوابة', className: 'badge-gate' },
        confirmed: { label: t('safe_exit.confirmed') || 'تم التسليم', className: 'badge-confirmed' },
    };
    const c = config[status] || config.approaching;
    return <span className={`exit-badge ${c.className}`}>{c.label}</span>;
};

// ─── Arrival Card ─────────────────────────────────────────────────────────────

const ArrivalCard = ({ entry, isLockdown, onConfirm }) => {
    const { t } = useTranslation();
    const [eta, setEta] = useState(entry.etaSeconds);
    const isApproaching = entry.status === 'approaching';
    const isAtGate = entry.status === 'at_gate';

    useEffect(() => {
        if (!isApproaching || eta <= 0) return;
        const timer = setInterval(() => setEta(prev => Math.max(0, prev - 1)), 1000);
        return () => clearInterval(timer);
    }, [isApproaching, eta]);

    return (
        <div className={`arrival-card status-${entry.status}`}>
            {/* Pulsing urgency indicator */}
            {isAtGate && <div className="urgency-pulse" />}

            <div className="arrival-card__header">
                <div className="parent-avatar" style={{ background: entry.avatarColor }}>
                    {entry.avatar}
                </div>
                <div className="parent-info">
                    <h3 className="parent-name">{entry.parentName}</h3>
                    <span className="parent-phone">
                        <Phone size={12} />
                        {entry.phone}
                    </span>
                </div>
                <div className="arrival-card__status-col">
                    <StatusBadge status={entry.status} />
                    {isApproaching && (
                        <div className="eta-timer">
                            <Clock size={13} />
                            <span>{formatEta(eta)}</span>
                        </div>
                    )}
                    {isAtGate && (
                        <div className="arrival-time">
                            <CheckCircle size={13} />
                            <span>{t('safe_exit.arrived_at') || 'وصل'} {entry.arrivalTime}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="arrival-card__students">
                {entry.students.map((s, i) => {
                    const loc = LOCATION_ICONS[s.locationKey] || LOCATION_ICONS.class;
                    return (
                        <div className="student-chip" key={i}>
                            <div className="student-chip__icon" style={{ color: loc.color }}>
                                {loc.icon}
                            </div>
                            <div className="student-chip__info">
                                <span className="student-chip__name">{s.name}</span>
                                <span className="student-chip__loc" style={{ color: loc.color }}>
                                    <MapPin size={10} />
                                    {s.location}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isAtGate && (
                <div className="arrival-card__actions">
                    <button
                        className={`btn-verify ${isLockdown ? 'btn-verify--locked' : ''}`}
                        onClick={() => !isLockdown && onConfirm(entry)}
                        disabled={isLockdown}
                    >
                        {isLockdown ? (
                            <><Lock size={15} /> {t('safe_exit.locked') || 'مُقفل'}</>
                        ) : (
                            <><CheckCircle size={15} /> {t('safe_exit.confirm_pickup') || 'تأكيد التسليم'}</>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

// ─── Bento Stats ──────────────────────────────────────────────────────────────

const BentoStats = ({ stats, isLockdown }) => {
    const { t } = useTranslation();
    return (
        <div className="bento-grid">
            <div className="bento-card bento-card--primary">
                <div className="bento-card__icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
                    <Users size={24} />
                </div>
                <div className="bento-card__value">{stats.totalPresent}</div>
                <div className="bento-card__label">{t('safe_exit.students_in_building') || 'طلاب في المبنى'}</div>
                <div className="bento-card__sub">
                    <TrendingUp size={12} />
                    <span>{t('safe_exit.current_status') || 'الوضع الراهن'}</span>
                </div>
            </div>

            <div className="bento-card bento-card--warning">
                <div className="bento-card__icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                    <Clock size={24} />
                </div>
                <div className="bento-card__value">{stats.readyForPickup}</div>
                <div className="bento-card__label">{t('safe_exit.ready_for_pickup') || 'جاهزون للاستلام'}</div>
                <div className="bento-card__sub">
                    <MapPin size={12} />
                    <span>{t('safe_exit.at_gate_sub') || 'بالبوابة'}</span>
                </div>
            </div>

            <div className="bento-card bento-card--success">
                <div className="bento-card__icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                    <CheckCircle size={24} />
                </div>
                <div className="bento-card__value">{stats.dismissed}</div>
                <div className="bento-card__label">{t('safe_exit.left_school') || 'غادروا المدرسة'}</div>
                <div className="bento-card__sub">
                    <CheckCircle size={12} />
                    <span>{t('safe_exit.confirmed') || 'تم التأكيد'}</span>
                </div>
            </div>

            <div className="bento-card bento-card--danger">
                <div className="bento-card__icon" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                    <Radio size={24} />
                </div>
                <div className="bento-card__value">{stats.pendingSignal}</div>
                <div className="bento-card__label">{t('safe_exit.im_near_signal') || 'إشارة "أنا قريب"'}</div>
                <div className="bento-card__sub">
                    <AlertCircle size={12} />
                    <span>{t('safe_exit.waiting_prep') || 'بانتظار التحضير'}</span>
                </div>
            </div>

            {/* Lockdown Status card */}
            <div className={`bento-card bento-card--lockdown ${isLockdown ? 'is-active' : ''}`}>
                <div className="bento-card__icon" style={{
                    background: isLockdown ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.12)',
                    color: isLockdown ? '#ef4444' : '#10b981'
                }}>
                    {isLockdown ? <Lock size={24} /> : <Unlock size={24} />}
                </div>
                <div className="bento-card__value" style={{ color: isLockdown ? '#ef4444' : '#10b981' }}>
                    {isLockdown ? (t('safe_exit.locked') || 'مُقفل') : (t('safe_exit.unlocked') || 'مفتوح')}
                </div>
                <div className="bento-card__label">{t('safe_exit.gate_status') || 'حالة البوابة'}</div>
            </div>
        </div>
    )
};

// ─── Manual Entry Modal ───────────────────────────────────────────────────────

const ManualEntryModal = ({ isOpen, onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [form, setForm] = useState({ parentName: '', studentName: '', reason: '' });

    if (!isOpen) return null;
    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const handleSubmit = e => {
        e.preventDefault();
        onSubmit(form);
        setForm({ parentName: '', studentName: '', reason: '' });
        onClose();
    };

    return (
        <div className="exit-modal-overlay" onClick={onClose}>
            <div className="exit-modal" onClick={e => e.stopPropagation()}>
                <div className="exit-modal__header">
                    <div className="exit-modal__icon">
                        <PlusCircle size={20} />
                    </div>
                    <div>
                        <h3>{t('safe_exit.manual_entry_title') || 'تسجيل يدوي'}</h3>
                        <p>{t('safe_exit.manual_entry_desc') || 'أضف طلب استلام يدوياً (هاتف معطل / زيارة مباشرة)'}</p>
                    </div>
                    <button className="exit-modal__close" onClick={onClose}>✕</button>
                </div>
                <form className="exit-modal__body" onSubmit={handleSubmit}>
                    <div className="exit-form-group">
                        <label>{t('safe_exit.parent_name') || 'اسم ولي الأمر'}</label>
                        <input name="parentName" value={form.parentName} onChange={handleChange} required placeholder="الاسم الكامل..." />
                    </div>
                    <div className="exit-form-group">
                        <label>{t('safe_exit.student_name') || 'اسم الطالب'}</label>
                        <input name="studentName" value={form.studentName} onChange={handleChange} required placeholder="اسم التلميذ..." />
                    </div>
                    <div className="exit-form-group">
                        <label>{t('common.notes') || 'ملاحظة'}</label>
                        <textarea name="reason" value={form.reason} onChange={handleChange} placeholder="سبب التسجيل اليدوي..." rows={3} />
                    </div>
                    <div className="exit-modal__footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>{t('common.cancel') || 'إلغاء'}</button>
                        <button type="submit" className="btn-submit">{t('safe_exit.submit_request') || 'تسجيل الطلب'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const GateMonitor = () => {
    const { t } = useTranslation();
    const [arrivals, setArrivals] = useState(INITIAL_ARRIVALS);
    const [stats, setStats] = useState(STATS);
    const [isLockdown, setIsLockdown] = useState(false);
    const [showManualModal, setShowManualModal] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [ledger, setLedger] = useState([]);
    const [ledgerSearch, setLedgerSearch] = useState('');

    // Simulate live: every 15s a new "approaching" signal arrives
    useEffect(() => {
        const simulateSignal = setInterval(() => {
            const newEntry = {
                id: `arr-sim-${Date.now()}`,
                parentName: 'أحمد بن صالح',
                phone: '0661-000-111',
                avatar: 'أ',
                avatarColor: '#6366f1',
                students: [{ name: 'نور بن صالح', class: 'الفصل 3ب', location: 'الفصل 3ب', locationKey: 'class' }],
                status: 'approaching',
                etaSeconds: 300,
                arrivalTime: null,
            };
            setArrivals(prev => {
                // keep only max 6 cards
                const filtered = prev.filter(a => a.id !== newEntry.id);
                return [newEntry, ...filtered].slice(0, 6);
            });
            setLastUpdate(new Date());
        }, 20000);
        return () => clearInterval(simulateSignal);
    }, []);

    const handleConfirm = useCallback((entry) => {
        const timestamp = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });
        const newLedgerEntry = {
            id: `ledger-${Date.now()}`,
            studentName: entry.students.map(s => s.name).join('، '),
            parentName: entry.parentName,
            timestamp,
            type: 'تأكيد',
        };
        setLedger(prev => [newLedgerEntry, ...prev]);
        setArrivals(prev => prev.map(a => a.id === entry.id ? { ...a, status: 'confirmed' } : a));
        setStats(prev => ({
            ...prev,
            dismissed: prev.dismissed + entry.students.length,
            readyForPickup: Math.max(0, prev.readyForPickup - entry.students.length),
        }));
    }, []);

    const handleManualEntry = useCallback((form) => {
        const timestamp = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });
        setLedger(prev => [{
            id: `ledger-manual-${Date.now()}`,
            studentName: form.studentName,
            parentName: form.parentName,
            timestamp,
            type: 'يدوي',
        }, ...prev]);
    }, []);

    const toggleLockdown = () => setIsLockdown(prev => !prev);

    const activeArrivals = arrivals.filter(a => a.status !== 'confirmed');
    const filteredLedger = ledger.filter(e =>
        e.studentName.includes(ledgerSearch) || e.parentName.includes(ledgerSearch)
    );

    return (
        <div className="gate-monitor fade-in">
            {/* Lockdown Banner */}
            {isLockdown && (
                <div className="lockdown-banner">
                    <AlertTriangle size={20} />
                    <span>{t('safe_exit.lockdown_active') || '⚠️ وضع الإغلاق الطارئ مُفعَّل — تم تعطيل جميع تأكيدات الخروج'}</span>
                    <button onClick={toggleLockdown}>{t('safe_exit.cancel_lockdown') || 'إلغاء الإغلاق'}</button>
                </div>
            )}

            {/* Page Header */}
            <div className="gate-monitor__header">
                <div className="gate-monitor__title-group">
                    <div className="gate-monitor__live-dot" />
                    <div>
                        <h1>{t('safe_exit.monitor_title') || 'شاشة البوابة المركزية'}</h1>
                        <p className="gate-monitor__subtitle">
                            {t('safe_exit.last_update') || 'آخر تحديث'}: {lastUpdate.toLocaleTimeString('ar-DZ')} — {t('safe_exit.monitor_subtitle') || 'مراقبة الخروج في الوقت الحقيقي'}
                        </p>
                    </div>
                </div>
                <div className="gate-monitor__controls">
                    <button className="ctrl-btn" onClick={() => setLastUpdate(new Date())}>
                        <RefreshCw size={16} /> {t('safe_exit.refresh') || 'تحديث'}
                    </button>
                    <button className="ctrl-btn ctrl-btn--secondary" onClick={() => setShowManualModal(true)}>
                        <PlusCircle size={16} /> {t('safe_exit.manual_entry') || 'تسجيل يدوي'}
                    </button>
                    <button
                        className={`ctrl-btn ctrl-btn--lockdown ${isLockdown ? 'is-active' : ''}`}
                        onClick={toggleLockdown}
                    >
                        {isLockdown ? <><Unlock size={16} /> {t('safe_exit.unlock_gate') || 'فتح البوابة'}</> : <><Lock size={16} /> {t('safe_exit.lockdown_emergency') || 'إغلاق طارئ'}</>}
                    </button>
                </div>
            </div>

            {/* Body: Feed (left) + Bento (right) */}
            <div className="gate-monitor__body">
                {/* Live Arrival Feed */}
                <section className="arrival-feed">
                    <div className="section-title-row">
                        <h2 className="section-title">
                            <span className="pulse-dot" />
                            {t('safe_exit.live_arrival_feed') || 'تغذية الوصول الحي'}
                        </h2>
                        <span className="feed-count">{activeArrivals.length} {t('safe_exit.waiting') || 'في الانتظار'}</span>
                    </div>

                    <div className="arrival-list">
                        {activeArrivals.length === 0 ? (
                            <div className="empty-feed">
                                <CheckCircle size={40} color="var(--color-success)" />
                                <p>{t('safe_exit.no_active_signals') || 'لا توجد إشارات وصول نشطة'}</p>
                            </div>
                        ) : (
                            activeArrivals.map(entry => (
                                <ArrivalCard
                                    key={entry.id}
                                    entry={entry}
                                    isLockdown={isLockdown}
                                    onConfirm={handleConfirm}
                                />
                            ))
                        )}
                    </div>
                </section>

                {/* Right column: Bento + Ledger */}
                <aside className="gate-monitor__aside">
                    <BentoStats stats={stats} isLockdown={isLockdown} />

                    {/* Safe-Exit Ledger */}
                    <div className="ledger-panel">
                        <div className="ledger-panel__header">
                            <h3>{t('safe_exit.safe_exit_ledger') || 'سجل الخروج الآمن'}</h3>
                            <span className="ledger-count">{ledger.length} {t('safe_exit.records') || 'سجل'}</span>
                        </div>
                        <div className="ledger-search-wrap">
                            <input
                                className="ledger-search"
                                placeholder={t('safe_exit.search_ledger') || "ابحث في سجل اليوم..."}
                                value={ledgerSearch}
                                onChange={e => setLedgerSearch(e.target.value)}
                            />
                        </div>
                        <div className="ledger-list">
                            {filteredLedger.length === 0 ? (
                                <p className="ledger-empty">{t('safe_exit.no_records_yet') || 'لا توجد سجلات بعد'}</p>
                            ) : (
                                filteredLedger.map(entry => (
                                    <div className="ledger-item" key={entry.id}>
                                        <div className="ledger-item__badge"
                                            style={{
                                                background: entry.type === 'يدوي' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                                                color: entry.type === 'يدوي' ? '#f59e0b' : '#10b981',
                                            }}>
                                            {entry.type}
                                        </div>
                                        <div className="ledger-item__info">
                                            <span className="ledger-item__student">{entry.studentName}</span>
                                            <span className="ledger-item__parent">— {entry.parentName}</span>
                                        </div>
                                        <div className="ledger-item__time">{entry.timestamp}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </aside>
            </div>

            <ManualEntryModal
                isOpen={showManualModal}
                onClose={() => setShowManualModal(false)}
                onSubmit={handleManualEntry}
            />
        </div>
    );
};
