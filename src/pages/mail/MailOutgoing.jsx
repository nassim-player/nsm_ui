import React, { useState, useRef } from "react";
import {
  Send,
  Plus,
  Printer,
  FileText,
  User,
  Hash,
  ChevronDown,
  Check,
  X,
  Package,
  Search,
  AlertCircle,
  Calendar,
  Trash2,
  Maximize,
} from "react-feather";
import QRCode from "qrcode";
import { useTranslation } from "../../context/LanguageContext";
import "./MailOutgoing.scss";

// ─── Mock data for recipient suggestions ─────────────────────────────────────
const RECIPIENT_SUGGESTIONS = [
  "متوسطة الفضيلة",
  "متوسطة ابن خلدون",
  "ثانوية الأمير عبد القادر",
  "ثانوية فضيلة",
  "مديرية التربية لولاية الجزائر",
  "مديرية التربية لولاية وهران",
  "مفتشية التعليم الابتدائي",
  "إدارة التربية الوطنية",
  "مديرية الديوان الوطني للامتحانات",
  "ابتدائية النصر",
];

const STUDENT_POOL = [
  "أحمد بن علي",
  "فاطمة الزهراء حمدي",
  "يوسف بلقاسم",
  "مريم سعيدي",
  "عبد الرحمان تواتي",
  "خديجة مزياني",
  "إسلام بوطالب",
  "سارة عمراوي",
  "محمد الأمين قاسمي",
  "نور الهدى رحماني",
  "ياسمين بوزيد",
  "رضا برهومي",
];

// ─── Generating next archive number ──────────────────────────────────────────
const generateArchiveNumber = (entries) => {
  const num = entries.length + 1;
  return String(num).padStart(3, "0");
};

// ─── QR Code Generator ───────────────────────────────────────────────────────
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

// ─── Student Tag Component ────────────────────────────────────────────────────
const StudentTag = ({ name, onRemove }) => (
  <span className="student-tag">
    <User size={12} />
    {name}
    <button onClick={() => onRemove(name)} className="tag-remove">
      <X size={10} />
    </button>
  </span>
);

// ─── Entry Row in confirmation panel ─────────────────────────────────────────
const LedgerRow = ({ entry, onPrintQR, onDelete }) => {
  const { t } = useTranslation();
  return (
    <tr className="ledger-row">
      <td className="cell-num">
        <span className="archive-badge">{entry.archiveNumber}</span>
      </td>
      <td className="cell-date">{entry.date}</td>
      <td className="cell-recipient">
        <div className="recipient-display">
          <Send size={13} />
          {entry.recipient}
        </div>
      </td>
      <td className="cell-object">
        <div className="object-display">
          <span className="object-type-tag">{entry.objectType}</span>
          {entry.students && entry.students.length > 0 && (
            <div className="students-inline">
              {entry.students.map((s, i) => (
                <span key={i} className="student-inline-name">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </td>
      <td className="cell-pieces">
        <span className="pieces-badge">{entry.pieces}</span>
      </td>
      <td className="cell-obs">{entry.observations || "—"}</td>
      <td className="cell-actions">
        <button
          className="action-btn qr-btn"
          onClick={() => onPrintQR(entry)}
          title={t("mail.print_qr") || "طباعة QR"}
        >
          <Maximize size={15} />
        </button>
        <button
          className="action-btn del-btn"
          onClick={() => onDelete(entry.id)}
          title={t("mail.delete") || "حذف"}
        >
          <Trash2 size={15} />
        </button>
      </td>
    </tr>
  );
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
        type: "DÉPART",
        recipient: entry.recipient,
        date: entry.date,
        object: entry.objectType,
        students: entry.students,
      }).then(setQrDataUrl);
    }
  }, [entry]);

  if (!entry) return null;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
            <html dir="${dir}">
              <head>
                <title>QR - ${t("mail.qr_label_out")} ${entry.archiveNumber}</title>
                <style>
                  body { font-family: Arial, sans-serif; display:flex; justify-content:center; align-items:center; min-height:100vh; margin:0; background:#f8fafc; }
                  .sticker { border: 2px solid #1e293b; border-radius:12px; padding:20px; width:240px; text-align:center; background:white; }
                  .sticker h3 { font-size:13px; margin:0 0 4px 0; color:#1e293b; }
                  .sticker .num { font-size:22px; font-weight:900; color:#3b82f6; margin:4px 0; }
                  .sticker p { font-size:11px; color:#64748b; margin:2px 0; }
                  .sticker img { margin:10px auto; display:block; }
                  .sticker .label { font-size:10px; background:#eff6ff; color:#3b82f6; padding:3px 8px; border-radius:20px; display:inline-block; margin-top:4px; }
                </style>
              </head>
              <body onload="window.print()">
                <div class="sticker">
                  <h3>${t("mail.qr_label_out")}</h3>
                  <div class="num">#${entry.archiveNumber}</div>
                  <img src="${qrDataUrl}" width="160" />
                  <p>${entry.recipient}</p>
                  <p>${entry.date}</p>
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
          <div className="qr-sticker-preview">
            <p className="sticker-label">{t("mail.qr_label_out")}</p>
            <div className="sticker-number">#{entry.archiveNumber}</div>
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code" className="qr-img" />
            ) : (
              <div className="qr-loading">{t("mail.generating")}</div>
            )}
            <p className="sticker-dest">{entry.recipient}</p>
            <p className="sticker-date">{entry.date}</p>
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
export const MailOutgoing = () => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState([
    {
      id: 1,
      archiveNumber: "001",
      date: "2026-02-15",
      recipient: "متوسطة الفضيلة",
      objectType: t("mail.obj_student_file") || "إرسال ملف التلميذ",
      students: ["أحمد بن علي", "فاطمة الزهراء حمدي"],
      pieces: 4,
      observations: "ملف كامل",
    },
    {
      id: 2,
      archiveNumber: "002",
      date: "2026-02-20",
      recipient: "مديرية التربية",
      objectType: t("mail.obj_admin_doc_req") || "وثيقة إدارية",
      students: [],
      pieces: 2,
      observations: "",
    },
  ]);

  // Form state
  const [form, setForm] = useState({
    recipient: "",
    objectType: t("mail.obj_student_file") || "إرسال ملف التلميذ",
    students: [],
    pieces: 1,
    observations: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [showModal, setShowModal] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState("");
  const [recipientDropOpen, setRecipientDropOpen] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentDropOpen, setStudentDropOpen] = useState(false);
  const [qrEntry, setQrEntry] = useState(null);
  const [successFlash, setSuccessFlash] = useState(false);

  const recipientRef = useRef(null);
  const studentRef = useRef(null);

  const filteredRecipients = RECIPIENT_SUGGESTIONS.filter(
    (r) =>
      r.includes(recipientSearch) ||
      r.toLowerCase().includes(recipientSearch.toLowerCase()),
  );
  const filteredStudents = STUDENT_POOL.filter(
    (s) =>
      !form.students.includes(s) &&
      (s.includes(studentSearch) ||
        s.toLowerCase().includes(studentSearch.toLowerCase())),
  );

  const handleAddStudent = (name) => {
    setForm((f) => ({ ...f, students: [...f.students, name] }));
    setStudentSearch("");
    setStudentDropOpen(false);
  };

  const handleRemoveStudent = (name) => {
    setForm((f) => ({ ...f, students: f.students.filter((s) => s !== name) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.recipient.trim()) return;

    const newEntry = {
      id: Date.now(),
      archiveNumber: generateArchiveNumber(entries),
      date: form.date,
      recipient: form.recipient,
      objectType: form.objectType,
      students: [...form.students],
      pieces: form.pieces,
      observations: form.observations,
    };

    setEntries((prev) => [...prev, newEntry]);
    setForm({
      recipient: "",
      objectType: t("mail.obj_student_file") || "إرسال ملف التلميذ",
      students: [],
      pieces: 1,
      observations: "",
      date: new Date().toISOString().split("T")[0],
    });
    setRecipientSearch("");
    setShowModal(false);
    setSuccessFlash(true);
    setTimeout(() => setSuccessFlash(false), 3000);
  };

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="mail-outgoing-page">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="header-left">
          <div className="header-icon-wrapper outgoing">
            <Send size={22} />
          </div>
          <div>
            <h1>{t("mail.title_outgoing")}</h1>
            <p>{t("mail.subtitle_outgoing")}</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={15} />
            {t("mail.add_outgoing")}
          </button>
          <button className="btn-secondary" onClick={handlePrintAll}>
            <Printer size={15} />
            {t("mail.print_register")}
          </button>
          <div className="entries-counter">
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
          {t("mail.success_outgoing")}
        </div>
      )}

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
                  <span>{t("mail.add_outgoing")}</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div className="auto-number-display">
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

              <form onSubmit={handleSubmit} className="outgoing-form">
                <div className="form-grid">
                  {/* Date */}
                  <div className="form-field">
                    <label>
                      <Calendar size={14} />
                      {t("mail.date_send")}
                    </label>
                    <input
                      type="date"
                      className="field-input"
                      value={form.date}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, date: e.target.value }))
                      }
                      required
                    />
                  </div>

                  {/* Recipient */}
                  <div className="form-field field-wide" ref={recipientRef}>
                    <label>
                      <Send size={14} />
                      {t("mail.recipient")}
                    </label>
                    <div className="search-field-wrapper">
                      <div className="search-input-row">
                        <Search size={15} className="field-search-icon" />
                        <input
                          type="text"
                          className="field-input with-icon"
                          placeholder={t("mail.search_entity")}
                          value={form.recipient || recipientSearch}
                          onChange={(e) => {
                            setRecipientSearch(e.target.value);
                            setForm((f) => ({
                              ...f,
                              recipient: e.target.value,
                            }));
                            setRecipientDropOpen(true);
                          }}
                          onFocus={() => setRecipientDropOpen(true)}
                          onBlur={() =>
                            setTimeout(() => setRecipientDropOpen(false), 200)
                          }
                          required
                        />
                      </div>
                      {recipientDropOpen && filteredRecipients.length > 0 && (
                        <ul className="search-dropdown">
                          {filteredRecipients.map((r, i) => (
                            <li
                              key={i}
                              onMouseDown={() => {
                                setForm((f) => ({ ...f, recipient: r }));
                                setRecipientSearch(r);
                                setRecipientDropOpen(false);
                              }}
                            >
                              <Send size={12} />
                              {r}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Object Type */}
                  <div className="form-field">
                    <label>
                      <FileText size={14} />
                      {t("mail.object_outgoing")}
                    </label>
                    <div className="select-wrapper">
                      <select
                        className="field-input field-select"
                        value={form.objectType}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, objectType: e.target.value }))
                        }
                      >
                        <option value={t("mail.obj_student_file")}>
                          {t("mail.obj_student_file")}
                        </option>
                        <option value={t("mail.obj_admin_doc_req")}>
                          {t("mail.obj_admin_doc_req")}
                        </option>
                        <option value={t("mail.obj_official_notice")}>
                          {t("mail.obj_official_notice")}
                        </option>
                        <option value={t("mail.obj_admin_corr")}>
                          {t("mail.obj_admin_corr")}
                        </option>
                        <option value={t("mail.obj_financial")}>
                          {t("mail.obj_financial")}
                        </option>
                        <option value={t("mail.obj_exam_results")}>
                          {t("mail.obj_exam_results")}
                        </option>
                        <option value={t("mail.obj_contract")}>
                          {t("mail.obj_contract")}
                        </option>
                        <option value={t("mail.obj_other")}>
                          {t("mail.obj_other")}
                        </option>
                      </select>
                      <ChevronDown size={15} className="select-arrow" />
                    </div>
                  </div>

                  {/* Pieces Count */}
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
                </div>

                {/* Students Section — visible only for "إرسال ملف التلميذ" */}
                {form.objectType === t("mail.obj_student_file") && (
                  <div className="students-section">
                    <label className="students-label">
                      <User size={14} />
                      {t("mail.students_label")}
                    </label>
                    <div className="students-tags-area">
                      {form.students.map((s) => (
                        <StudentTag
                          key={s}
                          name={s}
                          onRemove={handleRemoveStudent}
                        />
                      ))}
                      <div className="student-add-wrapper" ref={studentRef}>
                        <div className="student-add-input-row">
                          <input
                            type="text"
                            className="student-search-input"
                            placeholder={t("mail.add_student")}
                            value={studentSearch}
                            onChange={(e) => {
                              setStudentSearch(e.target.value);
                              setStudentDropOpen(true);
                            }}
                            onFocus={() => setStudentDropOpen(true)}
                            onBlur={() =>
                              setTimeout(() => setStudentDropOpen(false), 200)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && studentSearch.trim()) {
                                e.preventDefault();
                                handleAddStudent(studentSearch.trim());
                              }
                            }}
                          />
                        </div>
                        {studentDropOpen && filteredStudents.length > 0 && (
                          <ul className="search-dropdown student-drop">
                            {filteredStudents.map((s, i) => (
                              <li
                                key={i}
                                onMouseDown={() => handleAddStudent(s)}
                              >
                                <User size={12} />
                                {s}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Observations */}
                <div className="form-field full-width">
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

                <div className="form-footer">
                  <div className="form-hint">
                    <AlertCircle size={13} />
                    {t("mail.auto_number_hint_out")}
                  </div>
                  <button type="submit" className="btn-submit">
                    <Plus size={16} />
                    {t("mail.save_entry")}
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
            <FileText size={18} />
            <span>{t("mail.title_outgoing")}</span>
          </div>
          <span className="ledger-year">{t("mail.school_year")} 2025/2026</span>
        </div>

        <div className="ledger-table-wrapper">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>{t("mail.archive_number")}</th>
                <th>{t("mail.date")}</th>
                <th>{t("mail.recipient")}</th>
                <th>{t("mail.object")}</th>
                <th>{t("mail.pieces")}</th>
                <th>{t("mail.observations")}</th>
                <th>{t("mail.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-row">
                    <Send size={32} />
                    <p>{t("mail.no_entries")}</p>
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <LedgerRow
                    key={entry.id}
                    entry={entry}
                    onPrintQR={setQrEntry}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="ledger-footer">
          <span>
            {t("mail.total_entries")} <strong>{entries.length}</strong>
          </span>
          <span>
            {t("mail.total_pieces")}{" "}
            <strong>{entries.reduce((s, e) => s + e.pieces, 0)}</strong>
          </span>
        </div>
      </div>

      {/* QR Modal */}
      {qrEntry && <QRModal entry={qrEntry} onClose={() => setQrEntry(null)} />}
    </div>
  );
};
