import React, { useState, useMemo } from "react";
import {
  Archive,
  Send,
  Inbox,
  FileText,
  Download,
  Filter,
  Search,
  X,
  Calendar,
  ChevronDown,
  Printer,
  Maximize,
  Hash,
  BarChart2,
  Eye,
} from "react-feather";
import { useTranslation } from "../../context/LanguageContext";
import "./MailArchive.scss";

// ─── Unified mock data ────────────────────────────────────────────────────────
const MOCK_ENTRIES = [
  {
    id: 1,
    archiveNumber: "001",
    type: "outgoing",
    date: "2026-02-15",
    counterpart: "متوسطة الفضيلة",
    object: "إرسال ملف التلميذ — أحمد بن علي، فاطمة الزهراء حمدي",
    pieces: 4,
    reference: "—",
    observations: "ملف كامل",
  },
  {
    id: 2,
    archiveNumber: "002",
    type: "outgoing",
    date: "2026-02-20",
    counterpart: "مديرية التربية",
    object: "وثيقة إدارية",
    pieces: 2,
    reference: "—",
    observations: "",
  },
  {
    id: 3,
    archiveNumber: "W-001",
    type: "incoming",
    date: "2026-02-10",
    counterpart: "مديرية التربية لولاية الجزائر",
    object: "تعليمة تنظيم الامتحانات الفصلية",
    pieces: 1,
    reference: "م/ت/2026/142",
    observations: "",
  },
  {
    id: 4,
    archiveNumber: "W-002",
    type: "incoming",
    date: "2026-02-18",
    counterpart: "متوسطة ابن خلدون",
    object: "ملف التلميذ يوسف بلقاسم للتسجيل",
    pieces: 5,
    reference: "—",
    observations: "ملف كامل",
  },
  {
    id: 5,
    archiveNumber: "003",
    type: "outgoing",
    date: "2026-02-25",
    counterpart: "ثانوية الأمير عبد القادر",
    object: "إرسال ملف التلميذ — محمد الأمين قاسمي",
    pieces: 3,
    reference: "—",
    observations: "",
  },
];

// ─── Stats Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="stat-card" style={{ "--stat-color": color }}>
    <div className="stat-icon">
      <Icon size={18} />
    </div>
    <div className="stat-info">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  </div>
);

// ─── PDF Generation ───────────────────────────────────────────────────────────
const generateDispatchPDF = (entries, t, language) => {
  const isRtl = language === "ar";
  const dir = isRtl ? "rtl" : "ltr";
  const textAlign = isRtl ? "right" : "left";
  const oppositeAlign = isRtl ? "left" : "right";

  const rows = entries
    .map(
      (e) => `
        <tr>
            <td>${e.archiveNumber}</td>
            <td>${e.date}</td>
            <td style="text-align:${textAlign}">${e.counterpart}</td>
            <td style="text-align:${textAlign}">${e.object}</td>
            <td>${e.pieces}</td>
            <td>${e.reference}</td>
            <td>${e.observations || "—"}</td>
        </tr>
    `,
    )
    .join("");

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
        <html dir="${dir}">
          <head>
            <title>${t("mail.dispatch_schedule")}</title>
            <style>
              * { margin:0; padding:0; box-sizing:border-box; }
              body { font-family: "Arial", sans-serif; padding: 30px; color: #1e293b; }
              .doc-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:30px; }
              .school-info h1 { font-size:18px; font-weight:900; color:#1e293b; }
              .school-info p { font-size:12px; color:#64748b; margin-top:4px; }
              .doc-title { text-align:center; }
              .doc-title h2 { font-size:20px; font-weight:900; color:#1e293b; text-decoration:underline; }
              .doc-title p { font-size:12px; color:#64748b; margin-top:4px; }
              table { width:100%; border-collapse:collapse; margin-top:20px; font-size:12px; }
              th { background:#1e293b; color:white; padding:10px 12px; text-align:${textAlign}; font-weight:700; font-size:11px; }
              td { padding:9px 12px; border-bottom:1px solid #e2e8f0; }
              tr:nth-child(even) td { background: #f8fafc; }
              .footer { margin-top:30px; text-align:${oppositeAlign}; font-size:11px; color:#64748b; }
              .stamp-area { margin-top:60px; display:flex; justify-content:space-between; }
              .stamp { text-align:center; }
              .stamp p { font-size:11px; font-weight:700; color:#1e293b; }
              .stamp .line { margin:30px auto 0; width:160px; border-top:1px solid #1e293b; }
              @media print { body { padding:15px; } }
            </style>
          </head>
          <body onload="window.print()">
            <div class="doc-header">
              <div class="school-info">
                <h1>${t("mail.school_name")}</h1>
                <p>المؤسسة التعليمية الخاصة — الجزائر</p>
              </div>
              <div class="doc-title">
                <h2>${t("mail.dispatch_schedule")}</h2>
                <p>TABLEAU D'ENVOI ET DE RÉCEPTION</p>
                <p>${t("mail.school_year")} 2025/2026</p>
              </div>
              <div class="school-info" style="text-align:${oppositeAlign}">
                <p>${t("mail.generated_on")} ${new Date().toLocaleDateString("ar-DZ")}</p>
                <p>${t("mail.total_entries")} ${entries.length}</p>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>${t("mail.archive_number")}</th>
                  <th>${t("mail.date")}</th>
                  <th>${t("mail.sender")} / ${t("mail.recipient")}</th>
                  <th>${t("mail.object")}</th>
                  <th>${t("mail.pieces_short")}</th>
                  <th>${t("mail.reference")}</th>
                  <th>${t("mail.observations")}</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
            <div class="stamp-area">
              <div class="stamp">
                <p>توقيع المسؤول</p>
                <div class="line"></div>
              </div>
              <div class="stamp">
                <p>ختم المؤسسة</p>
                <div class="line"></div>
              </div>
            </div>
            <div class="footer">
              <p>وثيقة رسمية — مدرسة الفضيلة الخاصة</p>
            </div>
          </body>
        </html>
    `);
  printWindow.document.close();
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const MailArchive = () => {
  const { t, language } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all"); // all | outgoing | incoming
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_ENTRIES.filter((e) => {
      if (activeFilter !== "all" && e.type !== activeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !e.counterpart.includes(searchQuery) &&
          !e.object.includes(searchQuery) &&
          !e.archiveNumber.toLowerCase().includes(q) &&
          !e.reference.toLowerCase().includes(q)
        )
          return false;
      }
      if (dateFrom && e.date < dateFrom) return false;
      if (dateTo && e.date > dateTo) return false;
      return true;
    });
  }, [activeFilter, searchQuery, dateFrom, dateTo]);

  const outCount = MOCK_ENTRIES.filter((e) => e.type === "outgoing").length;
  const inCount = MOCK_ENTRIES.filter((e) => e.type === "incoming").length;
  const totalPieces = MOCK_ENTRIES.reduce((s, e) => s + e.pieces, 0);

  return (
    <div className="mail-archive-page">
      {/* ── Header ── */}
      <div className="page-header">
        <div className="header-left">
          <div className="header-icon-wrapper archive">
            <Archive size={22} />
          </div>
          <div>
            <h1>{t("mail.title_archive")}</h1>
            <p>{t("mail.subtitle_archive")}</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="btn-secondary"
            onClick={() => generateDispatchPDF(filtered, t, language)}
          >
            <Download size={15} />
            {t("mail.print_dispatch")}
          </button>
          <button className="btn-secondary" onClick={() => window.print()}>
            <Printer size={15} />
            {t("mail.print_register")}
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="stats-row">
        <StatCard
          icon={BarChart2}
          label={t("mail.stats_total")}
          value={MOCK_ENTRIES.length}
          color="#3b82f6"
        />
        <StatCard
          icon={Send}
          label={t("mail.stats_out")}
          value={outCount}
          color="#6366f1"
        />
        <StatCard
          icon={Inbox}
          label={t("mail.stats_in")}
          value={inCount}
          color="#8b5cf6"
        />
        <StatCard
          icon={FileText}
          label={t("mail.total_pieces")}
          value={totalPieces}
          color="#10b981"
        />
      </div>

      {/* ── Filter Bar ── */}
      <div className="filter-bar">
        <div className="type-tabs">
          {[
            { id: "all", label: t("mail.filter_all"), icon: Archive },
            { id: "outgoing", label: t("mail.filter_out"), icon: Send },
            { id: "incoming", label: t("mail.filter_in"), icon: Inbox },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-btn ${activeFilter === tab.id ? "active" : ""}`}
                onClick={() => setActiveFilter(tab.id)}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="filter-controls">
          <div className="search-box">
            <Search size={15} />
            <input
              type="text"
              placeholder={t("mail.search_archive")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
              >
                <X size={13} />
              </button>
            )}
          </div>
          <button
            className={`btn-filter ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={14} />
            {t("mail.search_archive") /* Adjust wording if needed */}
            <ChevronDown
              size={12}
              style={{
                transform: showFilters ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>
      </div>

      {/* ── Date Filters ── */}
      {showFilters && (
        <div className="date-filter-panel">
          <div className="date-filter-field">
            <label>
              <Calendar size={13} /> من تاريخ
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="date-filter-field">
            <label>
              <Calendar size={13} /> إلى تاريخ
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <button
            className="btn-clear-filters"
            onClick={() => {
              setDateFrom("");
              setDateTo("");
              setSearchQuery("");
              setActiveFilter("all");
            }}
          >
            <X size={13} />
            إعادة ضبط
          </button>
        </div>
      )}

      {/* ── Unified Ledger Table ── */}
      <div className="archive-table-card">
        <div className="archive-table-header">
          <div className="archive-table-title">
            <Archive size={16} />
            <span>{t("mail.title_archive")}</span>
          </div>
          <span className="result-count">{filtered.length} نتيجة</span>
        </div>
        <div className="archive-table-wrapper">
          <table className="archive-table">
            <thead>
              <tr>
                <th>{t("mail.archive_number")}</th>
                <th>{t("mail.type")}</th>
                <th>{t("mail.date")}</th>
                <th>
                  {t("mail.sender")} / {t("mail.recipient")}
                </th>
                <th>{t("mail.object")}</th>
                <th>{t("mail.pieces")}</th>
                <th>{t("mail.reference")}</th>
                <th>{t("mail.observations")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-row">
                    <Archive size={32} />
                    <p>{t("mail.no_entries")}</p>
                  </td>
                </tr>
              ) : (
                filtered.map((entry, idx) => (
                  <tr key={entry.id} className={idx % 2 === 1 ? "row-alt" : ""}>
                    <td>
                      <span className={`archive-badge ${entry.type}`}>
                        {entry.archiveNumber}
                      </span>
                    </td>
                    <td>
                      <span className={`direction-badge ${entry.type}`}>
                        {entry.type === "outgoing" ? (
                          <>
                            <Send size={12} /> {t("mail.stats_out")}
                          </>
                        ) : (
                          <>
                            <Inbox size={12} /> {t("mail.stats_in")}
                          </>
                        )}
                      </span>
                    </td>
                    <td className="cell-date">{entry.date}</td>
                    <td className="cell-entity">{entry.counterpart}</td>
                    <td className="cell-object">{entry.object}</td>
                    <td>
                      <span className="pieces-badge">{entry.pieces}</span>
                    </td>
                    <td className="cell-ref">{entry.reference}</td>
                    <td className="cell-obs">{entry.observations || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="archive-table-footer">
          <span>
            {t("mail.total_entries").replace(":", "")}{" "}
            <strong>{filtered.length}</strong> /{" "}
            <strong>{MOCK_ENTRIES.length}</strong>
          </span>
          <span>
            {t("mail.total_pieces")}{" "}
            <strong>{filtered.reduce((s, e) => s + e.pieces, 0)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
