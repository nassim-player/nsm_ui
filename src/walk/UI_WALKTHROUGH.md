# NSM UI Project - Walkthrough & Documentation

This document provides an overview of the UI architecture, component library, and design system used in this project. It is intended for developers to understand how to use and extend the UI.

## 1. Project Overview
The UI is built using **React** and **SCSS**. It features a modern, "glassmorphism" inspired design with rich gradients, shadows, and rounded corners, fully compatible with RTL (Right-to-Left) layouts.

## 2. Directory Structure

```
src/
├── components/
│   ├── common/         # Atomic reusable components (Buttons, Inputs, etc.)
│   └── layout/         # Structural components (Sidebar, PageHero)
├── context/            # Global state (ToastProvider)
├── layouts/            # Page layouts (DashboardLayout)
├── pages/              # Main view components
├── styles/             # SCSS configuration (variables, mixins)
└── App.jsx             # Main router configuration
```

## 3. Design System (`src/styles/`)

- **`_variables.scss`**: Defines the color palette (gradients, slate grays), shadows (sm, md, lg), and border radius.
- **`_mixins.scss`**: Helper mixins for:
  - Flexbox layouts (`@mixin flex`)
  - Transitions (`@mixin transition`)
  - Card bases (`@mixin card-base`)
  - Mobile responsiveness (`@mixin mobile`)
- **`global.scss`**: Global resets and utility classes.

## 4. Component Library

### Common Components

| Component | Path | Description | Key Props |
| :--- | :--- | :--- | :--- |
| **Button** | `common/Button` | Standard gradient button. | `variant="primary|secondary"`, `onClick` |
| **IconButton** | `common/Button` | Icon-only button. | `color`, `onClick` |
| **Badge** | `common/Badge` | Status/Priority indicators. | `variant="status-completed|priority-high"` |
| **Card** | `common/Card` | `TaskCard` (main item), `StatCard` (summary), `MetricCard` (analytics). | `title`, `description`, `status` |
| **Form** | `common/Form` | Wrapper components for inputs. | `InputField`, `SelectField`, `DatePicker`, `TextArea` |
| **DataTable** | `common/Table` | Reusable table with configurable columns. | `columns` (array of objects), `data` |
| **Tabs** | `common/Tabs` | Tabbed interface switcher. | `tabs` (id, label, icon, content) |
| **ViewSwitcher** | `common/ViewSwitcher` | Toggle between List, Grid, Table views. | `view`, `onChange` |
| **AdvancedFilters**| `common/Filters` | Filter panel with chips and reset. | `activeFilters`, `onRemoveFilter` |

### Layout Components

- **Sidebar** (`layout/Sidebar`): Collapsible navigation. Uses `NavLink` for active states.
- **PageHero** (`layout/PageHero`): Sticky header with user profile, notifications, and page actions.

## 5. How to Add a New Page

1.  **Create the Page Component**:
    Create a new file in `src/pages/`, e.g., `NewPage.jsx`.
    ```jsx
    export const NewPage = () => {
        return <div>My New Page Content</div>;
    };
    ```

2.  **Add Route in `App.jsx`**:
    Import the component and add it to the `Routes`.
    ```jsx
    <Route path="new-page" element={<NewPage />} />
    ```

3.  **Add Link to Sidebar**:
    Update `src/components/layout/Sidebar/Sidebar.jsx` to include the new link in the `NAVIGATION_CONFIG`.
    ```js
    { href: 'new-page', icon: 'fa-star', label: 'New Page' }
    ```

## 6. Tips & Best Practices

- **Routing**: Always use `to` prop in `NavLink` or `Link` instead of `href` to avoid page reloads.
- **Icons**: The project uses FontAwesome classes (e.g., `fas fa-home`).
- **RTL Support**: The layout automatically handles RTL. Ensure margin/padding logic in SCSS uses logical properties or specific `[dir="rtl"]` overrides if needed (though Global SCSS handles most).
