# Teachers Unit — UI/UX Scope

> **Focus:** Frontend only. No backend or database work. APIs (if any) are for testing the UI only.

## Routes

| Path | Page | Status |
|------|------|--------|
| `/teachers` | TeachersOverview | Placeholder — to design |
| `/teachers/list` | TeachersManagement | Built — table, filters, modal, mock data |

## Current UI (Teachers Management)

- **List:** DataTable with mock teachers (name/nickname, stage, sub_stage, module, class).
- **Filters:** Stage filter (pre-school, primary, middle).
- **Quick assign:** Inline dropdowns for Module and Class on empty cells.
- **Row click:** Opens large modal with:
  - **Tab 1 — DRH/Personal:** Contact (email, phone, address), education, hire date, experience; editable fields + “Submit for approval” flow.
  - **Tab 2 — Admin control:** Department, module, classes (chips), working hours, break times, teaching preferences (cards), admin notes.
- **Styling:** `TeachersManagement.scss` (variables/mixins from `styles/`), RTL-friendly.

## Reusable pieces used

- `DataTable`, `Modal`, `react-feather` icons.
- `LanguageContext` (`useTranslation`) for ar/en/fr.
- Layout: `TeachersLayout` (sub-nav: Overview | قائمة الأساتذة).

## Where to add UI

- **New Teachers pages:** Add route in `App.jsx`, sub-link in `TeachersLayout.jsx`, page under `src/pages/teachers/`.
- **New components:** Prefer `src/components/common/` and document in `reusable_components_guide.md` if shared.
- **Copy/translations:** Add keys to `src/locales/translations.json` (ar, en, fr).
- **Styles:** SCSS next to the page or in `styles/`; use `_variables.scss` and RTL.

## Out of scope (for now)

- Real APIs and persistence.
- Database design for teachers.
- Non-Teachers areas (Registration, Students, etc.) unless needed for consistency.
