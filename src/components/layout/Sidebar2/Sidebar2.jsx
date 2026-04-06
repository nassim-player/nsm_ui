import React, { useState } from "react";
import { useTranslation } from "../../../context/LanguageContext";
import { NavLink } from "react-router-dom";
import "./Sidebar2.scss";
import PropTypes from "prop-types";
import {
    Grid,
    Calendar,
    LogOut,
    Users,
    Book,
    Layout,
    Clock,
    UserPlus,
    MessageSquare,
    Mail,
    Home,
    Briefcase,
    Shield,
    Cpu,
    Layers,
} from "react-feather";

// ─── Color themes per group ──────────────────────────────────────────────────
const GROUP_COLORS = {
    core: { bg: "rgba(59,130,246,0.12)", icon: "#3b82f6", active: "#2563eb" },
    people: { bg: "rgba(16,185,129,0.12)", icon: "#10b981", active: "#059669" },
    academic: { bg: "rgba(245,158,11,0.12)", icon: "#f59e0b", active: "#d97706" },
    comms: { bg: "rgba(139,92,246,0.12)", icon: "#8b5cf6", active: "#7c3aed" },
};

const buildNavConfig = (t) => ({
    Director: [
        {
            id: "core",
            groupLabel: t("nav.group_core") || "الرئيسية",
            items: [
                { href: "/", icon: Grid, label: t("nav.dashboard") },
            ],
        },
        {
            id: "people",
            groupLabel: t("nav.group_people") || "الأفراد",
            items: [
                { href: "/teachers", icon: Users, label: t("nav.teachers") },
                { href: "/students", icon: Briefcase, label: t("nav.students") },
                { href: "/registration", icon: UserPlus, label: t("nav.registration") },
                { href: "/distribution", icon: Layers, label: t("nav.distribution") || "التوزيع على الأقسام" },
            ],
        },
        {
            id: "academic",
            groupLabel: t("nav.group_academic") || "الدراسة",
            items: [
                { href: "/academic", icon: Book, label: t("nav.academic") },
                { href: "/reception", icon: Clock, label: t("nav.reception") },
                { href: "/safe-exit", icon: Shield, label: t("nav.safe_exit") || "بوابة الخروج الآمن" },
                { href: "/scheduling", icon: Cpu, label: t("nav.scheduling") || "الجداول الذكية" },
            ],
        },
        {
            id: "comms",
            groupLabel: t("nav.group_comms") || "العمليات",
            items: [
                { href: "/hub", icon: Calendar, label: t("nav.hub") || "التقويم والإعلانات" },
                { href: "/complaints", icon: MessageSquare, label: t("nav.complaints") || "الشكاوي" },
                { href: "/mail", icon: Mail, label: t("mail.nav_outgoing") || "البريد الإداري" },
            ],
        },
    ],
    HR_Manager: [
        {
            id: "core",
            groupLabel: t("nav.dashboard") || "الرئيسية",
            items: [{ href: "/", icon: Grid, label: t("nav.dashboard") }],
        },
        {
            id: "people",
            groupLabel: t("nav.hr") || "الموارد البشرية",
            items: [
                { href: "/employees", icon: Users, label: t("nav.employees") },
                { href: "/structure", icon: Layout, label: t("nav.structure") },
                { href: "/attendance", icon: Clock, label: t("nav.attendance") },
            ],
        },
    ],
    Default: [
        {
            id: "core",
            groupLabel: t("nav.main") || "الرئيسية",
            items: [{ href: "/", icon: Home, label: t("nav.main") }],
        },
    ],
});

// ─── Single nav item ─────────────────────────────────────────────────────────
const SidebarItem = ({ item, color }) => (
    <NavLink
        to={item.href}
        end={item.href === "/"}
        className={({ isActive }) => `s2-item ${isActive ? "s2-item--active" : ""}`}
        title={item.label}
        style={{ "--item-color": color.icon, "--item-active": color.active, "--item-bg": color.bg }}
    >
        <div className="s2-icon-pill">
            <item.icon size={19} />
        </div>
        <span className="s2-label">{item.label}</span>
    </NavLink>
);

SidebarItem.propTypes = {
    item: PropTypes.object.isRequired,
    color: PropTypes.object.isRequired,
};

// ─── Main component ───────────────────────────────────────────────────────────
export const Sidebar2 = ({ role = "Director", onLogout, className = "" }) => {
    const { t } = useTranslation();
    const navConfig = buildNavConfig(t);
    const navGroups = navConfig[role] || navConfig["Default"];

    const handleLogout = (e) => {
        e.preventDefault();
        if (onLogout) onLogout();
    };

    const logoPath =
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%233b82f6"/%3E%3Ctext x="50" y="65" font-size="40" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold"%3EEF%3C/text%3E%3C/svg%3E';

    return (
        <div id="sidebar2" className={`s2-root ${className}`}>

            {/* ── Logo ── */}
            <div className="s2-logo">
                <div className="s2-logo-pill">
                    <img src={logoPath} alt="EL FADILA" className="s2-logo-img" />
                </div>
                <div className="s2-logo-text">
                    <span className="s2-logo-name">EL FADILA</span>
                    <span className="s2-logo-sub">نظام الإدارة</span>
                </div>
            </div>

            {/* ── Groups ── */}
            <nav className="s2-nav">
                {navGroups.map((group, gi) => {
                    const color = GROUP_COLORS[group.id] || GROUP_COLORS.core;
                    return (
                        <div key={group.id} className="s2-group">
                            {/* Section label */}
                            <div
                                className="s2-group-label"
                                style={{ "--grp-color": color.icon }}
                            >
                                <span className="s2-group-dot" />
                                <span className="s2-group-text">{group.groupLabel}</span>
                            </div>

                            {/* Items */}
                            <div className="s2-group-items">
                                {group.items.map((item, idx) => (
                                    <SidebarItem key={idx} item={item} color={color} />
                                ))}
                            </div>

                            {/* Divider between groups */}
                            {gi < navGroups.length - 1 && <div className="s2-divider" />}
                        </div>
                    );
                })}
            </nav>

            {/* ── Footer / Logout ── */}
            <div className="s2-footer">
                <div className="s2-divider" />
                <a
                    href="#"
                    className="s2-item s2-logout"
                    onClick={handleLogout}
                    title={t("nav.logout")}
                    style={{ "--item-color": "#ef4444", "--item-active": "#dc2626", "--item-bg": "rgba(239,68,68,0.1)" }}
                >
                    <div className="s2-icon-pill">
                        <LogOut size={19} />
                    </div>
                    <span className="s2-label">{t("nav.logout")}</span>
                </a>
            </div>
        </div>
    );
};

Sidebar2.propTypes = {
    role: PropTypes.string,
    onLogout: PropTypes.func,
    className: PropTypes.string,
};
