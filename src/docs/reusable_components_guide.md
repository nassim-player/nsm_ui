
# Reusable UI Components System

This knowledge item documents the reusable UI components created for the NSM project, extracted from the registration system.

## Modal Component
**Location:** `src/components/common/Modal/Modal.jsx`
**Styles:** `src/components/common/Modal/Modal.scss`

A highly flexible modal component with glassmorphism support.
- **Props:**
  - `isOpen`: (bool) Control visibility.
  - `onClose`: (func) Callback when closing.
  - `title`: (node) Header title.
  - `subtitle`: (node) Header subtitle.
  - `icon`: (ElementType) Header icon (Feather).
  - `size`: 'small' | 'medium' | 'large' | 'full'.
  - `glass`: (bool) Enable glassmorphism (default: true).
  - `headerActions`: (node) Custom content for the header.
  - `footer`: (node) Custom footer content.

## InfoCard & InfoRow
**Location:** `src/components/common/Card/InfoCard.jsx`
**Styles:** `src/components/common/Card/Card.scss` (integrated with other cards)

Designed for displaying structured information.
- **InfoCard Props:**
  - `title`, `subtitle`, `icon`, `badge`.
  - `variant`: 'primary', 'secondary', 'father', 'mother', 'guardian', 'family', etc.
  - `highlight`: (bool) Add a highlight border.
- **InfoRow Props:**
  - `icon`, `label`, `value`, `color`.

## Steps Indicator
**Location:** `src/components/common/Steps/Steps.jsx`
**Styles:** `src/components/common/Steps/Steps.scss`

A flexible step-by-step indicator.
- **Props:**
  - `steps`: Array of `{ id, label, description }`.
  - `currentStepIndex`: (number) 0-indexed current step.
  - `direction`: 'horizontal' | 'vertical'.

## Panel Component
**Location:** `src/components/common/Panel/Panel.jsx`
**Styles:** `src/components/common/Panel/Panel.scss`

A layout container with a consistent header and body structure.
- **Props:**
  - `title`, `icon`, `badge`, `badgeVariant`.
  - `actions`: (node) Right-aligned header elements.
  - `loading`: (bool) Show a loading spinner.
  - `variant`: 'default', 'bordered', 'flat'.

## Best Practices
1. Always use CSS variables from `_variables.scss` for styling new components.
2. Support RTL by utilizing `[dir="rtl"]` selectors or logical properties.
3. Ensure dark mode compatibility using `.dark-mode` overrides.
4. Pass standard Feather icons as the `icon` prop.
