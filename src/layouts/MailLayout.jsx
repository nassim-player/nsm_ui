import React from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";
import { SubNav } from "../components/common/SubNav/SubNav";
import { ArrowUpCircle, ArrowDownCircle, Archive } from "react-feather";
import "./MailLayout.scss";

export const MailLayout = () => {
  const { t } = useTranslation();

  const mailLinks = [
    {
      to: "/mail",
      icon: ArrowUpCircle,
      label: t("mail.nav_outgoing") || "سجل الصادر",
      exact: true,
    },
    {
      to: "/mail/incoming",
      icon: ArrowDownCircle,
      label: t("mail.nav_incoming") || "سجل الوارد",
    },
    {
      to: "/mail/archive",
      icon: Archive,
      label: t("mail.nav_archive") || "الأرشيف الموحد",
    },
  ];

  return (
    <div className="mail-layout">
      <SubNav links={mailLinks} />
      <div className="mail-content">
        <Outlet />
      </div>
    </div>
  );
};
