import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { SubNav } from '../components/common/SubNav/SubNav';
import { MessageSquare, List } from 'react-feather';

export const ComplaintsLayout = () => {
    const { t } = useTranslation();

    const complaintsLinks = [
        {
            to: '/complaints',
            icon: List,
            label: t?.('complaints.nav_oversight') || 'متابعة الشكاوي',
            exact: true
        },
        // We will separate the manual submission into its own page
        {
            to: '/complaints/new',
            icon: MessageSquare,
            label: t?.('complaints.nav_submission') || 'تسجيل شكوى جديدة'
        }
    ];

    return (
        <div className="complaints-layout">
            <SubNav links={complaintsLinks} />
            <div className="complaints-content">
                <Outlet />
            </div>
        </div>
    );
};
