
import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Button, IconButton } from '../components/common/Button/Button';
import { Badge } from '../components/common/Badge/Badge';
import { TaskCard, StatCard, MetricCard } from '../components/common/Card/Card';
import { DataTable } from '../components/common/Table/DataTable';
import { Tabs } from '../components/common/Tabs/Tabs';
import { InputField, SelectField, TextArea, DatePicker } from '../components/common/Form/Form';
import { ViewSwitcher } from '../components/common/ViewSwitcher/ViewSwitcher';
import { AdvancedFilters, FilterField } from '../components/common/Filters/AdvancedFilters';
import {
    Eye, Edit, Trash2, Plus, X, MousePointer,
    Grid, Calendar, HelpCircle, Filter, Tag, CheckCircle, AlertCircle
} from 'react-feather';

export const Showcase = () => {
    const { success, error, info } = useToast();
    const [view, setView] = useState('cards');

    // Mock Data
    const tasks = [
        { id: 1, title: 'مهمة نموذجية 1', status: 'completed', priority: 'low', date: '25 يناير 2026' },
        { id: 2, title: 'مهمة نموذجية 2', status: 'inprogress', priority: 'medium', date: '26 يناير 2026' },
        { id: 3, title: 'مهمة نموذجية 3', status: 'pending', priority: 'high', date: '27 يناير 2026' },
    ];

    const columns = [
        {
            header: 'العنوان',
            accessor: 'title',
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', background: row.status === 'completed' ? '#10b981' : row.status === 'inprogress' ? '#f59e0b' : '#ef4444', borderRadius: '50%' }}></div>
                    <span style={{ fontWeight: 600 }}>{row.title}</span>
                </div>
            )
        },
        {
            header: 'الحالة',
            render: (row) => <Badge variant={`status-${row.status}`}>{row.status}</Badge>
        },
        {
            header: 'الأولوية',
            render: (row) => <Badge variant={`priority-${row.priority}`}>{row.priority}</Badge>
        },
        { header: 'التاريخ', accessor: 'date' },
        {
            header: 'الإجراءات',
            render: () => (
                <div style={{ display: 'flex', gap: '6px' }}>
                    <IconButton onClick={() => info('عرض التفاصيل')}><Eye size={16} /></IconButton>
                    <IconButton onClick={() => success('تم التعديل')}><Edit size={16} /></IconButton>
                    <IconButton onClick={() => error('تم الحذف')} color="danger"><Trash2 size={16} /></IconButton>
                </div>
            )
        }
    ];

    return (
        <div className="component-showcase">

            {/* Buttons */}
            <section className="showcase-section">
                <h2 className="section-title"><MousePointer size={20} className="ml-2" /> الأزرار (Buttons)</h2>
                <div className="component-grid">
                    <div className="component-card">
                        <h3 className="component-title">الزر الأساسي</h3>
                        <Button onClick={() => success('تمت العملية بنجاح')}>
                            <Plus size={16} className="ml-2" /> إضافة جديد
                        </Button>
                    </div>
                    <div className="component-card">
                        <h3 className="component-title">الزر الثانوي</h3>
                        <Button variant="secondary" onClick={() => info('تم الإلغاء')}>
                            <X size={16} className="ml-2" /> إلغاء
                        </Button>
                    </div>
                </div>
            </section>

            {/* Cards */}
            <section className="showcase-section">
                <h2 className="section-title"><Grid size={20} className="ml-2" /> البطاقات (Cards)</h2>
                <div className="component-grid">
                    <TaskCard
                        title="مهمة نموذجية للعرض"
                        description="هذا نص تجريبي لوصف المهمة."
                        date="27 يناير 2026"
                        user="أحمد محمد"
                        priority="high"
                        status="pending"
                        onView={() => info('View Task')}
                        onEdit={() => success('Edit Task')}
                    />
                    <StatCard
                        label="إجمالي المهام"
                        value="42"
                        icon={CheckCircle}
                        badges={[
                            { label: 'مكتملة: 28', variant: 'success' },
                            { label: 'نشطة: 14', variant: 'warning' }
                        ]}
                    />
                    <MetricCard
                        label="معدل الإنجاز"
                        value="87%"
                        icon={AlertCircle}
                        trend="up"
                        trendValue="+5%"
                        style={{ borderLeft: '4px solid #10b981' }}
                    />
                </div>
            </section>

            {/* Forms */}
            <section className="showcase-section">
                <h2 className="section-title"><Edit size={20} className="ml-2" /> عناصر النماذج (Form Elements)</h2>
                <div className="form-showcase">
                    <InputField id="demo-input" label="حقل إدخال نصي" placeholder="أدخل النص هنا..." />
                    <SelectField id="demo-select" label="قائمة منسدلة">
                        <option>اختر خياراً</option>
                        <option>الخيار الأول</option>
                    </SelectField>
                    <TextArea id="demo-textarea" label="منطقة نص" placeholder="أدخل وصفاً مفصلاً..." />
                    <DatePicker id="demo-date" label="تاريخ" />
                </div>
            </section>

            {/* Tabs */}
            <section className="showcase-section">
                <h2 className="section-title"><Filter size={20} className="ml-2" /> التبويبات (Tabs)</h2>
                <Tabs tabs={[
                    { id: 'tasks', label: 'المهام', icon: 'fa-tasks', content: <p>محتوى المهام</p> },
                    { id: 'instructions', label: 'التعليمات', icon: 'fa-bullhorn', content: <p>محتوى التعليمات</p> },
                    { id: 'admins', label: 'المسؤولون', icon: 'fa-users', content: <p>محتوى المسؤولون</p> }
                ]} />
            </section>

            {/* Table */}
            <section className="showcase-section">
                <h2 className="section-title"><Grid size={20} className="ml-2" /> الجداول (Tables)</h2>
                <DataTable columns={columns} data={tasks} />
            </section>

            {/* Filters */}
            <section className="showcase-section">
                <h2 className="section-title"><Filter size={20} className="ml-2" /> الفلاتر المتقدمة (Filters)</h2>
                <AdvancedFilters
                    activeFilters={[
                        { id: 1, label: 'مكتملة', icon: CheckCircle, color: '#10b981' },
                        { id: 2, label: 'أولوية عالية', icon: AlertCircle, color: '#ef4444' }
                    ]}
                    onRemoveFilter={(id) => info(`Remove filter ${id}`)}
                    onReset={() => info('Reset filters')}
                >
                    <FilterField label="الحالة">
                        <SelectField id="f-status" className="mb-0">
                            <option>الكل</option>
                            <option>مكتملة</option>
                        </SelectField>
                    </FilterField>
                    <FilterField label="الأولوية">
                        <SelectField id="f-prio" className="mb-0">
                            <option>الكل</option>
                            <option>عالية</option>
                        </SelectField>
                    </FilterField>
                    <FilterField label="البحث">
                        <InputField id="f-search" placeholder="ابحث..." className="mb-0" />
                    </FilterField>
                </AdvancedFilters>
            </section>

            {/* View Switcher and Badges */}
            <section className="showcase-section">
                <div className="flex gap-6 flex-wrap">
                    <div>
                        <h2 className="section-title"><Eye size={20} className="ml-2" /> العرض (View)</h2>
                        <ViewSwitcher view={view} onChange={setView} />
                    </div>
                    <div>
                        <h2 className="section-title"><Tag size={20} className="ml-2" /> الشارات (Badges)</h2>
                        <div className="flex gap-2 flex-wrap">
                            <Badge variant="status-completed">مكتملة</Badge>
                            <Badge variant="priority-critical">حرجة</Badge>
                            <Badge variant="success">نجاح</Badge>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};
