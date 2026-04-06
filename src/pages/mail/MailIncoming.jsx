import React, { useState } from "react";
import {
  Inbox,
  Plus,
  Printer,
  FileText,
  Hash,
  ChevronDown,
  Check,
  X,
  Package,
  Calendar,
  Trash2,
  Maximize,
  AlertCircle,
  Layers,
  BookOpen,
  Briefcase,
} from "react-feather";
import QRCode from "qrcode";
import { useTranslation } from "../../context/LanguageContext";
import "./MailIncoming.scss";

// ─── Constants ────────────────────────────────────────────────────────────────
const SOURCE_SUGGESTIONS = [
  "مديرية التربية لولاية الجزائر",
  "مديرية التربية لولاية وهران",
  "وزارة التربية الوطنية",
  "مديرية الديوان الوطني للامتحانات",
  "مفتشية التعليم الابتدائي",
  "ابتدائية النصر",
  "متوسطة ابن خلدون",
  "ثانوية الأمير عبد القادر",
  "ثانوية فضيلة",
  "الديوان الوطني للتعليم والتكوين",
];

const INSTRUCTION_TYPES = [
  {
    id: "directive",
    labelKey: "inst_directive",
    icon: BookOpen,
    color: "#8b5cf6",
  },
  {
    id: "student_file",
    labelKey: "inst_student_file",
    icon: FileText,
    color: "#3b82f6",
  },
  { id: "package", labelKey: "inst_package", icon: Package, color: "#f59e0b" },
  {
    id: "official",
    labelKey: "inst_official",
    icon: Briefcase,
    color: "#10b981",
  },
  { id: "other", labelKey: "obj_other", icon: Layers, color: "#64748b" },
];

const generateArchiveNumber = (entries) => {
  const num = entries.length + 1;
  return `W-${String(num).padStart(3, "0")}`;
};

const generateQRDataURL = async (data) => {
  try {
    return await QRCode.toDataURL(JSON.stringify(data), {
      width: 200,
      margin: 2,
      color: { dark: "#1e293b", light: "#ffffff" },
    });
  } catch {
    return null;
  }
};

// ─── QR Print Modal ──────────────────────────────────────────────────────────
const QRModal = ({ entry, onClose }) => {
  const { t, language } = useTranslation();
  const isRtl = language === "ar";
  const dir = isRtl ? "rtl" : "ltr";
  const [qrDataUrl, setQrDataUrl] = useState(null);

  React.useEffect(() => {
    if (entry) {
      generateQRDataURL({
        id: entry.id,
        archiveNumber: entry.archiveNumber,
        type: "ARRIVÉE",
        source: entry.source,
        arrivalDate: entry.arrivalDate,
        instructionType: entry.instructionType,
      }).then(setQrDataUrl);
    }
  }, [entry]);

  if (!entry) return null;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
            <html dir="${dir}">
              <head>
                <title>QR - ${t("mail.qr_label_in")} ${entry.archiveNumber}</title>
                <style>
                  body { font-family: Arial, sans-serif; display:flex; justify-content:center; align-items:center; min-height:100vh; margin:0; background:#f8fafc; }
                  .sticker { border: 2px solid #1e293b; border-radius:12px; padding:20px; width:240px; text-align:center; background:white; }
                  .sticker h3 { font-size:13px; margin:0 0 4px 0; color:#1e293b; }
                  .sticker .num { font-size:20px; font-weight:900; color:#8b5cf6; margin:4px 0; }
                  .sticker p { font-size:11px; color:#64748b; margin:2px 0; }
                  .sticker img { margin:10px auto; display:block; }
                  .sticker .label { font-size:10px; background:#f5f3ff; color:#8b5cf6; padding:3px 8px; border-radius:20px; display:inline-block; margin-top:4px; }
                </style>
              </head>
              <body onload="window.print()">
                <div class="sticker">
                  <h3>${t("mail.qr_label_in")}</h3>
                  <div class="num">${entry.archiveNumber}</div>
                  <img src="${qrDataUrl}" width="160" />
                  <p>${entry.source}</p>
                  <p>${entry.arrivalDate}</p>
                  <div class="label">${t("mail.school_name")}</div>
                </div>
              </body>
            </html>
        `);
    printWindow.document.close();
  };

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qr-modal-header">
          <div className="qr-modal-title">
            <Maximize size={18} />
            <span>
              {t("mail.qr_modal_title") || "ملصق QR —"} {entry.archiveNumber}
            </span>
          </div>
          <button className="qr-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="qr-modal-body">
          <div className="qr-sticker-preview incoming">
            <p className="sticker-label">{t("mail.qr_label_in")}</p>
            <div className="sticker-number">{entry.archiveNumber}</div>
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code" className="qr-img" />
            ) : (
              <div className="qr-loading">{t("mail.generating")}</div>
            )}
            <p className="sticker-dest">{entry.source}</p>
            <p className="sticker-date">{entry.arrivalDate}</p>
            <span className="sticker-school">{t("mail.school_name")}</span>
          </div>
        </div>
        <div className="qr-modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            {t("mail.close") || "إغلاق"}
          </button>
          <button className="btn-print" onClick={handlePrint}>
            <Printer size={15} />
            {t("mail.print_sticker") || "طباعة الملصق"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const MailIncoming = () => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState([
    {
      id: 1,
      archiveNumber: "W-001",
      arrivalDate: "2026-02-10",
      originalDate: "2026-02-08",
      source: "مديرية التربية لولاية الجزائر",
      instructionType: "directive",
      reference: "م/ت/2026/142",
      object: "تعليمة تنظيم الامتحانات الفصلية",
      pieces: 1,
      observations: "",
    },
    {
      id: 2,
      archiveNumber: "W-002",
      arrivalDate: "2026-02-18",
      originalDate: "2026-02-15",
      source: "متوسطة ابن خلدون",
      instructionType: "student_file",
      reference: "—",
      object: "ملف التلميذ يوسف بلقاسم للتسجيل",
      pieces: 5,
      observations: "ملف كامل",
    },
  ]);

  const [form, setForm] = useState({
    arrivalDate: new Date().toISOString().split("T")[0],
    originalDate: "",
    source: "",
    instructionType: "directive",
    reference: "",
    object: "",
    pieces: 1,
    observations: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [sourceSearch, setSourceSearch] = useState("");
  const [sourceDrop, setSourceDrop] = useState(false);
  const [qrEntry, setQrEntry] = useState(null);
  const [successFlash, setSuccessFlash] = useState(false);

  const filteredSources = SOURCE_SUGGESTIONS.filter(
    (s) =>
      s.includes(sourceSearch) ||
      s.toLowerCase().includes(sourceSearch.toLowerCase()),
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.source.trim() || !form.object.trim()) return;

    const newEntry = {
      id: Date.now(),
      archiveNumber: generateArchiveNumber(entries),
      ...form,
    };

    setEntries((prev) => [...prev, newEntry]);
    setForm({
      arrivalDate: new Date().toISOString().split("T")[0],
      originalDate: "",
      source: "",
      instructionType: "directive",
      reference: "",
      object: "",
      pieces: 1,
      observations: "",
    });
    setSourceSearch("");
    setShowModal(false);
    setSuccessFlash(true);
    setTimeout(() => setSuccessFlash(false), 3000);
  };

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const getTypeInfo = (typeId) =>
    INSTRUCTION_TYPES.find((t) => t.id === typeId) || INSTRUCTION_TYPES[4];

  return (
    <div className="mail-incoming-page">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="header-left">
          <div className="header-icon-wrapper incoming">
            <Inbox size={22} />
          </div>
          <div>
            <h1>{t("mail.title_incoming")}</h1>
            <p>{t("mail.subtitle_incoming")}</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="btn-primary incoming"
            onClick={() => setShowModal(true)}
          >
            <Plus size={15} />
            {t("mail.add_incoming")}
          </button>
          <button className="btn-secondary" onClick={() => window.print()}>
            <Printer size={15} />
            {t("mail.print_register")}
          </button>
          <div className="entries-counter incoming">
            <Hash size={14} />
            <span>
              {t("mail.entries_count").replace("{count}", entries.length)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Success Flash ── */}
      {successFlash && (
        <div className="success-flash">
          <Check size={16} />
          {t("mail.success_incoming")}
        </div>
      )}

      {/* ── Instruction Type Selector ── */}
      <div className="type-cards-row">
        {INSTRUCTION_TYPES.map((type) => {
          const Icon = type.icon;
          const isActive = form.instructionType === type.id;
          return (
            <button
              key={type.id}
              className={`type-card ${isActive ? "active" : ""}`}
              style={{ "--type-color": type.color }}
              onClick={() =>
                setForm((f) => ({ ...f, instructionType: type.id }))
              }
            >
              <div className="type-icon">
                <Icon size={18} />
              </div>
              <span>{t(`mail.${type.labelKey}`)}</span>
              {isActive && <Check size={14} className="type-check" />}
            </button>
          );
        })}
      </div>

      {/* ── Entry Form Modal ── */}
      {showModal && (
        <div className="add-modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="add-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="form-card modal-variant">
              <div className="form-card-header">
                <div className="form-card-title">
                  <Plus size={18} />
                  <span>{t("mail.add_incoming")}</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div className="auto-number-display incoming">
                    <Hash size={14} />
                    <span>{t("mail.next_number")}</span>
                    <strong>{generateArchiveNumber(entries)}</strong>
                  </div>
                  <button
                    type="button"
                    className="btn-close-modal"
                    onClick={() => setShowModal(false)}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="incoming-form">
                <div className="form-grid">
                  {/* Arrival Date */}
                  <div className="form-field">
                    <label>
                      <Calendar size={14} />
                      {t("mail.date_arrival")}
                    </label>
                    <input
                      type="date"
                      className="field-input"
                      value={form.arrivalDate}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, arrivalDate: e.target.value }))
                      }
                      required
                    />
                  </div>

                  {/* Original Date */}
                  <div className="form-field">
                    <label>
                      <Calendar size={14} />
                      {t("mail.date_original")}
                    </label>
                    <input
                      type="date"
                      className="field-input"
                      value={form.originalDate}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, originalDate: e.target.value }))
                      }
                    />
                  </div>

                  {/* Source */}
                  <div className="form-field field-wide">
                    <label>
                      <Inbox size={14} />
                      {t("mail.source")}
                    </label>
                    <div className="search-field-wrapper">
                      <input
                        type="text"
                        className="field-input"
                        placeholder={t("mail.search_entity")}
                        value={form.source || sourceSearch}
                        onChange={(e) => {
                          setSourceSearch(e.target.value);
                          setForm((f) => ({ ...f, source: e.target.value }));
                          setSourceDrop(true);
                        }}
                        onFocus={() => setSourceDrop(true)}
                        onBlur={() =>
                          setTimeout(() => setSourceDrop(false), 200)
                        }
                        required
                      />
                      {sourceDrop && filteredSources.length > 0 && (
                        <ul className="search-dropdown">
                          {filteredSources.map((s, i) => (
                            <li
                              key={i}
                              onMouseDown={() => {
                                setForm((f) => ({ ...f, source: s }));
                                setSourceSearch(s);
                                setSourceDrop(false);
                              }}
                            >
                              <Inbox size={12} />
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Reference */}
                  <div className="form-field">
                    <label>
                      <Hash size={14} />
                      {t("mail.reference")}
                    </label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="مثال: م/ت/2026/142"
                      value={form.reference}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, reference: e.target.value }))
                      }
                    />
                  </div>

                  {/* Object */}
                  <div className="form-field span-two">
                    <label>
                      <FileText size={14} />
                      {t("mail.object_incoming")}
                    </label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder={t("mail.object_placeholder")}
                      value={form.object}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, object: e.target.value }))
                      }
                      required
                    />
                  </div>

                  {/* Pieces */}
                  <div className="form-field">
                    <label>
                      <Package size={14} />
                      {t("mail.pieces")}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      className="field-input"
                      value={form.pieces}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          pieces: parseInt(e.target.value) || 1,
                        }))
                      }
                    />
                  </div>

                  {/* Observations */}
                  <div className="form-field span-full">
                    <label>
                      <AlertCircle size={14} />
                      {t("mail.observations")}
                    </label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder={t("mail.obs_placeholder")}
                      value={form.observations}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, observations: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="form-footer">
                  <div className="form-hint">
                    <AlertCircle size={13} />
                    {t("mail.auto_number_hint")}
                  </div>
                  <button type="submit" className="btn-submit incoming">
                    <Plus size={16} />
                    {t("mail.save_incoming")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Ledger Table ── */}
      <div className="ledger-card">
        <div className="ledger-header">
          <div className="ledger-title">
            <Inbox size={18} />
            <span>{t("mail.title_incoming")}</span>
          </div>
          <span className="ledger-year">{t("mail.school_year")} 2025/2026</span>
        </div>
        <div className="ledger-table-wrapper">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>{t("mail.archive_number")}</th>
                <th>{t("mail.date_arrival")}</th>
                <th>{t("mail.date_original")}</th>
                <th>{t("mail.source")}</th>
                <th>{t("mail.type")}</th>
                <th>{t("mail.object")}</th>
                <th>{t("mail.pieces")}</th>
                <th>{t("mail.observations")}</th>
                <th>{t("mail.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-row">
                    <Inbox size={32} />
                    <p>{t("mail.no_entries_in")}</p>
                  </td>
                </tr>
              ) : (
                entries.map((entry, idx) => {
                  const typeInfo = getTypeInfo(entry.instructionType);
                  const TypeIcon = typeInfo.icon;
                  return (
                    <tr
                      key={entry.id}
                      className={idx % 2 === 1 ? "row-alt" : ""}
                    >
                      <td>
                        <span className="archive-badge incoming">
                          {entry.archiveNumber}
                        </span>
                      </td>
                      <td className="cell-date">{entry.arrivalDate}</td>
                      <td className="cell-date muted">
                        {entry.originalDate || "—"}
                      </td>
                      <td>
                        <div className="source-display">
                          <Inbox size={12} />
                          {entry.source}
                        </div>
                      </td>
                      <td>
                        <span
                          className="type-badge"
                          style={{ "--type-color": typeInfo.color }}
                        >
                          <TypeIcon size={11} />
                          {t(`mail.${typeInfo.labelKey}`)}
                        </span>
                      </td>
                      <td className="cell-object">{entry.object}</td>
                      <td>
                        <span className="pieces-badge">{entry.pieces}</span>
                      </td>
                      <td className="cell-obs">{entry.observations || "—"}</td>
                      <td>
                        <div className="cell-actions">
                          <button
                            className="action-btn qr-btn"
                            onClick={() => setQrEntry(entry)}
                            title={t("mail.print_qr") || "طباعة QR"}
                          >
                            <Maximize size={14} />
                          </button>
                          <button
                            className="action-btn del-btn"
                            onClick={() => handleDelete(entry.id)}
                            title={t("mail.delete") || "حذف"}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="ledger-footer">
          <span>
            {t("mail.total_entries")} <strong>{entries.length}</strong>
          </span>
          <span>
            {t("mail.pieces_short")}{" "}
            <strong>{entries.reduce((s, e) => s + e.pieces, 0)}</strong>
          </span>
        </div>
      </div>

      {qrEntry && <QRModal entry={qrEntry} onClose={() => setQrEntry(null)} />}
    </div>
  );
};
