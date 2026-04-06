import React, { useState } from "react";
import { useTranslation } from "../../../context/LanguageContext";
import { NavLink } from "react-router-dom";
import "./Sidebar.scss";
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
  ChevronDown,
  Home,
  Briefcase,
  Cpu,
} from "react-feather";

// Navigation config factory — call inside component for fresh translations
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
      groupLabel: t("nav.group_people") || "إدارة الأفراد",
      items: [
        { href: "/teachers", icon: Users, label: t("nav.teachers") },
        { href: "/students", icon: Briefcase, label: t("nav.students") },
        { href: "/registration", icon: UserPlus, label: t("nav.registration") },
      ],
    },
    {
      id: "academic",
      groupLabel: t("nav.group_academic") || "الجانب الأكاديمي",
      items: [
        { href: "/academic", icon: Book, label: t("nav.academic") },
        { href: "/reception", icon: Clock, label: t("nav.reception") },
        { href: "/scheduling", icon: Cpu, label: t("nav.scheduling") || "الجداول الذكية" },
      ],
    },
    {
      id: "comms",
      groupLabel: t("nav.group_comms") || "التواصل والعمليات",
      items: [
        {
          href: "/hub",
          icon: Calendar,
          label: t("nav.hub") || "التقويم والإعلانات",
        },
        {
          href: "/complaints",
          icon: MessageSquare,
          label: t("nav.complaints") || "الشكاوي والاقتراحات",
        },
        {
          href: "/mail",
          icon: Mail,
          label: t("mail.nav_outgoing") || "الوثائق والبريد",
        },
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
      id: "hr",
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

export const Sidebar = ({ role = "Director", onLogout, className = "" }) => {
  const { t } = useTranslation();
  const navConfig = buildNavConfig(t);
  const navGroups = navConfig[role] || navConfig["Default"];

  // Track which groups are open; default: all open
  const [openGroups, setOpenGroups] = useState(() =>
    navGroups.reduce((acc, g) => ({ ...acc, [g.id]: true }), {})
  );

  const toggleGroup = (id) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleLogout = (e) => {
    e.preventDefault();
    if (onLogout) onLogout();
  };

  const logoPath =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%233b82f6"/%3E%3Ctext x="50" y="65" font-size="40" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold"%3EEF%3C/text%3E%3C/svg%3E';

  return (
    <div id="collapsibleSidebar" className={`sidebar ${className}`}>
      {/* ── Logo ── */}
      <div className="sidebar-logo-section">
        <div className="logo-row">
          <div className="logo-container">
            <img src={logoPath} alt="EL FADILA" className="logo-img" />
          </div>
          <div className="school-info">
            <h1 className="school-title">EL FADILA</h1>
            <p className="school-subtitle">نظام إدارة المدرسة</p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.id} className="nav-group">
            {/* Group header — clickable to collapse/expand */}
            <button
              className="nav-group-header"
              onClick={() => toggleGroup(group.id)}
              title={group.groupLabel}
            >
              <span className="nav-group-label">{group.groupLabel}</span>
              <ChevronDown
                size={15}
                className={`nav-group-chevron ${openGroups[group.id] ? "open" : ""}`}
              />
            </button>

            {/* Group items */}
            <div
              className={`nav-group-items ${openGroups[group.id] ? "items-open" : "items-closed"}`}
            >
              {group.items.map((item, idx) => (
                <NavLink
                  key={idx}
                  to={item.href}
                  end={item.href === "/"}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "nav-active" : ""}`
                  }
                  title={item.label}
                >
                  <div className="nav-icon-wrapper">
                    <item.icon size={20} />
                  </div>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer / Logout ── */}
      <div className="sidebar-footer">
        <div className="nav-divider" />
        <a
          href="#"
          className="nav-item logout-item"
          onClick={handleLogout}
          data-action="logout"
          title={t("nav.logout")}
        >
          <div className="nav-icon-wrapper">
            <LogOut size={20} />
          </div>
          <span className="nav-label">{t("nav.logout")}</span>
        </a>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  role: PropTypes.string,
  onLogout: PropTypes.func,
  className: PropTypes.string,
};
