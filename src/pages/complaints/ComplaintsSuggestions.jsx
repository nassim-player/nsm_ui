import React, { useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { Panel } from '../../components/common/Panel/Panel';
import { Modal } from '../../components/common/Modal/Modal';
import { DataTable } from '../../components/common/DataTable/DataTable';
import { AlertCircle, CheckCircle, Clock, Eye, Edit2, MessageSquare, User, Tag, Calendar, Shield, Activity, Send, Paperclip, ChevronRight, CornerDownLeft } from 'react-feather';
import './ComplaintsSuggestions.scss';

export const ComplaintsSuggestions = () => {
    const { t } = useTranslation();

    // Mock Data for Complaints
    const initialComplaints = [
        {
            id: 'C-1001',
            date: '2026-02-24',
            source: 'محمد محمود (ولي أمر)',
            category: 'behavioral',
            status: 'new',
            assignedTo: 'المراقب العام',
            description: 'السلوك غير مقبول تماماً في الساحة العامة اليوم من طرف بعض تلاميذ السنة الرابعة، أرجو اتخاذ الإجراءات اللازمة لضمان سلامة الأبناء.',
            urgency: 'high'
        },
        {
            id: 'C-1002',
            date: '2026-02-23',
            source: 'سارة خالد (تلميذة)',
            category: 'facilities',
            status: 'under_review',
            assignedTo: 'قسم الصيانة',
            description: 'هناك تسرب للمياه في دورة المياه بالدور الثالث بجانب القاعة رقم 12، يحتاج المعالجة قبل أن يسبب أضراراً كبيرة.',
            urgency: 'medium'
        },
        {
            id: 'C-1003',
            date: '2026-02-21',
            source: 'كمال حسن (أستاذ)',
            category: 'administrative',
            status: 'resolved',
            assignedTo: 'الإدارة',
            description: 'أقترح تحسين نظام توزيع الوجبات المدرسية لتفادي الازدحام في وقت الاستراحة.',
            urgency: 'low'
        }
    ];

    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const handleRowClick = (complaint) => {
        setSelectedComplaint(complaint);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'new': { label: 'جديد', className: 'badge-danger', icon: AlertCircle },
            'under_review': { label: 'قيد المراجعة', className: 'badge-warning', icon: Clock },
            'resolved': { label: 'محلول', className: 'badge-success', icon: CheckCircle }
        };
        const stat = statusMap[status] || statusMap['new'];
        const Icon = stat.icon;
        return (
            <span className={`dt-badge ${stat.className}`}>
                <Icon size={14} />
                {stat.label}
            </span>
        );
    };

    const getCategoryLabel = (cat) => {
        const cats = {
            'academic': 'بيداغوجي',
            'behavioral': 'سلوكي',
            'facilities': 'مرافق',
            'administrative': 'إداري',
            'suggestion': 'اقتراح'
        };
        return cats[cat] || cat;
    };

    const columns = [
        { key: 'id', label: 'رقم المرجع', width: 100, visible: true },
        { key: 'date', label: 'التاريخ', width: 120, visible: true },
        { key: 'source', label: 'المصدر (المعني)', width: 200, visible: true },
        {
            key: 'category',
            label: 'التصنيف',
            width: 150,
            visible: true,
            render: (val) => getCategoryLabel(val)
        },
        {
            key: 'status',
            label: 'الحالة',
            width: 150,
            visible: true,
            render: (val) => getStatusBadge(val)
        },
        { key: 'assignedTo', label: 'مُسند إلى', width: 150, visible: true },
        {
            key: 'actions',
            label: 'الإجراءات',
            width: 150,
            sortable: false,
            visible: true,
            render: (_, row) => (
                <div className="table-actions">
                    <button
                        className="btn-icon"
                        title="عرض التفاصيل"
                        onClick={(e) => { e.stopPropagation(); handleRowClick(row); }}
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        className="btn-icon warning"
                        title="تحديث الحالة"
                        onClick={(e) => { e.stopPropagation(); /* logic for status update */ }}
                    >
                        <Edit2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="complaints-suggestions-page fade-in">
            <div className="page-header">
                <div className="header-content">
                    <h1>{t?.('complaints.title') || 'وحدة الشكاوي والاقتراحات'}</h1>
                    <p>{t?.('complaints.subtitle') || 'إدارة ومتابعة الشكاوي والاقتراحات الخاصة بالمدرسة بشكل مركزي.'}</p>
                </div>
            </div>

            <div className="oversight-tab">
                <Panel title={t?.('complaints.oversight_table') || 'جدول متابعة الشكاوي والاقتراحات'}>
                    <DataTable
                        data={initialComplaints}
                        columns={columns}
                        storageKey="complaints_oversight_table"
                        searchPlaceholder="ابحث بالرقم، المصدر، أو القسم..."
                        onRowClick={handleRowClick}
                    />
                </Panel>
            </div>

            {/* Complaint Details Modal */}
            <Modal
                isOpen={!!selectedComplaint}
                onClose={() => setSelectedComplaint(null)}
                title={`نظرة شاملة على الشكوى: ${selectedComplaint?.id}`}
                icon={Shield}
                size="large"
            >
                {selectedComplaint && (
                    <div className="complaint-detail-view premium">
                        <div className="modal-top-banner">
                            <div className="urgency-indicator" data-urgency={selectedComplaint.urgency}>
                                <AlertCircle size={16} />
                                {selectedComplaint.urgency === 'high' ? 'أولوية قصوى' : selectedComplaint.urgency === 'medium' ? 'أولوية متوسطة' : 'أولوية عادية'}
                            </div>
                            <div className="status-current">
                                {getStatusBadge(selectedComplaint.status)}
                            </div>
                        </div>

                        <div className="main-layout-grid">
                            <div className="content-left">
                                <div className="detail-section">
                                    <h4 className="section-title"><MessageSquare size={18} /> موضوع الشكوى والبيانات</h4>
                                    <div className="detail-grid-v2">
                                        <div className="v2-card">
                                            <label><User size={14} /> صاحب الشكوى</label>
                                            <p>{selectedComplaint.source}</p>
                                        </div>
                                        <div className="v2-card">
                                            <label><Calendar size={14} /> تاريخ التقديم</label>
                                            <p>{selectedComplaint.date}</p>
                                        </div>
                                        <div className="v2-card">
                                            <label><Tag size={14} /> التصنيف الأساسي</label>
                                            <p>{getCategoryLabel(selectedComplaint.category)}</p>
                                        </div>
                                        <div className="v2-card">
                                            <label><Shield size={14} /> الكيان المسؤول</label>
                                            <p>{selectedComplaint.assignedTo}</p>
                                        </div>
                                    </div>

                                    <div className="description-area">
                                        <label>نص الرسالة / الشكوى</label>
                                        <div className="text-content">
                                            {selectedComplaint.description}
                                        </div>
                                    </div>

                                    <div className="internal-notes">
                                        <label className="secondary-label"><Edit2 size={14} /> ملاحظة داخلية (للمسؤولين فقط)</label>
                                        <textarea
                                            placeholder="أضف ملاحظة إدارية مخفية عن صاحب الشكوى..."
                                            rows="3"
                                        ></textarea>
                                        <button className="btn-save-note"><Send size={14} /> حفظ الملاحظة</button>
                                    </div>
                                </div>
                            </div>

                            <div className="content-right">
                                <div className="side-section">
                                    <h4 className="section-title"><Activity size={18} /> المسار الزمني</h4>
                                    <div className="complaint-timeline">
                                        <div className="timeline-step finished">
                                            <div className="step-marker"></div>
                                            <div className="step-info">
                                                <span className="step-date">24/02 - 08:30</span>
                                                <p>تم استلام الشكوى إلكترونياً</p>
                                            </div>
                                        </div>
                                        <div className="timeline-step active">
                                            <div className="step-marker"></div>
                                            <div className="step-info">
                                                <span className="step-date">24/02 - 10:15</span>
                                                <p>تم إسناد الملف إلى {selectedComplaint.assignedTo}</p>
                                            </div>
                                        </div>
                                        <div className="timeline-step pending">
                                            <div className="step-marker"></div>
                                            <div className="step-info">
                                                <p>بانتظار المراجعة والقرار النهائي</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="side-section actions">
                                    <h4 className="section-title"><CornerDownLeft size={18} /> تغيير الحالة فوراً</h4>
                                    <div className="quick-status-actions">
                                        <button className="status-opt review">
                                            <Clock size={16} /> تحويل للمراجعة
                                        </button>
                                        <button className="status-opt resolve">
                                            <CheckCircle size={16} /> تم الحل نهائياً
                                        </button>
                                        <button className="status-opt export">
                                            <Paperclip size={16} /> تصدير تقرير PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer-v2">
                            <button className="btn-close-v2" onClick={() => setSelectedComplaint(null)}>
                                إغلاق النافذة
                            </button>
                            <button className="btn-action-v2">
                                تحديث وحفظ التغييرات <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
